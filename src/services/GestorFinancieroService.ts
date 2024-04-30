import { Cuota, EstadoPago } from "../models/cuota";
import { HistorialPago } from "../models/historialPago";
import { Mora } from "../models/mora";
import { Prestamo } from "../models/prestamo";
import { Op } from 'sequelize';

export const obtenerCantidadTotalPrestada = async (idSucursal: number) => {
  try {
    const sumaCantidadPrestada = await Prestamo.sum('capital', { where: { deleted: false, idSucursal } }) || 0;
    console.log('Suma de capital prestado:', sumaCantidadPrestada);
    return sumaCantidadPrestada;
  } catch (error) {
      console.error('Error al obtener la cantidad total prestada:', error);
      throw new Error('Error al obtener la cantidad total prestada');
  }
};

export const obtenerMontoTotalPrestamos = async (idSucursal: number) => {
  try {
    const sumaMontoTotal = await Prestamo.sum('monto', { where: { deleted: false, idSucursal } }) || 0;
    console.log('Suma del monto total (Capital total + Intereses total):', sumaMontoTotal);
    return sumaMontoTotal;
  } catch (error) {
      console.error('Error al obtener el monto total de los préstamos:', error);
      throw new Error('Error al obtener el monto total de los préstamos');
  }
};


export const obtenerSumaInteresesPrestamos = async (idSucursal: number) => {
    try {
        const sumaIntereses = await Prestamo.sum('interes', { where: { deleted: false, idSucursal } }) || 0;
        console.log('Suma de intereses de préstamos:', sumaIntereses);
        return sumaIntereses;
    } catch (error) {
        console.error('Error al obtener la suma de intereses de los préstamos:', error);
        throw new Error('Error al obtener la suma de intereses de los préstamos');
    }
};

export const obtenerSumaDeHistorilPago = async (idSucursal: number): Promise<number> =>{
    try {
        const montoPagado = await HistorialPago.sum('monto', {where: {estado: 'Confirmado', idSucursal, deleted: false }})

        return montoPagado;
    } catch (error: any) {
        console.error('Error al obtener la suma de historial de pago:', error);
        throw new Error('Error al obtener la suma de historial de pago');
        
    }
}

export const obtenerSumaDemorasGeneral = async (idSucursal: number): Promise<number> =>{
    try {
        const sumaMoras = await Mora.sum('montoMora', {where:  {idSucursal, deleted: false} })

        return sumaMoras;
    } catch (error: any) {
        console.error('Error al obtener la suma de las moras:', error);
        throw new Error('Error al obtener la suma de las moras');
        
    }
}

export const obtenerSumaDemorasPagadas = async (idSucursal: number): Promise<number> =>{
    try {
        const sumaMorasPagadas = await Mora.sum('montoMora', {where:  {idSucursal, deleted: false, pagada: true} })

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
          sumaCuotasPagoParcial
      ] = await Promise.all([
          Cuota.count({ where: { idSucursal, deleted: false } }),
          Cuota.count({ where: { estado: EstadoPago.Pagado, idSucursal, deleted: false } }),
          Cuota.count({ where: { estado: EstadoPago.Pendiente, idSucursal, deleted: false } }),
          Cuota.count({ where: { estado: EstadoPago.PagoParcial, idSucursal, deleted: false } }),
          Cuota.sum('montoCuota', { where: { estado: EstadoPago.Pagado, idSucursal, deleted: false } }) || 0,
          Cuota.sum('montoCuota', { where: { estado: EstadoPago.Pendiente, idSucursal, deleted: false } }) || 0,
          Cuota.sum('montoCuota', { where: { estado: EstadoPago.PagoParcial, idSucursal, deleted: false } })
      ]);      

      // Manejar el caso de sumaCuotasPagoParcial null
      const sumaCuotasPagoParcialValue = isNaN(sumaCuotasPagoParcial) ? 0 : (sumaCuotasPagoParcial || 0);
      const sumaCuotasPagadoValue = isNaN(sumaCuotasPagadas) ? 0 : (sumaCuotasPagadas || 0);
      const sumaCuotasPendienteValue = isNaN(sumaCuotasPendientes) ? 0 : (sumaCuotasPendientes || 0);

      console.log('Información de cuotas obtenida:', {
          totalCuotas,
          cuotasPagadas,
          cuotasPendientes,
          cuotasPagoParcial,
          sumaCuotasPagadas: sumaCuotasPagadoValue,
          sumaCuotasPendientes: sumaCuotasPendienteValue,
          sumaCuotasPagoParcial: sumaCuotasPagoParcialValue,
      });

      return {
          totalCuotas,
          cuotasPagadas,
          cuotasPendientes,
          cuotasPagoParcial,
          sumaCuotasPagadas: sumaCuotasPagadoValue,
          sumaCuotasPendientes: sumaCuotasPendienteValue,
          sumaCuotasPagoParcial: sumaCuotasPagoParcialValue,
      };
  } catch (error) {
      console.error('Error al obtener información de cuotas:', error);
      throw new Error('Error al obtener información de cuotas');
  }
};


