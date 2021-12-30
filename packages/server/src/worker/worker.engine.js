const workerThreads = require('worker_threads');
const { DownloaderHelper, DH_STATES } = require('node-downloader-helper');
const path = require('path');
const fs = require('fs');
const axios = require('axios');
const workerConstants = require('@app/constants/worker.constants');
const jobConstants = require('@app/constants/job.constants');
const workerService = require('@app/services/worker.service');
const jobService = require('@app/services/job.service');
const logger = require('@app/utils/logger');

class Worker {
    constructor({ serverData, ...restOptions }){
        this.options = restOptions || {};
        this.intervalTimer = null;

        this.currentServer = serverData;
        this.currentWorker = null;
        this.currentJob = null;

        // run
        this.run();
    }

    async startEncodingPendingJobs(){
        if(this.isBusy()) return;

        // worker register to db
        await this.workerRegister();

        if(!this.currentWorker){
            logger.info(`[Finding Jobs] no worker found`);
        }
        
        // find a waiting job on db
        const findedJob = await this.findAWaitingJob();
        if(findedJob){
            // download job input
            await this.downloadJobInput();
        } else {
            logger.info(`[Finding Jobs] no pending jobs were found`);
        }
    }
    
    async downloadJobInput(){
        logger.info(`[Job] finded id:${this.currentJob.id}`);  

        // Destionation
        //const destinationFilePath = `uploads/${this.currentJob.id}/original${path.extname(this.currentJob.input)}`;
        const destinationFolder = path.resolve(this.options.jobsFolder, this.currentJob.id);

        // Create job directory if haven't already
        if (!fs.existsSync(destinationFolder)){
            await fs.mkdirSync(destinationFolder, { recursive: true });
            await fs.mkdirSync(path.join(destinationFolder, "outputs"), { recursive: true });
        }

        // `original${path.extname(this.currentJob.input)}`;
        const downloaderOptions = {
            method: "GET",
            headers: {},  // Custom HTTP Header ex: Authorization, User-Agent
            fileName: { name: "original" },
            retry: false, // { maxRetries: number, delay: number in ms } or false to disable (default)
            forceResume: false, // If the server does not return the "accept-ranges" header, can be force if it does support it
            removeOnStop: true, // remove the file when is stopped (default:true)
            removeOnFail: true, // remove the file when fail (default:true)
            override: { skip: true, skipSmaller: true }, // Behavior when local file already exists
            progressThrottle: 1000, // interval time of the 'progress.throttled' event will be emitted
            httpRequestOptions: {}, // Override the http request options  
            httpsRequestOptions: {}, // Override the https request options, ex: to add SSL Certs
        }

        // download job input
        const downloader = new DownloaderHelper(this.currentJob.input, destinationFolder, downloaderOptions);

        // downloader: start listener
        downloader.on('start', (data) => {
            //console.log('downloader:(start):', data, JSON.stringify(data));
            this.sendCallback({ 
                status: jobConstants.status.DOWNLOADING, 
            }); 
            logger.info(`[Job] ${jobConstants.status.DOWNLOADING} (%0.0)`);  
        });

        // downloader: progress listener
        downloader.on('progress.throttled', (stats) => {
            this.updateJob({ 
                status: jobConstants.status.DOWNLOADING,
                progress: stats.progress.toFixed(1)
            });
            logger.info(`[Job] ${jobConstants.status.DOWNLOADING} (%${stats.progress.toFixed(1)})`);              
        });

        // downloader: timeout listener
        downloader.on('timeout', (data) => {
            console.log('downloader:(timeout):', data, JSON.stringify(data || {}));
            logger.info(`[Job] timeout`);  
        })
        
        // downloader: error listener
        downloader.on('error', ({ status, body, message }) => {
            // remove job folder from uploads folder
            if (fs.existsSync(destinationFolder)){
                fs.rmdirSync(destinationFolder, { recursive: true })
            }

            // update job as ERROR
            this.updateJob({ 
                status: jobConstants.status.ERROR,
                statusMessage: message
            });
            this.sendCallback({ 
                status: jobConstants.status.ERROR, 
            }); 

            logger.info(`[Job] error ${jobConstants.status.DOWNLOADING}`);     
        })

        // downloader: stateChanged listener
        downloader.on('stateChanged', (state) => {
            //console.log('stateChanged:', state);
            switch(state){
                case DH_STATES.STARTED:
                    
                break;

                case DH_STATES.DOWNLOADING:
                    this.updateJob({ 
                        status: jobConstants.status.DOWNLOADING, 
                        progress: 0 
                    });
                break;

                case DH_STATES.FINISHED:
                    this.updateJob({ 
                        status: jobConstants.status.DOWNLOADING, 
                        progress: 100 
                    });
                break;    
                
                case DH_STATES.FAILED:
                    this.updateJob({ 
                        status: jobConstants.status.FAILED 
                    });
                    this.sendCallback({ 
                        status: jobConstants.status.FAILED, 
                    }); 
                    this.reset();
                break;                
            }
        })

        // downloader: end listener
        downloader.on('end', (downloadInfo) => {
            // start encoder
            this.jobEncoder({ 
                type: "video",
                downloadInfo
            });

            logger.info(`[Job] end ${jobConstants.status.DOWNLOADING}`) 
        });

        // downloader: start
        downloader.start()
            .catch((err) => logger.info(`downloader error:(${this.currentJob.id}) > ${err}`))
    }

    async jobEncoder({ type = "video", downloadInfo }) {
        const workerNode = new workerThreads.Worker(`${__dirname}/encoders/${type}.encoder.js`, {
            workerData: {
                job: this.currentJob.toObject({ virtuals: true }),
                downloadInfo
            }
        });

        workerNode.on('online', () => {
            logger.info(`[Worker] online`);
            this.updateWorker({ 
                status: workerConstants.status.INACTIVE 
            });
            this.updateJob({ 
                status: jobConstants.status.IN_PROGRESS,
                workerId: this.currentWorker.id,
                progress: 0
            });
            this.sendCallback({ 
                status: jobConstants.status.IN_PROGRESS, 
            });   
        });
    
        workerNode.on('message', async (response) => {
            if (!response || typeof response !== 'object') return;

            switch(response.type){
                case workerConstants.types.PROGRESS:
                    await this.updateJob({ 
                        status: jobConstants.status.IN_PROGRESS, 
                        progress: response.percent 
                    });     
                    //await this.sendCallback({ 
                    //    status: jobConstants.status.IN_PROGRESS, 
                    //    progress: response.percent 
                    //});               
                    logger.info(`[Worker] ffmpeg progress (%${response.percent.toFixed(1)})`);
                break;

                case workerConstants.types.ERROR:
                    await this.updateJob({ 
                        status: jobConstants.status.ERROR 
                    });
                    await this.sendCallback({ 
                        status: jobConstants.status.ERROR 
                    });
                    logger.error(`[Worker] error: ${new Error(response.message)}`)                    
                break;
                
                case workerConstants.types.DONE:
                    await this.updateJob({ 
                        status: jobConstants.status.COMPLATED 
                    });
                    await this.sendCallback({ 
                        status: jobConstants.status.COMPLATED 
                    });
                    //this.reset();                    
                    logger.info(`[Worker] process done ${response.type}:${response.message}`);
                break;                
            }      
        });
    
        workerNode.on('error', (err) => {
            logger.error(`[Worker] error ${new Error(`An error occurred while encoding. ${err}`)}`)
            this.reset();
            //callback(new Error(`An error occurred while encoding. ${err}`));
        });
    
        workerNode.on('exit', (code) => {
            if (code !== 0) {
                logger.error(`[Worker][Thread] stopped with exit code ${code}`);
            } else {
                logger.info(`[Worker][Thread] exit code: ${code}`)
            }
            this.reset();
        });
    }

    async workerRegister(){
        const worker = await workerService.createOrUpdate({
            serverId: this.currentServer.id,
            status: workerConstants.status.IDLE
        });

        if(!worker){
            throw new Error("Worker not created!");
        }

        this.currentWorker = worker;
        
        return worker;
    }

    async updateWorker(data){
        if(!this.currentWorker) return;
        this.currentWorker = await workerService.updateById(this.currentWorker.id, data);
    }

    async findAWaitingJob(){
        return new Promise(async (resolve, reject) => {
            if(this.currentJob) {
                return resolve(false);
            }
        
            const job = await jobService.getAWaiting();
            if(!job){
                return resolve(false);
            }
            
            this.currentJob = job;
            this.currentJob.workerId = this.currentWorker.id;
            await this.currentJob.save();
            
            setTimeout(async () => {
                // match worker and job
                const isMatched = await jobService.isMatchWithWorker(this.currentJob.id, this.currentWorker.id);
                if(isMatched){
                    this.currentWorker.status = workerConstants.status.INACTIVE;
                    await this.currentWorker.save();
                    resolve(true);
                } else {
                    await this.updateWorker({ 
                        status: workerConstants.status.IDLE 
                    });
                    this.clear();
                    resolve(false);
                }
            }, 200);
        });
    }

    async updateJob(data){
        if(!this.currentJob || !data) return;
        this.currentJob = await jobService.updateById(this.currentJob.id, data);
    }    

    async updateWorker(data){
        if(!this.currentWorker || !data) return;
        this.currentWorker = await workerService.updateById(this.currentWorker.id, data);
    }   
    
    async sendCallback(data){
        const job = this.currentJob;
        
        if(!job || !data) return;
        if(!job.callbacks || !job.callbacks.length) return;

        job.callbacks.forEach((callback, index) => {
            axios.post(callback.url, {
                jobId: job.id,
                ...data
            }).then((response) => {
                jobService.updateCallbackByFilter(
                    { 
                        id: job.id, 
                        'callbacks.id': callback.id 
                    }, 
                    {
                        $push: {
                            'callbacks.$.requests': {
                                status: response.status,
                                data: response.config.data,
                                response: response.data
                            }
                        }
                    }
                );
            }).catch((err) => {
                jobService.updateCallbackByFilter(
                    { 
                        id: job.id, 
                        'callbacks.id': callback.id 
                    }, 
                    {
                        $push: {
                            'callbacks.$.requests': {
                                status: err.response.status,
                                data: err.config.data,
                                error: `${new Error(err)}`
                            }
                        }
                    }
                );
            });
        });
    }

    isBusy(){
        return (this.currentWorker || false) && this.currentWorker.status === workerConstants.status.INACTIVE;
    }

    async reset(){
        await this.stop();
        await this.clear();
        await this.run();
    }

    async run(){
        if(!this.currentServer) return;
        this.intervalTimer = setInterval(this.startEncodingPendingJobs.bind(this), 2000);
        this.startEncodingPendingJobs();
    }

    clear(){
        this.currentJob = null;
        this.currentWorker = null;
    }

    async stop(){
        clearInterval(this.intervalTimer);
        await this.updateWorker({ 
            status: workerConstants.status.IDLE 
        });
        logger.info(`[Worker] disconnect`);
    }
}

module.exports = Worker;
