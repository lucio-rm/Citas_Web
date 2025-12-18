import pkg from 'pg';
import dotenv from 'dotenv';

dotenv.config();

const { Pool } = pkg;

export const pool = new Pool({
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    host: process.env.DB_HOST,
    database: process.env.DB_NAME,
    port: process.env.DB_PORT
});

export const esperarDB = async (retries = 15, delay = 2000) => {
    while (retries > 0) {
        try { 
            await pool.query('SELECT 1');
            console.log('Postgres conectado');
            return;
        } catch (err) {
            console.log(`Postgres no disponible, reintentando... (${retries})`);
            retries--;
            await new Promise(res => setTimeout(res, delay));
        }
    }
    throw new Error('No se pudo conectar con Postgres')
};
