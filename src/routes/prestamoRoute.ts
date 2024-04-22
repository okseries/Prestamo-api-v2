import { Router } from "express";
import { actualizarPrestamo, crearPrestamos,  marcarPrestamoAsDeleted,  obtenerPrestamoPorId, obtenerPrestamos, obtenerPrestamosConCuotasVencidas } from "../controllers/prestamoContoller";
import { authenticateToken } from "../middleWare/authMiddleware";

// Crear una instancia de Router de Express
export const router = Router();

// Rutas para la manipulación de préstamos

/**
 * Endpoint para obtener todos los préstamos de una sucursal.
 * @route GET /api/v1/prestamos/sucursal/:id
 */
router.get('/sucursal/:id',/*cuotasVencidas*/ obtenerPrestamos);

router.get('/vencidos/sucursal/:id',/*cuotasVencidas*/ obtenerPrestamosConCuotasVencidas);


/**
 * Endpoint para obtener un préstamo por su ID.
 * @route GET /api/v1/prestamos/:id
 */
router.get('/:id',/*cuotasVencidas*/ obtenerPrestamoPorId);



/**
 * Endpoint para actualizar un préstamo por su ID.
 * @route PUT /api/v1/prestamos/:id
 */
router.put('/:id',/*cuotasVencidas*/ actualizarPrestamo);

/**
 * Endpoint para crear un nuevo préstamo en una sucursal específica.
 * @route POST /api/v1/prestamos/sucursal/:id
 */
router.post('/sucursal/:id',/*cuotasVencidas*/ crearPrestamos);

router.put('/eliminar/:id',/*cuotasVencidas*/ marcarPrestamoAsDeleted);




// Fin de las rutas de préstamos
