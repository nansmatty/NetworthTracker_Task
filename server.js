require('dotenv').config();
const Hapi = require('@hapi/hapi');
const Cookie = require('@hapi/cookie');
const sequelize = require('./config/dbconfig');
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const transactionRoutes = require('./routes/transactionRoutes');

const init = async () => {
  const server = Hapi.Server({
    port: 4000,
    host: '0.0.0.0',
    state: {
      strictHeader: false, // Cookie settings for both development and production
    },
  });

  //Database connection
  await sequelize.sync({ force: false });
  await sequelize.connectWithRetry();

  //Plugin Register (if required)
  // ------ Cookie
  await server.register(Cookie);

  server.auth.strategy('session', 'cookie', {
    cookie: {
      name: 'token',
      password: process.env.COOKIE_SECRET, // Use environment variable
      isSecure: process.env.NODE_ENV === 'production', // Secure in production
      ttl: 24 * 60 * 60 * 1000, // 1 day
    },
    redirectTo: false,
  });

  server.auth.default('session');

  //Register routes
  server.route([
    {
      method: 'GET',
      path: '/api/health_check',
      handler: (request, h) => {
        return 'Health OK';
      },
    },
    ...authRoutes,
    ...userRoutes,
    ...transactionRoutes,
  ]);

  await server.start();
  console.log('Server running on: ', server.info.uri);
};

//Handling rejection

process.on('unhandledRejection', (err) => {
  console.log(err);
  process.exit(1);
});

init();
