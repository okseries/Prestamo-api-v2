import { DetalleFrecuencia } from "../models/detalleFrecuenciaPago";

export const getAllDetalleFrecuenciaPago = async (): Promise<DetalleFrecuencia[]> => {
    try {
        const detallesFrecuencias = await DetalleFrecuencia.findAll();
        return detallesFrecuencias;
    } catch (error: any) {
        throw new Error("Error al obtener todos los detalles de frecuencia de pago: ", error.message);
    }
}

export const getDetalleFrecuenciaPagoById = async (idDetalleFrecuencia: number): Promise<DetalleFrecuencia | null> => {
    try {
        const detalleFrecuencia = await DetalleFrecuencia.findByPk(idDetalleFrecuencia);
        return detalleFrecuencia;
    } catch (error: any) {
        throw new Error("Error al obtener el detalle de frecuencia de pago por ID: ", error.message);
    }
}

export const createDetalleFrecuenciaPago = async (detalleFrecuenciaData: DetalleFrecuencia): Promise<DetalleFrecuencia> => {
    try {
        const detalleFrecuenciaCreada = await DetalleFrecuencia.create(detalleFrecuenciaData);
        // Logging
        console.log("Detalle de frecuencia de pago creado correctamente:", detalleFrecuenciaCreada.toJSON());
        return detalleFrecuenciaCreada;
    } catch (error: any) {
        // Manejo de errores específicos
        if (error.name === 'SequelizeUniqueConstraintError') {
            throw new Error("Ya existe un detalle de frecuencia de pago con estos datos.");
        } else {
            throw new Error("Error al crear un nuevo detalle de frecuencia de pago: ", error.message);
        }
    }
};



export const updateDetalleFrecuenciaPago = async (idPrestamo: number, detalleFrecuenciaData: Partial<DetalleFrecuencia>): Promise<[number]> => {
    try {
        const updatedRowCount = await DetalleFrecuencia.update(
            detalleFrecuenciaData,
            { where: { idPrestamo } },
        );


        return updatedRowCount;
    } catch (error: any) {
        throw new Error("Error al actualizar el detalle de frecuencia de pago: ", error.message);
    }
}

export const deleteDetalleFrecuenciaPago = async (idDetalleFrecuencia: number): Promise<number> => {
    try {
        const deletedRowCount = DetalleFrecuencia.destroy(
            {
                where: { idDetalleFrecuencia }
            });
        return deletedRowCount;
    } catch (error: any) {
        throw new Error("Error al eliminar el detalle de frecuencia de pago: ", error.message);
    }
}
