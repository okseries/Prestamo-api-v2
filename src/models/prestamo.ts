import { Column, Model, Table, DataType, ForeignKey, BelongsTo, HasMany } from 'sequelize-typescript';
import { Cliente } from './cliente';
import { Cuota } from './cuota';
import { Sucursal } from './sucursal';
import { DetalleFrecuencia } from './detalleFrecuenciaPago';


// Definición de la tabla 'Prestamo' en la base de datos
@Table({ tableName: 'Prestamo' })
export class Prestamo extends Model<Prestamo> {
    // Campo para el ID del préstamo, clave primaria y autoincremental
    @Column({ primaryKey: true, autoIncrement: true, type: DataType.INTEGER })
    idPrestamo!: number;

    // Campos para la información financiera del préstamo
    @Column({ type: DataType.DECIMAL(10, 2) })
    capital!: number;

    @Column({ type: DataType.DECIMAL(10, 2) })
    tasaPorcentaje!: number;

    @Column({ type: DataType.DECIMAL(10, 2) })
    porcentajeMora!: number;

    @Column({ type: DataType.INTEGER })
    tiempo!: number;

    @Column({ type: DataType.DECIMAL(10, 2) })
    interes!: number;

    @Column({ type: DataType.DECIMAL(10, 2) })
    monto!: number;

    @Column({ type: DataType.DECIMAL(10, 2) })
    cuota!: number;

    //ejemplo: despues que una cuota es vencida tiene hasta 5 dias para pagar sin que genere mora.
    @Column({ type: DataType.INTEGER })
    umbralDiasPago!: number;

    // Campos para las fechas del préstamo
    @Column({ type: DataType.DATEONLY })
    fechaInicioPago!: Date;

    @Column({ type: DataType.DATEONLY })
    fechaFin!: Date;

    // Campo para el estado del préstamo (activo o inactivo)
    @Column({ type: DataType.BOOLEAN })
    estado!: boolean;   

    // Clave foránea para la relación con la tabla 'Cliente'
    @ForeignKey(() => Cliente)
    @Column({ type: DataType.INTEGER })
    idCliente!: number;

    // Relación con la tabla 'Cliente'
    @BelongsTo(() => Cliente)
    cliente!: Cliente;

    // Relación uno a muchos con la tabla 'Cuota'
    @HasMany(() => Cuota)
    cuotas!: Cuota[];    

    // Clave foránea para la relación con la tabla 'Sucursal'
    @ForeignKey(() => Sucursal)
    @Column({ type: DataType.INTEGER })
    idSucursal!: number;

    // Relación con la tabla 'Sucursal'
    @BelongsTo(() => Sucursal)
    sucursal!: Sucursal;

    @HasMany(() => DetalleFrecuencia)
    detalleFrecuencia!: DetalleFrecuencia[];

    @Column({ type: DataType.BOOLEAN,  defaultValue: false })
    deleted!: boolean;

    
}
