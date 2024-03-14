import { Sequelize } from "sequelize";
import dotenv from "dotenv";
dotenv.config();

const db = new Sequelize(
  process.env.DATABASE_NAME, 
  process.env.DATABASE_USERNAME, 
  process.env.DATABASE_PASSWORD, 
  {
    host: process.env.DATABASE_HOST,
    dialect: 'mysql'
});

async function testConnection() {
    try {
      await db.authenticate();
      console.log('DATABASE CONNECTION RUNNING.');
    } catch (error) {
      console.log('DATABASE CONNECTION FAILED');
    }
}

testConnection();

export default db;