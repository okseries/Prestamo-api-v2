import { Column, Model, DataType, ForeignKey, BelongsTo, Table, HasMany } from 'sequelize-typescript';
import { Cliente } from "./cliente";
import { Sucursal } from './sucursal';
import { DetallePago } from './detallePago';
import { EstadoPago } from './cuota';

/**
 * Modelo para la tabla 'historialPago'.
 */
@Table({ tableName: 'historialPago' })
export class HistorialPago extends Model<HistorialPago>{
    /**
     * Identificador único del historial de pago.
     */
    @Column({ type: DataType.INTEGER, primaryKey: true, autoIncrement: true })
    idHistorialPago!: number;

    /**
     * Identificador del cliente asociado al historial de pago.
     */
    @ForeignKey(() => Cliente)
    idCliente!: number;

    /**
     * Relación de pertenencia con la tabla 'cliente'.
     */
    @BelongsTo(() => Cliente)
    cliente!: Cliente;

    /**
     * Monto del pago realizado.
     */
    @Column({ type: DataType.DECIMAL(10, 2) })
    monto!: number;

    /**
     * Identificador de la sucursal donde se realizó el pago.
     */
    @ForeignKey(() => Sucursal)
    idSucursal!: number;

    /**
     * Relación de pertenencia con la tabla 'sucursal'.
     */
    @BelongsTo(() => Sucursal)
    sucursal!: Sucursal;

    @Column({type: DataType.ENUM('Confirmado', 'Cancelado'), defaultValue: 'Confirmado'})
    estado?: EstadoPago;

    @HasMany(()=> DetallePago)
    detallePago!: DetallePago[];

    @Column({ type: DataType.BOOLEAN,  defaultValue: false })
    deleted!: boolean;
    
}
