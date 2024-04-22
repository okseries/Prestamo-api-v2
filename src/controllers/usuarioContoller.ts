import { Request, Response } from "express";
import { createUsuarios, deleteUsuario, getAllUsuarios, /*getUsuarioById,*/ login, updateUsuario } from "../services/usuarioService";
import { handleError } from "../utility/handleError";



export const obtenerUsuarios = async (req: Request, res: Response): Promise<void>=>{
    try {
        const idSucursal: number = parseInt(req.params.id)
        const usuarios = await getAllUsuarios(idSucursal);
        res.status(200).json(usuarios);
    } catch (error: any) {
        handleError(res, error);
    }
}

/**
 * Obtener un usuario por su ID.
 * @param idUsuario - El ID del usuario que se desea obtener.
 * @returns Una Promesa que se resuelve en un objeto Usuario si se encuentra, o null si no se encuentra.
 */
/*export const obtenerUsuarioPorID = async (req: Request, res: Response): Promise<void> => {
    try {
        const idUsuario: number = parseInt(req.params.id);
        const usuario = await getUsuarioById(idUsuario);
        res.status(200).json(usuario);
    } catch (error) {
        handleError(res, error);
    }
}*/

export const crearUsuarios = async (req: Request, res: Response): Promise<void>=>{
    try {
        const usuarioData = req.body;
        usuarioData.idSucursal = req.params.id;
        const usuariosCreados = await createUsuarios(usuarioData);
        res.status(200).json(usuariosCreados);
    } catch (error: any) {
        handleError(res, error);
    }
}


export const iniciarSesion = async (req: Request, res: Response): Promise<void> => {
    try {
        // Obtener credenciales del cuerpo de la solicitud
        const { usuarioCorreo, clave } = req.body;

        // Llamar a la función de inicio de sesión desde el servicio de usuario
        const token = await login(usuarioCorreo, clave);

        // Devolver el token como respuesta
        res.status(200).json({ token });
    } catch (error: any) {
        handleError(res, error);
    }
};


export const eliminarUsuario = async (req: Request, res: Response): Promise<void> => {
    try {
        const idUsuario: number = parseInt(req.params.id);
        const usuarioEliminado = await deleteUsuario(idUsuario);
        res.status(200).json(usuarioEliminado);
    } catch (error) {
        handleError(res, error);
    }
}


export const actualizarusuario = async (req: Request, res: Response): Promise<void> => {
    try {
        const idUsuario: number = parseInt(req.params.id);
        const dataUsuario = req.body;
        const usuarioActualizado = await updateUsuario(idUsuario, dataUsuario);
        res.status(200).json(usuarioActualizado);
    } catch (error) {
        handleError(res, error);
    }
}
