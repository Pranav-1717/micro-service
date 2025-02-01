const express = require('express')
const router = express.Router()
const contoller = require('../controllers/captain_ct')
const AuthMiddleware = require('../middlewares/captainauth')

router.post('/register' , contoller.register)
router.post('/login' , contoller.login)
router.get('/logout' ,contoller.logout)
router.get('/profile' , AuthMiddleware.captainAuth , contoller.profile)
router.patch('/toggle-isAvailability', AuthMiddleware.captainAuth , contoller.isAvailability)
router.get('/new-ride' , AuthMiddleware.captainAuth , contoller.waitForNewRide)


module.exports = router