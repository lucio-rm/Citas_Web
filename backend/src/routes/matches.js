import express from 'express';
import * as controladores from '../controllers/controladorMatches.js';
const router = express.Router();


router.get('/', controladores.obtenerMatches);

router.get('/:id', controladores.obtenerMatchPorId);

router.post('/like', controladores.darLike);

router.post('/', controladores.crearMatch);

router.delete('/:id', controladores.eliminarMatch);

export default router;
