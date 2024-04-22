import { Router } from "express";
import { crearCuotas,  markCuotasForPrestamoAsDeletedController, obtenerCuotaPorId, obtenerCuotas, obtenerCuotasVencenHoy,  obternerCuotasVencidas,  pagarCuotas } from "../controllers/cuotaContoller";
import { authenticateToken } from "../middleWare/authMiddleware";
import { payMoraCuotaController } from "../controllers/payCuotaMoraController";

export const router = Router();
 
/**
 * @swagger
 * /cuotas/vencidas/sucursal/{id}:
 *   get:
 *     summary: Obtener cuotas vencidas de una sucursal por su ID.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Cuotas vencidas obtenidas exitosamente.
 *       404:
 *         description: No se encontraron cuotas vencidas para la sucursal especificada.
 */
router.get('/vencidas/prestamo/:id',/*cuotasVencidas*/ obternerCuotasVencidas);

/**
 * @swagger
 * /cuotas/pagar:
 *   put:
 *     summary: Pagar cuotas seleccionadas.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               montoPagado:
 *                 type: number
 *               idCuota:
 *                 type: array
 *                 items:
 *                   type: number
 *     responses:
 *       200:
 *         description: Pago realizado correctamente.
 *       400:
 *         description: Error en la solicitud de pago.
 */
router.put('/pagar',/*cuotasVencidas*/ payMoraCuotaController);

/**
 * @swagger
 * /cuotas/sucursal/{id}:
 *   get:
 *     summary: Obtener todas las cuotas de una sucursal por prestamo ID.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Cuotas obtenidas exitosamente.
 *       404:
 *         description: No se encontraron cuotas para la sucursal especificada.
 */
router.get('/prestamo/:id',/*cuotasVencidas*/ obtenerCuotas);

/**
 * @swagger
 * /cuotas/{id}:
 *   get:
 *     summary: Obtener una cuota por su ID.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Cuota obtenida exitosamente.
 *       404:
 *         description: No se encontró la cuota especificada.
 */
router.get('/:id', obtenerCuotaPorId);

/**
 * @swagger
 * /cuotas:
 *   post:
 *     summary: Crear nuevas cuotas.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               // Especificar aquí las propiedades del cuerpo de la solicitud requeridas para crear cuotas.
 *     responses:
 *       201:
 *         description: Cuotas creadas correctamente.
 *       400:
 *         description: Error en la solicitud de creación de cuotas.
 */
router.post('/',/*cuotasVencidas*/ crearCuotas); 

router.get('/vencenHoy/sucursal/:id', obtenerCuotasVencenHoy);

router.put('/deleted/prestamos/:id', markCuotasForPrestamoAsDeletedController);
