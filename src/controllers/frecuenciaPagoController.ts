import { Request, Response } from "express";
import { handleError } from "../utility/handleError";
import { createFrecuenciaPago, deleteFrecuenciaPago, getAllFrecuenciaPago, getFrecuenciaPagoById, updateFrecuenciaPago } from "../services/frecuenciaPagoService";

export const obtenerFrecuencia = async (req: Request, res: Response): Promise<void> => {
    try {
        const frecuencias = await getAllFrecuenciaPago();
        res.status(200).json(frecuencias);
    } catch (error: any) {
        handleError(res, error);
    }
}

export const obtenerFrecuenciaPorId = async (req: Request, res: Response): Promise<void> => {
    try {
        const idFrecuencia: number = parseInt(req.params.id);
        const frecuencia = await getFrecuenciaPagoById(idFrecuencia);
        res.status(200).json(frecuencia);
    } catch (error) {
        handleError(res, error);
    }
}

export const crearFrecuencia = async (req: Request, res: Response): Promise<void> => {
    try {
        const dataFrecuencia = req.body;
        const frecuenciaCreada = await createFrecuenciaPago(dataFrecuencia);
        res.status(200).json(frecuenciaCreada);
    } catch (error: any) {
        handleError(res, error);
    }
}

export const eliminarFrecuencia = async (req: Request, res: Response): Promise<void> => {
    try {
        const idFrecuencia: number = parseInt(req.params.id);
        const frecuenciaEliminada = await deleteFrecuenciaPago(idFrecuencia);
        res.status(200).json(frecuenciaEliminada);
    } catch (error) {
        handleError(res, error);
    }
}

export const actualizarFrecuencia = async (req: Request, res: Response): Promise<void> => {
    try {
        const idFrecuencia: number = parseInt(req.params.id);
        const dataFrecuencia = req.body;
        const frecuenciaActualizada = await updateFrecuenciaPago(idFrecuencia, dataFrecuencia);
        res.status(200).json(frecuenciaActualizada);
    } catch (error) {
        handleError(res, error);
    }
}
