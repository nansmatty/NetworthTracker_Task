const transactionController = require('../controllers/transactionController');
const decodeToken = require('../middlewares/decodeToken');

const transactionRoutes = [
  {
    method: 'POST',
    path: '/api/transactions',
    handler: transactionController.createTransaction,
    options: {
      auth: 'session', // Requires the user to be authenticated
      pre: [{ method: decodeToken }], // Apply token decoding middleware
    },
  },
  {
    method: 'GET',
    path: '/api/transactions',
    handler: transactionController.getTransactions,
    options: {
      auth: 'session', // Requires the user to be authenticated
      pre: [{ method: decodeToken }], // Apply token decoding middleware
    },
  },
  {
    method: 'GET',
    path: '/api/transactions/{id}',
    handler: transactionController.getTransactionById,
    options: {
      auth: 'session', // Requires the user to be authenticated
      pre: [{ method: decodeToken }], // Apply token decoding middleware
    },
  },
  {
    method: 'PUT',
    path: '/api/transactions/{id}',
    handler: transactionController.updateTransaction,
    options: {
      auth: 'session', // Requires the user to be authenticated
      pre: [{ method: decodeToken }], // Apply token decoding middleware
    },
  },
  {
    method: 'DELETE',
    path: '/api/transactions/{id}',
    handler: transactionController.deleteTransaction,
    options: {
      auth: 'session', // Requires the user to be authenticated
      pre: [{ method: decodeToken }], // Apply token decoding middleware
    },
  },
];

module.exports = transactionRoutes;
