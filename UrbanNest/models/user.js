const mongoose  = require('mongoose')
const {Schema} = mongoose
const passoprtLocalMongoose = require('passport-local-mongoose')


const userSchema = new Schema({
    email :{
        type : String,
        required : true
    }
})


userSchema.plugin(passoprtLocalMongoose);

module.exports = mongoose.model('User', userSchema)