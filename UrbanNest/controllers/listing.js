const listing = require('../models/listing.js')
const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding');
const mapToken = process.env.MAP_TOKEN
const geocodingClient = mbxGeocoding({ accessToken: mapToken });


module.exports.index = async (req, res) => {
    let list = await listing.find()
    res.render('listings/index.ejs', { list })
}

module.exports.newForm = (req, res) => {
    res.render('listings/new.ejs')
}

module.exports.show = async (req, res) => {
    let { id } = req.params
    let data = await listing.findById(id).populate({path: 'reviews', populate:{path:'author'}}).populate('owner')
    if(!data){
        req.flash("error","Listing does not exist")
        res.redirect('/listings')
    }
    res.render('listings/show.ejs', { data })
}

module.exports.create = async (req, res, next) => {
    let response = await geocodingClient.forwardGeocode({
        query: req.body.listing.location,
        limit: 1
      })
        .send()

    let url = req.file.path
    let filename = req.file.filename
    let newlisting = new listing(req.body.listing)
    newlisting.owner = req.user._id
    newlisting.image = {url, filename}
    newlisting.geometry = response.body.features[0].geometry
    let save = await newlisting.save()
    console.log(save)
    req.flash("success","New Listing Added Successfully")
    res.redirect('/listings')
}

module.exports.edit = async(req, res) => {
    let { id } = req.params
    let data = await listing.findById(id)
    if(!data){
        req.flash("error","Listing does not exist")
        res.redirect('/listings')
    }
    let original = data.image.url;
    original = original.replace('/upload', '/upload/w_250')
    res.render('listings/edit.ejs', { data, original })
}

module.exports.update = async(req, res) => {
    let { id } = req.params
    let list = await listing.findByIdAndUpdate(id, { ...req.body.listing })
    if(typeof req.file != 'undefined'){
        let url = req.file.path
        let filename = req.file.filename
        list.image = {url, filename}
        await list.save()
    }
    req.flash("success","Listing Edited Successfully")
    res.redirect(`/listings/${id}`)

}

module.exports.delete = async(req, res) => {
    let { id } = req.params
    await listing.findByIdAndDelete(id)
    req.flash("success","Listing Deleted Successfully")
    res.redirect('/listings')
}