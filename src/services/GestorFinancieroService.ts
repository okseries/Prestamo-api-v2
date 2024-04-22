import { Cuota, EstadoPago } from "../models/cuota";
import { HistorialPago } from "../models/historialPago";
import { Mora } from "../models/mora";
import { Prestamo } from "../models/prestamo";

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


