import { Op, Transaction } from "sequelize";
import { sequelize } from "../../config/sequelize.config";
import { Mora } from "../../models/mora";
import { Cuota } from "../../models/cuota";
import { Prestamo } from "../../models/prestamo";



export const PayMoraCuota = async (idsMoras: number[], idsCuotas: number[], montoPagadoParametro: number): Promise<boolean> => {
    try {
        await sequelize.transaction(async (t: Transaction) => {
            console.log('Iniciando transacción...');
            
            let montoParaMora = montoPagadoParametro;
            let montoParaCuota = 0;

            const morasActuales = await findMorasByIds(idsMoras, t);
            console.log('Moras encontradas:', morasActuales);

            const totalMontoMoras = calculateTotalMontoMoras(morasActuales);
            console.log('Total de monto de moras:', totalMontoMoras);

            const cuotasActuales = await findCuotasByIds(idsCuotas, t);
            console.log('Cuotas encontradas:', cuotasActuales);

            const totalMontoCuotas = calculateTotalMontoCuotas(cuotasActuales);
            console.log('Total de monto de cuotas:', totalMontoCuotas);

            const montoTotal  = totalMontoCuotas + totalMontoMoras;
            console.log('Monto total a pagar:', montoTotal);


            validateMontoPagado(idsCuotas, montoPagadoParametro, totalMontoCuotas, errores);

            for (const cuota of cuotasActuales) {
                await processCuota(cuota, montoPagadoParametro, idsCuotas, t, errores);
            }

            if (idsCuotas.length > 2) {
                if (montoTotal < montoPagadoParametro || montoTotal > montoPagadoParametro) {
                    throw new Error(`El monto ${montoPagadoParametro} que intenta pagar no es valido para saladar el monto ${montoTotal}.`)
                }
            }

            if (totalMontoMoras > montoPagadoParametro) {
                throw new Error(`El monto pagado: ${montoPagadoParametro} debe como minimo ser mayor o igual que el monto total de la mora.`)
            }

            if (montoPagadoParametro <= 0) {
                throw new Error(`El monto pagado: ${montoPagadoParametro} no es valido.`)
            }

            if (totalMontoMoras < montoPagadoParametro) {
                montoParaCuota = montoPagadoParametro - totalMontoMoras;
                montoParaMora = montoPagadoParametro - montoParaCuota;
            }

            if (idsCuotas[0] !== null && idsMoras[0] !== null) {
                console.log('Realizando pagos de cuotas y moras...');
                // Aquí podrías añadir la lógica para realizar los pagos
            }

            if (idsCuotas[0] === null && idsMoras[0] !== null) {
                console.log('Realizando pagos de moras...');
                // Aquí podrías añadir la lógica para realizar los pagos
            }

            if (idsCuotas[0] !== null && idsMoras[0] === null) {
                console.log('Realizando pagos de cuotas...');
                // Aquí podrías añadir la lógica para realizar los pagos
            }
        });

        console.log('Transacción completada.');
        return true;
    } catch (error) {
        console.error('Error en PayMoraCuota:', error);
        return false;
    }
}


const calculateTotalMontoMoras = (morasActuales: any[]) => {
    return morasActuales.reduce((sum, mora) => {
        const montoMora = parseFloat(mora.dataValues.montoMora.toString());
        return sum + montoMora;
    }, 0);
};


const findMorasByIds = async (idsMoras: number[], transaction: Transaction) => {
    return await Mora.findAll({
        where: { idMora: { [Op.in]: idsMoras }, deleted: false },
        transaction: transaction,
    });
};


const findCuotasByIds = async (idsCuotas: number[], transaction: Transaction) => {
    return await Cuota.findAll({
        where: { idCuota: { [Op.in]: idsCuotas }, deleted: false },
        transaction: transaction,
        include: [{ model: Prestamo, attributes: ['idSucursal'] }]
    });
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