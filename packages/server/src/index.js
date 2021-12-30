require('module-alias/register');
const ip = require('ip');
const serverConfig = require('@app/config/server.config');
const api = require('@app/api');
const Worker = require('@app/worker/worker.engine');
const database = require('@app/utils/database');
const logger = require('@app/utils/logger');
const maintenanceService = require('@app/services/maintenance.service');
const serverService = require('@app/services/server.service');
const voltajServerScheme = require('@app/validations/voltajServer.validation');

function voltajServer(options){
    options = options || {};

    // options: Validation
    if (typeof options !== 'object') {
        throw new TypeError('Server options must be an object');
    }

    // options: joi scheme validate
    const { value: optionVars, error } = voltajServerScheme.prefs({ errors: { label: 'key' } }).validate(options);

    if (error) {
        throw new Error(`Config validation error: ${error.message}`);
    }

    // server options final
    options = { ...serverConfig, ...optionVars };

    // get database information
    const getDatabaseInfo = () => {
        return options.database;
    }    
    
    // get database information
    const getAddress = () => {
        return `${ip.address()}:${options.api.port}`;
    }

    // run server
    const run = async () => {
        try {
            // database connect
            await database.connect(options.database);

            // api start
            api.start(options.api);

            // create a server record for db & other processes
            serverService.initialize({ address: getAddress() })
                .then((serverData) => new Worker({ serverData, ...options.worker }));

            // maintenance service
            maintenanceService.start(options);

            // process events
            process.on('SIGINT', async () => {
                logger.info('Got SIGINT, gracefully shutting down');
                await stop();
            });
            
            process.on('SIGTERM', async () => {
                logger.info('Got SIGTERM, gracefully shutting down');
                await stop();
            });
        } catch(err){
            throw new Error(err);
        }       
    }

    // stop server
    const stop = async () => {
        await serverService.kill({ address: getAddress() });
        api.stop();
        database.disconnect();
        maintenanceService.stop();
        console.clean();
        process.exit();
    }

    return {
        getDatabaseInfo,
        getAddress,
        options,
        run,
        stop
    }
}

module.exports = voltajServer;
module.exports.voltajServer = voltajServer;
module.exports.default = voltajServer;