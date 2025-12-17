import express from 'express';
import cors from 'cors';
import { pool } from './db.js';
import fs from 'fs'
import path from 'path';

const initDB = async() => {
      try {
    const sqlPath = path.join(process.cwd(), 'sql', 'main.sql');
    const sql = fs.readFileSync(sqlPath, 'utf-8'); // lee el archivo .sql
    await pool.query(sql); // ejecuta todo el script
    console.log('Base de datos inicializada con éxito');
  } catch (err) {
    console.error('Error inicializando la base de datos:', err);
  }
};

const app = express();
app.use(express.json());
app.use(cors());

import usuariosRouter from './routes/usuarios.js';
import citasRouter from './routes/citas.js';
import matchesRouter from './routes/matches.js';
import feedbackRouter from './routes/feedback.js';



initDB();

app.use('/usuarios', usuariosRouter);
app.use('/citas', citasRouter);
app.use('/matches', matchesRouter);
app.use('/feedback', feedbackRouter);


app.get('/', (req, res) => {
    res.json({ message: 'El backend funciona'});
});

//manejo de errores
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ error: 'Error interno del servidor'});
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`El servidor está corriendo en http://localhost:${PORT}`);
});
