const express = require('express')
const router = express.Router();

const JobManager = require("../containers/jobs")

router.route('/')
    .get(JobManager.getAll);

router.route('/:id')
    .get(JobManager.get);

module.exports = router;