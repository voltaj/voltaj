const responseHelper = {};

responseHelper.success = function (res, message) {
	return res.status(200).json({
		status: true,
		message
	});
};

responseHelper.successWithData = function (res, data, message) {
	return res.status(200).json({
		status: true,
		message,
		data: data
	});
};

responseHelper.error = function (res, message) {
	return res.status(500).json({
		status: false,
		message
	});
};

responseHelper.notFound = function (res, message) {
	var responseData = {
		status: false,
		message
	};

	return res.status(404).json(responseData);
};

responseHelper.validationErrorWithData = function (res, data, message) {
	return res.status(400).json({
		status: false,
		message,
		data: data
	});
};

responseHelper.unauthorized = function (res, message) {
	return res.status(401).json({
		status: false,
		message
	});
};

module.exports = responseHelper;