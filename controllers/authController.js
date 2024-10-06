const Boom = require('@hapi/boom');
const UserModel = require('../models/UserModel');
const userValidation = require('../validation/userValidation');
const bcrypt = require('bcryptjs');
const { generateToken } = require('../utils/jwtToken');
const { setAuthCookie } = require('../utils/cookieHelper');

//Registration Logic

exports.userRegistration = async (request, h) => {
  const { name, email, password, phoneNumber, address } = request.payload;

  // Validate the user input
  const { error } = userValidation.validate({ name, email, password, phoneNumber, address });

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
