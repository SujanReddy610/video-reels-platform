
















// import { Sequelize } from 'sequelize';
// import dotenv from 'dotenv';
// dotenv.config();

// // Create Sequelize instance
// const sequelize = new Sequelize(
//   process.env.DB_NAME,
//   process.env.DB_USER,
//   process.env.DB_PASSWORD,
//   {
//     host: process.env.DB_HOST || 'localhost',
//     dialect: 'mysql',
//     logging: false, // disable SQL logging
//   }
// );

// // Function to test connection
// export const testDBConnection = async () => {
//   try {
//     await sequelize.authenticate();
//     console.log('Database connected ✅');
//   } catch (err) {
//     console.error('Unable to connect to DB:', err);
//   }
// };

// // Call test function immediately
// testDBConnection();

// export default sequelize;



// render
import { Sequelize } from "sequelize";
import dotenv from "dotenv";

dotenv.config();

// ------------------ DATABASE CONNECTION ------------------
// Use DATABASE_URL if provided (for Render PostgreSQL), else fallback to individual DB params
const sequelize = new Sequelize(process.env.DATABASE_URL || `postgres://${process.env.DB_USER}:${process.env.DB_PASSWORD}@${process.env.DB_HOST}:${process.env.DB_PORT}/${process.env.DB_NAME}`, {
  dialect: "postgres",
  protocol: "postgres",
  logging: false, // disable SQL logging
  dialectOptions: {
    ssl: process.env.DB_SSL === "true" ? { require: true, rejectUnauthorized: false } : false,
  },
});

// ------------------ TEST CONNECTION ------------------
export const testDBConnection = async () => {
  try {
    await sequelize.authenticate();
    console.log("✅ Database connected successfully");
  } catch (err) {
    console.error("❌ Unable to connect to DB:", err);
  }
};

// Immediately test DB connection
testDBConnection();

export default sequelize;
