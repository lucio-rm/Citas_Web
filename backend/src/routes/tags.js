import express from 'express';
import * as controladores from '../controllers/controladorTags.js';
const router = express.Router();


router.get('/', controladores.obtenerTags);

router.get('/:id', controladores.obtenerTagPorId);

router.get('/usuario/:id', controladores.obtenerTagsPorUsuarioId);

router.put('/usuario/:id', controladores.actualizarTagsUsuario)

export default router;