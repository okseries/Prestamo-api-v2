import { createSucursal, getAllSucursal, getSucursalById, updateSucursal, deleteSucursal } from '../services/sucursalservice';
import { Request, Response } from 'express';
import { handleError } from '../utility/handleError';



/**
 * Maneja la solicitud para obtener todas las sucursales.
 * @function obtenerSucursales
 * @param {Request} req - El objeto de solicitud de Express.
 * @param {Response} res - El objeto de respuesta de Express.
 * @returns {Promise<void>} Una promesa que resuelve cuando se completa la operación.
 */
export const obtenerSucursales = async (req: Request, res: Response): Promise<void> => {
    try {
        const sucursales = await getAllSucursal();
        res.status(200).json(sucursales);
    } catch (error) {
        handleError(res, error);
    }
}

/**
 * Maneja la solicitud para obtener una sucursal por su ID.
 * @function obtenerSucursalPorId
 * @param {Request} req - El objeto de solicitud de Express.
 * @param {Response} res - El objeto de respuesta de Express.
 * @returns {Promise<void>} Una promesa que resuelve cuando se completa la operación.
 */
export const obtenerSucursalPorId = async (req: Request, res: Response): Promise<void> => {
    try {
        const idSucursal: number = parseInt(req.params.id);
        const sucursal = await getSucursalById(idSucursal);
        res.status(200).json(sucursal);
    } catch (error) {
        handleError(res, error);
    }
}

/**
 * Maneja la solicitud para crear una nueva sucursal.
 * @function crearSucursal
 * @param {Request} req - El objeto de solicitud de Express con los datos de la sucursal a crear en el cuerpo.
 * @param {Response} res - El objeto de respuesta de Express.
 * @returns {Promise<void>} Una promesa que resuelve cuando se completa la operación.
 */
export const crearSucursal = async (req: Request, res: Response): Promise<void> => {
    try {
        const sucursalData = req.body;
        const sucursalCreada = await createSucursal(sucursalData);
        res.status(200).json(sucursalCreada);
    } catch (error) {
        handleError(res, error);
    }
}

/**
 * Maneja la solicitud para actualizar una sucursal existente.
 * @function actualizarSucursal
 * @param {Request} req - El objeto de solicitud de Express con los datos actualizados de la sucursal en el cuerpo.
 * @param {Response} res - El objeto de respuesta de Express.
 * @returns {Promise<void>} Una promesa que resuelve cuando se completa la operación.
 */
export const actualizarSucursal = async (req: Request, res: Response): Promise<void> => {
    try {
        const sucursalData = req.body;
        const idSucursal: number = parseInt(req.params.id);
        const sucursalActualizada = await updateSucursal(idSucursal, sucursalData);
        res.status(200).json(sucursalActualizada);
    } catch (error: any) {
        handleError(res, error);
    }
}

/**
 * Maneja la solicitud para eliminar una sucursal por su ID.
 * @function eliminarSucursal
 * @param {Request} req - El objeto de solicitud de Express con el ID de la sucursal a eliminar en el cuerpo.
 * @param {Response} res - El objeto de respuesta de Express.
 * @returns {Promise<void>} Una promesa que resuelve cuando se completa la operación.
 */
export const eliminarSucursal = async (req: Request, res: Response): Promise<void> => {
    try {
        const idSucursal: number = parseInt(req.params.id);
        const sucursalEliminada = await deleteSucursal(idSucursal);
        res.status(200).json(sucursalEliminada);
    } catch (error: any) {
        handleError(res, error);
    }
}
