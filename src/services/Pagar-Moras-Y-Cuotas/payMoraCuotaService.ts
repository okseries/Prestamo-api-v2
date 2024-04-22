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

            if (idsCuotas !== null && idsMoras !== null) {
                console.log('Realizando pagos...');
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