const review = require('../models/reviews.js')
const listing = require('../models/listing.js')

module.exports.reviewPost = async (req, res, next) => {
    let { id } = req.params
    let list =  await listing.findById(id)
    let newReview = new review(req.body.review)
    newReview.author = req.user._id
    list.reviews.push(newReview)
    await newReview.save();
    await list.save()
    req.flash("success","Review Added Successfully")
    res.redirect(`/listings/${id}`)
}

module.exports.deletePost = async (req, res) => {
    let { id, reviewId } = req.params
    await listing.findByIdAndUpdate(id, {$pull : {reviews:reviewId}})
    await review.findByIdAndDelete(reviewId)
    req.flash("success","Review Deleted Successfully")
    res.redirect(`/listings/${id}`)
}