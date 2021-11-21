const log = {};

log.info = function info(message) {
	console.info(message);
};

log.error = function error(message) {
	console.error(message);
};

log.debug = function debug(message) {
	console.debug(message);
};

module.exports = log;