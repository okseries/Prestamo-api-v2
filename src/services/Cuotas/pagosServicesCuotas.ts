import { Op, Transaction } from "sequelize";
import { sequelize } from "../../config/sequelize.config";
import { Cuota, EstadoPago } from "../../models/cuota";
import { Prestamo } from "../../models/prestamo";
import { HistorialPago } from "../../models/historialPago";
import { createHistorialPago } from "../historialPagoService";
import { DetallePago } from "../../models/detallePago";
import { createDetallePago } from "../detallePagoService";




export const payCuotas = async (idsCuotas: number[], montoPagadoParametro: number): Promise<void> => {
    try {
        const errores: string[] = [];
        await sequelize.transaction(async (t: Transaction) => {
            const cuotasActuales = await findCuotasByIds(idsCuotas, t);
            validateCuotas(idsCuotas, cuotasActuales, errores);
            const totalMontoCuotas = calculateTotalMontoCuotas(cuotasActuales);
            validateMontoPagado(idsCuotas, montoPagadoParametro, totalMontoCuotas, errores);

            for (const cuota of cuotasActuales) {
                await processCuota(cuota, montoPagadoParametro, idsCuotas, t, errores);
            }

            const historialPago = await createHistorialPagoAndDetails(cuotasActuales, montoPagadoParametro);
        });

        if (errores.length > 0) {
            throw new Error(errores.join('\n'));
        }
    } catch (error: any) {
        throw new Error(`Error al realizar el pago: ${error.message}`);
    }
};

const findCuotasByIds = async (idsCuotas: number[], transaction: Transaction) => {
    return await Cuota.findAll({
        where: { idCuota: { [Op.in]: idsCuotas }, deleted: false },
        transaction: transaction,
        include: [{ model: Prestamo, attributes: ['idSucursal'] }]
    });
};

const validateCuotas = (idsCuotas: number[], cuotasActuales: any[], errores: string[]) => {
    if (cuotasActuales.length !== idsCuotas.length) {
        errores.push('No se encontraron todas las cuotas especificadas');
        throw new Error('No se encontraron todas las cuotas especificadas');
    }
};

const calculateTotalMontoCuotas = (cuotasActuales: any[]) => {
    return cuotasActuales.reduce((sum, cuota) => {
        const montoCuota = parseFloat(cuota.dataValues.montoCuota.toString());
        const montoPagado = parseFloat(cuota.dataValues.montoPagado?.toString() ?? "0");
        return sum + (montoCuota - montoPagado);
    }, 0);
};

const validateMontoPagado = (idsCuotas: number[], montoPagadoParametro: number, totalMontoCuotas: number, errores: string[]) => {
    if (idsCuotas.length > 1 && montoPagadoParametro !== totalMontoCuotas) {
        errores.push(`El monto total pagado (${montoPagadoParametro}) no coincide con la suma de los montos de las cuotas seleccionadas (${totalMontoCuotas}).`);
        throw new Error(`El monto total pagado (${montoPagadoParametro}) no coincide con la suma de los montos de las cuotas seleccionadas (${totalMontoCuotas}).`);
    }
};

const processCuota = async (cuota: any, montoPagadoParametro: number, idsCuotas: number[], transaction: Transaction, errores: string[]) => {

    const montoCuota = parseFloat(cuota.dataValues.montoCuota.toString());
    const montoPagadoBd = parseFloat(cuota.dataValues.montoPagado?.toString() ?? "0");
    let nuevoMontoPagado = montoPagadoBd + montoPagadoParametro;
    let nuevoEstado = nuevoMontoPagado === montoCuota ? EstadoPago.Pagado : EstadoPago.PagoParcial;

    try {
        // Verifica si la cuota ya ha sido saldada
        if (cuota.dataValues.estado === EstadoPago.Pagado) {
            errores.push(`La cuota con ID ${cuota.dataValues.idCuota} ya ha sido saldada`);
            throw new Error(`La cuota con ID ${cuota.dataValues.idCuota} ya ha sido saldada`);
        }

        if (idsCuotas.length > 1) {
            nuevoMontoPagado = montoCuota;
            nuevoEstado = EstadoPago.Pagado;
        }

        // Actualiza el estado y el monto pagado de la cuota
        await Cuota.update(
            { estado: nuevoEstado, montoPagado: nuevoMontoPagado },
            { where: { idCuota: cuota.dataValues.idCuota }, transaction: transaction }
        );

        // Actualiza el monto restante del préstamo
        const prestamo = await Prestamo.findByPk(cuota.dataValues.idPrestamo, { transaction: transaction });
        if (!prestamo) {
            errores.push(`Prestamo no encontrado (revisar linea 170 cuotaService)`);
            throw new Error(`Prestamo no encontrado (revisar linea 170 cuotaService)`);
        }

        //aqui se actualizaba el monto restante del prestamo
        /*await Prestamo.update(
            { montoRestante: nuevoMontoRestantePrestamo },
            { where: { idPrestamo: cuota.dataValues.idPrestamo }, transaction: transaction }
        );*/

    } catch (error: any) {
        errores.push(`Error al procesar cuota con ID ${cuota.dataValues.idCuota}: ${error.message}`);
        throw error;
    }
};

const createHistorialPagoAndDetails = async (cuotasActuales: any[], montoPagadoParametro: number) => {

    const { idSucursal, idPrestamo } = cuotasActuales[0].toJSON()
    const prestamo = await Prestamo.findByPk(idPrestamo);
    const idCliente = prestamo?.toJSON().idCliente || 0;



    const historialPago: HistorialPago = {
        idCliente,
        idSucursal,
        monto: montoPagadoParametro
    } as HistorialPago;

    const historialPagoCreado = await createHistorialPago(historialPago);

    for (const cuota of cuotasActuales) {
        const { idCuota, montoCuota, montoPagado, estado } = cuota.dataValues;

        const nuevoMontoPagado: number = parseFloat(montoCuota.toString()) - parseFloat(montoPagado?.toString() ?? "0")

        const nuevoDetallePago: DetallePago = {
            idHistorialPago: historialPagoCreado.idHistorialPago,
            estadoAnterior: estado,
            idCuota,
            montoPagado: cuotasActuales.length > 1 ? nuevoMontoPagado : montoPagadoParametro,
            idSucursal: cuota.dataValues.prestamo.dataValues.idSucursal,
        } as DetallePago;

        createDetallePago(nuevoDetallePago);

    }

    return historialPagoCreado;
};