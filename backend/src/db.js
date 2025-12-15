import pkg from 'pg';
import dotenv from 'dotenv';

dotenv.config();

console.log("DB_PASS =", process.env.DB_PASS);


const { Pool } = pkg;

export const pool = new Pool({
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    host: process.env.DB_HOST,
    database: process.env.DB_NAME,
    port: process.env.DB_PORT
});

