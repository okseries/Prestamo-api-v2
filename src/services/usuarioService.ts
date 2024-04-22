import { Usuario } from "../models/usuario";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

/**
 * Obtener todos los usuarios pertenecientes a una Sucursal específica.
 * @param idSucursal - El ID de la Sucursal para la cual se obtienen los usuarios.
 * @returns Una Promesa que se resuelve en un array de objetos Usuario que representan a los usuarios.
 */
export const getAllUsuarios = async (idSucursal: number): Promise<Usuario[]> => {
    try {
        const usuarios = await Usuario.findAll({
            where: { idSucursal }
        });
        return usuarios;
    } catch (error) {
        throw new Error(`Error al obtener los usuarios: ${error}`);
    }
}

/**
 * Obtener un usuario por su ID.
 * @param idUsuario - El ID del usuario que se desea obtener.
 * @returns Una Promesa que se resuelve en un objeto Usuario si se encuentra, o null si no se encuentra.
 */
/*export const getUsuarioById = async (idUsuario: number): Promise<Usuario | null> => {
    try {
        // Buscar un usuario por su ID
        const usuario = await Usuario.findByPk(idUsuario);
        return usuario;
    } catch (error: any) {
        throw new Error(`Error al obtener el usuario por ID  hola que tal?: ${error.message}`);
    }
}*/

/**
 * Crear un nuevo Usuario.
 * @param usuarioData - Datos para crear el nuevo Usuario.
 * @returns Una Promesa que se resuelve en el Usuario creado.
 */
export const createUsuarios = async (usuarioData: Usuario): Promise<Usuario> => {
    try {
        const usuario = new Usuario(usuarioData);
        await usuario.save(); // Guardar el usuario primero

        // La contraseña se encripta automáticamente en el setter

        return usuario;
    } catch (error) {
        throw new Error(`Error al crear los usuarios: ${error}`);
    }
}

/**
 * Iniciar sesión de un usuario según el correo electrónico y la contraseña proporcionados.
 * @param usuarioCorreo - Correo electrónico del usuario.
 * @param clave - Contraseña del usuario.
 * @returns Una Promesa que se resuelve en un token JWT al iniciar sesión correctamente, o null si la sesión no es exitosa.
 */
export const login = async (usuarioCorreo: string, clave: string): Promise<string | null> => {
    try {
        // Buscar al usuario por correo electrónico y contraseña
        const usuario = await Usuario.findOne({
            where: {
                usuarioCorreo,
                clave,
            }
        });


        // Verificar si el usuario existe
        if (!usuario) {
            throw new Error("Nombre de usuario o contraseña incorrectos");
        }

        // Generar y devolver el token JWT con el ID de la sucursal
        const token = jwt.sign({
            idSucursal: usuario.dataValues.idSucursal,
            nombre: usuario.dataValues.nombre,
            usuarioCorreo: usuario.dataValues.usuarioCorreo
        }, "secreto", { expiresIn: "10h" });
        console.log('Token generado:', token);

        // Agregar esto después de la firma para imprimir la información decodificada
        const decodedToken = jwt.decode(token);

        return token;
    } catch (error: any) {
        throw new Error(`Error al iniciar sesión: ${error.message}`);
    }
};

/**
 * Eliminar un usuario según el ID de usuario proporcionado.
 * @param idUsuario - El ID del usuario que se va a eliminar.
 * @returns Una Promesa que se resuelve en el número de filas eliminadas.
 */
export const deleteUsuario = async (idUsuario: number): Promise<number> => {
    try {
        const deletedRowCount = await Usuario.destroy({
            where: { idUsuario },
        });
        return deletedRowCount;
    } catch (error) {
        throw new Error(`Error al eliminar el usuario: ${error}`);
    }
}

/**
 * Actualizar un usuario según el ID de usuario y los datos actualizados proporcionados.
 * @param idUsuario - El ID del usuario que se va a actualizar.
 * @param updatedData - Datos actualizados del usuario.
 * @returns Una Promesa que se resuelve en un array, donde el primer elemento es el número de filas actualizadas
 * y el segundo elemento es un array de los usuarios actualizados.
 */
export const updateUsuario = async (idUsuario: number, updatedData: Partial<Usuario>): Promise<[number, Usuario[]]> => {
    try {
        const [updatedRowCount, updatedCUsuarios] = await Usuario.update(updatedData, {
            where: { idUsuario },
            returning: true,
        });
        return [updatedRowCount, updatedCUsuarios];
    } catch (error) {
        throw new Error(`Error al actualizar el usuario: ${error}`);
    }
}
