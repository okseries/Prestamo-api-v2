import { Cliente } from "../models/cliente";
import { Cuota, EstadoPago } from "../models/cuota";
import { DetallePago } from "../models/detallePago";
import { HistorialPago } from "../models/historialPago";
import { Mora } from "../models/mora";
import { Prestamo } from "../models/prestamo";
import { getAllMorasDetalle } from "./moraService";
import { Op } from 'sequelize';

export const obtenerCantidadTotalPrestada = async (idSucursal: number) => {
    try {
        const sumaCantidadPrestada = await Prestamo.sum('capital', { where: { deleted: false, idSucursal } }) || 0;
        return sumaCantidadPrestada;
    } catch (error) {
        console.error('Error al obtener la cantidad total prestada:', error);
        throw new Error('Error al obtener la cantidad total prestada');
    }
};

export const obtenerMontoTotalPrestamos = async (idSucursal: number) => {
    try {
        const sumaMontoTotal = await Prestamo.sum('monto', { where: { deleted: false, idSucursal } }) || 0;
        return sumaMontoTotal;
    } catch (error) {
        console.error('Error al obtener el monto total de los préstamos:', error);
        throw new Error('Error al obtener el monto total de los préstamos');
    }
};


export const obtenerSumaInteresesPrestamos = async (idSucursal: number) => {
    try {
        const sumaIntereses = await Prestamo.sum('interes', { where: { deleted: false, idSucursal } }) || 0;
        return sumaIntereses;
    } catch (error) {
        console.error('Error al obtener la suma de intereses de los préstamos:', error);
        throw new Error('Error al obtener la suma de intereses de los préstamos');
    }
};

export const obtenerSumaDeHistorilPago = async (idSucursal: number): Promise<number> => {
    try {
        const montoPagado = await HistorialPago.sum('monto', { where: { estado: 'Confirmado', idSucursal, deleted: false } })

        return montoPagado;
    } catch (error: any) {
        console.error('Error al obtener la suma de historial de pago:', error);
        throw new Error('Error al obtener la suma de historial de pago');

    }
}

export const obtenerSumaDemorasGeneral = async (idSucursal: number): Promise<number> => {
    try {
        const sumaMoras = await Mora.sum('montoMora', { where: { idSucursal, deleted: false } })

        return sumaMoras;
    } catch (error: any) {
        console.error('Error al obtener la suma de las moras:', error);
        throw new Error('Error al obtener la suma de las moras');

    }
}

export const obtenerSumaDemorasPagadas = async (idSucursal: number): Promise<number> => {
    try {
        const sumaMorasPagadas = await Mora.sum('montoMora', { where: { idSucursal, deleted: false, pagada: true } })

        return sumaMorasPagadas;
    } catch (error: any) {
        console.error('Error al obtener la suma de las moras pagadas:', error);
        throw new Error('Error al obtener la suma de las moras pagadas');

    }
}




export const obtenerSumaDemorasPagadasEnElMesActual = async (idSucursal: number): Promise<number> => {
    try {
        const fechaInicioMes = new Date();
        fechaInicioMes.setDate(1); // Establece el día como el primer día del mes actual
        fechaInicioMes.setHours(0, 0, 0, 0); // Establece las horas a las 00:00:00

        const fechaFinMes = new Date();
        fechaFinMes.setMonth(fechaFinMes.getMonth() + 1); // Aumenta el mes en uno para obtener el siguiente mes
        fechaFinMes.setDate(0); // Establece el día como el último día del mes actual
        fechaFinMes.setHours(23, 59, 59, 999); // Establece las horas a las 23:59:59

        const sumaMorasPagadas = await Mora.sum('montoMora', {
            where: {
                idSucursal,
                deleted: false,
                pagada: true,
                updatedAt: {
                    [Op.between]: [fechaInicioMes, fechaFinMes] // Utiliza Op.between para buscar entre dos fechas
                }
            }
        });

        return sumaMorasPagadas || 0; // Devuelve la suma de moras pagadas o 0 si no hay resultados
    } catch (error: any) {
        console.error('Error al obtener la suma de las moras pagadas:', error);
        throw new Error('Error al obtener la suma de las moras pagadas');
    }
}



export const obtenerInformacionCuotas = async (idSucursal: number) => {
    try {
        const [
            totalCuotas,
            cuotasPagadas,
            cuotasPendientes,
            cuotasPagoParcial,
            sumaCuotasPagadas,
            sumaCuotasPendientes,
            sumaCuotasPagoParcial,
            sumaMontoRestanteCuotasPagoParcial,
            sumaCuotasTotal
        ] = await Promise.all([
            Cuota.count({ where: { idSucursal, deleted: false } }),
            Cuota.count({ where: { estado: EstadoPago.Pagado, idSucursal, deleted: false } }),
            Cuota.count({ where: { estado: EstadoPago.Pendiente, idSucursal, deleted: false } }),
            Cuota.count({ where: { estado: EstadoPago.PagoParcial, idSucursal, deleted: false } }),
            Cuota.sum('montoPagado', { where: { estado: EstadoPago.Pagado, idSucursal, deleted: false } }) || 0,
            Cuota.sum('montoCuota', { where: { estado: EstadoPago.Pendiente, idSucursal, deleted: false } }) || 0,
            Cuota.sum('montoPagado', { where: { estado: EstadoPago.PagoParcial, idSucursal, deleted: false } }) || 0,
            Cuota.sum('montoCuota', { where: { estado: EstadoPago.PagoParcial, idSucursal, deleted: false } }) || 0,
            Cuota.sum('montoCuota', { where: { idSucursal, deleted: false } }) || 0,
        ]);

        // Calcular total pagado y total pendiente
        const sumaCuotasPagadoValue = isNaN(sumaCuotasPagadas) ? 0 : sumaCuotasPagadas;
        const sumaCuotasPendienteValue = isNaN(sumaCuotasPendientes) ? 0 : sumaCuotasPendientes;
        const sumaCuotasPagoParcialValue = isNaN(sumaCuotasPagoParcial) ? 0 : sumaCuotasPagoParcial;
        const sumaMontoRestanteCuotasPagoParcialValue = isNaN(sumaMontoRestanteCuotasPagoParcial) ? 0 : sumaMontoRestanteCuotasPagoParcial;

        const totalPagado = sumaCuotasPagadoValue + sumaCuotasPagoParcialValue;
        const totalPendiente = sumaMontoRestanteCuotasPagoParcialValue - sumaCuotasPagoParcialValue + sumaCuotasPendienteValue;

        return {
            totalCuotas,
            cuotasPagadas,
            cuotasPendientes,
            cuotasPagoParcial,
            sumaCuotasPagadas: sumaCuotasPagadoValue,
            sumaCuotasPendientes: sumaCuotasPendienteValue,
            sumaCuotasPagoParcial: sumaCuotasPagoParcialValue,
            sumaCuotasTotal,
            sumaMontoRestanteCuotasPagoParcial: sumaMontoRestanteCuotasPagoParcialValue,
            totalPagado,
            totalPendiente,
        };
    } catch (error) {
        console.error('Error al obtener información de cuotas:', error);
        throw new Error('Error al obtener información de cuotas');
    }
};







export const obtenerInformacionMoras = async (idSucursal: number) => {
    try {
        const moras = await getAllMorasDetalle(idSucursal);

        const fechaActual = new Date(); // Fecha actual
        fechaActual.setHours(fechaActual.getHours() - 4);
        fechaActual.setUTCHours(0, 0, 0, 0); // Establecemos la hora UTC a 00:00:00:000
        
        // Calcular la fecha inicial del mes actual
        const primerDiaDelMes = new Date(fechaActual.getFullYear(), fechaActual.getMonth(), 1);
        
        // Calcular la fecha final del mes actual
        const ultimoDiaDelMes = new Date(fechaActual.getFullYear(), fechaActual.getMonth() + 1, 0);
        ultimoDiaDelMes.setHours(23, 59, 59, 999); // Establecemos la hora a las 23:59:59:999
        
        // Consulta para obtener todas las moras pagadas dentro del rango de fechas y para la sucursal especificada
        const morasPagadasRangoMes = await Mora.findAll({
            where: {
                idSucursal,
                pagada: true,
                updatedAt: {
                    [Op.between]: [primerDiaDelMes, ultimoDiaDelMes] // Filtrar por rango de fecha del mes
                }
            }
        });
        
        // Calcular el monto total pagado dentro del rango de fechas del mes
        const montoTotalPagadoRangoMes = morasPagadasRangoMes.reduce((total, mora) => {
            return total + parseFloat(mora.dataValues.montoMora.toString());
        }, 0);
        
        console.log(montoTotalPagadoRangoMes);
        




        const [
            cantidadRegistrosMoras,
            cantidadMorasPagadas,
            cantidadMorasPendientes,
            montoTotalMorasPagadas,
            montoTotalMorasPendientes,
            montoTotalMoras,
        ] = await Promise.all([
            Mora.count({ where: { idSucursal, deleted: false } }),
            Mora.count({ where: { pagada: true, idSucursal, deleted: false } }),
            Mora.count({ where: { pagada: false, idSucursal, deleted: false } }),
            Mora.sum('montoMora', { where: { pagada: true, idSucursal, deleted: false } }) || 0,
            Mora.sum('montoMora', { where: { pagada: false, idSucursal, deleted: false } }) || 0,
            Mora.sum('montoMora', { where: { idSucursal, deleted: false } }) || 0,
        ]);

        return {
            cantidadRegistrosMoras,
            cantidadMorasPagadas,
            cantidadMorasPendientes,
            montoTotalMorasPagadas,
            montoTotalMorasPendientes,
            montoTotalMoras,
            montoTotalPagadoRangoMes,
            moras,
        };
    } catch (error) {
        console.error('Error al obtener información de moras:', error);
        throw new Error('Error al obtener información de moras');
    }
};



