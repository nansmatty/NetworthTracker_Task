const { DataTypes: DT } = require('sequelize');
const sequelize = require('../config/dbconfig');

const UserModel = sequelize.define(
  'UserModel',
  {
    id: {
      type: DT.UUID,
      defaultValue: DT.UUIDV4,
      primaryKey: true,
    },
    name: {
      type: DT.STRING,
      allowNull: false,
    },
    email: {
      type: DT.STRING,
      unique: true,
      allowNull: false,
    },
    password: {
      type: DT.STRING,
      allowNull: false,
    },
    phoneNumber: {
      type: DT.STRING,
    },
    address: {
      type: DT.STRING,
    },
  },
  {
    timestamps: true, // Automatically adds createdAt and updatedAt fields
  }
);

UserModel.associate = (models) => {
  UserModel.hasMany(models.TransactionModel, {
    foreignKey: 'userId',
  });
};

module.exports = UserModel;
