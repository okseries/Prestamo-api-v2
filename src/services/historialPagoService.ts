import { Cliente } from "../models/cliente";
import { Cuota, EstadoPago } from "../models/cuota";
import { DetalleFrecuencia } from "../models/detalleFrecuenciaPago";
import { DetallePago } from "../models/detallePago";
import { HistorialPago } from "../models/historialPago";
import { Mora } from "../models/mora";

/**
 * Obtiene todos los registros de historial de pago asociados a una sucursal.
 * @param idSucursal El ID de la sucursal.
 * @returns Un array de objetos HistorialPago.
 * @throws Error si ocurre algún problema al obtener los registros de historial de pago.
 */
export const getAllHistorialPago = async (idSucursal: number): Promise<HistorialPago[]> => {
    try {
        const historialPagos = await HistorialPago.findAll({
            where: { idSucursal, deleted: false },
            include:
                [
                    {
                        model: Cliente,
                        attributes: ['primerNombre', 'identificacion']
                    },
                    {
                        model: DetallePago,
                        include:
                            [
                                {
                                    model: Cuota,
                                    attributes: ['numeroCuota', 'idCuota'],
                                    include: [
                                        { model: Mora, attributes: ['idMora'], }
                                    ]
                                }
                            ]

                    }
                ]
        });
        return historialPagos;
    } catch (error: any) {
        throw new Error(`Ha ocurrido un error al obtener el historial de pago: ${error}`);
    }
}

/**
 * Obtiene un registro de historial de pago por su ID.
 * @param idHistorialPago El ID del historial de pago.
 * @returns El objeto HistorialPago encontrado o null si no se encuentra.
 * @throws Error si ocurre algún problema al obtener el registro de historial de pago.
 */
export const getHistorialPagoById = async (idHistorialPago: number): Promise<HistorialPago | null> => {
    try {
        const historialPago = await HistorialPago.findByPk(idHistorialPago);
        return historialPago;
    } catch (error: any) {
        throw new Error(`No se encontró un historial de pago asociado a ese ID: ${idHistorialPago}`);
    }
}

/**
 * Crea un nuevo registro de historial de pago.
 * @param historialPagoData Los datos del historial de pago a crear.
 * @returns El objeto HistorialPago creado.
 * @throws Error si ocurre algún problema al crear el historial de pago.
 */
export const createHistorialPago = async (historialPagoData: HistorialPago): Promise<HistorialPago> => {
    try {
        const historialPagoCreado = await HistorialPago.create(historialPagoData);
        return historialPagoCreado;
    } catch (error: any) {
        throw new Error(`Ha ocurrido un error al crear el historial de pago: ${error}`);
    }
}

/**
 * Actualiza un registro de historial de pago por su ID.
 * @param idHistorialPago El ID del historial de pago a actualizar.
 * @param historialPagoData Los datos actualizados del historial de pago.
 * @returns Un objeto con el número de filas actualizadas y los registros actualizados de historial de pago.
 * @throws Error si ocurre algún problema al actualizar el historial de pago.
 */
export const updateHistorialPago = async (idHistorialPago: number, historialPagoData: Partial<HistorialPago>): Promise<{ updatedRowCount: number; updatedHistorialPago: HistorialPago[] }> => {
    try {
        // Actualiza los registros de historial de pago con el ID proporcionado
        const [updatedRowCount] = await HistorialPago.update(historialPagoData, {
            where: { idHistorialPago },
            returning: true,
        });

        // Consulta los registros de historial de pago actualizados después de la actualización
        const updatedHistorialPago = await HistorialPago.findAll({ where: { idHistorialPago } });


        // Retorna el número de filas actualizadas y los registros de historial de pago actualizados
        return { updatedRowCount, updatedHistorialPago };
    } catch (error: any) {
        // Captura cualquier error que ocurra durante la actualización y lanza una nueva excepción
        throw new Error(`Ha ocurrido un error al intentar actualizar el historial de pago: ${error}`);
    }
}


export const cancelarPagoService = async (idHistorialPago: number, estado: Partial<HistorialPago>): Promise<boolean> => {
    try {

        const historialPago = await HistorialPago.findOne({ where: { idHistorialPago } })

        if (historialPago?.dataValues.estado === EstadoPago.Cancelado) {
            return false;
        }

        // Actualiza el estado del registro de historial de pago a "Cancelado"
        await HistorialPago.update(estado, {
            where: { idHistorialPago }
        });


        // Obtener los detalles de pago asociados al historial de pago
        const detallePagos = await DetallePago.findAll({ where: { idHistorialPago } });

        for (const detallePago of detallePagos) {
            const { idCuota, estadoAnterior, montoPagado } = detallePago.dataValues;



            // Buscar la cuota correspondiente utilizando el idCuota
            const cuota = await Cuota.findByPk(idCuota);

            if (cuota) {



                const montoPagadoDetalle = parseFloat(montoPagado.toString());
                const montoPagadoCuota = cuota && cuota.dataValues.montoPagado
                    ? parseFloat(cuota.dataValues.montoPagado.toString())
                    : NaN;


                const nuevoMontoPagado: number = montoPagadoCuota - montoPagadoDetalle;
                // Actualizar el estado y el campo montoPagado de la cuota
                const data: Cuota = {
                    estado: estadoAnterior,
                    montoPagado: nuevoMontoPagado
                } as Cuota;

                await cuota.update(data);
                console.log(`El estado de la cuota ${idCuota} ha sido actualizado a ${estadoAnterior}`);
            } else {
                console.log(`No se encontró la cuota con el ID ${idCuota}`);
            }
        }

        console.log('Todos los detalles de pago han sido procesados.');

        // Retorna true para indicar que la operación fue exitosa
        return true;
    } catch (error: any) {
        // Captura cualquier error que ocurra durante la actualización y lanza una nueva excepción
        console.error(`Ha ocurrido un error al intentar actualizar el historial de pago: ${error.message}`);
        throw new Error('Ocurrió un error al cancelar el pago. Consulta los registros para más detalles.');
    }
}



