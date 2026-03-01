import dotenv from "dotenv";
dotenv.config();

const NODE_ENV = process.env.NODE_ENV;
const PORT = process.env.PORT;
const DB_NAME = process.env.DB_NAME;
const SECRET_KEY = process.env.SECRET_KEY;
const EMAIL_PASS = process.env.EMAIL_PASS;
const EMAIL_USER = process.env.EMAIL_USER;
const DB_PASSWORD = process.env.DB_PASSWORD;

export { NODE_ENV, PORT, DB_NAME, SECRET_KEY, EMAIL_PASS, EMAIL_USER, DB_PASSWORD };
