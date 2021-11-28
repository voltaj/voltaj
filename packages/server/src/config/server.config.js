const config = {
    api: {
        host: "localhost",
        port: 3000,
        secretToken: false,
        cors: false,
        healthPollingIntervalMs: (1000 * 60 * 5), // 5 min
    },
    database: {
        url: "mongodb://localhost/voltaj",
        name: "voltaj",
        connectRetry: 5
    }
}

module.exports = config;