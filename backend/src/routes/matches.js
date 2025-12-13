import express from 'express';
import * as controladores from '../controllers/controladorMatch.js';
const router = express.Router();

router.get('/', controladores.obtenerMatches);

router.get('/:id', controladores.obtenerMatchPorId);

router.post('/', controladores.crearMatch);

router.delete('/:id', controladores.eliminarMatch);

export default router;
