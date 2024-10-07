// tests/authController.test.js
const bcrypt = require('bcryptjs');
const Boom = require('@hapi/boom');
const UserModel = require('../models/UserModel');
const { updateUser } = require('../controllers/userController');
// const { updateUserValidation } = require('../validation/userValidation');

jest.mock('bcryptjs'); // Mock bcrypt
jest.mock('../models/UserModel'); // Mock the UserModel

describe('Update User', () => {
  let request;
  let h;

  beforeEach(() => {
    request = {
      authentication: { id: 1 }, // Simulate the user ID extracted from the JWT token
      payload: {
        name: 'John Doe',
        old_password: 'oldPassword123',
        new_password: 'newPassword123',
        phoneNumber: '1234567890',
        address: '123 Main St',
      },
    };
    h = {
      response: jest.fn().mockImplementation((data) => {
        return {
          code: jest.fn().mockReturnValue(data), // **This allows code to be chained after response**
        };
      }),
    };
  });

  afterEach(() => {
    jest.clearAllMocks(); // Clear mocks after each test
  });

  test('should update user successfully', async () => {
    const user = {
      id: 1,
      name: 'John Doe',
      password: await bcrypt.hash('oldPassword123', 10), // Existing hashed password
      phoneNumber: '1234567890',
      address: '123 Main St',
      update: jest.fn(), // Mocking the update function
    };

    // **Mocking to ensure user is found**
    UserModel.findByPk.mockResolvedValue(user); // Simulate finding the user
    bcrypt.compare.mockResolvedValue(true); // Simulate password match
    bcrypt.hash.mockResolvedValue('hashedNewPassword'); // Simulate new password hashing

    const response = await updateUser(request, h); // Call the function being tested

    // **Add the following assertions to check if update was called**
    expect(user.update).toHaveBeenCalledWith({
      name: request.payload.name,
      password: 'hashedNewPassword',
      phoneNumber: request.payload.phoneNumber,
      address: request.payload.address,
    });
    expect(h.response).toHaveBeenCalledWith({ success: true, message: 'User updated successfully!' });
  });

  test('should return 400 if validation fails', async () => {
    request.payload.new_password = ''; // Invalid input

    const response = await updateUser(request, h);

    expect(response).toEqual(Boom.badRequest('"new_password" is not allowed to be empty'));
    expect(h.response).not.toHaveBeenCalled(); // No response should be set
  });

  test('should return 404 if user is not found', async () => {
    UserModel.findByPk.mockResolvedValue(null); // Simulate user not found

    const response = await updateUser(request, h);

    expect(response).toEqual(Boom.notFound('User not found'));
    expect(h.response).not.toHaveBeenCalled(); // No response should be set
  });

  test('should return 400 if old password is incorrect', async () => {
    const user = {
      id: 1,
      name: 'John Doe',
      password: await bcrypt.hash('oldPassword123', 10), // Existing hashed password
      phoneNumber: '1234567890',
      address: '123 Main St',
      update: jest.fn(),
    };

    UserModel.findByPk.mockResolvedValue(user); // Simulate finding the user
    bcrypt.compare.mockResolvedValue(false); // Simulate incorrect old password

    const response = await updateUser(request, h);

    expect(response).toEqual(Boom.badData('Old Password is incorrect'));
    expect(h.response).not.toHaveBeenCalled(); // No response should be set
  });

  test('should return 400 if there is a database error', async () => {
    UserModel.findByPk.mockRejectedValue(new Error('Database Error')); // Simulate database error

    const response = await updateUser(request, h);

    expect(response).toEqual(Boom.badRequest('Database Error'));
    expect(h.response).not.toHaveBeenCalled(); // No response should be set
  });
});
