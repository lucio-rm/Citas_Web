import express from 'express';
import * as controladores from '../controllers/controladorUsuario.js';
//import { guardarPreferencias } from "../controllers/controladorPreferencias.js";
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

// login
router.post('/login', controladores.loginUsuario);

//router.put("/:id/preferencias", controladores.actualizarPreferencias);
// 👇 otras rutas que ya tengas
//router.post("/preferencias", guardarPreferencias);

export default router;
