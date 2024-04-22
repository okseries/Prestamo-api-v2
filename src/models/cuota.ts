import { Column, Model, Table, DataType, ForeignKey, BelongsTo, BeforeCreate, HasMany } from 'sequelize-typescript';
import { Prestamo } from './prestamo';
import { Sucursal } from './sucursal';
import { Mora } from './mora';
import { DetallePago } from './detallePago';

export enum EstadoPago {
    Pendiente = 'Pendiente',
    Pagado = 'Pagado',
    Cancelado = 'Cancelado',
    Vencido = 'Vencido',
    PagoParcial = 'Pago Parcial',
    Confirmado = 'Confirmado',
}

@Table({ tableName: 'Cuota' })
export class Cuota extends Model<Cuota> {
    @Column({ primaryKey: true, autoIncrement: true, type: DataType.INTEGER })
    idCuota!: number;

    @Column({ type: DataType.INTEGER })
    numeroCuota!: number;

    @Column({ type: DataType.DATE })
    fechaCuota!: Date;

    @Column({ type: DataType.DECIMAL(10, 2) })
    montoCuota!: number;

    @Column({ type: DataType.DECIMAL(10, 2), defaultValue: 0 })
    montoPagado?: number;

    @Column({ type: DataType.ENUM(...Object.values(EstadoPago)) })
    estado!: EstadoPago;

    @ForeignKey(() => Prestamo)
    @Column({ type: DataType.INTEGER })
    idPrestamo!: number;

    @BelongsTo(() => Prestamo)
    prestamo!: Prestamo;

    @ForeignKey(() => Sucursal)
    @Column({ type: DataType.INTEGER })
    idSucursal!: number;

    @BelongsTo(() => Sucursal)
    sucursal!: Sucursal;
    
    @HasMany(()=> Mora)
    mora!: Mora[];

    @HasMany(()=> DetallePago)
    detallePago!: DetallePago[];

    @Column({ type: DataType.BOOLEAN,  defaultValue: false })
    deleted!: boolean;


}
