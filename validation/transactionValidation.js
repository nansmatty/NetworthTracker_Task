const Joi = require('joi');

const transactionValidation = Joi.object({
  userId: Joi.string().guid({ version: 'uuidv4' }).required(),
  type: Joi.string().valid('asset', 'liability').required(),
  amount: Joi.number().positive().required(),
  description: Joi.string().trim().optional(),
  category: Joi.string().trim().optional(),
});

module.exports = transactionValidation;
