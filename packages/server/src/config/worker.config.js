const config = {
    worker: {
        count: 1,
        intervalSeconds: 10,
    },
    database: {
        url: "mongodb://localhost/voltaj",
        connectRetry: 5
    }
}

module.exports = config;