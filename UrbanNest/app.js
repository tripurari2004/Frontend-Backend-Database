const express = require('express')
const app = express()
const mongoose = require('mongoose')
const port = 3000
const listing = require('./models/listing.js')
const path = require('path')
const methodOverride = require('method-override')
const ejsMate = require('ejs-mate')
const wrapAsync = require('./utils/wrapAsync.js')
const ExpressError = require('./utils/ExpressError.js')
const { MessageEvent } = require('http')

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


// Home Route
app.get('/listings', wrapAsync(async (req, res) => {
    let list = await listing.find()
    res.render('listings/index.ejs', { list })
}))


// New Route
app.get('/listings/new', (req, res) => {
    res.render('listings/new.ejs')
})


//Show Route
app.get('/listings/:id', wrapAsync(async (req, res) => {
    let { id } = req.params
    let data = await listing.findById(id)
    res.render('listings/show.ejs', { data })
}))


// Create Route
app.post('/listings', wrapAsync(async (req, res, next) => {
    if(!req.body.listing){
        throw new ExpressError(400, 'Send valid data for listing')
    }
    let newlisting = new listing(req.body.listing)
    await newlisting.save()
    res.redirect('/listings')
}))



// Edit Route
app.get('/listings/:id/edit', wrapAsync(async(req, res) => {
    let { id } = req.params
    let data = await listing.findById(id)
    res.render('listings/edit.ejs', { data })
}))



// Update Route
app.put('/listings/:id', wrapAsync(async(req, res) => {
    let { id } = req.params
    if(!req.body.listing){
        throw new ExpressError(400, 'Send valid data for listing')
    }
    await listing.findByIdAndUpdate(id, { ...req.body.listing })
    res.redirect(`/listings/${id}`)

}))


// Delete Route
app.delete('/listings/:id', wrapAsync(async(req, res) => {
    let { id } = req.params
    await listing.findByIdAndDelete(id)
    res.redirect('/listings')
}))

app.all('*', (req, res, next) => {
    next(new ExpressError(404, 'Page Not Found'))
})

app.use((err, req, res, next) => {
    let { status=500, message="Something went wrong" } = err
    res.render('error.ejs', {message})
    // res.status(status).send(message)
})

app.listen(port, (req, res) => {
    console.log('Sever listing')
})