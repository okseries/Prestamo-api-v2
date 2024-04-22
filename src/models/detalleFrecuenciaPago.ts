import { BelongsTo, Column, DataType, ForeignKey, Model, Table } from "sequelize-typescript";
import { FrecuenciaPago } from "./frecuenciaPago";
import { Prestamo } from "./prestamo";

@Table({ tableName: 'detalleFrecuencia' })
export class DetalleFrecuencia extends Model<DetalleFrecuencia> {
    @Column({ primaryKey: true, autoIncrement: true, type: DataType.INTEGER })
    idDetalleFrecuencia!: number;

    @ForeignKey(()=> Prestamo)
    @Column({ type: DataType.INTEGER })
    idPrestamo!: number;

    @BelongsTo(()=> Prestamo)
    prestamo!: Prestamo;

    @ForeignKey(()=> FrecuenciaPago)
    @Column({ type: DataType.INTEGER })
    idFrecuencia!: number;

    @BelongsTo(()=> FrecuenciaPago)
    frecuenciaPago!: FrecuenciaPago;

    @Column({ type: DataType.INTEGER })
    cadaCuantosDias!: number;

    @Column({ type: DataType.INTEGER })
    diaDelMesEnNumero!: number;

    @Column({ type: DataType.STRING(15) })
    nombreDiaSemana!: string;

    @Column({ type: DataType.BOOLEAN,  defaultValue: false })
    deleted!: boolean;
}