const express = require('express')
const router = express.Router()
const {getUsers, getUser, createUser, deleteUser, updateUser} = require('../controller/users')

const jobsRouter = require('./jobs')
router.use('/:usersId/jobs', jobsRouter)

router.route('/').get(getUsers).post(createUser)
router.route('/:id').put(updateUser).delete(deleteUser).get(getUser)

module.exports = router