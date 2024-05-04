//cuotaService

import { Op, Transaction, literal, } from "sequelize";
import { sequelize } from "../config/sequelize.config";
import { Cuota, EstadoPago } from "../models/cuota";
import { Prestamo } from "../models/prestamo";
import { frecuenciaDiaria, frecuenciaMensual, frecuenciaQuincenal, frecuenciaSemanal, frecuenciaUltimoDiaMensual } from "../utility/generarFechas";
import { RRule } from "rrule";
import { createHistorialPago } from "./historialPagoService";
import { HistorialPago } from '../models/historialPago';
import { Cliente } from '../models/cliente';
import { DetallePago } from "../models/detallePago";
import { createDetallePago } from "./detallePagoService";
import { findPrestamoById } from "./prestamoService";
import { Frecuencia } from "../models/frecuenciaPago";
import { obtenerPrestamoPorId } from "../controllers/prestamoContoller";
import { Mora } from "../models/mora";

interface CuotaInfo {
    idPrestamo: number;
    cuota: number;
    tiempo: number;
    fechaInicioPago: Date;
    descripcionFrecuencia: string;
    diaDelMesEnNumero: number;
    nombreDiaSemana: string;
    cadaCuantosDias: number;
    idSucursal: number;
}

/**
 * Obtener todas las cuotas.
 * @returns Una Promesa que se resuelve en un array de objetos Cuota representando todas las cuotas.
 */
export const getAllCuotas = async (idPrestamo: number): Promise<Cuota[]> => {
    try {
        const cuotas = await Cuota.findAll({
            where: { idPrestamo, deleted: false, }
        });
        return cuotas;
    } catch (error) {
        throw new Error(`Error al obtener las cuotas: ${error}`);
    }
}

/**
 * Buscar una cuota por su ID.
 * @param idCuota - El ID de la cuota que se desea obtener.
 * @returns Una Promesa que se resuelve en un objeto Cuota si se encuentra, o null si no se encuentra.
 */
export const getCuotaById = async (idCuota: number): Promise<Cuota | null> => {
    try {
        const cuota = await Cuota.findByPk(idCuota, {
            include: [
                {
                    model: Prestamo,
                    include: [
                        {
                            model: Cliente,
                            attributes: ['idCliente'] // Solo seleccionar el idCliente del cliente
                        }
                    ],
                    attributes: ['idPrestamo', 'idSucursal']

                }
            ],

        });


        return cuota;
    } catch (error) {
        throw new Error(`Error al buscar la cuota por ID: ${error}`);
    }
};

/**
 * Actualiza el estado y monto de una cuota en la base de datos.
 * @param idCuota - El ID de la cuota que se desea actualizar.
 * @param updatedData - Un objeto con los campos que se desean actualizar.
 * @throws {Error} Si no se encuentra la cuota con el ID especificado.
 * @throws {Error} Si ocurre un error durante la actualización.
 * @returns {Promise<void>} Una promesa que se resuelve cuando la actualización se completa.
 */

export const updateCuota = async (idCuota: number, updatedData: Partial<Cuota>, transaction?: Transaction): Promise<void> => {
    try {
        const options = transaction ? { transaction } : {};

        await Cuota.update(updatedData, {
            where: { idCuota },
            returning: true,
            ...options, // Agregar opciones de transacción si se proporciona
        });

    } catch (error) {
        // Si ocurre un error durante la actualización, lanzar un nuevo error con un mensaje descriptivo
        throw new Error(`Error al actualizar la cuota: ${error}`);
    }
}


export const getCuotasVencidasPorPrestamo = async (idPrestamo: number): Promise<Cuota[]> => {
    const fechaActual = new Date(); // Fecha actual
    fechaActual.setHours(fechaActual.getHours() - 4);
    fechaActual.setUTCHours(0, 0, 0, 0); // Establecemos la hora UTC a 00:00:00:000



    try {
        const cuotasVencidas = await Cuota.findAll({
            where: {
                idPrestamo, 
                deleted: false,
                fechaCuota: { [Op.lt]: fechaActual },
                [Op.or]: [
                    { estado: EstadoPago.Pendiente },
                    { estado: EstadoPago.PagoParcial },
                    { estado: EstadoPago.Vencido }
                ]
            },
            /*include: [{
                model: Prestamo,
                include:[{
                    model: Cliente,
                    attributes:['idCliente', 'identificacion', 'primerNombre', 'apellidoPaterno', 'telefono' ]
                }],
                attributes:['idPrestamo'],
                
            }]*/
        });

        return cuotasVencidas;
    } catch (error) {
        throw new Error(`Error al obtener las cuotas vencidas por el préstamo ${idPrestamo}: ${error}`);
    }
};



export const createCuotas = async (idPrestamo: number): Promise<Cuota[]> => {
    try {
        // Validación de entrada
        /*if (!Number.isInteger(cadaCuantosDias) || cadaCuantosDias <= 0) {
            throw new Error('Valor no válido para cantidad.');
        }*/

        // Verificar si ya existen cuotas para el préstamo
        const cuotas = await Cuota.findAll({ where: { idPrestamo, deleted: false } });
        if (cuotas.length > 0) {
            throw new Error(`Error: El préstamo ya tiene ${cuotas.length} cuotas.`);
        }

        // Obtener información del préstamo
        const prestamo = await findPrestamoById(idPrestamo);
        
        
        if (!prestamo) {
            throw new Error(`Error: No se encontró el préstamo con ID ${idPrestamo}.`);
        }

        const { cuota, tiempo, fechaInicioPago, idSucursal } = prestamo.dataValues;
        const frecuenciaPago = prestamo?.toJSON().detalleFrecuencia[0];

        const cadaCuantosDias = frecuenciaPago.cadaCuantosDias;
        const diaDelMesEnNumero = frecuenciaPago.diaDelMesEnNumero;
        const nombreDiaSemana = frecuenciaPago.nombreDiaSemana;
        const descripcionFrecuencia = frecuenciaPago.frecuenciaPago.descripcion;

        // Utilizar una función auxiliar para la generación de cuotas
        const cuotasCreadas = await generarCuotas({ idPrestamo, idSucursal, cuota, tiempo, fechaInicioPago, descripcionFrecuencia, cadaCuantosDias, diaDelMesEnNumero, nombreDiaSemana });


        return cuotasCreadas;
    } catch (error: any) {
        throw new Error(`Error al crear las cuotas: ${error.message || error}`);
    }
};


const generarCuotas = async ({ idPrestamo, idSucursal, cuota, tiempo, fechaInicioPago, descripcionFrecuencia, cadaCuantosDias, diaDelMesEnNumero, nombreDiaSemana }: CuotaInfo): Promise<Cuota[]> => {
    /**
     * Array para almacenar las cuotas creadas.
     * @type {Cuota[]}
     */
    const cuotasCreadas: Cuota[] = [];

    /**
     * Fecha inicial para las cuotas.
     * @type {Date}
     */
    let fechaCuota = new Date(fechaInicioPago);

    /**
     * Variable para almacenar las reglas de recurrencia.
     * @type {RRule | undefined}
     */
    let fechas: RRule | undefined;


    // Determina las fechas de cuotas según la frecuencia seleccionada
    switch (descripcionFrecuencia) {
        case Frecuencia.Diario:
            fechas = frecuenciaDiaria(fechaInicioPago, tiempo, cadaCuantosDias);
            break;
        case Frecuencia.Semanal:
            fechas = frecuenciaSemanal(fechaInicioPago, tiempo, nombreDiaSemana);
            break;
        case Frecuencia.Quincenal:
            fechas = frecuenciaQuincenal(fechaInicioPago, tiempo);
            break;
        case Frecuencia.Mensual:
            fechas = frecuenciaMensual(fechaInicioPago, tiempo, diaDelMesEnNumero); //tengo que sumarle uno porque la fecha al momento de guardar le resta un dia.
            break;
        default:
            throw new Error('Frecuencia de cuota no reconocida');
    }

    // Verifica si se obtuvieron las reglas de recurrencia
    if (!fechas) {
        throw new Error('Error al obtener la regla de recurrencia');
    }

    // Obtiene todas las fechas de cuotas según las reglas de recurrencia
    const fechasCuotas = fechas.all();


    // Crea cada cuota y la agrega al array
    for (let numeroCuota = 1; numeroCuota <= tiempo; numeroCuota++) {
        fechaCuota = new Date(fechasCuotas[numeroCuota - 1]);
        //pruebas 
        //const mes_siguiente = fechaCuota.getMonth()
        //const mi_fecha = new Date(`${fechaCuota.getDay()}/${mes_siguiente}/${fechaCuota.getFullYear()}`)
        //pruebas 

        // Crea una nueva cuota con la información proporcionada
        const nuevaCuota: Cuota = {
            numeroCuota,
            fechaCuota,
            montoCuota: cuota,
            estado: 'Pendiente',
            idPrestamo,
            idSucursal,
        } as Cuota;

        try {

            const cuotaCreada = await Cuota.create(nuevaCuota);

            cuotasCreadas.push(cuotaCreada);
        } catch (error) {
            // Maneja errores específicos de creación de cuotas
            console.error('Error al crear cuota:', error);
            throw new Error('Error al crear las cuotas');
        }
    }

    // Devuelve el array de cuotas creadas

    return cuotasCreadas;
};


export const markCuotasForPrestamoAsDeleted = async (idPrestamo: number): Promise<boolean> => {

    const transaction = await sequelize.transaction();
    try {

        // Marcar todas las cuotas asociadas al préstamo como eliminadas dentro de la transacción
        const cuotas = await Cuota.findAll({ where: { idPrestamo }, transaction });

        /*if(cuotas.){
                no se deberia marcar como eliminada una cuota que tenga ya algun pago realizado.
        }*/




        await Promise.all(cuotas.map(async cuota => {
            await cuota.update({ deleted: true }, { transaction });

            // Marcar los detalles de pago asociados como eliminados
            const detallesPago = await DetallePago.findAll({ where: { idCuota: cuota.dataValues.idCuota }, transaction });
            await Promise.all(detallesPago.map(async detalle => {
                await detalle.update({ deleted: true }, { transaction });
            }));

            // Obtener los IDs de los historiales de pago asociados a los detalles de pago marcados como eliminados
            const historialesPagoIds = detallesPago.map(detalle => detalle.dataValues.idHistorialPago);

            // Marcar como eliminados los historiales de pago asociados
            await HistorialPago.update({ deleted: true }, { where: { idHistorialPago: historialesPagoIds }, transaction });

            // Marcar las moras asociadas como eliminadas
            const moras = await Mora.findAll({ where: { idCuota: cuota.dataValues.idCuota }, transaction });
            await Promise.all(moras.map(mora => {
                return mora.update({ deleted: true }, { transaction });
            }));
        }));

       // console.log('Commit de la transacción');
        // Commit de la transacción si todas las operaciones tienen éxito
        await transaction.commit();

        return true;
    } catch (error) {
        console.error('Error al marcar como eliminadas las cuotas del préstamo:', error);
        // Rollback de la transacción si hay algún error
        await transaction.rollback();
        console.log('Transacción revertida debido a un error');
        throw new Error('Error al marcar como eliminadas las cuotas del préstamo');
    }
};



export const getCuotasVencenHoy = async (idSucursal: number): Promise<Cuota[]> => {
    try {
        const fechaActual = new Date(); // Fecha actual
        fechaActual.setHours(fechaActual.getHours() - 4);
        fechaActual.setUTCHours(0, 0, 0, 0); // Establecemos la hora UTC a 00:00:00:000

        // Calcular la fecha final del día actual (23:59:59:999)
        const fechaFinal = new Date(fechaActual.getTime() + (24 * 60 * 60 * 1000) - 1);


        // Consulta de las cuotas que vencen hoy
        const cuotas = await Cuota.findAll({
            where: {
                // Utilizamos el operador [Op.between] para encontrar cuotas que estén entre
                // el inicio y el final del día actual
                fechaCuota: {
                    [Op.between]: [fechaActual, fechaFinal]
                },
                idSucursal,
                deleted: false,
                estado: {
                    [Op.not]: EstadoPago.Pagado // Excluir las cuotas con estado "pagado"
                }

            },
            include: [
                {
                    model: Prestamo,
                    include: [{ model: Cliente }]
                }
            ]
        });

        return cuotas;
    } catch (error: any) {
        throw new Error(`Error al intentar obtener las cuotas que vencen hoy: ${error}`);
    }
};











