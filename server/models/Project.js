import { DataTypes } from 'sequelize';
import sequelize from '../db.js';

// Using SQLite JSON type to store complex arrays/objects (supported by SQLite 3.38+)
const Project = sequelize.define('Project', {
  id: {
    type: DataTypes.STRING,
    primaryKey: true,
    allowNull: false
  },
  title: {
    type: DataTypes.STRING,
    allowNull: false
  },
  subtitle: {
    type: DataTypes.STRING
  },
  category: {
    type: DataTypes.STRING
  },
  summary: {
    type: DataTypes.TEXT
  },
  // Store arrays/objects as JSON strings
  bullets: {
    type: DataTypes.JSON
  },
  techStack: {
    type: DataTypes.JSON
  },
  features: {
    type: DataTypes.JSON
  },
  architectureDetails: {
    type: DataTypes.JSON
  },
  githubUrl: {
    type: DataTypes.STRING
  },
  liveUrl: {
    type: DataTypes.STRING
  },
  metrics: {
    type: DataTypes.JSON
  }
});

export default Project;
