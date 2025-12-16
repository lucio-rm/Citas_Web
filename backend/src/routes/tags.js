import express from 'express';
import * as controladores from '../controllers/controladorTags.js';
const router = express.Router();

// devuelve todos los tags
router.get('/', controladores.obtenerTags);

// obtener un solo tag por su id
router.get('/:id', controladores.obtenerTagPorId);

router.get('/usuario/:id', controladores.obtenerTagsPorUsuarioId);
// obtener tags de un usuario por su id

export default router;