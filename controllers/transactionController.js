const { Boom } = require('@hapi/boom');
const transactionSchema = require('../validation/transactionValidation');
const TransactionModel = require('../models/TranscationModel');

// Create a new transaction
exports.createTransaction = async (request, h) => {
  const userId = request.authentication.id; // Extract the user ID from the JWT token
  const { type, amount, description, category } = request.payload;

  // Validate the transaction payload
  const { error } = transactionSchema.validate({
    type,
    amount,
    description,
    category,
  });

  if (error) {
    return Boom.badRequest(error.details[0].message); // Handle validation error
  }

  try {
    const newTransaction = await TransactionModel.create({
      userId, // Now userId is derived from the authenticated user's ID
      type,
      amount,
      description,
      category,
    });

    return h.response(newTransaction).code(201); // Respond with the created transaction and a 201 status
  } catch (error) {
    return Boom.badRequest(error.message); // Handle errors
  }
};

// Get all transactions for a user
exports.getTransactions = async (request, h) => {
  const userId = request.authentication.id; // Get the user ID from JWT

  try {
    const transactions = await TransactionModel.findAll({ where: { userId } });
    return h.response(transactions).code(200); // Respond with the transactions
  } catch (error) {
    return Boom.badRequest(error.message); // Handle errors
  }
};

// Get a specific transaction by ID
exports.getTransactionById = async (request, h) => {
  const { id } = request.params;

  try {
    const transaction = await TransactionModel.findByPk(id);
    if (!transaction) {
      return Boom.notFound('Transaction not found'); // Handle not found
    }
    return h.response(transaction).code(200); // Respond with the transaction
  } catch (error) {
    return Boom.badRequest(error.message); // Handle errors
  }
};

// Update a transaction
exports.updateTransaction = async (request, h) => {
  const { id } = request.params;
  const { type, amount, description, category } = request.payload;

  // Validate the transaction payload
  const { error } = transactionSchema.validate({
    type,
    amount,
    description,
    category,
  });

  if (error) {
    return Boom.badRequest(error.details[0].message); // Handle validation error
  }

  try {
    const transaction = await TransactionModel.findByPk(id);
    if (!transaction) {
      return Boom.notFound('Transaction not found'); // Handle not found
    }

    await transaction.update({
      type: type || transaction.type,
      amount: amount || transaction.amount,
      description: description || transaction.description,
      category: category || transaction.category,
    });

    return h.response(transaction).code(200); // Respond with the updated transaction
  } catch (error) {
    return Boom.badRequest(error.message); // Handle errors
  }
};

// Delete a transaction
exports.deleteTransaction = async (request, h) => {
  const { id } = request.params;

  try {
    const transaction = await TransactionModel.findByPk(id);
    if (!transaction) {
      return Boom.notFound('Transaction not found'); // Handle not found
    }

    await transaction.destroy(); // Delete the transaction
    return h.response().code(204); // Respond with 204 No Content
  } catch (error) {
    return Boom.badRequest(error.message); // Handle errors
  }
};
