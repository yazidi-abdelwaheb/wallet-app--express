import dotenv from 'dotenv';
dotenv.config();

const DB_NAME = process.env.DB_NAME;
const SECRET_KEY = process.env.SECRET_KEY;

export { DB_NAME, SECRET_KEY   };