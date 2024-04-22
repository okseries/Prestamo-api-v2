import { NextFunction, Request, Response } from "express";

// Middleware para limpiar token antes de iniciar sesión
export const limpiarTokenYSesion = (req: Request, res: Response, next: NextFunction) => {
    // Verificar si hay un token en el encabezado de autorización
    console.log('******************************************************************');
    
    console.log('Middleware limpiarTokenYSesion en acción');
    if (req.headers['authorization']) {
        const token = req.headers['authorization'].split(' ')[1]; // Extraer el token
        
        // Si se encontró un token, imprimirlo
        if (token) {
            console.log('Token encontrado:', token);
        } else {
            console.log('No se encontró ningún token en el encabezado de autorización.');
        }
    } else {
        console.log('No se encontró ningún encabezado de autorización en la solicitud.');
    }

    // Continuar con el siguiente middleware
    next();
}
