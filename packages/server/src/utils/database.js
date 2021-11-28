const mongoose = require('mongoose');
const logger = require('./logger');
const serverConfig = require('../config/server.config');

const database = {
	isConnectedToDb: false
};

database.isConnected = function isConnected() {
	return database.isConnectedToDb;
};

mongoose.connection.on("error", (err) => {
	logger.error(`Got error event ${err}`);
});

mongoose.connection.on("disconnected", () => {
	logger.error("Got disconnected event from database");
	database.isConnectedToDb = false;
});

mongoose.connection.on("reconnected", () => {
	logger.info("Got reconnected event from database");
	database.isConnectedToDb = true;
});

database.connect = (options) => {
	const connectTimeoutMS = Number(options.connectRetry || serverConfig.database.connectRetry) * 1000;
	return mongoose
		.connect(options.url, {
			useNewUrlParser: true,
			useUnifiedTopology: true,
			connectTimeoutMS
		})
		.then(() => {
			database.isConnectedToDb = true;
			logger.info(`Successfully connected to ${options.url}`);
		})
		.catch((err) => {
			database.isConnectedToDb = false;
			logger.error(`An error occurred while trying to connect to the ${options.url}, retrying in ${options.connectRetry}s. Err: ${err}`);
			//setTimeout(() => database.connect(options), options.connectRetry * 1000);4
		});
};

database.disconnect = () => {
	if (database.isConnected()) {
		mongoose
			.disconnect()
			.then(() => database.isConnectedToDb = false)
			.catch((err) => logger.error(`An error occurred while trying to disconnect from the voltaj database. Err: ${err}`));
	}
};

module.exports = database;
