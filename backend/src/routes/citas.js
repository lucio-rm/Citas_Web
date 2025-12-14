import express from 'express';
import * as controladores from '../controllers/controladorCitas.js';
const router = express.Router();

router.patch('/cancelar/:id', cancelarCita);

export default router;