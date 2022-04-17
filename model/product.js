const Joi=require('joi');
const JoiV = require("joi");

const schema=Joi.object().keys({
    product_id:Joi.string(),
    product_name:Joi.string().required(),
    description:Joi.string(),
    details:Joi.required(),
    pan_size:Joi.string(),
    dimension:Joi.string(),
    netweight:Joi.string(),
    power_supply :Joi.string(),
    image_path :Joi.string(),
    status :Joi.string(),
    category_name :Joi.string().required(),
});

module.exports={
    schema
}