import express from 'express';
import * as controladores from '../controllers/controladorTags.js';
const router = express.Router();

// devuelve todos los tags
router.get('/', controladores.obtenerTags);

// obtener un solo tag por su id
router.get('/:id', controladores.obtenerTagPorId);

// obtener tags de un usuario por su id
router.get('/usuario/:id', controladores.obtenerTagsPorUsuarioId);

// actualizar los tags asociados a un usuario
router.put('/usuario/:id', controladores.actualizarTagsUsuario)

export default router;