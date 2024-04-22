import { Request, Response } from "express";
import { handleError } from "../utility/handleError";
import { cancelarPagoService, createHistorialPago, getAllHistorialPago, getHistorialPagoById, updateHistorialPago } from "../services/historialPagoService";


/**
 * Controlador para obtener todos los registros de historial de pagos asociados a una sucursal.
 * @param req Objeto de solicitud de Express.
 * @param res Objeto de respuesta de Express.
 * @returns Un array de objetos de historial de pago.
 */
export const obtenerHistorialPagos = async (req: Request, res: Response): Promise<void> => {
    try {
        const idSucursal: number = parseInt(req.params.id);
        const historialPagos = await getAllHistorialPago(idSucursal);
        res.status(200).json(historialPagos);
    } catch (error: any) {
        handleError(res, error);
    }
}

/**
 * Controlador para obtener un registro de historial de pago por su ID.
 * @param req Objeto de solicitud de Express.
 * @param res Objeto de respuesta de Express.
 * @returns El objeto de historial de pago encontrado.
 */
export const obtenerHistorialPagoById = async (req: Request, res: Response): Promise<void> => {
    try {
        const idCuota: number = parseInt(req.params.id);
        const historialPago = await getHistorialPagoById(idCuota);
        res.status(200).json(historialPago);
    } catch (error: any) {
        handleError(res, error);
    }
}

/**
 * Controlador para crear un nuevo registro de historial de pago.
 * @param req Objeto de solicitud de Express que contiene los datos del historial de pago a crear.
 * @param res Objeto de respuesta de Express.
 * @returns El objeto de historial de pago creado.
 */
export const crearHistorialPago = async (req: Request, res: Response): Promise<void> => {
    try {
        const historialPagoData = req.body;
        historialPagoData.idSucursal = req.params.id;
        const historialPagoCreado = await createHistorialPago(historialPagoData);
        res.status(200).json(historialPagoCreado);
    } catch (error: any) {
        handleError(res, error);
    }
}

/**
 * Controlador para actualizar un registro de historial de pago por su ID.
 * @param req Objeto de solicitud de Express que contiene los datos actualizados del historial de pago.
 * @param res Objeto de respuesta de Express.
 * @returns Un objeto que indica el número de filas actualizadas y los registros actualizados de historial de pago.
 */
export const actualizarHistorialPago = async (req: Request, res: Response): Promise<void> => {
    try {
        const idHistorialPago: number = parseInt(req.params.id);
        const historialPagoData = req.body;
        const historialPagoActualizado = await updateHistorialPago(idHistorialPago, historialPagoData);
        res.status(200).json(historialPagoActualizado);
    } catch (error: any) {
        handleError(res, error);
    }
}


export const cancelarPagoController = async (req: Request, res: Response): Promise<void> => {
    try {
        const idHistorialPago: number = parseInt(req.params.id);
        const estado = req.body;
        const historialPagoActualizado = await cancelarPagoService(idHistorialPago, estado);
        if (historialPagoActualizado) {
            res.status(200).json({ historialPagoActualizado, message: 'El pago ha sido cancelado', respose: 'success' });
        } else {
            res.json({ historialPagoActualizado, message: 'El pago ya está cancelado', respose: 'failure' });
        }

    } catch (error: any) {
        handleError(res, error);
    }
}


