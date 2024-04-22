import { Column, Model, DataType, ForeignKey, BelongsTo, Table, HasMany } from 'sequelize-typescript';
import { Cliente } from "./cliente";
import { Sucursal } from './sucursal';
import { DetallePago } from './detallePago';
import { EstadoPago } from './cuota';
import { DetallePagoMora } from './detallePagoMora';

/**
 * Modelo para la tabla 'historialPago'.
 */
@Table({ tableName: 'historialPagoMora' })
export class HistorialPagoMora extends Model<HistorialPagoMora>{
    
    @Column({ type: DataType.INTEGER, primaryKey: true, autoIncrement: true })
    idHistorialPagoMora!: number;

    @ForeignKey(() => Cliente)
    idCliente!: number;

    @BelongsTo(() => Cliente)
    cliente!: Cliente;

    @Column({ type: DataType.DECIMAL(10, 2) })
    montoPagado!: number;

    @ForeignKey(() => Sucursal)
    idSucursal!: number;

    @BelongsTo(() => Sucursal)
    sucursal!: Sucursal;

    @HasMany(()=> DetallePagoMora)
    detallePagoMora!: DetallePagoMora[];

    @Column({ type: DataType.BOOLEAN,  defaultValue: false })
    deleted!: boolean;

    @Column({ type: DataType.DATE })
    fechaPago!: Date;
    
}
