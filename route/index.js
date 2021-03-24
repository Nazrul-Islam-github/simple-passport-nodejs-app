const express = require('express');
const router = express.Router()

const { ensureAuthenticate } = require('../config/auth')
// welcome page
router.get('/', (req, res) => {
    res.render('welcome')
})
// deshbord
router.get('/dashboard',ensureAuthenticate, (req, res) => {
    res.render('dashbord',{
        user:req.user
    })
})

module.exports = router