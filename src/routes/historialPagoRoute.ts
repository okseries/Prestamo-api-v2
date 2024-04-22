import { Router } from "express";
import { actualizarHistorialPago, cancelarPagoController, crearHistorialPago,  obtenerHistorialPagoById, obtenerHistorialPagos } from "../controllers/historialPagoController";
import { authenticateToken } from "../middleWare/authMiddleware";

// Crear una instancia de Router de Express
export const router = Router();

/**
 * @swagger
 * tags:
 *   name: HistorialPago
 *   description: Endpoints para la gestión del historial de pagos.
 */

/**
 * @swagger
 * /api/v1/historial-pago/sucursal/{id}:
 *   get:
 *     summary: Obtiene todos los registros del historial de pagos de una sucursal.
 *     tags: [HistorialPago]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID de la sucursal
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Lista de historial de pagos obtenida correctamente.
 *       404:
 *         description: No se encontraron registros de historial de pagos para la sucursal especificada.
 */
router.get('/sucursal/:id',authenticateToken, obtenerHistorialPagos);

/**
 * @swagger
 * /api/v1/historial-pago/{id}:
 *   get:
 *     summary: Obtiene un registro de historial de pagos por su ID.
 *     tags: [HistorialPago]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID del historial de pagos
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Registro de historial de pagos obtenido correctamente.
 *       404:
 *         description: No se encontró un registro de historial de pagos con el ID especificado.
 */
router.get('/:id',authenticateToken, obtenerHistorialPagoById);

/**
 * @swagger
 * /api/v1/historial-pago/{id}:
 *   delete:
 *     summary: Elimina un registro de historial de pagos por su ID.
 *     tags: [HistorialPago]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID del historial de pagos a eliminar
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Registro de historial de pagos eliminado correctamente.
 *       404:
 *         description: No se encontró un registro de historial de pagos con el ID especificado.
 */
router.put('/cancelarPago/:id',authenticateToken, cancelarPagoController);

/**
 * @swagger
 * /api/v1/historial-pago:
 *   post:
 *     summary: Crea un nuevo registro de historial de pagos.
 *     tags: [HistorialPago]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/definitions/HistorialPago'
 *     responses:
 *       200:
 *         description: Registro de historial de pagos creado correctamente.
 *       400:
 *         description: Error al procesar la solicitud de creación del historial de pagos.
 */
router.post('/sucursal/:id',authenticateToken, crearHistorialPago);

/**
 * @swagger
 * /api/v1/historial-pago/{id}:
 *   put:
 *     summary: Actualiza un registro de historial de pagos por su ID.
 *     tags: [HistorialPago]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID del historial de pagos a actualizar
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/definitions/HistorialPago'
 *     responses:
 *       200:
 *         description: Registro de historial de pagos actualizado correctamente.
 *       404:
 *         description: No se encontró un registro de historial de pagos con el ID especificado.
 *       400:
 *         description: Error al procesar la solicitud de actualización del historial de pagos.
 */
router.put('/:id',/*authenticateToken,*/ actualizarHistorialPago);

