/*
 * Storage, the gateway to the database
 */

// Dependencies
const mongoose = require("mongoose");

const log = require("./log");
const config = require("../config/config");
const Job = require("../models/job");

const database = {};

database.isConnectedToDb = false;

database.isConnected = function isConnected() {
	return database.isConnectedToDb;
};

mongoose.connection.on("error", (err) => {
	log.error(`Got error event ${err}`);
});

mongoose.connection.on("disconnected", () => {
	log.error("Got disconnected event from database");
	database.isConnectedToDb = false;
});

mongoose.connection.on("reconnected", () => {
	log.info("Got reconnected event from database");
	database.isConnectedToDb = true;
});

database.connect = (config) => {
	mongoose
		.connect(config.url, {
			useNewUrlParser: true,
			useUnifiedTopology: true,
			//useCreateIndex: true,
			connectTimeoutMS: 3000,
			//useFindAndModify: false
		})
		.then(() => {
			log.info("Successfully connected to voltaj database");
			database.isConnectedToDb = true;
		})
		.catch((err) => {
			log.error(
				`An error occurred while trying to connect to the voltaj database, retrying in ${config.connectRetry}s. Err: ${err}`
			);
			setTimeout(database.connect, config.connectRetry * 1000);
		});
};

database.disconnect = () => {
	if (database.isConnected()) {
		mongoose
			.disconnect()
			.then(() => {
				database.isConnectedToDb = false;
			})
			.catch((err) => {
				log.error(
					`An error occurred while trying to disconnect from the voltaj database. Err: ${err}`
				);
			});
	}
};

database.getJobs = async (status) => {
	const jobs = await Job.find({ status }).catch((err) => {
		log.error(`An error occurred while searching for jobs. Err: ${err}`);
	});
	return jobs;
};

database.updateJob = async (job) => {
	try {
		const { ...updateData } = job._doc;
		const update = await Job.findByIdAndUpdate(job.id, updateData);
		return update;
	} catch (err) {
		log.error(
			`An error occurred while trying to update jobs ${job.name}. Err: ${err}`
		);
		return null;
	}
};

database.updateJobStatus = async (jobId, status) => {
	try {
		const update = await Job.findByIdAndUpdate(jobId, { status });
		return update;
	} catch (err) {
		log.error(
			`An error occurred while trying to update jobs ${jobId}. Err: ${err}`
		);
		return null;
	}
};

module.exports = database;
