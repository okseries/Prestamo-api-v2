import jwt from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";

// Define una interfaz extendida para el objeto de solicitud (Request)
interface AuthenticatedRequest extends Request {
  user?: any; // Define la propiedad user como opcional
}

const secretKey = 'secreto'; // Reemplaza esto con tu propia clave secreta

// Middleware de autenticación para verificar el token JWT
export const authenticateToken = (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  // Obtén el encabezado de autorización que contiene el token JWT
  const authHeader = req.headers['authorization'];

  // Extrae el token de autorización del encabezado
  const token = authHeader && authHeader.split(' ')[1];

  // Verifica si el token existe
  if (!token) {
    return res.status(401).send('Acceso denegado');
  }

  // Verifica el token JWT utilizando la clave secreta
  jwt.verify(token, secretKey, (err: any, user: any) => {
    // Registro: Imprimir cualquier error que ocurra al verificar el token
    if (err) {
      return res.status(403).send('Error al verificar el token');
    }    
    // Asigna el objeto de usuario al objeto de solicitud
    req.user = user;
    
    // Llama a la siguiente función de middleware
    next();
  });
}
