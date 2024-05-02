import { Request, Response } from "express";
import {  createMoras, deleteMoraById, getAllMoras, getAllMorasDetalle, obtenerUltimaMoraDeUnaCuota, updateMora } from "../services/moraService";
import { handleError } from "../utility/handleError";



export const obtenerMoras = async (req: Request, res: Response): Promise<void> => {
    try {
        const moras = await getAllMoras();
        res.status(200).json(moras);
    } catch (error: any) {
        handleError(res, error);
    }
}


export const obtenerMorasDetalle = async (req: Request, res: Response): Promise<void> => {
    try {
        const idSucursal: number = parseInt(req.params.id);
        const morasDetalle = await getAllMorasDetalle(idSucursal);
        res.status(200).json(morasDetalle);
    } catch (error: any) {
        handleError(res, error);
    }
};

export const crearMoras = async (req: Request, res: Response): Promise<void> => {
    try {
        const { idCuota } = req.body; // Acceder a idCuota desde req.body
        const mora = await createMoras(idCuota);
            
        // Verificar si se generó la mora correctamente
        // Verificar si se generó la mora correctamente
        if (mora) {
            // Si la mora se generó correctamente, devolver un mensaje de éxito
            res.status(200).json({ message: "La mora se generó correctamente.", result: "success" });
        } else {
            // Si no se pudo generar la mora, devolver un mensaje indicando que no existen cuotas vencidas
            res.status(404).json({ message: "No existen cuotas vencidas para generar mora o ya se ha generado una mora a esta cuota hoy.", result: "Not found" });
        }
        


    } catch (error: any) {
        handleError(res, error)
    }
};


export const eliminarMoraById = async (req: Request, res: Response): Promise<void> => {
    try {
        const idMora: number = parseInt(req.params.id);
        const moraDeleted = await deleteMoraById(idMora);
        res.status(200).json(moraDeleted);
    } catch (error: any) {
        handleError(error, res);
    }
}

export const actualizarMora = async (req: Request, res: Response): Promise<void> => {
    try {
        const idMora: number = parseInt(req.params.id);
        const moraData = req.body;
        const moraUpdated = await updateMora(idMora, moraData);
        res.status(200).json(moraUpdated);
    } catch (error: any) {
        handleError(error, res);
    }
}


export const obtenerUltimaMoraDeUnaCuotaController = async (req: Request, res: Response): Promise<void>=>{
    try {
        const idCuota: number = parseInt(req.params.id);
        const mora = await obtenerUltimaMoraDeUnaCuota(idCuota);
        res.status(200).json(mora);
    } catch (error: any) {
        handleError(res, error);
    }
}
