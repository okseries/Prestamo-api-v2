import { Cliente } from "../models/cliente";
import { Prestamo } from "../models/prestamo";

/**
 * Obtener todos los clientes de una sucursal.
 * @param idSucursal - El ID de la sucursal para la cual se obtienen los clientes.
 * @returns Una Promesa que se resuelve en un array de objetos Cliente representando a los clientes.
 */
export const getAllClientes = async (idSucursal: number): Promise<Cliente[]> => {
    try {
        const clientes = await Cliente.findAll({
            where: { idSucursal, deleted: false }
        });
        return clientes;
    } catch (error) {
        throw new Error(`Error al obtener los clientes: ${error}`);
    }
}

/**
 * Crear un nuevo cliente en una sucursal específica.
 * @param idSucursal - El ID de la sucursal en la que se crea el cliente.
 * @param clienteData - Datos del cliente a crear.
 * @returns Una Promesa que se resuelve en el Cliente creado.
 */
export const createClientes = async (idSucursal: number, clienteData: Cliente): Promise<Cliente> => {
    try {
        clienteData.idSucursal = idSucursal;
        const clienteCreado = await Cliente.create(clienteData);
        return clienteCreado;
    } catch (error) {
        throw new Error(`Error al crear el cliente: ${error}`);
    }
}

/**
 * Actualizar un cliente por su ID.
 * @param idCliente - El ID del cliente que se va a actualizar.
 * @param updatedData - Datos actualizados del cliente.
 * @returns Una Promesa que se resuelve en un array, donde el primer elemento es el número de filas actualizadas
 * y el segundo elemento es un array de los clientes actualizados.
 */
export const updateCliente = async (idCliente: number, updatedData: Partial<Cliente>): Promise<[number, Cliente[]]> => {
    try {
        const [updatedRowCount, updatedClientes] = await Cliente.update(updatedData, {
            where: { idCliente },
            returning: true,
        });
        return [updatedRowCount, updatedClientes];
    } catch (error) {
        throw new Error(`Error al actualizar el cliente: ${error}`);
    }
}


export const markClienteAsDeleted = async (idCliente: number): Promise<boolean> => {
    try {

        const prestamosCliente = await Prestamo.findAll({
            where:{idCliente, estado: true}
        });

        if (prestamosCliente.length > 0) {
            return false;
        }


        const cliente = await Cliente.findByPk(idCliente);
        if (cliente) {
            await cliente.update({ deleted: true });
            return true;
        }
        return false; // Cliente no encontrado
    } catch (error) {
        console.error('Error al marcar como eliminado el cliente:', error);
        throw new Error('Error al marcar como eliminado el cliente');
    }
};



/**
 * Obtener un cliente por su ID.
 * @param idCliente - El ID del cliente que se desea obtener.
 * @returns Una Promesa que se resuelve en un objeto Cliente si se encuentra, o null si no se encuentra.
 */
export const getClienteById = async (idCliente: number): Promise<Cliente | null> => {
    try {
        const cliente = await Cliente.findByPk(idCliente);
        return cliente;
    } catch (error) {
        throw new Error(`Error al buscar el cliente por ID: ${error}`);
    }
}


export const getClienteByIdentificacion = async (idSucursal: number, identificacion: string): Promise<Cliente | null> => {
    try {
        const cliente = await Cliente.findOne(
            {where: {identificacion, idSucursal}}
            );
        return cliente;
    } catch (error) {
        throw new Error(`Error al buscar el cliente por su numero de identificacion: ${error}`);
    }
}
