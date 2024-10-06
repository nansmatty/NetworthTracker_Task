const { DataTypes: DT } = require('sequelize');
const { sequelize } = require('../config/dbconfig');

const TransactionModel = sequelize.define(
  'TransactionModel',
  {
    id: {
      type: DT.UUID,
      defaultValue: DT.UUIDV4,
      primaryKey: true,
    },
    userId: {
      type: DT.UUID,
      references: {
        model: 'UserModel',
        key: 'id',
      },
    },
    type: {
      type: DT.ENUM('asset', 'liability'),
    },
    amount: {
      type: DT.DECIMAL(10, 2),
      allowNull: false,
    },
    description: {
      type: DT.STRING,
    },
    category: {
      type: DT.STRING,
    },
  },
  {
    timestamps: true, // Automatically adds createdAt and updatedAt fields
  }
);

TransactionModel.associate = (models) => {
  TransactionModel.belongsTo(models.UserModel, { foreignKey: 'userId' });
};

module.exports = TransactionModel;
