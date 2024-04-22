import { Request, Response } from "express";
import { handleError } from "../utility/handleError";
import { createDetalleFrecuenciaPago, deleteDetalleFrecuenciaPago, getAllDetalleFrecuenciaPago, getDetalleFrecuenciaPagoById, updateDetalleFrecuenciaPago } from "../services/detalleFrecuenciaPagoServcice";

export const obtenerDetalleFrecuencia = async (req: Request, res: Response): Promise<void> => {
    try {
        const detallesFrecuencia = await getAllDetalleFrecuenciaPago();
        res.status(200).json(detallesFrecuencia);
    } catch (error: any) {
        handleError(res, error);
    }
}

export const obtenerDetalleFrecuenciaPorId = async (req: Request, res: Response): Promise<void> => {
    try {
        const idDetalleFrecuencia: number = parseInt(req.params.id);
        const detalleFrecuencia = await getDetalleFrecuenciaPagoById(idDetalleFrecuencia);
        res.status(200).json(detalleFrecuencia);
    } catch (error) {
        handleError(res, error);
    }
}

export const crearDetalleFrecuencia = async (req: Request, res: Response): Promise<void> => {
    try {
        const detalleFrecuenciaData = req.body;
        const detallesFrecuenciaCreados = await createDetalleFrecuenciaPago(detalleFrecuenciaData);
        res.status(200).json(detallesFrecuenciaCreados);
    } catch (error: any) {
        handleError(res, error);
    }
}

export const eliminarDetalleFrecuencia = async (req: Request, res: Response): Promise<void> => {
    try {
        const idDetalleFrecuencia: number = parseInt(req.params.id);
        const detalleFrecuenciaEliminado = await deleteDetalleFrecuenciaPago(idDetalleFrecuencia);
        res.status(200).json(detalleFrecuenciaEliminado);
    } catch (error) {
        handleError(res, error);
    }
}

export const actualizarDetalleFrecuencia = async (req: Request, res: Response): Promise<void> => {
    try {
        const idPrestamo: number = parseInt(req.body);
        const dataDetalleFrecuencia = req.body;
        const detalleFrecuenciaActualizado = await updateDetalleFrecuenciaPago(idPrestamo, dataDetalleFrecuencia);
        res.status(200).json(detalleFrecuenciaActualizado);
    } catch (error) {
        handleError(res, error);
    }
}
