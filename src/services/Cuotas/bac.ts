import { Transaction } from "sequelize";
import { Cuota } from "../../models/cuota";



export const validarExistenciaCuotas = async (idsCuotas: number[]): Promise<void> => {
    try {
        // Buscar las cuotas por sus IDs
        const cuotasEncontradas = await Cuota.findAll({ where: { idCuota: idsCuotas } });

        // Verificar si se encontraron todas las cuotas especificadas
        if (cuotasEncontradas.length !== idsCuotas.length) {
            throw new Error('No se encontraron todas las cuotas especificadas');
        }
    } catch (error: any) {
        // Capturar y relanzar cualquier error que ocurra durante la validación
        throw new Error(`Error al validar la existencia de las cuotas: ${error.message}`);
    }
};


export const calcularMontoTotalCuotas = (cuotas: Cuota[]): number => {
    let totalAmount = 0;
    for (const cuota of cuotas) {
        const montoCuota = parseFloat(cuota.dataValues.montoCuota.toString());
        const montoPagado = parseFloat(cuota.dataValues.montoPagado?.toString() ?? '0');
        const montoMora = cuota.mora.length > 0 ? parseFloat(cuota.dataValues.mora[0].montoMora.toString()) : 0;
        totalAmount += montoCuota - montoPagado + montoMora;
    }
    return Math.ceil(totalAmount);
};



export const procesarPagoCuotas = async (cuotas: Cuota[], montoPagado: number, transaction: Transaction): Promise<void> => {
    try {
        for (const cuota of cuotas) {
            const montoCuota = parseFloat(cuota.dataValues.montoCuota.toString());
            const montoPagadoBd = parseFloat(cuota.dataValues?.montoPagado?.toString() ?? '0');
            const nuevoMontoPagado = montoPagadoBd + montoPagado;
            const nuevoEstado = nuevoMontoPagado === montoCuota ? 'Pagado' : 'PagoParcial';

            // Verificar si la cuota ya ha sido saldada
            if (cuota.estado === 'Pagado') {
                throw new Error(`La cuota con ID ${cuota.idCuota} ya ha sido saldada.`);
            }

            const cuotaData: Cuota = { estado: nuevoEstado, montoPagado: nuevoMontoPagado } as Cuota;
            // Actualizar el estado y el monto pagado de la cuota
            await cuota.update(
                cuotaData,
                { transaction }
            );

            // Actualizar el monto restante del préstamo
            // Aquí deberías agregar la lógica adecuada para actualizar el monto restante del préstamo.
        }
    } catch (error: any) {
        throw new Error(`Error al procesar el pago de las cuotas: ${error.message}`);
    }
};