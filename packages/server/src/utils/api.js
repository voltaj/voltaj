const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const logger = require('./logger');

const verifyApiToken = require('../middlewares/verifyApiToken');
const jobRoutes = require('../routes/job.routes');

const app = express();

const api = {};
api.server = null;

/*
** Router initialize
**/
api.start = (config) => {
    // set security HTTP headers
    app.use(helmet());

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

    // jobs routes
    app.use("/api/jobs", jobRoutes);

    // default route
    app.use("*", (req, res) => res.send("Welcome to Voltaj API"));

    // app listen port
    api.server = app.listen(config.port, config.host, () => logger.info("Server is listening on port 3000"));
}

api.stop = () => {
    if(api.server){
        logger.error(`Server stopped`);
        api.server.close()
    }
};

module.exports = api;