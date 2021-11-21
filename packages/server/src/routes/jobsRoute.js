const express = require('express')
const router = express.Router();

const jobController = require("../controllers/jobController")

router.route('/').get(jobController.getAll);
router.route('/:id').get(jobController.get);

module.exports = router;