import { Op } from "sequelize";
import { Cliente } from "../models/cliente";
import { Cuota, EstadoPago } from "../models/cuota";
import { DetalleFrecuencia } from "../models/detalleFrecuenciaPago";
import { FrecuenciaPago } from "../models/frecuenciaPago";
import { Prestamo } from "../models/prestamo";
import { Sucursal } from "../models/sucursal";
import { Mora } from "../models/mora";
import { DetallePago } from "../models/detallePago";
import { HistorialPago } from "../models/historialPago";
import { sequelize } from "../config/sequelize.config";

/**
 * Obtener todos los préstamos de una sucursal, incluyendo información de cliente y cuotas asociadas.
 * @param idSucursal - El ID de la sucursal para la cual se obtienen los préstamos.
 * @returns Una Promesa que se resuelve en un array de objetos Prestamo representando a los préstamos con información adicional.
 */
export const getAllPrestamos = async (idSucursal: number): Promise<Prestamo[]> => {
    try {
        const prestamos = await Prestamo.findAll({
            where: { idSucursal, deleted: false },
            include: [
                {
                    model: DetalleFrecuencia,
                    include: [{ model: FrecuenciaPago }]
                },
                {
                    model: Cliente
                },
                {
                    model: Cuota
                }
            ]
        });

        // Obtener solo las cuotas no eliminadas para cada préstamo
        await Promise.all(prestamos.map(async (prestamo) => {
            const cuotas = await Cuota.findAll({
                where: { idPrestamo: prestamo.dataValues.idPrestamo, deleted: false },
                include: [
                    { model: Mora, where: { pagada: false }, required: false }
                ]
            });
            prestamo.setDataValue('cuotas', cuotas); // Agregar las cuotas al objeto de préstamo
        }));



        return prestamos;
    } catch (error) {
        throw new Error(`Error al obtener los préstamos: ${error}`);
    }
}

/**
 * Buscar un préstamo por su ID.
 * @param idPrestamo - El ID del préstamo que se desea obtener.
 * @returns Una Promesa que se resuelve en un objeto Prestamo si se encuentra, o null si no se encuentra.
 */
export const findPrestamoById = async (idPrestamo: number): Promise<Prestamo | null> => {
    try {
        const prestamo = await Prestamo.findByPk(
            idPrestamo,
            {
                include: [
                    {
                        model: DetalleFrecuencia, // Incluir el modelo DetalleFrecuencia
                        include: [{ model: FrecuenciaPago }] // Incluir el modelo FrecuenciaPago dentro de DetalleFrecuencia
                    },
                    {
                        model: Cliente,
                    },
                    {
                        model: Cuota,

                    },
                    {
                        model: Sucursal,
                    }
                ]
            }
        );

        if (!prestamo) {
            return null; // Si no se encontró el préstamo, devolver null
        }

        // Obtener solo las cuotas no eliminadas para cada préstamo
        const cuotas = await Cuota.findAll({
            where: { idPrestamo, deleted: false },
            include: [
                { model: Mora },
                {
                    model: DetallePago,
                    include: [
                        { model: HistorialPago }
                    ]
                }
            ]
        });

        prestamo.setDataValue('cuotas', cuotas); // Agregar las cuotas al objeto de préstamo   


        return prestamo;
    } catch (error) {
        throw new Error(`Error al buscar el préstamo por ID: ${error}`);
    }
}


/**
 * Crear un nuevo préstamo en una sucursal específica.
 * @param idSucursal - El ID de la sucursal en la que se crea el préstamo.
 * @param prestamoData - Datos del préstamo a crear.
 * @returns Una Promesa que se resuelve en el préstamo creado.
 */
export const createPrestamos = async (idSucursal: number, bodyData: any): Promise<Prestamo> => {
    const transaction = await sequelize.transaction();
    try {
        // Validación de datos de entrada
        if (!idSucursal || typeof idSucursal !== 'number' || !bodyData || typeof bodyData !== 'object') {
            throw new Error("Los datos de entrada no son válidos.");
        }

        // Desestructurar bodyData y excluir propiedades no deseadas
        const { idFrecuencia, cadaCuantosDias, diaDelMesEnNumero, nombreDiaSemana, ...restData } = bodyData;

        const idFrecuenciaNum = parseInt(idFrecuencia, 10);
        const cadaCuantosDiasNum = cadaCuantosDias !== '' ? parseInt(cadaCuantosDias, 10) : null;
        const diaDelMesEnNumeroNum = diaDelMesEnNumero !== '' ? parseInt(diaDelMesEnNumero, 10) : null;
        // Asignar idSucursal
        restData.idSucursal = idSucursal;

        // Crear préstamo dentro de la transacción
        const prestamoCreado = await Prestamo.create(restData, { transaction });

        // Crear detalle de frecuencia de pago dentro de la transacción
        const detalleFrecuencia: DetalleFrecuencia = {
            idPrestamo: prestamoCreado.idPrestamo,
            idFrecuencia: idFrecuenciaNum,
            cadaCuantosDias: cadaCuantosDiasNum,
            diaDelMesEnNumero: diaDelMesEnNumeroNum,
            nombreDiaSemana,
        } as DetalleFrecuencia;


        await DetalleFrecuencia.create(detalleFrecuencia, { transaction });

        // Commit de la transacción si todas las operaciones son exitosas
        await transaction.commit();

        return prestamoCreado;
    } catch (error: any) {
        // Rollback de la transacción en caso de error
        await transaction.rollback();
        throw new Error(`Error al crear los préstamos: ${error.message}`);
    }
};


/**
 * Actualizar un préstamo por su ID.
 * @param idPrestamo - El ID del préstamo que se va a actualizar.
 * @param updatedData - Datos actualizados del préstamo.
 * @returns Una Promesa que se resuelve en un array, donde el primer elemento es el número de filas actualizadas
 * y el segundo elemento es un array de los préstamos actualizados.
 */
export const updatePrestamo = async (idPrestamo: number, updatedData: Partial<any>): Promise<[number, Prestamo[]]> => {
    try {
        const [updatedRowCount, updatedPrestamos] = await Prestamo.update(updatedData, {
            where: { idPrestamo },
            returning: true,
        });

        const { idFrecuencia, cadaCuantosDias, diaDelMesEnNumero, nombreDiaSemana } = updatedData;

        const idFrecuenciaNum = parseInt(idFrecuencia, 10);
        const cadaCuantosDiasNum = cadaCuantosDias !== '' ? parseInt(cadaCuantosDias, 10) : null;
        const diaDelMesEnNumeroNum = diaDelMesEnNumero !== '' ? parseInt(diaDelMesEnNumero, 10) : null;

        const DetalleFrecuenciaData: DetalleFrecuencia = {
            idFrecuencia: idFrecuenciaNum,
            cadaCuantosDias: cadaCuantosDiasNum,
            diaDelMesEnNumero: diaDelMesEnNumeroNum,
            nombreDiaSemana,
        } as DetalleFrecuencia;

        await DetalleFrecuencia.update(DetalleFrecuenciaData, {
            where: { idPrestamo }
        });
        

        return [updatedRowCount, updatedPrestamos];
    } catch (error) {
        throw new Error(`Error al actualizar el préstamo: ${error}`);
    }
}




export const getAllPrestamosConCuotasVencidas = async (idSucursal: number): Promise<Prestamo[]> => {
    try {
        const fechaActual: Date = new Date();
        fechaActual.setHours(fechaActual.getHours() - 4);

        fechaActual.setUTCHours(0, 0, 0, 0); // Establecemos la hora UTC a 00:00:00:000
        //fechaActual.setUTCDate(fechaActual.getUTCDate() - 1);

        const prestamos = await Prestamo.findAll({
            where: { idSucursal },
            include: [
                {
                    model: DetalleFrecuencia,
                    include: [{ model: FrecuenciaPago }]
                },
                {
                    model: Cliente
                },
                {
                    model: Cuota,
                    where: {
                        fechaCuota: { [Op.lt]: fechaActual },
                        deleted: false,
                        [Op.or]: [
                            { estado: EstadoPago.Pendiente },
                            { estado: EstadoPago.PagoParcial },
                            { estado: EstadoPago.Vencido },
                        ]
                    },
                }
            ]
        });


        return prestamos;
    } catch (error) {
        throw new Error(`Error al obtener los préstamos: ${error}`);
    }
}


export const markPrestamoAsDeleted = async (idPrestamo: number): Promise<boolean> => {

    const transaction = await sequelize.transaction();
    try {
        const prestamo = await Prestamo.findByPk(idPrestamo, {transaction});

        if (prestamo?.dataValues.cuota) {
            return false
        }

        await Prestamo.update({ deleted: true }, { where: { idPrestamo }, transaction });
        await DetalleFrecuencia.update({ deleted: true }, { where: { idPrestamo }, transaction });
       
        await transaction.commit();
        return true;
    } catch (error) {
        console.error('Error al marcar como eliminado el préstamo:', error);
        // Rollback de la transacción si hay algún error
        await transaction.rollback();
        throw new Error('Error al marcar como eliminados el préstamo y sus detalles');
    }
};