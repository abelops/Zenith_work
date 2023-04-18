const User = require('../models/User')
const ErrorResponse = require('../utils/errorResponse')
const asyncHandler = require('../middleware/async')
const queryHandler = require('../utils/queryHandler')
const paginationHandler = require('../utils/paginationHandler')
const pageHandler = require('../utils/pageHandler')
const Jobs = require('../models/Jobs')

// @desc Get all users
// @route Get /api/v1/users
// @access public 
exports.getUsers = asyncHandler(async (req, res, next) => {
    let query

    // query = User.find(JSON.parse(queryStr)).populate('jobs')
    query = User.find(queryHandler(req))

    
    const {result, page, limit, endIndex, startIndex} = paginationHandler(query, req)
    const total = Math.ceil((await User.find(queryHandler(req))).length/limit)
    // exicuting query
    const users = await result

    // pagination result
    const pagination = pageHandler(total, page, limit)
    res.status(200).json({success: true, count: users.length, pagination, data:users})
})

// @desc Get single users
// @route Get /api/v1/users/:id
// @access public 
exports.getUser = asyncHandler(async (req, res, next) => {
    const user = await User.findById(req.params.id)

    if (!user){
        return next(new ErrorResponse(`User not found with id of ${req.params.id}`, 404))
    }

    res.status(200).json({success: true, data: user})
})

// @desc create new users
// @route POST /api/v1/users
// @access private 
exports.createUser = asyncHandler(async (req, res, next) => {
    const user = await User.create(req.body)
    res.status(201).json({success: true, data: user})
})

// @desc update user
// @route PUT /api/v1/users/:id
// @access private 
exports.updateUser = asyncHandler(async (req, res, next) => {
    const user = await User.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true
    })

    if (!user){
        return next(new ErrorResponse(`User not found with id of ${req.params.id}`, 404))
    }

    res.status(200).json({success: true, data: user})
})

// @desc delete user
// @route DELETE /api/v1/users/:id
// @access private 
exports.deleteUser = asyncHandler(async (req, res, next) => {
    const user = await User.findByIdAndDelete(req.params.id);

    if (!user) {
        return next(
        new ErrorResponse(`User not found with id of ${req.params.id}`, 404)
        );
    }

    // delete user dependencies
    // Cascade delete courses when a user is deleted
    await Jobs.deleteMany({user: user._id})

    res.status(200).json({ success: true, data: {} });
})