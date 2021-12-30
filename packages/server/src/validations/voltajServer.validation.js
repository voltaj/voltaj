const Joi = require('joi');

const voltajServerOptionsScheme = Joi.object({
    database: Joi.object({
        url: Joi.string(),
        dbName: Joi.string(),
        connectRetry: Joi.number()
    }),
    api: Joi.object({
        host: Joi.string(),
        port: Joi.number(),
        secretToken: Joi.string().alphanum().min(16).max(64).required(),
        routePrefix: Joi.string(),
        cors: Joi.object({
            origin: Joi.string().required(),
            optionsSuccessStatus: Joi.number()
        }),
        healthPollingIntervalMs: Joi.number()
    }).required(),
    worker: Joi.object({
        count: Joi.number(),
        jobsFolder: Joi.string(),
        intervalSeconds: Joi.number(),
    })
});

module.exports = voltajServerOptionsScheme;