import { Model, Column, DataType, Table, ForeignKey, BelongsTo, HasMany } from 'sequelize-typescript';
import { Sucursal } from './sucursal';
import { Prestamo } from './prestamo';

@Table({ tableName: 'cliente' })
export class Cliente extends Model<Cliente> {
    @Column({ type: DataType.INTEGER, primaryKey: true, autoIncrement: true })
    idCliente!: number;

    @Column({ type: DataType.STRING(15) })
    identificacion!: string;

    @Column({ type: DataType.STRING(25) })
    primerNombre!: string;

    @Column({ type: DataType.STRING(25) })
    segundoNombre!: string;

    @Column({ type: DataType.STRING(25) })
    apellidoPaterno!: string;

    @Column({ type: DataType.STRING(25) })
    apellidoMaterno!: string;

    @Column({ type: DataType.STRING(15) })
    telefono!: string;

    @Column({ type: DataType.STRING(50) })
    correo?: string;

    @Column({ type: DataType.STRING(100) })
    direccion!: string;

    @Column({ type: DataType.DECIMAL(10, 2) })
    ingresos!: number;

    @Column({ type: DataType.STRING(50) })
    dondeLabora!: string;

    @Column({ type: DataType.BOOLEAN,  defaultValue: false })
    deleted!: boolean;

    @ForeignKey(() => Sucursal)
    @Column({  type: DataType.INTEGER })
    idSucursal!: number;

    @BelongsTo(() => Sucursal)
    sucursal!: Sucursal;

    @HasMany(() => Prestamo)
    prestamo!: Prestamo[];
}
