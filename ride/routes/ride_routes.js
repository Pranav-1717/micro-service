const express = require('express')
const router = express.Router()
const Middleware = require('../middlewares/auth_middleware')
const controller = require('../controller/ride_ct')

router.use('/create-ride' , Middleware.AuthMiddleware , controller.createRide)
router.put('/accept-ride',Middleware.captainAuth, controller.acceptRide)


module.exports = router