const Joi = require('joi');

const registerValidation = Joi.object({
  name: Joi.string().trim().required(),
  email: Joi.string().email().trim().required(),
  password: Joi.string().min(8).required(),
  phoneNumber: Joi.string().trim().optional(),
  address: Joi.string().trim().optional(),
});

const loginValidation = Joi.object({
  email: Joi.string().email().trim().required(),
  password: Joi.string().min(8).required(),
});

const updateUserValidation = Joi.object({
  name: Joi.string().trim().optional(),
  old_password: Joi.string().min(8).optional(),
  new_password: Joi.string().min(8).optional(),
  phoneNumber: Joi.string().trim().optional(),
  address: Joi.string().trim().optional(),
});

module.exports = { registerValidation, loginValidation, updateUserValidation };
