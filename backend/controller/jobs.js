const Job = require('../models/Jobs')
const ErrorResponse = require('../utils/errorResponse')
const asyncHandler = require('../middleware/async')
const User = require('../models/User')

// @desc Get all jobs
// @route Get /api/v1/jobs
// @route Get /api/v1/users/:usersId/jobs
// @access public

// @desc Get all jobs
// @route Get /api/v1/jobs
// @route Get /api/v1/users/:usersId/jobs
// @access public
exports.getJobs = asyncHandler(async (req, res, next) => {
    if (req.params.usersId) {
        const jobs = await Job.find({user: req.params.usersId})
        return res.status(200).json({success:true, count: jobs.length, data: jobs})
    }
    
    res.status(200).json(res.advancedResults)
})

// @desc Get single jobs
// @route Get /api/v1/jobs/:id
// @access public
exports.getJob = asyncHandler(async (req, res, next) => {
    const job = await Job.findById(req.params.id).populate({
        path: 'user',
        select: 'name description'
    })

    if (!job) {
        return next(new ErrorResponse(`No job with id of ${req.params.id}`, 404))
    }

    res.status(200).json({success:true, data: job})
})

// @desc Add job
// @route POST /api/v1/users/:usersId/jobs
// @access private
exports.addJob = asyncHandler(async (req, res, next) => {
    req.body.user = req.params.usersId

    const user = await User.findById(req.params.usersId)

    if (!user) {
        return next(new ErrorResponse(`No user with id of ${req.params.usersId}`, 404))
    }

    const job = await Job.create(req.body)

    res.status(200).json({success:true, data: job})
})

// @desc Update job
// @route PUT /api/v1/jobs/:id
// @access private
exports.updateJob = asyncHandler(async (req, res, next) => {

    let job = await Job.findById(req.params.id)

    if (!job) {
        return next(new ErrorResponse(`No job with id of ${req.params.id}`, 404))
    }

    job = await Job.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true
    }) 

    res.status(200).json({success:true, data: job})
})

// @desc delete job
// @route DELETE /api/v1/jobs/:id
// @access private
exports.deleteJob = asyncHandler(async (req, res, next) => {

    const job = await Job.findByIdAndDelete(req.params.id)

    if (!job) {
        return next(new ErrorResponse(`No job with id of ${req.params.id}`, 404))
    }

    res.status(200).json({success:true, data: {}})
})