const authController = require('../controllers/authController');

const authRoutes = [
  {
    method: 'POST',
    path: '/api/auth/register',
    handler: authController.userRegistration,
    options: {
      auth: false, // No authentication needed for registration
    },
  },
];

module.exports = authRoutes;
