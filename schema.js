const Joi = require("joi");

module.exports.listingSchema = Joi.object({
    listing: Joi.object({
        title: Joi.string().required(),
        description: Joi.string().required(),
        location: Joi.string().required(),
        country: Joi.string().required(),
        price: Joi.number().min(0).required(),
        image: Joi.alternatives().try(
            Joi.string().allow("", null),
            Joi.object({
                filename: Joi.string().allow("", null),
                url: Joi.string().allow("", null)
            }).allow(null)
        ).allow("", null)
    }).required()
});