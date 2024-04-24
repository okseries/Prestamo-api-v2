import { sequelize } from "../../config/sequelize.config";
import { Op, Transaction, where } from "sequelize";
import { Cuota, EstadoPago } from "../../models/cuota";
import { Mora } from "../../models/mora";
import { HistorialPago } from "../../models/historialPago";
import { DetallePago } from "../../models/detallePago";
import { Prestamo } from "../../models/prestamo";

// Función para realizar el pago de cuotas y moras
export const PayMoraCuota = async (idsMoras: number[], idPrestamo: number, idsCuotas: number[], montoPagadoParametro: number): Promise<boolean> => {
    const transaction = await sequelize.transaction();

    try {



        const prestamo = await Prestamo.findByPk(idPrestamo)

        if (!prestamo) {
            throw new Error(`No se ha encontrade el prestamo con el ID: ${idPrestamo}`)
        }
        const idCliente: number = (prestamo ? parseInt(prestamo?.dataValues.idCliente.toString()) : 0);
        const idSucursal: number = (prestamo ? parseInt(prestamo?.dataValues.idSucursal.toString()) : 0);

        const { montoTotal } = await calcularMontoTotal(idsMoras, idsCuotas, transaction);

        const historialPago = await crearHistorialPago(montoPagadoParametro, idCliente, idSucursal, transaction);
        await updateMoraCuota(historialPago.idHistorialPago, idSucursal, montoPagadoParametro, idsMoras, idsCuotas, transaction);


        await transaction.commit();

        console.log('Transacción completada.');

        return true;
    } catch (error) {
        await transaction.rollback();
        console.error('Error en PayMoraCuota:', error);
        return false;
    }
}

const updateMoraCuota = async (idHistorialPago: number, idSucursal: number, montoPagadoParametro: number, idsMoras: number[], idsCuotas: number[], transaction: Transaction): Promise<boolean> => {
    try {
        let montoDisponible = montoPagadoParametro;

        // Procesar las moras primero
        for (const idMora of idsMoras) {
            if (idMora === null) {
                // Si el ID de la mora es nulo, lo ignoramos y pasamos al siguiente
                continue;
            }

            const mora = await Mora.findByPk(idMora, { transaction });

            if (!mora) {
                throw new Error(`Mora con ID ${idMora} no encontrada`);
            }

            const montoAdeudadoMora = parseFloat(mora.dataValues.montoMora.toString());

            console.log(`ID mora: ${idMora} Monto adeudado: ${montoAdeudadoMora}`);

            // Si hay suficiente dinero disponible, pagamos la mora
            if (montoDisponible >= montoAdeudadoMora) {
                montoDisponible -= montoAdeudadoMora;
                await Mora.update({ pagada: true }, { where: { idMora }, transaction });
                await crearDetallePagoMora(montoAdeudadoMora, idHistorialPago, idMora, idSucursal, transaction);
            } else {
                break; // No hay suficiente dinero para pagar más moras
            }
        }

        // Procesar las cuotas si aún hay dinero disponible
        if (montoDisponible > 0) {
            for (const idCuota of idsCuotas) {
                const cuota = await Cuota.findByPk(idCuota, { transaction });

                if (!cuota) {
                    throw new Error(`Cuota con ID ${idCuota} no encontrada`);
                }

                // Verificar si la cuota ya ha sido saldada
                if (cuota.estado === EstadoPago.Pagado) {
                    continue; // Pasar a la siguiente cuota si ya está pagada
                }

                const valorOriginalDeCuota = parseFloat(cuota.dataValues.montoCuota.toString());
                const valorPagadoCuota = cuota && cuota.dataValues.montoPagado !== undefined
                    ? parseFloat(cuota.dataValues.montoPagado.toString())
                    : 0;

                const montoAdeudadoCuota = valorOriginalDeCuota - valorPagadoCuota;

                console.log(`ID cuota: ${idCuota} Monto adeudado: ${montoAdeudadoCuota}`);

                // Si el dinero disponible es suficiente para saldar la cuota, actualizar el estado
                if (montoDisponible >= montoAdeudadoCuota) {
                    montoDisponible -= montoAdeudadoCuota;
                    await Cuota.update({ estado: EstadoPago.Pagado, montoPagado: valorOriginalDeCuota }, { where: { idCuota }, transaction });
                    await crearDetallePagoCuota(montoAdeudadoCuota, idHistorialPago, idCuota, idSucursal, transaction);

                } else {
                    // Si no es suficiente, se paga parcialmente la cuota
                    const nuevoMontoPagado = valorPagadoCuota + montoDisponible;
                    await Cuota.update({ estado: EstadoPago.PagoParcial, montoPagado: nuevoMontoPagado }, { where: { idCuota }, transaction });
                    await crearDetallePagoCuota(nuevoMontoPagado, idHistorialPago, idCuota, idSucursal, transaction);
                    break; // No hay más dinero disponible para pagar cuotas
                }
            }
        }

        return true; // Indicar que la actualización se realizó correctamente
    } catch (error) {
        console.error('Error al actualizar las cuotas y moras:', error);
        return false; // Indicar que hubo un error durante la actualización
    }
}


// Función para crear el historial de pago
const crearHistorialPago = async (montoPagadoParametro: number, idCliente: number, idSucursal: number, transaction: Transaction): Promise<HistorialPago> => {
    try {

        const historialData: HistorialPago = {
            monto: montoPagadoParametro,
            idCliente,
            idSucursal,
            estado: EstadoPago.Confirmado,
        } as HistorialPago;

        const historialPago = await HistorialPago.create(historialData, { transaction });
        return historialPago;
    } catch (error) {
        console.error('Error al crear el historial de pago:', error);
        throw error;
    }
};


const crearDetallePagoMora = async (montoPagadoMora: number, idHistorialPago: number, idMora: number, idSucursal: number, transaction: Transaction): Promise<boolean> => {
    try {
        if (montoPagadoMora <= 0) {
            throw new Error(`Estas intentando pagar con un monto de ${montoPagadoMora}`)
        }
        const detalleDataMora: DetallePago = {
            idHistorialPago, // Aquí se establece correctamente el idHistorialPago
            idMora,
            montoPagado: montoPagadoMora,
            idSucursal
        } as DetallePago;
        // Guardar el detalle de pago en la base de datos
        await DetallePago.create(detalleDataMora, { transaction });

        return true;
    } catch (error) {
        console.error('Error al actualizar las cuotas y moras:', error);
        return false;
    }
}

const crearDetallePagoCuota = async (montoPagadoCuota: number, idHistorialPago: number, idCuota: number, idSucursal: number, transaction: Transaction): Promise<boolean> => {
    try {
        if (montoPagadoCuota <= 0) {
            throw new Error(`Estas intentando pagar con un monto de ${montoPagadoCuota}`)
        }

        const detalleDataCuota: DetallePago = {
            idHistorialPago,
            idCuota,
            montoPagado: montoPagadoCuota, // Asignar el monto pagado correcto
            idSucursal
        } as DetallePago;

        // Guardar el detalle de pago en la base de datos
        await DetallePago.create(detalleDataCuota, { transaction });

        return true;
    } catch (error) {
        console.error('Error al actualizar las cuotas y moras:', error);
        return false;
    }
}

































const findCuotasByIds = async (idsCuotas: number[], transaction: Transaction) => {
    return await Cuota.findAll({
        where: { idCuota: { [Op.in]: idsCuotas }, deleted: false },
        transaction: transaction,
        include: [{ model: Prestamo, attributes: ['idSucursal'] }]

    });
};

const findMorasByIds = async (idsMoras: number[], transaction: Transaction) => {
    return await Mora.findAll({
        where: { idMora: { [Op.in]: idsMoras }, deleted: false },
        transaction: transaction,
    });
}

const calculateTotalMontoMoras = (morasActuales: any[]) => {
    return morasActuales.reduce((sum, mora) => {
        const montoMora = parseFloat(mora.dataValues.montoMora.toString());
        return sum + montoMora;
    }, 0);
};

const calculateTotalMontoCuotas = (cuotasActuales: any[]) => {
    return cuotasActuales.reduce((sum, cuota) => {
        const montoCuota = parseFloat(cuota.dataValues.montoCuota.toString());
        const montoPagado = parseFloat(cuota.dataValues.montoPagado?.toString() ?? "0");
        return sum + (montoCuota - montoPagado);
    }, 0);
};

// Función para calcular el monto total a pagar
const calcularMontoTotal = async (idsMoras: number[], idsCuotas: number[], transaction: Transaction): Promise<{ montoTotal: number, montoTotalMora: number, montoTotalCuota: number }> => {
    let montoTotal = 0;

    // console.log('calcularMontoTotal : montoTotal', montoTotal);
    // console.log('calcularMontoTotal : idsMoras', idsMoras);
    // console.log('calcularMontoTotal : idsCuotas', idsCuotas);

    // Calculamos el monto total de las moras seleccionadas
    const morasActuales = await findMorasByIds(idsMoras, transaction);
    const montoTotalMora = calculateTotalMontoMoras(morasActuales);

    // console.log('*************************calculateTotalMontoMoras', montoTotalMora);


    // Calculamos el monto total de las cuotas seleccionadas
    const cuotasActuales = await findCuotasByIds(idsCuotas, transaction);
    const montoTotalCuota = calculateTotalMontoCuotas(cuotasActuales);

    // console.log('*************************calculateTotalMontoCuotas', montoTotalCuota);
    montoTotal = montoTotalMora + montoTotalCuota

    return { montoTotal, montoTotalMora, montoTotalCuota };
};









