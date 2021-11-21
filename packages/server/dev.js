require("dotenv").config();
const VoltajServer = require("./src/index");

const voltajServer = new VoltajServer({
    database: {
        url: "mongodb://localhost",
        name: "voltaj",
        connectRetry: 3
    }
});

voltajServer.run();