import { DataTypes } from 'sequelize';
import sequelize from '../db.js';

const Setting = sequelize.define('Setting', {
  key: {
    type: DataTypes.STRING,
    primaryKey: true,
    allowNull: false
  },
  value: {
    type: DataTypes.JSON,
    allowNull: false
  }
});

export default Setting;
