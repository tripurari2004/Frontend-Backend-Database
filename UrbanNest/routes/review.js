const express = require('express')
const router = express.Router({mergeParams : true})
const wrapAsync = require('../utils/wrapAsync.js')
const {validateReview, isLoggedin, isAuther} = require('../middleware.js')
const reviewController = require('../controllers/review.js')

// Reviews Post
router.post('/', isLoggedin, validateReview, wrapAsync(reviewController.reviewPost))


// Reviews Delete
router.delete('/:reviewId', isLoggedin, isAuther, wrapAsync(reviewController.deletePost))

module.exports = router;