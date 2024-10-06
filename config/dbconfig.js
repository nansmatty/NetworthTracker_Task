require('dotenv').config();
const { Sequelize } = require('sequelize');

const sequelize = new Sequelize(process.env.DB_NAME, process.env.DB_USER, process.env.DB_PASS, {
  dialect: 'mysql',
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
});

const connectWithRetry = async (attempts = 5) => {
  while (attempts > 0) {
    try {
      await sequelize.authenticate();
      console.log('Connection has been established successfully');
      return sequelize;
    } catch (error) {
      console.error(`Unable to connect to the database. Retrying... (${attempts} attempts left)`, error);
      attempts--;
      await new Promise((resolve) => setTimeout(resolve, 5000)); // wait for 5 seconds before retrying
    }
  }
  throw new Error('Failed to connect to the database after multiple attempts');
};

module.exports = { sequelize, connectWithRetry };
