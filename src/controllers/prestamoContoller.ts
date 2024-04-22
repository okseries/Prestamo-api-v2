import { Request, Response } from "express";
import { createPrestamos,  findPrestamoById, getAllPrestamos, getAllPrestamosConCuotasVencidas, markPrestamoAsDeleted, updatePrestamo } from "../services/prestamoService";
import { handleError } from "../utility/handleError";
import { actualizarDetallePago } from "./detallePagoController";



/**
 * Obtener todos los préstamos de una sucursal.
 * @route GET /api/v1/prestamos/sucursal/:id
 */
export const obtenerPrestamos = async (req: Request, res: Response): Promise<void> => {
    try {
        const idSucursal: number = parseInt(req.params.id);
        const prestamos = await getAllPrestamos(idSucursal);
        res.status(200).json(prestamos);
    } catch (error: any) {
        handleError(res, error);
    }
}

/**
 * Crear un nuevo préstamo en una sucursal específica.
 * @route POST /api/v1/prestamos/sucursal/:id
 */
export const crearPrestamos = async (req: Request, res: Response): Promise<void> => {
    try {
        const prestamoData = req.body;
        const idSucursal: number = parseInt(req.params.id);
        const prestamosCreados = await createPrestamos(idSucursal, prestamoData);
        res.status(200).json(prestamosCreados);
    } catch (error: any) {
        handleError(res, error);
    }
}

/**
 * Obtener un préstamo por su ID.
 * @route GET /api/v1/prestamos/:id
 */
export const obtenerPrestamoPorId = async (req: Request, res: Response): Promise<void> => {
    try {
        const idPrestamo: number = parseInt(req.params.id);
        const prestamo = await findPrestamoById(idPrestamo);
        res.status(200).json(prestamo);
    } catch (error) {
        handleError(res, error);
    }
}

/**
 * Actualizar un préstamo por su ID.
 * @route PUT /api/v1/prestamos/:id
 */
export const actualizarPrestamo = async (req: Request, res: Response): Promise<void> => {
    try {
        const idPrestamo: number = parseInt(req.params.id);
        const prestamoData = req.body;
        const prestamoActualizado = await updatePrestamo(idPrestamo, prestamoData);


        res.status(200).json(prestamoActualizado);
    } catch (error: any) {
        handleError(res, error);
    }
}

/**
 * Eliminar un préstamo por su ID.
 * @route DELETE /api/v1/prestamos/:id
 */



export const obtenerPrestamosConCuotasVencidas = async (req: Request, res: Response): Promise<void> => {
    try {
        const idSucursal: number = parseInt(req.params.id);
        const Prestamos = await getAllPrestamosConCuotasVencidas(idSucursal);
        res.status(200).json(Prestamos);
    } catch (error: any) {
        handleError(res, error);
    }
};


export const marcarPrestamoAsDeleted = async (req: Request, res: Response): Promise<void> => {
    try {
        const idPrestamo: number = parseInt(req.params.id);
        if (isNaN(idPrestamo)) {
            res.status(400).json({ error: 'El ID del préstamo proporcionado no es válido' });
            return;
        }

        const deleted = await markPrestamoAsDeleted(idPrestamo);
        res.status(200).json({ success: deleted });
    } catch (error) {
        console.error('Error al marcar el préstamo como eliminado:', error);
        res.status(500).json({ error: 'Ocurrió un error al procesar la solicitud' });
    }
};