import express from 'express';
import * as controladores from '../controllers/controladorFeedback.js';
const router = express.Router();

router.post('/', controladores.crearFeedback);

router.get('/cita/:id_cita', controladores.obtenerFeedbackPorCita);

export default router;