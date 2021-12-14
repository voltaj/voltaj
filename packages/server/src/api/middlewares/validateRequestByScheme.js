const Joi = require('joi');
const pick = require('@app/helpers/pick');

function validateRequestByScheme(schema) {
    return function(req, res, next) {
        const validSchema = pick(schema, ['params', 'query', 'body']);
        const object = pick(req, Object.keys(validSchema));

        if(!schema){
            throw new Error("Schema not found!");
        }

        const options = {
            errors: { 
                label: 'key',
            },
            abortEarly: false, // include all errors
            allowUnknown: true, // ignore unknown props
            stripUnknown: true // remove unknown props
        };
    
        // validate request body against schema
        const { error, value } = Joi.compile(validSchema).validate(object, options);
        
        if (error) {
            // on fail return comma separated errors
            res.json({
                status: false,
                errors: error.details
            });
        } else {
            // on success replace req.body with validated value and trigger next middleware function
            Object.assign(req, value);
            next();
        }
    }
}

module.exports = validateRequestByScheme;