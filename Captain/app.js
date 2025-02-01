const express = require('express')
const app = express()
const dotenv = require('dotenv')
dotenv.config()
const connect = require('./DB/db')
connect()
const CaptainRoute = require('./Routes/captain_routes')
const cookieParser = require('cookie-parser')
const RabbitMQ = require('./service/rabbit')

RabbitMQ.connect()

app.use(express.json())
app.use(express.urlencoded({extended:true}))
app.use(cookieParser())


app.use('/' ,CaptainRoute)

module.exports = app