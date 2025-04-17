const listing = require('./models/listing')
const reviews = require('./models/reviews')
const ExpressError = require('./utils/ExpressError.js')
const { listingSchema } = require('./schema.js')
const { reviewSchema } = require('./schema.js')

module.exports.isLoggedin = (req, res, next)=>{
    if(!req.isAuthenticated()){
        req.session.redirectUrl = req.originalUrl
        req.flash('error', 'You must be logged in to cretae listing')
        return res.redirect('/login')
    }
    next()
}


module.exports.saveRedirect = (req,res,next)=>{
    if(req.session.redirectUrl){
        res.locals.redirectUrl = req.session.redirectUrl
    }
    next()
}

module.exports.isOwner = async(req,res,next)=>{
    let { id } = req.params
    let list = await listing.findById(id)
    if(!list.owner._id.equals(res.locals.currUser._id)){
        req.flash("error","You don't have permission to edit")
        return res.redirect(`/listings/${id}`)
    }
    next()
}

module.exports.validateListing = (req,res,next)=>{
    let {error} = listingSchema.validate(req.body)
    if(error){
        throw new ExpressError(400, error)
    }else{
        next()
    }

}

module.exports.validateReview = (req,res,next)=>{
    let {error} = reviewSchema.validate(req.body)
    if(error){
        throw new ExpressError(400, error)
    }else{
        next()
    }

} 

module.exports.isAuther = async(req,res,next)=>{
    let { id,reviewId } = req.params
    let list = await reviews.findById(reviewId)
    if(!list.author._id.equals(res.locals.currUser._id)){
        req.flash("error","You don't have permission to delete")
        return res.redirect(`/listings/${id}`)
    }
    next()
}