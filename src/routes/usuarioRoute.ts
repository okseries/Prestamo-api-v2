import { Router } from "express";
import { actualizarusuario, crearUsuarios, eliminarUsuario, iniciarSesion, /*obtenerUsuarioPorID,*/ obtenerUsuarios } from "../controllers/usuarioContoller";

// Crear una instancia de Router de Express
export const router = Router();

/**
 * Endpoint para obtener todos los usuarios de una sucursal.
 * @route GET /api/v1/clientes/sucursal/:id
 */
router.get('/sucursal/:id', obtenerUsuarios);

/**
 * Endpoint para obtener un usuario por su ID.
 * @route GET /api/v1/usuarios/:id
 */
//router.get('/:id', obtenerUsuarioPorID);

/**
 * Endpoint para actualizar un usuario por su ID.
 * @route PUT /api/v1/usuarios/:id
 */
router.put('/:id', actualizarusuario);

/**
 * Endpoint para eliminar un usuario por su ID.
 * @route DELETE /api/v1/usuarios/:id
 */
router.delete('/:id', eliminarUsuario);

/**
 * Endpoint para crear un nuevo usuario en una sucursal específica.
 * @route POST /api/v1/usuarios/sucursal/:id
 */
router.post('/sucursal/:id', crearUsuarios);

/**
 * Endpoint para iniciar sesión de un usuario.
 * @route POST /api/v1/usuarios/login
 */
router.post('/login', iniciarSesion);

// Fin de las rutas de usuarios
