import { Column, Model, Table, DataType, ForeignKey, BelongsTo } from 'sequelize-typescript';
import { Cuota, EstadoPago } from './cuota';
import { HistorialPago } from './historialPago';
import { Sucursal } from './sucursal';
import { Mora } from './mora';

@Table({ tableName: 'detallePago' }) 
export class DetallePago extends Model<DetallePago> {
  @Column({ primaryKey: true, autoIncrement: true, type: DataType.INTEGER })
  idDetallePago!: number;

  @Column({
    type: DataType.ENUM('Pendiente', 'Pagado', 'Cancelado', 'Vencido', 'Pago Parcial', 'N/A')
  })
  estadoAnterior!: EstadoPago;
  

  @ForeignKey(() => Cuota)
  @Column({  type: DataType.INTEGER })
  idCuota!: number;

  @ForeignKey(() => Mora)
  @Column({  type: DataType.INTEGER })
  idMora!: number;

  @Column({type: DataType.DECIMAL(10,2)})
  montoPagado!: number;

  @BelongsTo(() => Cuota)
  cuota!: Cuota;

  @BelongsTo(() => Mora)
  mora!: Cuota;

  @ForeignKey(()=> HistorialPago)
  @Column({  type: DataType.INTEGER })
  idHistorialPago!: number;

  @BelongsTo(()=> HistorialPago)
  historialPago!: HistorialPago;

  @ForeignKey(()=> Sucursal)
  @Column({  type: DataType.INTEGER })
  idSucursal!: number;

  @BelongsTo(()=> Sucursal)
  sucursal!: Sucursal;

  @Column({ type: DataType.BOOLEAN,  defaultValue: false })
    deleted!: boolean;

}

