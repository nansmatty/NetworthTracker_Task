const userController = require('../controllers/userController');
const decodeToken = require('../middlewares/decodeToken');

const userRoutes = [
  {
    method: 'PUT',
    path: '/api/user/update',
    handler: userController.updateUser,
    options: {
      auth: 'session', // Requires the user to be authenticated
      pre: [{ method: decodeToken }],
    },
  },
];

module.exports = userRoutes;
