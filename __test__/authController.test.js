const bcrypt = require('bcryptjs');
const Boom = require('@hapi/boom');
const UserModel = require('../models/UserModel');
const { userRegistration, userLogin } = require('../controllers/authController');
const { generateToken } = require('../utils/jwtToken');
const { setAuthCookie } = require('../utils/cookieHelper');

jest.mock('bcryptjs'); // Mock bcrypt
jest.mock('../models/UserModel'); // Mock the UserModel
jest.mock('../utils/jwtToken'); // Mock the JWT helper
jest.mock('../utils/cookieHelper'); // Mock the cookie helper

//User Registration test case

describe('User Registration', () => {
  let request;
  let h;

  beforeEach(() => {
    request = {
      payload: {
        name: 'John Doe',
        email: 'john.doe@example.com',
        password: 'password123',
        phoneNumber: '1234567890',
        address: '123 Main St',
      },
    };

    // Mocking the response object properly
    h = {
      response: jest.fn().mockImplementation((data) => {
        return {
          code: jest.fn().mockReturnValue(data), // Simulating the response object
        };
      }),
    };
  });

  afterEach(() => {
    jest.clearAllMocks(); // Clear mocks after each test
  });

  test('should register a user successfully', async () => {
    const hashedPassword = 'hashedPassword';
    const user = { id: 1, ...request.payload, password: hashedPassword };

    // Set up mocks using Jest
    bcrypt.hash.mockResolvedValue(hashedPassword);
    UserModel.create.mockResolvedValue(user);
    generateToken.mockReturnValue('token123');
    setAuthCookie.mockReturnValue(undefined); // No return value

    const response = await userRegistration(request, h);

    expect(response).toEqual({ success: true, message: 'User registered successfully!' });
    expect(h.response).toHaveBeenCalledWith({ success: true, message: 'User registered successfully!' });
    expect(bcrypt.hash).toHaveBeenCalledWith('password123', 10);
    expect(UserModel.create).toHaveBeenCalledWith({ ...request.payload, password: hashedPassword });
    expect(setAuthCookie).toHaveBeenCalledWith(h, 'token123');
  });

  test('should return 400 if validation fails', async () => {
    request.payload.password = ''; // Invalid input

    const response = await userRegistration(request, h);

    expect(response).toEqual(Boom.badRequest('"password" is not allowed to be empty'));
    expect(h.response).not.toHaveBeenCalled(); // No response should be set
    expect(UserModel.create).not.toHaveBeenCalled(); // User creation shouldn't happen
  });

  test('should return 400 if there is an error creating the user', async () => {
    const hashedPassword = 'hashedPassword';
    bcrypt.hash.mockResolvedValue(hashedPassword);
    UserModel.create.mockRejectedValue(new Error('Database Error'));

    const response = await userRegistration(request, h);

    expect(response).toEqual(Boom.badRequest('Database Error'));
    expect(h.response).not.toHaveBeenCalled(); // No response should be set
  });
});

//User Login test case
describe('User Login', () => {
  let request;
  let h;

  beforeEach(() => {
    request = {
      payload: {
        email: 'john.doe@example.com',
        password: 'password123',
      },
    };
    h = {
      response: jest.fn().mockReturnValue({
        code: jest.fn(),
      }),
    };
  });

  afterEach(() => {
    jest.clearAllMocks(); // Clear mocks after each test
  });

  test('should log in a user successfully', async () => {
    const user = { id: 1, email: 'john.doe@example.com', password: 'hashedPassword' };
    const token = 'token123';

    // Set up mocks using Jest
    UserModel.findOne.mockResolvedValue(user);
    bcrypt.compare.mockResolvedValue(true);
    generateToken.mockReturnValue(token);
    setAuthCookie.mockReturnValue(undefined); // No return value

    const response = await userLogin(request, h); // Call the userLogin function

    // Assert the expected output
    expect(h.response).toHaveBeenCalledWith({ success: true, message: 'Login successful!' }); // **Check response was called**
    expect(h.response().code).toHaveBeenCalledWith(200); // **Check the status code**
    expect(UserModel.findOne).toHaveBeenCalledWith({ where: { email: request.payload.email } });
    expect(bcrypt.compare).toHaveBeenCalledWith(request.payload.password, user.password);
    expect(setAuthCookie).toHaveBeenCalledWith(h, token);
  });

  test('should return 400 if validation fails', async () => {
    request.payload.password = ''; // Invalid input

    const response = await userLogin(request, h);

    expect(response).toEqual(Boom.badRequest('"password" is not allowed to be empty'));
    expect(h.response).not.toHaveBeenCalled(); // No response should be set
  });

  test('should return 401 if user does not exist', async () => {
    UserModel.findOne.mockResolvedValue(null); // Simulate user not found

    const response = await userLogin(request, h);

    expect(response).toEqual(Boom.unauthorized('Invalid email or password'));
    expect(h.response).not.toHaveBeenCalled(); // No response should be set
  });

  test('should return 401 if password is incorrect', async () => {
    const user = { id: 1, email: 'john.doe@example.com', password: 'hashedPassword' };
    UserModel.findOne.mockResolvedValue(user);
    bcrypt.compare.mockResolvedValue(false); // Simulate incorrect password

    const response = await userLogin(request, h);

    expect(response).toEqual(Boom.unauthorized('Invalid email or password'));
    expect(h.response).not.toHaveBeenCalled(); // No response should be set
  });

  test('should return 400 if there is a database error', async () => {
    UserModel.findOne.mockRejectedValue(new Error('Database Error')); // Simulate database error

    const response = await userLogin(request, h);

    expect(response).toEqual(Boom.badRequest('Database Error'));
    expect(h.response).not.toHaveBeenCalled(); // No response should be set
  });
});
