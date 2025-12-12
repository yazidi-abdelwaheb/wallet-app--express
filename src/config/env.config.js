import dotenv from 'dotenv';
dotenv.config();

const DB_NAME = process.env.DB_NAME;
const SECRET_KEY = process.env.SECRET_KEY;
const EMAIL_PASS = process.env.EMAIL_PASS
const EMAIL_USER = process.env.EMAIL_USER

export { DB_NAME, SECRET_KEY , EMAIL_PASS ,EMAIL_USER  };