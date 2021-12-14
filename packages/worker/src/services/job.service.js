const Job = require('../models/job.model');
const jobConstants = require('../constants/job.constants');
const serverService = require('./server.service');

const jobService = {};

jobService.getAllJobs = async () => {
	return Job.find();
}

jobService.getJobById = async (id) => {
	return Job.findById(id);
}

jobService.getAWaitingJob = async () => {
	return Job.findOne({ status: jobConstants.status.WAITING });
}

jobService.createJob = async (jobBody) => {
	const currentServer = await serverService.getCurrentServer();

	if(!currentServer){
		throw new Error("Server record not found into server collection!");
	}

	return Job.create({
		serverId: currentServer._id,
		status: jobConstants.status.WAITING,
		...jobBody
	});
};

jobService.updateJob = async (job) => {
	const { ...updateData } = job._doc;
	return Job.findByIdAndUpdate(job.id, updateData);
};

jobService.updateJobStatus = async (id, status) => {
	return Job.findByIdAndUpdate(id, { status });
};

jobService.deleteJobById = async (jobId) => {
	const job = await jobService.getJobById(jobId);

	if(!job){
		throw new Error("Job not found");
	}

	await job.remove();

	return job;
}

module.exports = jobService;