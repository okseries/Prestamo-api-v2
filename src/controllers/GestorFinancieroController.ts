import { Request, Response } from "express";
import { obtenerCantidadTotalPrestada, obtenerInformacionCuotas, obtenerMontoTotalPrestamos, obtenerSumaDeHistorilPago, obtenerSumaDemorasGeneral, obtenerSumaDemorasPagadas, obtenerSumaInteresesPrestamos } from "../services/GestorFinancieroService";
import { handleError } from "../utility/handleError";


export const GestorFinancieroController = async (req: Request, res: Response ): Promise<void> => {
    try {
        const idSucursal: number = parseInt(req.params.id);
        // Llamada a obtenerCantidadTotalPrestada
        const totalCapital = await obtenerCantidadTotalPrestada(idSucursal);

        // Llamada a obtenerMontoTotalPrestamos
        const totalMonto = await obtenerMontoTotalPrestamos(idSucursal);

        // Llamada a obtenerSumaInteresesPrestamos
        const totalInteres = await obtenerSumaInteresesPrestamos(idSucursal);

        // Llamada a obtenerInformacionCuotas
        const informacionCuotas = await obtenerInformacionCuotas(idSucursal); 
        const SumaDeHistorialPago = await obtenerSumaDeHistorilPago(idSucursal); 

        const SumaMoras = await obtenerSumaDemorasGeneral(idSucursal);
        const SumaMorasPagadas = await obtenerSumaDemorasPagadas(idSucursal);

        res.status(200).json({
            message: 'success',
            totalCapital,
            totalMonto,
            totalInteres,
            informacionCuotas,
            SumaDeHistorialPago,
            SumaMoras,
            SumaMorasPagadas,
        });

    } catch (error: any) {
        handleError(res, error);
    }
}