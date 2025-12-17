import express from 'express';
import * as controladores from '../controllers/controladorUsuario.js';

import { guardarPreferencias } from "../controllers/controladorPreferencias.js";
const router = express.Router();

// obtener usuarios disponibles
router.get('/disponibles', controladores.usuariosDisponibles);

//obtener tags
router.get('/tags', controladores.obtenerTags)

// obtener un solo usuario
router.get('/:id', controladores.obtenerUsuarioPorId);

// obtenemos todos los usuarios
router.get('/', controladores.obtenerUsuarios);

// actualizamos un usuario
router.put('/:id', controladores.actualizarUsuario);

// eliminar un usuario
router.delete('/:id', controladores.eliminarUsuario);

// login
router.post('/login', controladores.loginUsuario);

// acá creamos un nuevo usuario:
router.post('/', controladores.crearUsuario);


router.post("/preferencias", guardarPreferencias);

export default router;
