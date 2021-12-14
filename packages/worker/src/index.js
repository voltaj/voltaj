const Joi = require('joi');
const workerConfig = require('./config/worker.config');
const database = require("./utils/database");
const WorkerManager = require("./utils/workerManager");

const voltajWorkerOptionsScheme = Joi.object({
    worker: Joi.object({
        count: Joi.number(),
        intervalSeconds: Joi.number(),
    }),
    database: Joi.object({
        url: Joi.string(),
        name: Joi.string(),
        connectRetry: Joi.number()
    })
})

function voltajWorker(options){
    options = options || {};

    // options: Validation
    if (typeof options !== 'object') {
        throw new TypeError('Worker options must be an object');
    }

    // options: joi scheme validate
    const { value: optionVars, error } = voltajWorkerOptionsScheme.prefs({ errors: { label: 'key' } }).validate(options);

    if (error) {
        throw new Error(`Config validation error: ${error.message}`);
    }

    // server options final
    options = { ...workerConfig, ...optionVars };    

    // run server
    const run = () => {
        // database connect
        const dbConnection = database.connect(options.database);
        dbConnection.then(() => {
            // init worker manager
            WorkerManager.init(options.worker);
        });

        process.on('SIGINT', () => {
            logger.info('Got SIGINT, gracefully shutting down');
            stop();
        });
          
        process.on('SIGTERM', () => {
            logger.info('Got SIGTERM, gracefully shutting down');
            stop();
        });          
    }

    // stop server
    const stop = async () => {
        database.disconnect();
    }

    return {
        run,
        stop
    }
}

module.exports = voltajWorker;