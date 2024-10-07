// middlewares/decodeToken.js
const jwt = require('jsonwebtoken');
const Boom = require('@hapi/boom');

const decodeToken = (request, h) => {
  const token = request.auth.credentials; // Get the JWT token from the credentials
  try {
    const decodedToken = jwt.verify(token, process.env.JWT_SECRET); // Verify and decode the token
    request.authentication = decodedToken; // Overwrite credentials with decoded token (contains user data)
    return h.continue; // Allow request to proceed
  } catch (error) {
    throw Boom.unauthorized('Invalid or expired token');
  }
};

module.exports = decodeToken;
