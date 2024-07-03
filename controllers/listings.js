const Listings = require('../models/listings');
require('dotenv').config();
const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding');
const mapToken=process.env.MAP_TOKEN;
const geocodingClient = mbxGeocoding({ accessToken:mapToken });


//Index(All Listings)
module.exports.index=async (req, res) => {
    const allListings = await Listings.find({});
    res.render('listings/index', { allListings });
}

//New Listing
module.exports.newListingForm=(req, res) => {
    res.render('listings/newList');
}

module.exports.newListingCreations = async (req, res, next) => {
    try {
        const response = await geocodingClient.forwardGeocode({
            query: req.body.listings.location,
            limit: 1
        }).send();

        // Verify the Mapbox response structure in the console
        console.log('Mapbox Response:', response.body.features[0].geometry);

        // Construct newListing object
        const newListing = new Listings({
            ...req.body.listings,
            geometry: {
                location: {
                    type: 'Point', // Hardcoded based on the Mapbox response structure
                    coordinates: response.body.features[0].geometry.coordinates
                }
            },
            image: { url: req.file.path, filename: req.file.filename },
            owner: req.user._id
        });

        const savedListing = await newListing.save();
        console.log(savedListing);

        req.flash("success", "New Listing Added!");
        res.redirect('/listings');
    } catch (err) {
        next(err);
    }
}
//Individual Listing
module.exports.individualListing=async (req, res, next) => {
    try {
        const { id } = req.params;
        const ListingDetails = await Listings.findById(id).populate({path:'reviews',populate:{path:'author'}}).populate('owner');
        if(!ListingDetails){
            req.flash("error","Does not exist!");
            res.redirect('/listings');
        }
        console.log(ListingDetails);
        res.render('listings/Indiv', { ListingDetails });
    } catch (err) {
        next(err);
    }
}

//Edit

module.exports.renderEditForm=async (req, res, next) => {
    try {
        const { id } = req.params;
        const ListingDetails = await Listings.findById(id);
        if(!ListingDetails){
            req.flash("error","Does not exist!");
            res.redirect('/listings');
        }
        res.render('listings/Edit', { ListingDetails });
    } catch (err) {
        next(err);
    }
}

//Update

module.exports.Updation = async (req, res, next) => {
    try {
        const { id } = req.params;

        // Update the listing and return the updated document
        let listing = await Listings.findByIdAndUpdate(id, { ...req.body.listings }, { new: true });

        if (typeof req.file != 'undefined') {
            let url = req.file.path;
            let filename = req.file.filename;
            listing.image = { url, filename };
            await listing.save();
        }

        req.flash("success", "Updated!");
        res.redirect(`/listings/${id}`);
    } catch (err) {
        next(err);
    }
}


//Destroy

module.exports.Destroy=async (req, res, next) => {
    try {
        const { id } = req.params;
        await Listings.findByIdAndDelete(id);
        req.flash("success","Listing Deleated!");
        res.redirect('/listings');
    } catch (err) {
        next(err);
    }
}

//Categories
module.exports.Category = async (req, res, next) => {
    try {
        const {category} = req.params;
        const listingsByCategory = await Listings.find({ category: category });
        console.log(listingsByCategory);
        res.render('listings/index', {allListings: listingsByCategory });

    } catch (err) {
        next(err);
    }
}
