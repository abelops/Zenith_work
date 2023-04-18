const express = require('express')
const dotenv = require('dotenv')
const morgan = require('morgan')
const colors = require('colors')
const connectDB = require('./config/db')
const errorHandler = require('./middleware/error')

// load env files
dotenv.config({path: './config/config.env'})

// route files
const users = require('./routes/users')

// connect to database

connectDB()

const app = express()

// Body parser
app.use(express.json())

// Dev logging middleware
if (process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'))
}



// mount routers

app.use('/api/v1/users', users)


// error handler middleware
app.use(errorHandler)

const PORT = process.env.PORT
const server = app.listen(PORT, console.log(`server running in ${process.env.NODE_ENV} mode on port ${PORT}`.cyan.bold))

// handle unhandled promise rejections

process.on('unhandledRejection', (err, promise) => {
    console.log(`Error: ${err.message}`.red)
    server.close(() => process.exit(1))
})