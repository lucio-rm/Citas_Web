import pkg from 'pg';
import dotenv from 'dotenv';

dotenv.config();

const { Pool } = pkg;

// Priorizamos la DATABASE_URL de Railway, si no, usamos los datos locales
export const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: process.env.DATABASE_URL ? { rejectUnauthorized: false } : false
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
    throw new Error('No se pudo conectar con Postgres');
};