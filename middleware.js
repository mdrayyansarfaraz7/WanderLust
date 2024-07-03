let Listings=require('./models/listings.js');
const ExpressError = require('./utils/ExpressError');
const { listingsSchema,reviewsSchema } = require('./schema.js');

module.exports.isLoggedIn=(req,res,next)=>{
    if(!req.isAuthenticated()){
        req.session.redirectUrl=req.originalUrl;
        req.flash("error","Authentication needed: Log in to continue!");
       return  res.redirect('/login');
    }
    next();
}

module.exports.saveRedirectionPath=(req,res,next)=>{
    if(req.session.redirectUrl){
        res.locals.redirectUrl=req.session.redirectUrl;
    }
    next();
}

module.exports.isOwner=async(req,res,next)=>{
    const { id } = req.params;
    let listing=await Listings.findById(id);
    if(!listing.owner._id.equals(res.locals.currentUser._id)){
    req.flash("error","Authorization needed!You are not the owner");
    return  res.redirect(`/listings/${id}`);
    
    }
    next();
}


module.exports.validateListing = (req, res, next) => {
    const { error } = listingsSchema.validate(req.body);
    if (error) {
        const msg = error.details.map(el => el.message).join(',');
        throw new ExpressError(400, msg);
    } else {
        next();
    }
};

module.exports.validateReviews = (req, res, next) => {
    const { error } = reviewsSchema.validate(req.body);
    if (error) {
        const msg = error.details.map(el => el.message).join(',');
        throw new ExpressError(400, msg);
    } else {
        next();
    }
};