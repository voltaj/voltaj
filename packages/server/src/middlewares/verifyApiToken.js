const responseHelper = require("../helpers/responseHelper");

function verifyApiToken(secretToken){
    return function(req, res, next){
        // token compare
        if(req.headers.token !== secretToken){
            responseHelper.unauthorized(res, "Forbidden");
            return;
        }
        
        next();
    }
}

module.exports = verifyApiToken;