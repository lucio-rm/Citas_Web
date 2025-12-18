import express from 'express';
import * as controladores from '../controllers/controladorUsuario.js';
const router = express.Router();


router.get('/disponibles', controladores.usuariosDisponibles);

router.get('/tags', controladores.obtenerTags);

router.get('/:id', controladores.obtenerUsuarioPorId);

router.get('/', controladores.obtenerUsuarios);

router.put('/:id', controladores.actualizarUsuario);

router.delete('/:id', controladores.eliminarUsuario);

router.post('/login', controladores.loginUsuario);

router.post('/', controladores.crearUsuario);

export default router;