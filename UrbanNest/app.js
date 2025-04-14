const express = require('express')
const app = express()
const mongoose = require('mongoose')
const port = 3000
const path = require('path')
const methodOverride = require('method-override')
const ejsMate = require('ejs-mate')
const ExpressError = require('./utils/ExpressError.js')
const listings = require('./routes/listing.js')
const reviews = require('./routes/review.js')
const userRouter = require('./routes/user.js')
const session = require ("express-session")
const flash = require("connect-flash")
const passport = require("passport")
const localStrategy = require("passport-local")
const user = require("./models/user.js")

const sessionOption = {
    secret : "tripurari2268",
    resave : false,
    saveUninitialized : true,
    cookie:{
        expires:Date.now()+7*24*60*60*1000,
        maxAge:7*24*60*60*1000,
        httpOnly:true
    }
};

app.use(session(sessionOption));
app.use(flash())

app.use(passport.initialize())
app.use(passport.session())
passport.use(new localStrategy(user.authenticate()))
passport.serializeUser(user.serializeUser())
passport.deserializeUser(user.deserializeUser())

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'))
app.use(express.urlencoded({ extended: true }))
app.use(methodOverride('_method'))
app.engine('ejs', ejsMate);
app.use(express.static(path.join(__dirname, "/public")))


// Database
main().then((res) => {
    console.log('Connected to db')
}).catch((err) => {
    console.log(err)
})

async function main() {
    await mongoose.connect('mongodb://127.0.0.1:27017/urbannest')
}

app.use((req,res,next)=>{
    res.locals.success = req.flash("success")
    res.locals.error = req.flash('error')
    next();
})

// app.get('/demouser', async(req,res)=>{
//     let fake = new user({
//         email:"tripurari@gmail.com",
//         username:"tripurari"
//     })

//     let reguser = await user.register(fake,'tripurari2268')
//     res.send(reguser)
// })

app.use("/listings", listings)
app.use("/listings/:id/reviews", reviews)
app.use("/", userRouter)

app.all('*', (req, res, next) => {
    next(new ExpressError(404, 'Page Not Found'))
})

app.use((err, req, res, next) => {
    let { status=500, message="Something went wrong" } = err
    res.status(status).render('error.ejs', {message})
})

app.listen(port, (req, res) => {
    console.log('Sever listing')
})