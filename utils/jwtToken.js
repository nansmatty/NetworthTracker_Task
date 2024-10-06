const jwt = require('@hapi/jwt');

exports.generateToken = (payload) => {
  const token = jwt.token.generate(payload, process.env.JWT_SECRET, {
    ttlSec: 86400, // 1 day in seconds
  });
  return token;
};
