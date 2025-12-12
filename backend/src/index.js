import express from 'express';
import cors from 'cors';

import usuariosRouter from './routes/usuarios.js';
//import citasRouter from './routes/citas.js';
import matchesRouter from './routes/matches.js';



const app = express();
app.use(express.json());
app.use(cors());

app.use('/usuarios', usuariosRouter);
//app.use('/citas', citasRouter);
app.use('/matches', matchesRouter);



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