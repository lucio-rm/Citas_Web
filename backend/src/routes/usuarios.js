import express from 'express';

const router = express.Router();
const controladores = require('../controllers/usuariosController');

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

// login
router.post('/login', controladores.loginUsuario);

export default router;
