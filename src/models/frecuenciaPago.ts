
import { BelongsTo, Column, DataType, HasMany, Model, Table } from "sequelize-typescript";
import { DetalleFrecuencia } from "./detalleFrecuenciaPago";

export enum Frecuencia {
    Mensual = 'Mensual',
    Quincenal = 'Quincenal',
    Semanal = 'Semanal',
    Diario = 'Diario',
};
@Table({ tableName: 'frecuenciaPago' })
export class FrecuenciaPago extends Model<FrecuenciaPago> {
    @Column({ primaryKey: true, autoIncrement: true, type: DataType.INTEGER })
    idFrecuencia!: number;

    @Column({ type: DataType.STRING(15) })
    descripcion!: string;

    @HasMany(()=> DetalleFrecuencia)
    detalleFrecuencia!: DetalleFrecuencia[];
    
}