//moraService
import { Cliente } from "../models/cliente";
import { Cuota, EstadoPago } from "../models/cuota";
import { Prestamo } from "../models/prestamo";
import { Mora } from "../models/mora";
import { findPrestamoById } from "./prestamoService";
import { Op } from "sequelize";

export const getAllMoras = async (): Promise<Mora[]> => {
    try {
        const moras = await Mora.findAll();
        return moras;
    } catch (error) {
        throw new Error(`Error al obtener las moras: ${error}`);
    }
};

export const getAllMorasDetalle = async (): Promise<Mora[]> => {
    try {
        const moras = await Mora.findAll({
            include: [
                {
                    model: Cuota,
                    include: [{
                        model: Prestamo,
                        include: [{ model: Cliente }]
                    }],
                },
            ],
        });
        return moras;
    } catch (error) {
        throw new Error(`Error al obtener las moras: ${error}`);
    }
};












//********************************************************************************************** */


export const createMoras = async (idsCuotas: number[]): Promise<boolean> => {
    try {
        const fechaActual = new Date();
        fechaActual.setUTCHours(0, 0, 0, 0);
        console.log(`Fecha actual: ${fechaActual.toISOString()}`);

        for (const idCuota of idsCuotas) {
            console.log(`Procesando cuota con ID ${idCuota}...`);
            const cuota = await Cuota.findByPk(idCuota);
            if (!cuota) {
                console.log(`La cuota con ID ${idCuota} no existe.`);
                continue;
            }

            const fechaVencimiento = cuota.dataValues.fechaCuota;
            const diasDeRetraso = calcularDiasDeRetraso(fechaActual, fechaVencimiento);
            console.log(`Días de retraso para cuota ${idCuota}: ${diasDeRetraso}`);

            const prestamo = await Prestamo.findByPk(cuota.dataValues.idPrestamo);
            const umbralDiasPago: number = prestamo?.dataValues.umbralDiasPago ?? 0;
            const porcentajeMora: number = prestamo?.dataValues.porcentajeMora ?? 0;

            console.log(prestamo);


            if (cuota.dataValues.estado === EstadoPago.Pagado) {
                throw new Error(`Cuota ${idCuota}: Está en estado Pagado, no se genera mora.`);
            }

            if (diasDeRetraso < umbralDiasPago) {
                throw new Error(`Cuota ${idCuota}: Está dentro del umbral de días para comenzar a generar mora.`);
                
            }

            console.log(`Cuota ${idCuota}: Días de retraso: ${diasDeRetraso}`);

            // Verificar si ya existe un registro de mora para la cuota en la fecha actual
            const moraExistente = await Mora.findOne({
                where: {
                    idCuota,
                    createdAt: {
                        [Op.gte]: fechaActual, // Buscar moras creadas hoy o después de hoy
                    }
                }
            });

            // Si ya existe un registro de mora para esta cuota en la fecha actual, no hacemos nada
            if (moraExistente) {
                throw new Error(`Ya existe un registro de mora para la cuota ${idCuota} en la fecha actual.`);
            }

            console.log(`Cuota ${idCuota}: Generando mora...`);
            const montoMora = await calcularMoraPorCuota(cuota.dataValues, diasDeRetraso, porcentajeMora);
            console.log(`Cuota ${idCuota}: Monto de mora calculado: ${montoMora}`);

            // Creamos un nuevo registro de mora
            await crearRegistroMora(cuota.dataValues, montoMora, umbralDiasPago, fechaActual);
            console.log(`Cuota ${idCuota}: Mora aplicada correctamente.`);
        }

        return true;
    } catch (error) {
        console.error(`Error al generar moras: ${error}`);
        throw new Error(`Error al generar moras: ${error}`);
    }
};

const crearRegistroMora = async (
    cuota: Cuota,
    montoMora: number,
    umbralDiasPago: number,
    fechaActual: Date
): Promise<void> => {
    const idCuota = cuota.idCuota;

    // Creamos un nuevo registro de mora
    const nuevaMoraData: Mora = {
        montoMora,
        idCuota,
        idSucursal: cuota.idSucursal,
        diasDeRetraso: calcularDiasDeRetraso(fechaActual, cuota.fechaCuota),
        fechaGeneracion: fechaActual, // Actualizamos la fecha de generación de la mora
    } as Mora;

    if (calcularDiasDeRetraso(fechaActual, cuota.fechaCuota) < 1) {
        throw new Error('La cuota no tiene dias vencido o esta dentro del umbral'); 
    } else{
        await Mora.create(nuevaMoraData);
        await Cuota.update({ estado: EstadoPago.Vencido }, { where: { idCuota: idCuota } });

    }
    
};

const calcularDiasDeRetraso = (fechaActual: Date, fechaVencimiento: Date): number => {
    const unDiaEnMs = 1000 * 60 * 60 * 24;
    const diferenciaEnMs = fechaActual.getTime() - fechaVencimiento.getTime();
    return Math.max(0, Math.floor(diferenciaEnMs / unDiaEnMs));
};

const calcularMoraPorCuota = async (
    cuota: Cuota,
    diasDeRetraso: number,
    porcentajeMora: number
): Promise<number> => {

    const {
        montoCuota,
        montoPagado,
        idCuota,
    } = cuota;


    const fechaActual = new Date();
    fechaActual.setUTCHours(0, 0, 0, 0);

    const ultimaMoraDelaCuota = await Mora.findOne({
        where: {
            idCuota
        },
        order: [['createdAt', 'DESC']] // Ordenar por fecha de creación en orden descendente
    });


    if (ultimaMoraDelaCuota) {
        const fechaCreacionMora = new Date(ultimaMoraDelaCuota?.dataValues.createdAt);
        
        fechaCreacionMora.setUTCHours(0, 0, 0, 0);
        diasDeRetraso = calcularDiasDeRetraso(fechaActual, fechaCreacionMora);
    } else {
        console.log('No se encontró una mora existente para la cuota');
    }

    const montoPendiente = montoCuota - (montoPagado || 0);

    const montoMora = montoPendiente * (porcentajeMora / 100) * diasDeRetraso;

    return Math.ceil(montoMora);
};






//********************************************************************************************** */



export const deleteMoraById = async (idMora: number): Promise<number> => {
    try {
        const deletedRowCount = await Mora.destroy({ where: { idMora } });
        return deletedRowCount;
    } catch (error: any) {
        throw new Error(`Ha ocurrido un error al intentar eliminar la mora: ${error}`)
    }
}

export const updateMora = async (idMora: number, moraData: Partial<Mora>): Promise<[number, Mora[]]> => {
    try {
        const [updatedRowCount, updatedMoras] = await Mora.update(moraData, {
            where: { idMora },
            returning: true,
        });
        return [updatedRowCount, updatedMoras];
    } catch (error: any) {
        throw new Error(`Error al actualizar la mora: ${error}`);
    }
}

export const obtenerUltimaMoraDeUnaCuota = async (idCuota: number): Promise<Mora | null> =>{
    try {
        const mora = await Mora.findOne({
            where: {
                idCuota
            },
            order: [['createdAt', 'DESC']] // Ordenar por fecha de creación en orden descendente
        });
        return mora || null
    } catch (error: any) {
        console.error(`Error al obtener la última mora de la cuota ${idCuota}: ${error.message}`);
        throw new Error(`Error al obtener la última mora de la cuota ${idCuota}: ${error.message}`);
    
    }
}



