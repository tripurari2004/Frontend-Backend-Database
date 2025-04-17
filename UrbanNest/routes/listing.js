const express = require("express");
const router = express.Router();
const wrapAsync = require('../utils/wrapAsync.js')
const {isLoggedin, isOwner, validateListing} = require('../middleware.js')
const listingController = require('../controllers/listing.js')
const multer  = require('multer')
const {storage} = require('../cloudConfig.js')
const upload = multer({ storage })


router.route('/')
.get(wrapAsync(listingController.index))
.post(isLoggedin, validateListing, upload.single("listing[image]"), wrapAsync(listingController.create))


router.get('/new', isLoggedin, listingController.newForm)


router.route('/:id')
.get(wrapAsync(listingController.show))
.put(isLoggedin, isOwner, upload.single("listing[image]"), validateListing,  wrapAsync(listingController.update))
.delete(isLoggedin, isOwner, wrapAsync(listingController.delete))


// Edit Route
router.get('/:id/edit', isLoggedin, isOwner, wrapAsync(listingController.edit))


module.exports = router;