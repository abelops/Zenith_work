const express = require('express')
const {getJobs} = require('../controller/jobs')
const router = express.Router({mergeParams: true})

router.route('/').get(getJobs)

module.exports = router