require('dotenv').config();
const { Sequelize } = require('sequelize');

const dbConfig = {
  dialect: 'mysql',
  host: 'localhost',
  port: process.env.DB_PORT,
  username: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
};

const sequelize = new Sequelize(dbConfig);

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

async function dbConnect() {
  try {
    await sequelize.authenticate();
    console.log('Connection has been established successfully');
  } catch (error) {
    console.error('Unable to connect to the database:', error);
  }
}

dbConnect();

module.exports = { sequelize, connectWithRetry };
