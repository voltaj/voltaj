const responseHelper = require("../helpers/responseHelper");
const jobService = require('../services/job.service');

const jobController = {};

jobController.getAll = async (req, res) => {
    try {
        const jobs = await jobService.getAllJobs();
        responseHelper.successWithData(res, null, jobs);
    } catch(err){
        responseHelper.error(res, "Something went wrong. Job not brought!")
    }
}

jobController.getById = async (req, res) => {
    const job = await jobService.getJobById(req.params.id);

    if(!job){
        responseHelper.error(res, "Job not found");
        return;
    }

    responseHelper.successWithData(res, null, job);
}

jobController.createJob = async (req, res) => {
    try {
        const job = await jobService.createJob(req.body);
        responseHelper.successWithData(res, null, job);
    } catch(err){
        responseHelper.error(res,  "Something went wrong. Job not created!");
    }
}

//jobController.updateById = (req, res) => {
//    res.json({ id: 1 });
//}

jobController.deleteById = async (req, res) => {
    try {
        const job = await jobService.getJobById(req.params.id);

        if(!job){
            responseHelper.error(res, "Job not found");
            return;
        }

        await job.remove();
        responseHelper.successWithData(res, null, job);
    } catch(err){
        responseHelper.error(res, "Something went wrong. Could not delete job!");
    }
}

module.exports = jobController;