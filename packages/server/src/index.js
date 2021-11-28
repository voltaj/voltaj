const Joi = require('joi');
const serverConstants = require('./constants/server.constants');
const api = require('./utils/api');
const database = require('./utils/database');
const logger = require('./utils/logger');
const serverService = require('./services/server.service');

const voltajServerOptionsScheme = Joi.object({
    database: Joi.object({
        url: Joi.string(),
        name: Joi.string(),
        connectRetry: Joi.number()
    }),
    api: Joi.object({
        host: Joi.string(),
        port: Joi.number(),
        secretToken: Joi.string().alphanum().min(16).max(64).required(),
        cors: Joi.object({
            origin: Joi.string().required(),
            optionsSuccessStatus: Joi.number()
        }),
        healthPollingIntervalMs: Joi.number()
    })
})

function voltajServer(options){
    options = options || {};

    // options: Validation
    if (typeof options !== 'object') {
        throw new TypeError('Server options must be an object');
    }

    // options: joi scheme validate
    const { value: optionVars, error } = voltajServerOptionsScheme.prefs({ errors: { label: 'key' } }).validate(options);

    if (error) {
        throw new Error(`Config validation error: ${error.message}`);
    }

    // server options final
    options = { ...serverConstants, ...optionVars };

    // get database information
    const getDatabaseInfo = () => {
        return options.database;
    }

    // run server
    const run = () => {
        // database connect
        const dbConnection = database.connect(options.database);
        dbConnection.then(() => {
            // api module
            if(options.api){
                // api start
                api.start(options.api);
            }

            // create a server record for db & other processes
            serverService.initServer({ 
                interval: true,
                options
            });
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
        // api module
        if(options.api){
            api.stop();
        }

        await serverService.killServer();
        database.disconnect();
        //clearInterval(app.intervalTimer);
        //process.exit();
    }

    return {
        getDatabaseInfo,
        options,
        run,
        stop
    }
}

module.exports = voltajServer;
module.exports.voltajServer = voltajServer;
module.exports.default = voltajServer;