const express = require("express");
const app = express();
const config = require("./config");

// extra depended modules
// const Routes = require("./routes");
const jobsRoute = require("./routes/jobsRoute");

const api = {};

/*
** Router initialize
**/
// router settings
app.use(express.json());

// jobs routes
app.use("/api/jobs", jobsRoute);

// default route
app.use("*", (req, res) => res.send("Welcome to Voltaj API"));

api.start = (config) => {
    // app listen port
    app.listen(config.port, config.host, () => console.log("Server is listening on port 3000") );
}

module.exports = api;