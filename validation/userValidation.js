const Joi = require('joi');

const userValidation = Joi.object({
  name: Joi.string().trim().required(),
  email: Joi.string().email().trim().required(),
  password: Joi.string().min(8).required(),
  phoneNumber: Joi.string().trim().optional(),
  address: Joi.string().trim().optional(),
});

module.exports = userValidation;
