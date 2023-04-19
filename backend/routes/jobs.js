const express = require('express')
const {getJobs, getJob, addJob, updateJob, deleteJob} = require('../controller/jobs')
const router = express.Router({mergeParams: true})

// advanced middleware
const Job = require('../models/Jobs')
const advancedResult = require('../middleware/advancedResult')

router.route('/').get(advancedResult(Job, {
    path: 'user',
    select: 'name description'
}
),getJobs).post(addJob)
router.route('/:id').get(getJob).put(updateJob).delete(deleteJob)

module.exports = router