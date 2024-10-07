const Boom = require('@hapi/boom');
const UserModel = require('../models/UserModel');
const { loginValidation, registerValidation } = require('../validation/userValidation');
const bcrypt = require('bcryptjs');
const { generateToken } = require('../utils/jwtToken');
const { setAuthCookie } = require('../utils/cookieHelper');

//Registration Logic

exports.userRegistration = async (request, h) => {
  const { name, email, password, phoneNumber, address } = request.payload;

  // Validate the user input
  const { error } = registerValidation.validate({ name, email, password, phoneNumber, address });

  if (error) {
    return Boom.badRequest(error.details[0].message);
  }

  try {
    //hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create new user
    const user = await UserModel.create({
      name,
      email,
      password: hashedPassword,
      phoneNumber,
      address,
    });

    // Generate JWT token
    const token = generateToken({ id: user.id });

    // Set JWT in cookie using the helper
    setAuthCookie(h, token);

    // If required the email verfication process

    return h.response({ success: true, message: 'User registered successfully!' }).code(201);
  } catch (error) {
    return Boom.badRequest(error.message);
  }
};

// Login User Logic

exports.userLogin = async (request, h) => {
  const { email, password } = request.payload;

  // Validate the login input
  const { error } = loginValidation.validate({ email, password });
  if (error) {
    return Boom.badRequest(error.details[0].message);
  }

  try {
    // Check if the user exists
    const user = await UserModel.findOne({ where: { email } });
    if (!user) {
      return Boom.unauthorized('Invalid email or password');
    }

    // Compare the provided password with the stored hashed password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return Boom.unauthorized('Invalid email or password');
    }

    // Generate JWT token
    const token = generateToken({ id: user.id });

    // Set JWT in cookie
    setAuthCookie(h, token);

    return h.response({ success: true, message: 'Login successful!' }).code(200);
  } catch (error) {
    return Boom.badRequest(error.message);
  }
};

//Rest code like forgot_password, resetPassword if user_verfication etc.
