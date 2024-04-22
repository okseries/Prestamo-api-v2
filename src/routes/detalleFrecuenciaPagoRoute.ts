import { Router } from "express";
import { obtenerDetalleFrecuencia, obtenerDetalleFrecuenciaPorId, actualizarDetalleFrecuencia, eliminarDetalleFrecuencia, crearDetalleFrecuencia } from "../controllers/detalleFrecuenciaPagoController";
import { authenticateToken } from "../middleWare/authMiddleware";

// Crear una instancia de Router de Express
export const router = Router();

/**
 * Endpoint para obtener todos los detalles de frecuencia de pago.
 * @route GET /api/v1/detallesFrecuenciaPago
 */
router.get('/',authenticateToken, obtenerDetalleFrecuencia);

/**
 * Endpoint para obtener un detalle de frecuencia de pago por su ID.
 * @route GET /api/v1/detallesFrecuenciaPago/:id
 */
router.get('/:id',authenticateToken, obtenerDetalleFrecuenciaPorId);

/**
 * Endpoint para actualizar un detalle de frecuencia de pago por su ID.
 * @route PUT /api/v1/detallesFrecuenciaPago/:id
 */
router.put('/:id',authenticateToken, actualizarDetalleFrecuencia);

/**
 * Endpoint para eliminar un detalle de frecuencia de pago por su ID.
 * @route DELETE /api/v1/detallesFrecuenciaPago/:id
 */
router.delete('/:id',authenticateToken, eliminarDetalleFrecuencia);

/**
 * Endpoint para crear un nuevo detalle de frecuencia de pago.
 * @route POST /api/v1/detallesFrecuenciaPago
 */
router.post('/',authenticateToken, crearDetalleFrecuencia);

// Fin de las rutas de detalle de frecuencia de pago
