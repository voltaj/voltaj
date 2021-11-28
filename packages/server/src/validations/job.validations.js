const Joi = require('joi');

const getJobScheme = {
    params: Joi.object().keys({
        id: Joi.string().required()
    })
}

const createJobScheme = {
    body: Joi.object().keys({
        input: Joi.string().required(),
        outputs: Joi.array().required().items({
            output: Joi.string().required()
        }),
        callbacks: Joi.array().required().items({
            type: Joi.string().required().default("webhook"),
            url: Joi.string().required()
        })
    })
}

const deleteJobScheme = {
    params: Joi.object().keys({
        id: Joi.string().required()
    })
}

module.exports = {
    getJobScheme,
    createJobScheme,
    deleteJobScheme,
}