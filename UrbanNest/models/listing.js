const mongoose  = require('mongoose')
const {Schema} = mongoose


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

})

const listing = mongoose.model('Listing', listingSchema)
module.exports = listing;