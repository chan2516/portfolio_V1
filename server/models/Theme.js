import { DataTypes } from 'sequelize';
import sequelize from '../db.js';

const Theme = sequelize.define('Theme', {
  primaryColor: {
    type: DataTypes.STRING,
    defaultValue: '#6366f1'
  },
  backgroundColor: {
    type: DataTypes.STRING,
    defaultValue: '#fafafa'
  },
  textColor: {
    type: DataTypes.STRING,
    defaultValue: '#18181b'
  },
  fontFamily: {
    type: DataTypes.STRING,
    defaultValue: 'Inter, sans-serif'
  },
  borderRadius: {
    type: DataTypes.STRING,
    defaultValue: '0.5rem'
  },
  isActive: {
    type: DataTypes.BOOLEAN,
    defaultValue: true
  }
});

export default Theme;
