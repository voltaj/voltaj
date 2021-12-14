const responseHelper = require('@app/helpers/responseHelper');
const jobService = require('@app/services/job.service');

const jobController = {};

jobController.getAll = async (req, res) => {
    try {
        const jobs = await jobService.getAll();
        responseHelper.successWithData(res, jobs);
    } catch(err){
        responseHelper.error(res, "Something went wrong. Job not brought!")
    }
}

jobController.getById = async (req, res) => {
    const job = await jobService.getById(req.params.id);

    if(!job){
        responseHelper.error(res, "Job not found");
        return;
    }

    responseHelper.successWithData(res, job);
}

jobController.createJob = async (req, res) => {
    try {
        const job = await jobService.create(req.body);
        responseHelper.successWithData(res, job);
    } catch(err){
        responseHelper.error(res,  "Something went wrong. Job not created!");
    }
}

//jobController.updateById = (req, res) => {
//    res.json({ id: 1 });
//}

jobController.updateStatusById = async (req, res) => {
    try {
        const job = await jobService.getById(req.params.id);

        if(!job){
            responseHelper.error(res, "Job not found");
            return;
        }

        await job.remove();
        responseHelper.success(res);
    } catch(err){
        responseHelper.error(res, "Something went wrong. Could not delete job!");
    }
}

module.exports = jobController;