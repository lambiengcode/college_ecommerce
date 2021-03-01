import AuthServices from '../controller/auth'
const express = require('express')
const router = express.Router()

router.post('/login', AuthServices.login)
router.post('/register' , AuthServices.register)
// router.post('/forgot-password', AuthServices.forgotPassword)
router.put('/change-password', AuthServices.changePassword)

module.exports = router