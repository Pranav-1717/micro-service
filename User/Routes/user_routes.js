const express = require('express')
const router = express.Router()
const contoller = require('../controllers/user_ct')
const AuthMiddleware = require('../middlewares/userauth')

router.post('/register' , contoller.register)
router.post('/login' , contoller.login)
router.get('/logout' ,contoller.logout)
router.get('/profile' ,AuthMiddleware.userAuth , contoller.profile)
router.get('/accepted-ride',AuthMiddleware.userAuth, contoller.acceptedRide);


module.exports = router