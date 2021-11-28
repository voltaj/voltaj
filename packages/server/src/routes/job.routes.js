const express = require('express')
const router = express.Router();
const validate = require('../middlewares/validateRequestByScheme');
const jobController = require('../controllers/job.controller');
const jobValidations = require('../validations/job.validations');

router.route('/')
    .get(jobController.getAll)
    .post(validate(jobValidations.createJobScheme), jobController.createJob);

router.route('/:id')
    .get(validate(jobValidations.getJobScheme), jobController.getById)
    //.patch(validate(jobValidations.updateJobScheme), jobController.updateById)
    .delete(validate(jobValidations.deleteJobScheme), jobController.deleteById)

module.exports = router;