import express from 'express';
import * as controladores from '../controllers/controladorFeedback.js';
const router = express.Router();

router.post('/', controladores.crearFeedback);

router.post('/guardar', controladores.guardarFeedback);

router.delete('/:id_cita', controladores.eliminarFeedbackPorCita);

router.get('/cita/:id_cita', controladores.obtenerFeedbackPorCita);

router.put('/actualizar/:id_cita', controladores.actualizarFeedbackPorCita);

export default router;