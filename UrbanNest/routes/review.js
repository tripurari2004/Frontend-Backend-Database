const express = require('express')
const router = express.Router({mergeParams : true})
const review = require('../models/reviews.js')
const listing = require('../models/listing.js')
const { reviewSchema } = require('../schema.js')
const wrapAsync = require('../utils/wrapAsync.js')
const ExpressError = require('../utils/ExpressError.js')


const validateReview = (req,res,next)=>{
    let {error} = reviewSchema.validate(req.body)
    if(error){
        throw new ExpressError(400, error)
    }else{
        next()
    }

} 

// Reviews Post
router.post('/', validateReview, wrapAsync(async (req, res, next) => {
    let { id } = req.params
    let list =  await listing.findById(id)
    let newReview = new review(req.body.review)
    list.reviews.push(newReview)
    await newReview.save();
    await list.save()
    res.redirect(`/listings/${id}`)
}))


// Reviews Delete
router.delete('/:reviewId', wrapAsync(async (req, res) => {
    let { id, reviewId } = req.params
    await listing.findByIdAndUpdate(id, {$pull : {reviews:reviewId}})
    await review.findByIdAndDelete(reviewId)
    res.redirect(`/listings/${id}`)
}))

module.exports = router;