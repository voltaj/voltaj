const defaultOptions = {
    api: {
        token: "very secret token"
    },
    database: {
        driver: "mongodb",
        host: "localhost",
        port: 44123,
        username: "username",
        password: "password"
    },
    jobs: {
        timeout: (1000 * 60) * 60 * 2, // 2 hours
        callback_try_count: 3
    },
    workers: {
        count: 5,
        interval: 5 
    }
}

class VoltajNode {
    constructor(settings){
        this.settings = { ...defaultOptions, ...(settings || {}) };
    }

    getDatabaseInfo(){
        return this.settings.database;
    }

    run(){
        const express = require("express");
        const app = express();

        // extra depended modules
        // const Routes = require("./routes");
        const jobsRoute = require("./routes/jobsRoute");

        /*
        ** Router initialize
        **/
        // router settings
        app.use(express.json());

        // jobs routes
        app.use("/jobs", jobsRoute);

        // default route
        app.use("*", (req, res) => res.send("Welcome to Voltaj API"));

        /*
        ** App Ending Settings
        **/
        // app listen port
        app.listen(
            process.env.APP_PORT || 3000, 
            process.env.APP_HOST || "localhost", 
            () => console.log("Server is listening on port 3000")
        );
    }
}

module.exports = VoltajNode;