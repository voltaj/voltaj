const express = require('express')
const router = express.Router();
const validate = require('@app/api/middlewares/validateRequestByScheme');
const jobController = require('@app/api/controllers/job.controller');
const jobValidations = require('@app/api/validations/job.validations');

// route: /api/jobs
router.route('/')
    .get(jobController.getAll)
    .post(validate(jobValidations.createJobScheme), jobController.createJob);

// route: /api/jobs/:id
router.route('/:id')
    .get(validate(jobValidations.getJobScheme), jobController.getById)
    //.patch(validate(jobValidations.updateJobScheme), jobController.updateById)
    .delete(validate(jobValidations.deleteJobScheme), jobController.updateStatusById)

module.exports = router;