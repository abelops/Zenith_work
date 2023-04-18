const express = require('express')
const dotenv = require('dotenv')

// environmentals path
dotenv.config({path:'./config/config.env'})


const app = express()

let dd = Date
dd = 1681824811584

console.log(dd)
process.exit(1)