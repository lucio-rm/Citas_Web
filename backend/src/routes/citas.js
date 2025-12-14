import express from 'express';
import * as controladores from '../controllers/controladorCitas.js';
const router = express.Router();

router.patch('/cancelar/:id', controladores.cancelarCita);

router.post('/feedback', controladores.guardarFeedback);

export default router;