import { Response } from "express";

/**
 * Función para manejar errores y enviar una respuesta de error al cliente.
 * @param {Response} res - Objeto de respuesta de Express.
 * @param {any} error - Objeto de error que se produjo.
 * @returns {void}
 */
export const handleError = (res: Response, error: any): void => {
    // Registra el error en la consola para su seguimiento
    console.error(`Error: ${error.message}`);

    // Envía una respuesta de error al cliente con un código de estado 500
    res.status(500).json({ message: 'Error interno en el servidor' });
};
