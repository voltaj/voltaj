const logger = require("@app/utils/logger");

const serverConstants = require('@app/constants/server.constants')
const workerConstants = require('@app/constants/worker.constants')
const jobConstants = require('@app/constants/job.constants')

const serverService = require('@app/services/server.service')
const workerService = require('@app/services/worker.service')
const jobService = require('@app/services/job.service')

const maintenance = {};

maintenance.intervalTimerRef = null;

maintenance.start = () => {
    intervalTimerRef = setInterval(maintenance.checkup, (1000 * 60 * 10)); // at 10 minute intervals
    //setTimeout(maintenance.checkup, 1000 * 5); // checkup after 5 seconds
    maintenance.checkup();
}

maintenance.checkup = async () => {
    // check servers
    const updatedServers = await serverService.updateAll({
        status: {
            $ne: serverConstants.status.DEAD
        },
        updatedAt: {
            $lte: new Date().getTime() - (1000 * 60 * 60 * 12) // 12 hours
        }
    }, {
        $set: {
            status: workerConstants.status.DEAD
        }
    });

    if(updatedServers.acknowledged){
        logger.info(`[Maintenance:servers] ${updatedServers.modifiedCount} servers updated.`)
    }

    // get current server
    const currentServer = await serverService.getCurrent();
    if(!currentServer) {
        return;
    }
    
    // check workers
    const updatedWorkers = await workerService.updateAll({ 
        status: {
            $ne: workerConstants.status.DEAD
        },
        updatedAt: {
            $lte: new Date().getTime() - (1000 * 60 * 30) // 30 mins
        }
    }, {
        $set: {
            status: workerConstants.status.DEAD
        }
    });

    if(updatedWorkers.acknowledged){
        logger.info(`[Maintenance:workers] ${updatedWorkers.modifiedCount} workers updated.`)
    }

    // check jobs
    const updatedJobs = await jobService.updateAll({ 
        serverId: currentServer.id,
        status: {
            $in: [
                jobConstants.status.DOWNLOADING,
                jobConstants.status.IN_PROGRESS,
                jobConstants.status.UPLOADING
            ]
        },
        updatedAt: {
            $lte: new Date().getTime() - (1000 * 60 * 60 * 3) // 3 hours
        }
    }, {
        $set: {
            status: jobConstants.status.ERROR
        }
    });

    if(updatedJobs.acknowledged){
        logger.info(`[Maintenance:jobs] ${updatedJobs.modifiedCount} jobs updated.`)
    }
}

maintenance.stop = () => {
    clearInterval(intervalTimerRef);
}

module.exports = maintenance;