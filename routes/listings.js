let express=require('express');
let router=express.Router();
const { isLoggedIn, isOwner,validateListing } = require('../middleware.js');
const listingController=require('../controllers/listings.js');
const multer  = require('multer')
const {storage}=require('../cloudConfig.js');
const upload = multer({ storage })

router.get('/', listingController.index);

router.get('/new',isLoggedIn, listingController.newListingForm);

router.post('/',upload.single('listings[image][url]'), listingController.newListingCreations);

router.get('/:id', listingController.individualListing);

router.get('/:id/edit',isLoggedIn,listingController.renderEditForm);

router.put('/:id', isLoggedIn,isOwner, upload.single('listings[image][url]'),listingController.Updation);

router.delete('/:id', isLoggedIn,isOwner,listingController.Destroy);

router.get('/category/:category', isLoggedIn, listingController.Category);

module.exports=router;