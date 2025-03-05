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

app.use("/listings", listings)
app.use("/listings/:id/reviews", reviews)

app.all('*', (req, res, next) => {
    next(new ExpressError(404, 'Page Not Found'))
})

app.use((err, req, res, next) => {
    let { status=500, message="Something went wrong" } = err
    res.status(status).render('error.ejs', {message})
    // res.status(status).send(message)
})

app.listen(port, (req, res) => {
    console.log('Sever listing')
})