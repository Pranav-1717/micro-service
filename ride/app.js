const express = require('express')
const dotenv = require('dotenv')
dotenv.config()
const app = express()
const connect = require('./DB/db')
connect()
const rideRoutes = require('./routes/ride_routes')
const cookieParser = require('cookie-parser')
const RabbitMQ = require('./service/rabbit')

RabbitMQ.connect()

app.use(express.json())
app.use(express.urlencoded({extended:true}))
app.use(cookieParser())

app.use('/' , rideRoutes)

module.exports = app
