import { Request, Response } from "express";
import {
    createCuotas,
    getAllCuotas,
    updateCuota,
    getCuotaById,
    getCuotasVencenHoy,
    getCuotasVencidasPorPrestamo,
    markCuotasForPrestamoAsDeleted
} from "../services/cuotaService";
import { handleError } from "../utility/handleError";
import { payCuotas } from "../services/Cuotas/pagosServicesCuotas";


/**
 * Obtiene todas las cuotas de un préstamo específico.
 * @param {Request} req - La solicitud de Express.
 * @param {Response} res - La respuesta de Express.
 */
export const obtenerCuotas = async (req: Request, res: Response): Promise<void> => {
    try {
        const idPrestamo: number = parseInt(req.params.id);
        const cuotas = await getAllCuotas(idPrestamo);
        res.status(200).json(cuotas);
    } catch (error: any) {
        handleError(res, error);
    }
};

/**
 * Obtiene las cuotas vencidas de un préstamo específico.
 * @param {Request} req - La solicitud de Express.
 * @param {Response} res - La respuesta de Express.
 */
export const obternerCuotasVencidas = async (req: Request, res: Response): Promise<void> => {
    try {
        const idPrestamo: number = parseInt(req.params.id);
        const cuotasVencidas = await getCuotasVencidasPorPrestamo(idPrestamo);
        res.status(200).json(cuotasVencidas);
        
    } catch (error: any) {
        handleError(res, error);
    }
};

/**
 * Crea cuotas para un préstamo específico.
 * @param {Request} req - La solicitud de Express.
 * @param {Response} res - La respuesta de Express.
 */
 
export const crearCuotas = async (req: Request, res: Response): Promise<void> => {
    try {
        const { idPrestamo} = req.body;
        const cuotasCreadas = await createCuotas(idPrestamo);
        
        
        res.status(200).json(cuotasCreadas);
    } catch (error: any) {
        handleError(res, error);
    }
};

/**
 * Paga cuotas específicas.
 * 
 * @param {Request} req - La solicitud de Express que contiene la información del pago.
 * @param {Response} res - La respuesta de Express que se enviará al cliente.
 * @throws {Error} Si ocurre algún error durante el proceso de pago.
 */
export const pagarCuotas = async (req: Request, res: Response): Promise<void> => {
    try {
        // Extraer información de la solicitud
        const { montoPagado, idCuota } = req.body;

        // Validar que se proporcionaron IDs de cuotas
        if (!Array.isArray(idCuota) || idCuota.length === 0) {
            throw new Error('Se requiere al menos un ID de cuota para realizar el pago.');
        }

        // Validar que el monto pagado sea un número positivo
        if (typeof montoPagado !== 'number' || montoPagado <= 0) {
            throw new Error('El monto pagado debe ser un número positivo mayor que cero.');
        }

        // Realizar el pago de las cuotas
        await payCuotas(idCuota, montoPagado);

        // Enviar respuesta al cliente
        res.status(200).json({ success: true, message: 'Pago realizado correctamente' });
    } catch (error: any) {
        // Manejar errores y enviar respuesta de error al cliente
        handleError(res, error);
    }
};



/**
 * Obtiene una cuota por su ID.
 * @param {Request} req - La solicitud de Express.
 * @param {Response} res - La respuesta de Express.
 */
export const obtenerCuotaPorId = async (req: Request, res: Response): Promise<void> => {
    try {
        const idCuota: number = parseInt(req.params.id);
        const cuota = await getCuotaById(idCuota);
        res.status(200).json(cuota);
    } catch (error: any) {
        handleError(res, error);
    }
};

export const obtenerCuotasVencenHoy = async(req: Request, res: Response): Promise<void>=>{
    try {

        const idSucursal: number = parseInt(req.params.id);
        const cuotas = await getCuotasVencenHoy(idSucursal);
        
        res.status(200).json(cuotas);

    } catch (error: any) {
        handleError(res,error)
    }
}


export const markCuotasForPrestamoAsDeletedController = async (req: Request, res: Response): Promise<void> => {
    const idPrestamo: number = parseInt(req.params.id);

    try {
        // Marcar todas las cuotas relacionadas al préstamo como eliminadas
        await markCuotasForPrestamoAsDeleted(idPrestamo);

        res.status(200).json({ message: 'Las cuotas del préstamo han sido marcadas como eliminadas exitosamente.' });
    } catch (error) {
        console.error('Error al eliminar las cuotas del préstamo:', error);
        res.status(500).json({ message: 'Se produjo un error al intentar eliminar las cuotas del préstamo.' });
    }
};
