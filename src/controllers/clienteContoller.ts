import { Request, Response } from "express";
import { createClientes,  getAllClientes, getClienteById, getClienteByIdentificacion, markClienteAsDeleted, updateCliente } from "../services/clienteService";
import { handleError } from "../utility/handleError";


/**
 * Obtener todos los clientes de una sucursal.
 * @route GET /api/v1/clientes/sucursal/:id
 */
export const obtenerClientes = async (req: Request, res: Response): Promise<void> => {
    try {
        const idSucursal: number = parseInt(req.params.id);
        const clientes = await getAllClientes(idSucursal);
        res.status(200).json(clientes);
    } catch (error: any) {
        handleError(res, error);
    }
}

/**
 * Crear un nuevo cliente en una sucursal específica.
 * @route POST /api/v1/clientes/sucursal/:id
 */
export const crearClientes = async (req: Request, res: Response): Promise<void> => {
    try {
        const clienteData = req.body;
        const idSucursal: number = parseInt(req.params.id);
        const clienteCreado = await createClientes(idSucursal, clienteData);
        res.status(200).json(clienteCreado);
    } catch (error: any) {
        handleError(res, error);
    }
}

/**
 * Actualizar un cliente por su ID.
 * @route PUT /api/v1/clientes/:id
 */
export const actualizarCliente = async (req: Request, res: Response): Promise<void> => {
    try {
        const idCliente: number = parseInt(req.params.id);
        const clienteData = req.body;
        const clienteActualizado = await updateCliente(idCliente, clienteData);
        res.status(200).json(clienteActualizado);
    } catch (error: any) {
        handleError(res, error);
    }
}


/**
 * Obtener un cliente por su ID.
 * @route GET /api/v1/clientes/:id
 */
export const obtenerClientelPorId = async (req: Request, res: Response): Promise<void> => {
    try {
        const idCliente: number = parseInt(req.params.id);
        const cliente = await getClienteById(idCliente);
        res.status(200).json(cliente);
    } catch (error) {
        handleError(res, error);
    }
}


/**
 * Obtener un cliente por su ID.
 * @route GET /api/v1/clientes/:identificacion
 */
export const obtenerClienteByIdentificacion = async (req: Request, res: Response): Promise<void> => {
    try {
        const identificacion: string = req.params.identificacion;
        const idSucursal: number = parseInt(req.params.id);
        
        const cliente = await getClienteByIdentificacion(idSucursal, identificacion);
        res.status(200).json(cliente);
    } catch (error) {
        handleError(res, error);
    }
}


export const markClienteAsDeletedController = async (req: Request, res: Response): Promise<void> => {
    const idCliente: number = parseInt(req.params.id);
               
    try {
        const success = await markClienteAsDeleted(idCliente);

        if (success === true) {
            res.status(200).json({ message: `Se marcó como eliminado correctamente el cliente con ID ${idCliente}.`, response: 'success' });
        } else {
            res.json({ message: `El cliente id ${idCliente}, no se puede eliminar.`, response: 'failure'  });
        }
    } catch (error) {
        console.error('Error al marcar como eliminado el cliente:', error);
        res.status(500).json({ message: 'Se produjo un error al intentar marcar como eliminado el cliente.' });
    }
};


