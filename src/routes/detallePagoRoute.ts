import { Router } from "express";
import { actualizarDetallePago, crearDetallePago, eliminarDetallePago, obtenerDetallePago, obtenerDetallePagoById, obtenerDetallePagoPorIdHistorialPago } from "../controllers/detallePagoController";
import { authenticateToken } from "../middleWare/authMiddleware";



export const router = Router();

router.get('/sucursal/:id',/*authenticateToken,*/ obtenerDetallePago);
router.get('/historialPago/:id', obtenerDetallePagoPorIdHistorialPago); 
router.get('/:id',/*authenticateToken,*/ obtenerDetallePagoById);
router.put('/:id',/*authenticateToken,*/ actualizarDetallePago);
router.delete('/:id',/*authenticateToken,*/ eliminarDetallePago);
router.post('/sucursal/:id',/*authenticateToken,*/ crearDetallePago); 
