import { Router } from "express";
import { actualizarMora, crearMoras, eliminarMoraById, obtenerMoras, obtenerMorasDetalle, obtenerUltimaMoraDeUnaCuotaController } from "../controllers/moraContoller";
import { obtenerPrestamoPorId } from "../controllers/prestamoContoller";
import { authenticateToken } from "../middleWare/authMiddleware";

export const router = Router();

router.get('/sucursal/:id',authenticateToken, obtenerMoras);
router.get('/detalle/sucursal/:id',authenticateToken, obtenerMorasDetalle);
router.get('/:id',authenticateToken, obtenerPrestamoPorId);
router.put('/:id',authenticateToken, actualizarMora);
router.delete('/:id',authenticateToken, eliminarMoraById);
router.post('/sucursal/:id',authenticateToken, crearMoras);
router.get('/cuota/:id', obtenerUltimaMoraDeUnaCuotaController);

