const fs = require('fs')
const mongoose = require('mongoose')
const colors = require('colors')
const dotenv = require('dotenv')

// load env vars

dotenv.config({path: './config/config.env'})

// load models
const User = require('./models/User')
const Job = require('./models/Jobs')

// connect to DB
mongoose.connect(process.env.MONGO_URI)

// read json files
const users = JSON.parse(fs.readFileSync(`${__dirname}/_data/users.json`, 'utf-8'))
const job = JSON.parse(fs.readFileSync(`${__dirname}/_data/jobs.json`, 'utf-8'))

// import into DB

const importData = async() => {
    try {
        await User.create(users)
        await Job.create(job)
        console.log(`Data Imported...`.green.inverse)
        process.exit(1)
    } catch (err) {
        console.log(err.message)
        process.exit(1)
    }
}

// Delete data

const deleteData = async() => {
    try {
        await User.deleteMany()
        await Job.deleteMany()
        console.log(`Data Destroyed...`.red.inverse)
        process.exit(1)
    } catch (err) {
        console.log(err.message)
    }
}

if (process.argv[2] === '-i') {
    importData()
}

else if (process.argv[2] == '-d') {
    deleteData()
}