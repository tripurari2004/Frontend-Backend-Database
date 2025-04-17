const user = require("../models/user.js")

module.exports.signup = async(req,res)=>{
    try{
        let {username, email, password} = req.body
        const newUser = new user({email, username})
        const regUser = await user.register(newUser, password)
        req.login(regUser,(err)=>{
            if(err){
                return next(err)
            }
            req.flash('success', "Welcome to UrbanNest")
            res.redirect('/listings')
        })
    }catch(e){
        req.flash('error', e.message)
        res.redirect('/signup')
    }
}

module.exports.login = async(req,res)=>{
    req.flash('success','Welcome back to UrbanNest!')
    let redirectUrl = res.locals.redirectUrl || '/listings'
    res.redirect(redirectUrl)
}

module.exports.logout = (req,res,next)=>{
    req.logout((err)=>{
        if(err){
            return next(err)
        }
        req.flash('success','You are logged out')
        res.redirect('/listings')
    })
}