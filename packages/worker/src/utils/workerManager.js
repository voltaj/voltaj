const workerThreads = require('worker_threads');
const logger = require('./logger');
const workerService = require('../services/worker.service');
const jobService = require('../services/job.service');

class WorkerManager {
    constructor() {
        this.options = {};
        this.worker = null;
        this.timeout = null;
    }

    init(options){
        // set props to manager
        this.options = options || {};

        // register worker to db
        this.registerWorker();

        // start work flow
        this.startWorkflow();
    }

    async registerWorker(){
        const worker = await workerService.createWorker();

        if(!worker){
            throw new Error("Worker not created!");
        }

        this.worker = worker;
    }

    startWorkflow(){
        this.timeout = setTimeout(this.startEncodingPendingJobs.bind(this), (this.options.intervalSeconds * 1000))
    }

    async startEncodingPendingJobs(){
        this.log(`running!`)

        const job = await jobService.getAWaitingJob();

        if(!job){
            this.log(`No pending jobs were found`);
            return;
        }

        this.log(`finded waiting a job:${job.id}`);

        /*
        const worker = new workerThreads.Worker('./encoder.js', {
            workerData: data,
        });
        
        worker.on('message', (message) => {
            if (message != null && typeof message === 'object') {
                if (message.type === constants.WORKER_MESSAGE_TYPES.PROGRESS) {
                    this.log(message.message);
                } else if (message.type === constants.WORKER_MESSAGE_TYPES.ERROR) {
                    cb(new Error(message.message));
                } else if (message.type === constants.WORKER_MESSAGE_TYPES.DONE) {
                    this.log(message.message);
                    cb(null);
                }
            }
        });
        
        worker.on('error', (err) => {
            cb(new Error(`An error occurred while encoding. ${err}`));
        });
        
        worker.on('exit', (code) => {
            if (code !== 0) {
                cb(new Error(`Worker stopped with exit code ${code}`));
            } else {
                cb(null);
            }
        });  
        */      
    }

    startEncoder = (data, cb) => {
        this.log('procesing a job...');
    
    }

    log(message){
        logger.info(`[Worker] ${this.worker.id}: ${message}`)
    }
}

module.exports = new WorkerManager();