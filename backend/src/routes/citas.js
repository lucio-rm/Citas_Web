import express from 'express';
import * as controladores from '../controllers/controladorCitas.js';
const router = express.Router();


router.get('/', controladores.obtenerCitas);

router.get('/:id', controladores.obtenerCitaPorId);

router.post('/', controladores.crearCita);

router.put('/:id', controladores.actualizarCita);

router.delete('/:id', controladores.eliminarCita);

router.patch('/cancelar/:id', controladores.cancelarCita);

router.get('/ver', controladores.obtenerVistaCitas);

export default router;