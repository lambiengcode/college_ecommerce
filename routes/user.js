
import UserServices from '../controller/user'
const express = require('express')
const router = express.Router()

router.get('/', UserServices.get)
router.get('/me/:id', UserServices.getById)
router.get('/count', UserServices.count)
router.get('/checkUser/:id', UserServices.checkUser)

router.post('/reg/pw', UserServices.postLoginPassword)
router.post('/reg/fb', UserServices.postLoginFacebook)
router.post('/reg/gg', UserServices.postLoginGoogle)

router.put('/pwChange', UserServices.changePassword)
router.put('/', UserServices.update)
router.delete('/', UserServices.delete)

module.exports = router
