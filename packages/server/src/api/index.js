const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const logger = require('@app/utils/logger');

const verifyApiToken = require('@app/api/middlewares/verifyApiToken');
const jobRoutes = require('@app/api/routes/job.routes');
const healthcheckController = require('@app/api/controllers/healthcheck.controller');

const app = express();

const api = {
    instance: null
};

/*
** Router initialize
**/
api.start = (config) => {
    // set security HTTP headers
    app.use(helmet({
        contentSecurityPolicy: false,
        dnsPrefetchControl: false,
        expectCt: false,
        frameguard: true, // important
        hidePoweredBy: false,
        hsts: false,
        ieNoOpen: false,
        noSniff: false,
        permittedCrossDomainPolicies: false,
        referrerPolicy: false,
        xssFilter: true, // important
    }));

    // router bodyparser settings
    app.use(express.json());
    app.use(express.urlencoded({ extended: false }));

    // cors settings
    if(config.cors){
        const corsOptions = typeof config.cors === "object" ? config.cors : null;
        app.use(cors(corsOptions));
    }

    // api token verify middleware
    app.use(verifyApiToken(config.secretToken));

    // custom routes
    app.use(`${config.routePrefix}/jobs`, jobRoutes);
    app.use(`${config.routePrefix}/:var(healthcheck|status)`, healthcheckController.get);

    // default route
    app.use("*", (req, res) => res.send("Welcome to Voltaj API"));

    // app listen port
    api.instance = app.listen(config.port, config.host, () => logger.info(`Server is listening on ${config.host}:${config.port}`));
}

api.stop = () => {
    if(api.instance){
        logger.error(`Server stopped`);
        api.instance.close()
    }
};

module.exports = api;