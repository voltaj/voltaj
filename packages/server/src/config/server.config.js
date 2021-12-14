const config = {
    database: {
        url: "mongodb://localhost/voltaj",
        connectRetry: 5
    },
    api: {
        host: "localhost",
        port: 3000,
        secretToken: false,
        routePrefix: "/api",
        cors: false,
        healthPollingIntervalMs: (1000 * 60 * 5), // 5 min
    },
    worker: {
        intervalSeconds: 10,
        inputsFolder: "inputs"
    }
}

module.exports = config;