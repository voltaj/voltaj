const config = {
    http: {
        host: process.env.SERVER_HOST || "localhost",
        port: process.env.SERVER_PORT || 3000,
    },
    database: {
        url: process.env.DB_URL,
        name: process.env.DB_NAME,
        connectRetry: 3
    },
    api: {
        token: "very secret token"
    },
    jobs: {
        timeout: (1000 * 60) * 60 * 2, // 2 hours
        callback_try_count: 3
    },
    workers: {
        count: 5,
        interval: 5 
    }
};

module.exports = config;