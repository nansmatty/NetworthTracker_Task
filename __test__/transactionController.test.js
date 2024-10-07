// tests/transactionController.test.js
const Boom = require('@hapi/boom');
const { createTransaction, getTransactions, getTransactionById, updateTransaction, deleteTransaction } = require('../controllers/transactionController');
const TransactionModel = require('../models/TranscationModel'); // Ensure the correct path
const transactionSchema = require('../validation/transactionValidation');

jest.mock('../models/TranscationModel.js'); // Mock the TransactionModel
jest.mock('../validation/transactionValidation'); // Mock the validation

describe('Transaction Controller', () => {
  let request;
  let h;

  beforeEach(() => {
    request = {
      authentication: { id: 'user-uuid' }, // Simulate authenticated user ID
      payload: {
        type: 'asset',
        amount: 100.0,
        description: 'Test transaction',
        category: 'Test category',
      },
    };

    // Mock the `h.response()` function to return the actual response data
    h = {
      response: jest.fn().mockImplementation((data) => ({
        code: jest.fn().mockReturnValue(data),
      })),
    };
  });

  afterEach(() => {
    jest.clearAllMocks(); // Clear mocks after each test
  });

  describe('createTransaction', () => {
    test('should create a transaction successfully', async () => {
      // Mock the transaction validation
      transactionSchema.validate.mockReturnValue({ error: null }); // Simulate successful validation

      // Mock TransactionModel.create
      const newTransaction = { id: 'transaction-uuid', ...request.payload };
      TransactionModel.create.mockResolvedValue(newTransaction); // Simulate successful transaction creation

      const response = await createTransaction(request, h);

      expect(response).toEqual(newTransaction); // Expect the response to be the created transaction
      expect(h.response).toHaveBeenCalledWith(newTransaction); // Ensure h.response is called correctly
      // expect(h.response().code).toHaveBeenCalledWith(201); // Check that status code 201 is set
    });

    test('should return 400 if validation fails', async () => {
      // Simulate validation error
      transactionSchema.validate.mockReturnValue({
        error: { details: [{ message: '"amount" is not allowed to be empty' }] },
      });

      const response = await createTransaction(request, h);

      expect(response).toEqual(Boom.badRequest('"amount" is not allowed to be empty')); // Expect the validation error
      expect(h.response).not.toHaveBeenCalled(); // Ensure response is not called
    });
  });

  describe('getTransactions', () => {
    test('should return 200 with all transactions', async () => {
      const transactions = [{ id: 'transaction-1' }, { id: 'transaction-2' }];
      TransactionModel.findAll.mockResolvedValue(transactions); // Mock successful retrieval of transactions

      const response = await getTransactions(request, h);

      expect(response).toEqual(transactions); // Expect response to equal the list of transactions
      expect(h.response).toHaveBeenCalledWith(transactions); // Check response is called with transactions
      // expect(h.response().code).toHaveBeenCalledWith(200); // Check that status code 200 is set
    });
  });

  describe('getTransactionById', () => {
    test('should return 200 for a specific transaction by ID', async () => {
      const transactionId = 'transaction-uuid';
      const transaction = { id: transactionId, type: 'asset' };
      request.params = { id: transactionId }; // Simulate request parameters

      TransactionModel.findByPk.mockResolvedValue(transaction); // Mock successful retrieval of the transaction

      const response = await getTransactionById(request, h);

      expect(response).toEqual(transaction); // Expect response to equal the transaction
      expect(h.response).toHaveBeenCalledWith(transaction); // Check response is called with the transaction
      // expect(h.response().code).toHaveBeenCalledWith(200); // Check that status code 200 is set
    });

    test('should return 404 if transaction not found', async () => {
      request.params = { id: 'non-existent-id' }; // Simulate request for a non-existent transaction

      TransactionModel.findByPk.mockResolvedValue(null); // Simulate not found

      const response = await getTransactionById(request, h);

      expect(response).toEqual(Boom.notFound('Transaction not found')); // Expect not found error
      expect(h.response).not.toHaveBeenCalled(); // Ensure response is not called
    });
  });

  describe('updateTransaction', () => {
    // test('should update a transaction successfully', async () => {
    //   const transactionId = 'transaction-uuid';
    //   const updatedTransaction = { id: transactionId, ...request.payload };
    //   request.params = { id: transactionId };
    //   transactionSchema.validate.mockReturnValue({ error: null });
    //   const transactionInstance = {
    //     update: jest.fn().mockResolvedValue(updatedTransaction), // Mocking the instance update method
    //   };
    //   TransactionModel.findByPk.mockResolvedValue(transactionInstance); // Mocking the instance returned by findByPk
    //   // expect(transactionInstance.update).toHaveBeenCalledWith(request.payload); // Check that update was called with correct payload
    //   expect(h.response).toHaveBeenCalledWith(updatedTransaction); // Ensure response was called correctly
    // });
    // test('should return 404 if transaction not found on update', async () => {
    //   request.params = { id: 'non-existent-id' }; // Simulate request for a non-existent transaction
    //   TransactionModel.findByPk.mockResolvedValue(null); // Simulate not found
    //   const response = await updateTransaction(request, h);
    //   expect(response).toEqual(Boom.notFound('Transaction not found')); // Expect not found error
    //   expect(h.response).not.toHaveBeenCalled(); // Ensure response is not called
    // });
  });

  describe('deleteTransaction', () => {
    // test('should delete a transaction successfully', async () => {
    //   const transactionId = 'transaction-uuid';
    //   request.params = { id: transactionId };

    //   const transactionInstance = {
    //     destroy: jest.fn().mockResolvedValue(), // Mocking destroy method
    //   };

    //   TransactionModel.findByPk.mockResolvedValue(transactionInstance); // Mocking instance returned by findByPk

    //   // expect(transactionInstance.destroy).toHaveBeenCalled(); // Check that destroy was called
    //   expect(h.response).toHaveBeenCalled(); // Ensure response was called
    // });

    test('should return 404 if transaction not found on delete', async () => {
      request.params = { id: 'non-existent-id' }; // Simulate request for a non-existent transaction

      TransactionModel.findByPk.mockResolvedValue(null); // Simulate not found

      const response = await deleteTransaction(request, h);

      expect(response).toEqual(Boom.notFound('Transaction not found')); // Expect not found error
      expect(h.response).not.toHaveBeenCalled(); // Ensure response is not called
    });
  });
});
