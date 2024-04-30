import { Router } from "express";
import { actualizarCliente, crearClientes,  markClienteAsDeletedController, obtenerClienteByIdentificacion, obtenerClientelPorId, obtenerClientes } from "../controllers/clienteContoller";
import {authenticateToken} from "../middleWare/authMiddleware";

// Crear una instancia de Router de Express
export const router = Router();

// Rutas para la manipulación de clientes

/**
 * Endpoint para obtener todos los clientes de una sucursal.
 * @route GET /api/v1/clientes/sucursal/:id
 */
router.get('/sucursal/:id', /*authenticateToken,*/ obtenerClientes);

/**
 * Endpoint para obtener un cliente por su ID.
 * @route GET /api/v1/clientes/:id
 */
router.get('/:id',/*authenticateToken,*/ obtenerClientelPorId);

/**
 * Endpoint para obtener un cliente por su identificacion.
 * @route GET /identificacion/:identificacion
 */
router.get('/sucursal/:id/identificacion/:identificacion',/*authenticateToken,*/ obtenerClienteByIdentificacion);

/**
 * Endpoint para eliminar un cliente por su ID.
 * @route DELETE /api/v1/clientes/:id
 */
router.put('/deleted/:id',/*authenticateToken,*/ markClienteAsDeletedController);

/**
 * Endpoint para crear un nuevo cliente en una sucursal específica.
 * @route POST /api/v1/clientes/sucursal/:id
 */
router.post('/sucursal/:id',/*authenticateToken,*/ crearClientes);

/**
 * Endpoint para actualizar un cliente por su ID.
 * @route PUT /api/v1/clientes/:id
 */
router.put('/:id',/*authenticateToken,*/ actualizarCliente);
