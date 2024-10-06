require('dotenv').config();
const { Sequelize } = require('sequelize');

const dbConfig = {
  dialect: 'mysql',
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  username: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
};

const sequelize = new Sequelize(dbConfig);

// async function dbConnect() {
//   try {
//     await sequelize.authenticate();
//     console.log('Connection has been established successfully');
//   } catch (error) {
//     console.error('Unable to connect to the database:', error);
//   }
// }

// dbConnect();

module.exports = sequelize;
