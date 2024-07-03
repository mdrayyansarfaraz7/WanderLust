const Joi = require('joi');

const listingsSchema = Joi.object({
    listings: Joi.object({
        title: Joi.string().required(),
        price: Joi.number().required(),
        description: Joi.string().required(),
        location: Joi.string().required(),
        country: Joi.string().required(), // Add validation for the country field
        image: Joi.object({
            url: Joi.string().required() // Nested validation for the image URL
        }).required()
    }).required()
});



const reviewsSchema=Joi.object({
    review:Joi.object({
    rating:Joi.number().required().min(1).max(5),
    comment:Joi.string().required()
    }).required()
});

module.exports = { listingsSchema, reviewsSchema };