import { Sucursal } from "../models/sucursal";

/**
 * Obtiene todas las sucursales.
 * @returns {Promise<Sucursal[]>} Una promesa que resuelve en un array de objetos Sucursal.
 * @throws {Error} Se lanza un error si hay algún problema al obtener las sucursales.
 */
export const getAllSucursal = async (): Promise<Sucursal[]> => {
    try {
        const sucursales = await Sucursal.findAll();
        return sucursales;
    } catch (error:any) {
        throw new Error(`Error al obtener las sucursales: ${error.message}`);
    }
}

/**
 * Obtiene una sucursal por su ID.
 * @param {number} idSucursal - El ID de la sucursal a buscar.
 * @returns {Promise<Sucursal | null>} Una promesa que resuelve en un objeto Sucursal o null si no se encuentra.
 * @throws {Error} Se lanza un error si hay algún problema al obtener la sucursal por ID.
 */
export const getSucursalById = async (idSucursal: number): Promise<Sucursal | null> => {
    try {
        const sucursal = await Sucursal.findByPk(idSucursal);
        return sucursal;
    } catch (error: any) {
        throw new Error(`Error al obtener sucursal por ID ${idSucursal}: ${error.message}`);
    }
}

/**
 * Crea una nueva sucursal.
 * @param {Sucursal} sucursalData - Los datos de la sucursal a crear.
 * @returns {Promise<Sucursal>} Una promesa que resuelve en la sucursal recién creada.
 * @throws {Error} Se lanza un error si hay algún problema al crear la sucursal.
 */
export const createSucursal = async (sucursalData: Sucursal): Promise<Sucursal> => {
    try {
        const sucursalCreada = await Sucursal.create(sucursalData);
        return sucursalCreada;
    } catch (error: any) {
        throw new Error(`Error al crear la sucursal: ${error.message}`);
    }
}

/**
 * Actualiza una sucursal existente por su ID.
 * @param {number} idSucursal - El ID de la sucursal a actualizar.
 * @param {Partial<Sucursal>} updatedData - Los datos actualizados de la sucursal.
 * @returns {Promise<[number, Sucursal[]]>} Una promesa que resuelve en un array con el número de filas actualizadas y las sucursales actualizadas.
 * @throws {Error} Se lanza un error si hay algún problema al actualizar la sucursal.
 */
export const updateSucursal = async (idSucursal: number, updatedData: Partial<Sucursal>): Promise<[number, Sucursal[]]> => {
    try {
        const [updatedRowCount, updatedSucursales] = await Sucursal.update(updatedData, {
            where: { idSucursal },
            returning: true,
        });
        
        return [updatedRowCount, updatedSucursales];
    } catch (error: any) {
        throw new Error(`Error al actualizar la sucursal: ${error.message}`);
    }
}

/**
 * Elimina una sucursal por su ID.
 * @param {number} idSucursal - El ID de la sucursal a eliminar.
 * @returns {Promise<number>} Una promesa que resuelve en el número de filas eliminadas.
 * @throws {Error} Se lanza un error si hay algún problema al eliminar la sucursal.
 */
export const deleteSucursal = async (idSucursal: number): Promise<number> => {
    try {
        const deletedRowCount = await Sucursal.destroy({
            where: { idSucursal },
        });
        return deletedRowCount;
    } catch (error: any) {
        throw new Error(`Error al eliminar la sucursal: ${error.message}`);
    }
}
