const responseHelper = require("@app/helpers/responseHelper");

const healthcheckController = {};

healthcheckController.get = async (req, res) => {
    return responseHelper.success(res);
}

module.exports = healthcheckController;