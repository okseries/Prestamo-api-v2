import { Column, Model, Table, DataType, ForeignKey, BelongsTo } from 'sequelize-typescript';
import { Sucursal } from './sucursal';
import { Mora } from './mora';
import { HistorialPagoMora } from './historialPagoMora';

@Table({ tableName: 'detallePagoMora' }) 
export class DetallePagoMora extends Model<DetallePagoMora> {
  @Column({ primaryKey: true, autoIncrement: true, type: DataType.INTEGER })
  idDetallePagoMora!: number; 

  @ForeignKey(() => Mora)
  @Column({  type: DataType.INTEGER })
  idMora!: number;

  @Column({type: DataType.DECIMAL(10,2)})
  montoPagado!: number;

  @BelongsTo(() => Mora)
  mora!: Mora;

  @ForeignKey(()=> HistorialPagoMora)
  @Column({  type: DataType.INTEGER })
  idHistorialPagoMora!: number;

  @BelongsTo(() => HistorialPagoMora)
historialPagoMora!: HistorialPagoMora;

  @ForeignKey(()=> Sucursal)
  @Column({  type: DataType.INTEGER })
  idSucursal!: number;

  @BelongsTo(()=> Sucursal)
  sucursal!: Sucursal;

  @Column({ type: DataType.BOOLEAN,  defaultValue: false })
    deleted!: boolean;

    @Column({ type: DataType.DATE })
    fechaPago!: Date;

}

