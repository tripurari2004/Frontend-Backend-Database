const express = require("express");
const router = express.Router();
const listing = require('../models/listing.js')
const wrapAsync = require('../utils/wrapAsync.js')
const ExpressError = require('../utils/ExpressError.js')
const { listingSchema } = require('../schema.js')

const validateListing = (req,res,next)=>{
    let {error} = listingSchema.validate(req.body)
    if(error){
        throw new ExpressError(400, error)
    }else{
        next()
    }

}

// Home Route
router.get('/', wrapAsync(async (req, res) => {
    let list = await listing.find()
    res.render('listings/index.ejs', { list })
}))


// New Route
router.get('/new', (req, res) => {
    res.render('listings/new.ejs')
})


//Show Route
router.get('/:id', wrapAsync(async (req, res) => {
    let { id } = req.params
    let data = await listing.findById(id).populate('reviews')
    if(!data){
        req.flash("error","Listing does not exist")
        res.redirect('/listings')
    }
    res.render('listings/show.ejs', { data })
}))


// Create Route
router.post('/', validateListing, wrapAsync(async (req, res, next) => {
    let newlisting = new listing(req.body.listing)
    await newlisting.save()
    req.flash("success","New Listing Added Successfully")
    res.redirect('/listings')
}))



// Edit Route
router.get('/:id/edit', wrapAsync(async(req, res) => {
    let { id } = req.params
    let data = await listing.findById(id)
    if(!data){
        req.flash("error","Listing does not exist")
        res.redirect('/listings')
    }
    res.render('listings/edit.ejs', { data })
}))



// Update Route
router.put('/:id',validateListing, wrapAsync(async(req, res) => {
    let { id } = req.params
    await listing.findByIdAndUpdate(id, { ...req.body.listing })
    req.flash("success","Listing Edited Successfully")
    res.redirect(`/listings/${id}`)

}))


// Delete Route
router.delete('/:id', wrapAsync(async(req, res) => {
    let { id } = req.params
    await listing.findByIdAndDelete(id)
    req.flash("success","Listing Deleted Successfully")
    res.redirect('/listings')
}))


module.exports = router;