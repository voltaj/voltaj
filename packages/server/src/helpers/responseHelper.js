const responseHelper = {};

responseHelper.success = function (res, msg) {
	var responseData = {
		status: true,
		message: msg
	};
	
	return res.status(200).json(responseData);
};

responseHelper.successWithData = function (res, msg, data) {
	var responseData = {
		status: true,
		message: msg,
		data: data
	};

	return res.status(200).json(responseData);
};

responseHelper.error = function (res, msg) {
	var responseData = {
		status: false,
		message: msg,
	};

	return res.status(500).json(responseData);
};

responseHelper.notFound = function (res, msg) {
	var responseData = {
		status: false,
		message: msg,
	};

	return res.status(404).json(responseData);
};

responseHelper.validationErrorWithData = function (res, msg, data) {
	var responseData = {
		status: false,
		message: msg,
		data: data
	};

	return res.status(400).json(responseData);
};

responseHelper.unauthorized = function (res, msg) {
	var responseData = {
		status: false,
		message: msg,
	};

	return res.status(401).json(responseData);
};

module.exports = responseHelper;