import { FrecuenciaPago } from "../models/frecuenciaPago";


export const getAllFrecuenciaPago = async (): Promise<FrecuenciaPago[]> => {
    try {
        const detallesFrecuencias = await FrecuenciaPago.findAll();
        return detallesFrecuencias;
    } catch (error: any) {
        throw new Error("Error al obtener todss las frecuencia de pago: ", error.message);
    }
}

export const getFrecuenciaPagoById = async (idFrecuencia: number): Promise<FrecuenciaPago | null> => {
    try {
        const detalleFrecuencia = await FrecuenciaPago.findByPk(idFrecuencia);
        return detalleFrecuencia;
    } catch (error: any) {
        throw new Error("Error al obtener la frecuencia de pago por ID: ", error.message);
    }
}

export const createFrecuenciaPago = async (detalleFrecuenciaData: FrecuenciaPago): Promise<FrecuenciaPago> => {
    try {
        const detalleFrecuenciaCreada = await FrecuenciaPago.create(detalleFrecuenciaData);
        return detalleFrecuenciaCreada;
    } catch (error: any) {
        throw new Error("Error al crear la frecuencia de pago: ", error.message);
    }
}

export const updateFrecuenciaPago = async (idFrecuencia: number, detalleFrecuenciaData: Partial<FrecuenciaPago>): Promise<[number]> => {
    try {
        const updatedRowCount = await FrecuenciaPago.update(
            detalleFrecuenciaData,
             {where: {idFrecuencia}},
             );
        return updatedRowCount;
    } catch (error: any) {
        throw new Error("Error al actualizar la frecuencia de pago: ", error.message);
    }
}

export const deleteFrecuenciaPago = async (idFrecuencia: number): Promise<number> => {
    try {
        const deletedRowCount = FrecuenciaPago.destroy(
            {where: { idFrecuencia }
        });
        return deletedRowCount;
    } catch (error: any) {
        throw new Error("Error al eliminar la frecuencia de pago: ", error.message);
    }
}
