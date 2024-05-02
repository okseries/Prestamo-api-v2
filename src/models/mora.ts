import { Column, Model, Table, DataType, ForeignKey, BelongsTo, HasMany } from 'sequelize-typescript';
import { Cuota } from './cuota';
import { Sucursal } from './sucursal';
import { DetallePago } from './detallePago';

@Table({ tableName: 'Mora' })
export class Mora extends Model<Mora> {
    @Column({ primaryKey: true, autoIncrement: true, type: DataType.INTEGER })
    idMora!: number;    

    @Column({  type: DataType.DECIMAL(10, 2) })
    montoMora!: number;

    @ForeignKey(() => Cuota)
    @Column({ type: DataType.INTEGER })
    idCuota!: number;

    @BelongsTo(() => Cuota)
    cuota!: Cuota;

    @ForeignKey(() => Sucursal)
    @Column({  type: DataType.INTEGER })
    idSucursal!: number;

    @BelongsTo(() => Sucursal)
    sucursal!: Sucursal;


    @Column({ type: DataType.BOOLEAN, defaultValue: false })
    pagada!: boolean;

    @Column({type: DataType.INTEGER, defaultValue: false})
    diasDeRetraso!: number;

    @HasMany(()=> DetallePago)
    DetallePago!: DetallePago[];

    @Column({ type: DataType.BOOLEAN,  defaultValue: false })
    deleted!: boolean;

    @Column({ type: DataType.DATE })
    fechaGeneracion!: Date;
}
