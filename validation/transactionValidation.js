// const Joi = require('joi');

// const transactionValidation = Joi.object({
//   userId: Joi.string().guid({ version: 'uuidv4' }).required(),
//   type: Joi.string().valid('asset', 'liability').required(),
//   amount: Joi.number().positive().required(),
//   description: Joi.string().trim().optional(),
//   category: Joi.string().trim().optional(),
// });

// module.exports = transactionValidation;

// validations/transactionValidation.js
const Joi = require('joi');

const transactionSchema = Joi.object({
  type: Joi.string().valid('asset', 'liability').required(), // Type can only be 'asset' or 'liability'
  amount: Joi.number().positive().required(), // Amount must be a positive number
  description: Joi.string().trim().optional(), // Description is optional
  category: Joi.string().trim().optional(), // Category is optional
});

// Export the schemas
module.exports = transactionSchema;
