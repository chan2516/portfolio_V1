import 'dotenv/config';
import { Sequelize } from 'sequelize';

// Initialize SQLite database (creates a local database.sqlite file)
const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: process.env.NODE_ENV === 'test' ? ':memory:' : (process.env.DB_STORAGE || './database.sqlite'),
  logging: false, // Set to console.log to see SQL queries
});

export default sequelize;
