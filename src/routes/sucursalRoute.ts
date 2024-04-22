import { Router } from "express";
import { actualizarSucursal, crearSucursal, eliminarSucursal, obtenerSucursalPorId, obtenerSucursales } from "../controllers/sucursalController";
import { authenticateToken } from "../middleWare/authMiddleware";

// Crear una instancia de Router de Express
export const router = Router();

// Rutas para la manipulación de sucursales

/**
 * Endpoint para obtener una sucursal por su ID.
 * @route GET /api/v1/sucursales/sucursal/:id
 */
router.get('/sucursal/:id',authenticateToken, obtenerSucursalPorId);

/**
 * Endpoint para eliminar una sucursal por su ID.
 * @route DELETE /api/v1/sucursales/sucursal/:id
 */
router.delete('/sucursal/:id',authenticateToken, eliminarSucursal);

/**
 * Endpoint para actualizar una sucursal por su ID.
 * @route PUT /api/v1/sucursales/sucursal/:id
 */
router.put('/sucursal/:id',authenticateToken, actualizarSucursal);

/**
 * Endpoint para obtener todas las sucursales.
 * @route GET /api/v1/sucursales/
 */
router.get('/',authenticateToken, obtenerSucursales);

/**
 * Endpoint para crear una nueva sucursal.
 * @route POST /api/v1/sucursales/
 */
router.post('/',authenticateToken, crearSucursal);
