import TestServices from '../controller/test'
const express = require('express')
const router = express.Router()

router.get('/', TestServices.get)
router.get('/me/:id' , TestServices.getById)
router.post('/', TestServices.create)
router.put('/', TestServices.update)
router.delete('/', TestServices.delete)

module.exports = router


