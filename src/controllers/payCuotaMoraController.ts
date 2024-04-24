import { Request, Response } from "express";
import { PayMoraCuota } from "../services/Pagar-Moras-Y-Cuotas/payMoraCuotaService";

// Controlador para manejar la solicitud de pago de moras y cuotas
export const payMoraCuotaController = async (req: Request, res: Response): Promise<void> => {
    // Extrae los datos necesarios de la solicitud
    const { idMora, idPrestamo, idCuota, montoPagado  } = req.body;
    console.log(idMora);
    console.log(idCuota);
    console.log(montoPagado);



    try {

        // Validar que el monto pagado sea un número positivo
        if (typeof montoPagado !== 'number' || montoPagado <= 0) {
            throw new Error('El monto pagado debe ser un número positivo mayor que cero.');
        }



        // Llama al servicio para realizar el pago de moras y cuotas
        const resultado = await PayMoraCuota(idMora, idPrestamo, idCuota, montoPagado);

        if (resultado) {
            // Envía una respuesta exitosa si el pago se realizó correctamente
            res.json({ message: 'Pago realizado exitosamente!', result: 'success' });
        }else{
            res.json({ message: 'Error al realizar el pago!', result: 'error' });
        }


    } catch (error) {
        // Maneja cualquier error que pueda ocurrir durante el proceso de pago
        console.error('Error en payMoraCuotaController:', error);
        res.status(500).json({ error: 'Se produjo un error al procesar el pago de moras y cuotas' });
    }
}



