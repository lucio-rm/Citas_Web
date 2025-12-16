import express from 'express';
import * as controladores from '../controllers/controladorUsuario.js';
const router = express.Router();

// obtenemos todos los usuarios
router.get('/', controladores.obtenerUsuarios);

// obtener un solo usuario
router.get('/:id', controladores.obtenerUsuarioPorId);

// acá creamos un nuevo usuario:
router.post('/', controladores.crearUsuario);

// actualizamos un usuario
router.put('/:id', controladores.actualizarUsuario);

// eliminar un usuario
router.delete('/:id', controladores.eliminarUsuario);

// obtener tags de un usuario por su id
router.get('/tags/:id', controladores.obtenerTagsPorUsuarioId);

// login
router.post('/login', controladores.loginUsuario);

export default router;
