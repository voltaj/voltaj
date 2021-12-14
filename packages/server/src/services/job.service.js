const Job = require('@app/models/job.model');
const logger = require('@app/utils/logger');
const jobConstants = require('@app/constants/job.constants');
const serverService = require('@app/services/server.service');

const jobService = {};

jobService.getAll = async (filter) => {
	return Job.find(filter);
}

jobService.getById = async (id) => {
	return Job.findById(id);
}

jobService.isMatchWithWorker = async (jobId, workerId) => {
	return Job.exists({ 
		id: jobId,
		workerId
	});
}

jobService.getAWaiting = async () => {
	return Job.findOne({ 
		status: jobConstants.status.WAITING,
		workerId: { $exists: false },
		input: { $exists: true },
		output: { $exists: true },
	});
}

jobService.create = async (data) => {
	const currentServer = await serverService.getCurrent();

	if(!currentServer){
		throw new Error("Server record not found into server collection!");
	}

	return Job.create({
		serverId: currentServer._id,
		...data
	});
};

jobService.updateAll = async (filter, update) => {
	return Job.updateMany(filter, update);
};

jobService.updateByJob = async (job, data) => {
	return Job.findByIdAndUpdate(job.id, data);
};

jobService.updateById = async (id, data) => {
	return Job.findByIdAndUpdate(id, data);
};

jobService.updateStatusById = async (id, status) => {
	return Job.findByIdAndUpdate(id, { status });
};

jobService.deleteById = async (jobId) => {
	const job = await jobService.getById(jobId);

	if(!job){
		throw new Error("Job not found");
	}

	await job.remove();

	return job;
}

module.exports = jobService;