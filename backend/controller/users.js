// const User = require('../models/Users')
const User = require('../models/User')
const ErrorResponse = require('../utils/errorResponse')
const asyncHandler = require('../middleware/async')

// @desc Get all users
// @route Get /api/v1/users
// @access public 
exports.getUsers = asyncHandler(async (req, res, next) => {
    let query

    // copy requests
    let reqQuery = {...req.query}

    // Fields to exclude
    const removeFields = ['select', 'sort','page', 'limit']
    // loop over remove fields and delete them from reqQuery
    removeFields.forEach(param => delete reqQuery[param])

    let queryStr = JSON.stringify(reqQuery)
    queryStr = queryStr.replace(/\b(gt|gte|lt|lte|in)\b/g, match => `$${match}`)

    // query = User.find(JSON.parse(queryStr)).populate('jobs')
    query = User.find(JSON.parse(queryStr))

    // Select fields
    if (req.query.select){
        const fields = req.query.select.split(',').join(' ')
        query = query.select(fields)
    }

    if (req.query.sort) {
        const sortBy = req.query.sort.split(',').join(' ')
        query = query.sort(sortBy)
    }else {
        query = query.sort('-createdAt')
    }

    // pagination
    const page = parseInt(req.query.page, 10) || 1
    const limit = parseInt(req.query.limit, 10) || 20
    const startIndex = (page - 1) * limit
    const endIndex = page * limit
    const total = await User.countDocuments()

    query = query.skip(startIndex).limit(limit)

    // exicuting query
    const users = await query

    // pagination result
    const pagination = {}
    if (endIndex < total) {
        pagination.next = {
            page: page + 1,
            limit: limit
        }
    }

    if (startIndex > 0) {
        pagination.prev = {
            page: page - 1,
            limit: limit
        }
    }

    res.status(200).json({success: true, count: users.length, pagination, data:users})
})

// @desc Get single users
// @route Get /api/v1/users/:id
// @access public 
exports.getUser = asyncHandler(async (req, res, next) => {
    const bootcamp = await User.findById(req.params.id)

    if (!bootcamp){
        return next(new ErrorResponse(`User not found with id of ${req.params.id}`, 404))
    }

    res.status(200).json({success: true, data: bootcamp})
})

// @desc create new users
// @route POST /api/v1/users
// @access private 
exports.createUser = asyncHandler(async (req, res, next) => {
    const bootcamp = await User.create(req.body)
    res.status(201).json({success: true, data: bootcamp})
})

// @desc update bootcamp
// @route PUT /api/v1/users/:id
// @access private 
exports.updateUser = asyncHandler(async (req, res, next) => {
    const bootcamp = await User.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true
    })

    if (!bootcamp){
        return next(new ErrorResponse(`User not found with id of ${req.params.id}`, 404))
    }

    res.status(200).json({success: true, data: bootcamp})
})

// @desc delete bootcamp
// @route DELETE /api/v1/users/:id
// @access private 
exports.deleteUser = asyncHandler(async (req, res, next) => {
    const bootcamp = await User.findByIdAndDelete(req.params.id);

    if (!bootcamp) {
        return next(
        new ErrorResponse(`User not found with id of ${req.params.id}`, 404)
        );
    }

    // delete bootcamp dependencies
    // Cascade delete courses when a bootcamp is deleted
    await Courses.deleteMany({bootcamp: bootcamp._id})

    res.status(200).json({ success: true, data: {} });
})