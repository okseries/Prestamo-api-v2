import { Router } from "express";
import { obtenerFrecuencia, obtenerFrecuenciaPorId, actualizarFrecuencia, eliminarFrecuencia, crearFrecuencia } from "../controllers/frecuenciaPagoController";
import { authenticateToken } from "../middleWare/authMiddleware";

// Crear una instancia de Router de Express
export const router = Router();

/**
 * Endpoint para obtener todas las frecuencias de pago.
 * @route GET /api/v1/frecuenciasPago
 */
router.get('/',/*authenticateToken,*/ obtenerFrecuencia);

/**
 * Endpoint para obtener una frecuencia de pago por su ID.
 * @route GET /api/v1/frecuenciasPago/:id
 */
router.get('/:id',/*authenticateToken,*/ obtenerFrecuenciaPorId);

/**
 * Endpoint para actualizar una frecuencia de pago por su ID.
 * @route PUT /api/v1/frecuenciasPago/:id
 */
router.put('/:id',/*authenticateToken,*/ actualizarFrecuencia);

/**
 * Endpoint para eliminar una frecuencia de pago por su ID.
 * @route DELETE /api/v1/frecuenciasPago/:id
 */
router.delete('/:id',/*authenticateToken,*/ eliminarFrecuencia);

/**
 * Endpoint para crear una nueva frecuencia de pago.
 * @route POST /api/v1/frecuenciasPago
 */
router.post('/',/*authenticateToken,*/ crearFrecuencia);

