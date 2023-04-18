const Job = require('../models/Jobs')
const ErrorResponse = require('../utils/errorResponse')
const asyncHandler = require('../middleware/async')
const queryHandler = require('../utils/queryHandler')
const paginationHandler = require('../utils/paginationHandler')
const pageHandler = require('../utils/pageHandler')

// @desc Get all jobs
// @route Get /api/v1/jobs
// @route Get /api/v1/users/:usersId/jobs
// @access public
exports.getJobs = asyncHandler(async (req, res, next) => {
    let query

    if (req.params.usersId) {
        query = Job.find({...queryHandler(req), user: req.params.usersId})
        // query = Job.find({user: req.params.usersId})
    }
    else{
        query = Job.find(queryHandler(req)).populate({
            path: 'user',
            select: 'name description'
        })
    }

    // const jobs = await query

    const {result, page, limit, endIndex, startIndex} = paginationHandler(query, req)
    const total = Math.ceil((await Job.find(queryHandler(req))).length/limit)
    // exicuting query
    const jobs = await result

    // pagination result
    const pagination = pageHandler(total, page, limit)

    res.status(200).json({success:true, pagination, count: jobs.length, data: jobs})
})