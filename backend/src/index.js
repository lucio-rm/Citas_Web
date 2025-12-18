import express from 'express';
import cors from 'cors';
import { pool, esperarDB } from './db.js';
import fs from 'fs'
import path from 'path';

const app = express();
app.use(express.json());
app.use(cors());

import usuariosRouter from './routes/usuarios.js';
import citasRouter from './routes/citas.js';
import matchesRouter from './routes/matches.js';
import feedbackRouter from './routes/feedback.js';
import tagsRouter from './routes/tags.js';

app.use('/usuarios', usuariosRouter);
app.use('/citas', citasRouter);
app.use('/matches', matchesRouter);
app.use('/feedback', feedbackRouter);
app.use('/tags', tagsRouter);


app.get('/', (req, res) => {
    res.json({ message: 'El backend funciona'});
});

//manejo de errores
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ error: 'Error interno del servidor'});
});

const PORT = process.env.PORT || 3000;

const initDB = async() => {
  const res = await pool.query("SELECT to_regclass('public.usuarios')");
  if (res.rows[0].to_regclass) {
    console.log('DB ya inicializada, saltando initDB');
    return;
  }
  try {
    const sqlPath = path.join(process.cwd(), 'sql', 'main.sql');
    const sql = fs.readFileSync(sqlPath, 'utf-8'); // lee el archivo .sql
    await pool.query(sql); // ejecuta todo el script
    console.log('Base de datos inicializada con éxito');
  } catch (err) {
    console.error('Error inicializando la base de datos:', err);
  }
};


const startServer = async () => {
  await esperarDB();
  await initDB();
  app.listen(PORT, () => {
    console.log(`El servidor está corriendo en http://localhost:${PORT}`);
  });
};

startServer();