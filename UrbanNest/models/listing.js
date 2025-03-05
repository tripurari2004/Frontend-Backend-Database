const mongoose  = require('mongoose')
const {Schema} = mongoose
const review = require("./reviews.js")


const listingSchema = new Schema({
    title :{
        type : String,
        required : true
    },
    
    description :{
        type : String,
        required : true
    },

    image :{ 
        type : String,
        default : "https://freedesignfile.com/upload/2017/05/Sunrise-tropical-island-beach-view-HD-picture-04.jpg",
        set : (v) => v==="" ? "https://freedesignfile.com/upload/2017/05/Sunrise-tropical-island-beach-view-HD-picture-04.jpg" : v
    },

    price :{
        type : Number,
        required : true
    },

    location :{
        type : String,
        required : true
    },

    country :{
        type : String,
        required : true
    },

    reviews : [
        {
            type:Schema.Types.ObjectId,
            ref:"Review"
        }
    ]

})

listingSchema.post('findOneAndDelete', async(listing)=>{
    if(listing){
         await review.deleteMany({_id: {$in: listing.reviews}})
    }
})

const listing = mongoose.model('Listing', listingSchema)
module.exports = listing;