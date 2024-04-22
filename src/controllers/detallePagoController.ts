import { Request, Response } from "express";
import { handleError } from "../utility/handleError";
import { createDetallePago, deleteDetallePago, getAllDetallePago, getDetallePagoById, getDetallePagoPorIdHistorialPago, updateDetallePago } from "../services/detallePagoService";



export const obtenerDetallePago = async (req: Request, res: Response): Promise<void> => {
    try {
        const idSucursal: number = parseInt(req.params.id);
        const detallesPagos = await getAllDetallePago(idSucursal);
        res.status(200).json(detallesPagos);
    } catch (error) {
        handleError(res, error);
    }
}

export const crearDetallePago = async (req: Request, res: Response): Promise<void> => {
    try {
        const DetallePagoData = req.body;
        DetallePagoData.idSucursal = DetallePagoData.idSucursal || req.params.id;

        const detallePagoCreado = await createDetallePago(DetallePagoData);
        res.status(200).json(detallePagoCreado);
    } catch (error) {
        handleError(res, error);
    }
}

export const obtenerDetallePagoById = async (req: Request, res: Response): Promise<void> => {
    try {
        const idDetallePago: number = parseInt(req.params.id);
        const historialPago = await getDetallePagoById(idDetallePago);
        res.status(200).json(historialPago);
    } catch (error) {
        handleError(res, error);
    }
}

export const actualizarDetallePago = async (req: Request, res: Response): Promise<void> => {
    try {
        const DetallePagoData = req.body;
        const idSucursal: number = parseInt(req.params.id);
        const detalleCreado = await updateDetallePago(idSucursal, DetallePagoData);
        res.status(200).json(detalleCreado);
    } catch (error) {
        handleError(res, error);
    }
}


export const eliminarDetallePago = async (req: Request, res: Response): Promise<void> => {
    try {
        const idHistorialPago = parseInt(req.params.id);
        const HistorialPagoEliminado = await deleteDetallePago(idHistorialPago);
        res.status(200).json(HistorialPagoEliminado);
    } catch (error) {
        handleError(res, error);
    }
}

export const obtenerDetallePagoPorIdHistorialPago = async (req: Request, res: Response): Promise<void>=>{
    try {
        const idHistorialPago: number = parseInt(req.params.id);        
        const detallePago = await getDetallePagoPorIdHistorialPago(idHistorialPago);
        res.status(200).json(detallePago);
    } catch (error: any) {
        handleError(res, error);
    }
}


