import { Cliente } from "../models/cliente";
import { Cuota } from "../models/cuota";
import { DetallePago } from "../models/detallePago";
import { HistorialPago } from "../models/historialPago";
import { Mora } from "../models/mora";


export const getAllDetallePago = async (idSucursal: number): Promise<DetallePago[]> => {
    try {
        const detallePagos = await DetallePago.findAll({ where: { idSucursal } });
        return detallePagos;
    } catch (error) {
        throw new Error(`Error al obtener los detalles de pagos: ${error}`);
    }
}

export const createDetallePago = async (DetallePagoData: DetallePago): Promise<DetallePago> => {
    try {
        const DetallePagoCreated = await DetallePago.create(DetallePagoData);
        return DetallePagoCreated;
    } catch (error) {
        throw new Error(`Ha ocurido un error al crear el detalle de pago: ${error}`);
    }
}

export const getDetallePagoById = async (idDetallePago: number): Promise<DetallePago | null> => {
    try {
        const detallePago = await DetallePago.findByPk(idDetallePago);
        return detallePago;
    } catch (error) {
        throw new Error(`Ha ocurrido un error al obtener el detalle del pago: ${error}`);
    }
}

export const updateDetallePago = async (idDetallePago: number, DetallePagoData: DetallePago,): Promise<[affectedCount: number, updatedDetallePago: DetallePago | null]> => {
    try {
        const [affectedCount] = await DetallePago.update(DetallePagoData, { where: { idDetallePago }, returning: true, });
        const updatedDetallePago = await getDetallePagoById(idDetallePago);
        return [affectedCount, updatedDetallePago];
    } catch (error) {
        throw new Error(`Ha ocurido un error al crear el detalle de pago: ${error}`);
    }
}


export const deleteDetallePago = async (idDetallePago: number): Promise<[affectedCount: number, deletedDetallePago: DetallePago | null]> => {
    try {
        const affectedCount = await DetallePago.destroy({ where: { idDetallePago } });
        const deletedDetallePago = await getDetallePagoById(idDetallePago);
        return [affectedCount, deletedDetallePago];
    } catch (error) {
        throw new Error(`Ha ocurido un error al eliminar el detalle de pago: ${error}`);
    }
}




export const getDetallePagoPorIdHistorialPago = async (idHistorialPago: number): Promise<DetallePago[]> => {
    try {
        const detallePago = await DetallePago.findAll({
            where: { idHistorialPago },
            include: [
                {
                    model: Cuota,
                },
                {
                    model: Mora,
                },
                {
                    model: HistorialPago,
                    include: [
                        {
                            model: Cliente
                        }
                    ]
                }
            ]
        });
        return detallePago;
    } catch (error) {
        throw new Error(`Ha ocurrido un error al obtener el detalle de pago por el id: ${idHistorialPago} del historial de pago: ${error}`);
    }
}




