import { DataTypes } from 'sequelize';
import sequelize from '../db.js';

const Experience = sequelize.define('Experience', {
  id: {
    type: DataTypes.STRING,
    primaryKey: true,
    allowNull: false
  },
  role: {
    type: DataTypes.STRING,
    allowNull: false
  },
  company: {
    type: DataTypes.STRING,
    allowNull: false
  },
  location: {
    type: DataTypes.STRING
  },
  period: {
    type: DataTypes.STRING
  },
  current: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  description: {
    type: DataTypes.TEXT
  },
  bullets: {
    type: DataTypes.JSON
  },
  techStack: {
    type: DataTypes.JSON
  },
  metrics: {
    type: DataTypes.JSON
  }
});

export default Experience;
