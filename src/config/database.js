import dotenv from "dotenv";
dotenv.config();

const config = {
  development: {
    username: process.env.DATABASE_DEV_USERNAME,
    password: process.env.DATABASE_DEV_PASSWORD,
    database: process.env.DATABASE_DEV_NAME,
    host: process.env.DATABASE_DEV_URL,
    dialect: process.env.DATABASE_DEV_DIALECT,
    port: process.env.DATABASE_DEV_PORT
  },
  test: {
    username: "root",
    password: null,
    database: "database_test",
    host: "127.0.0.1",
    dialect: "mysql",
  },
  production: {
    username: "root",
    password: null,
    database: "database_production",
    host: "127.0.0.1",
    dialect: "mysql",
  },
};
export default config;
