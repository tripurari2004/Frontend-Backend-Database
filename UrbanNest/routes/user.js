const express = require('express')
const router = express.Router()
const wrapAsync = require('../utils/wrapAsync.js')
const passport = require('passport')
const { saveRedirect } = require('../middleware.js')
const userController = require('../controllers/user.js')

router.route('/signup')
.get((req,res)=>{
    res.render('users/signup.ejs')
})
.post(wrapAsync(userController.signup))


router.route('/login')
.get((req,res)=>{
    res.render('users/login.ejs')
})
.post(saveRedirect ,passport.authenticate('local', {failureRedirect:'/login', failureFlash:true}), userController.login)


router.get('/logout', userController.logout)

module.exports = router;