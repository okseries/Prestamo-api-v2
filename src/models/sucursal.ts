import { Table, Column, DataType, Model, HasMany } from "sequelize-typescript";
import { Cliente } from "./cliente";
import { Usuario } from "./usuario";
import { Prestamo } from "./prestamo";
import { HistorialPago } from "./historialPago";
import { DetallePago } from "./detallePago";
import { Cuota } from "./cuota";

/**
 * Modelo para representar una sucursal.
 * @class Sucursal
 * @extends Model
 */
@Table({ tableName: 'sucursal' })
export class Sucursal extends Model<Sucursal> {
    /**
     * Identificador único de la sucursal.
     * @property {number} idSucursal - ID de la sucursal (clave primaria).
     */
    @Column({ type: DataType.INTEGER, primaryKey: true, autoIncrement: true })
    idSucursal!: number;

    /**
     * Nombre de la sucursal.
     * @property {string} nombreSucursal - Nombre de la sucursal (máximo 25 caracteres).
     */
    @Column({ type: DataType.STRING(25) })
    nombreSucursal!: string;

    /**
     * Estado de la sucursal (activo/inactivo).
     * @property {boolean} estadoSucursal - Estado de la sucursal (true para activo, false para inactivo).
     * @default true
     */
    @Column({ type: DataType.BOOLEAN, defaultValue: true })
    estadoSucursal!: boolean;

    /**
     * Relación uno a muchos con la entidad Cliente.
     * @property {Cliente[]} cliente - Array de instancias de Cliente asociadas a la sucursal.
     */
    @HasMany(() => Cliente)
    cliente!: Cliente[];

    /**
     * Relación uno a muchos con la entidad Usuario.
     * @property {Usuario[]} usuario - Array de instancias de Usuario asociados a la sucursal.
     */
    @HasMany(() => Usuario)
    usuario!: Usuario[];

    /**
     * Relación uno a muchos con la entidad prstamo.
     * @property {Prestamo[]} prestamo - Array de instancias de prestamo asociados a la sucursal.
     */
    @HasMany(() => Prestamo)
    prestamo!: Prestamo[];

    /**
     * Relación uno a muchos con la entidad historialPago.
     * @property {HistorialPago[]} historialPago - Array de instancias de historialPago asociados a la sucursal.
     */
    @HasMany(() => HistorialPago)
    historialPago!: HistorialPago[];

    /**
     * Relación uno a muchos con la entidad DetallePago.
     * @property {DetallePago[]} detallePago - Array de instancias de DetallePago asociados a la sucursal.
     */
    @HasMany(() => DetallePago)
    detallePago!: DetallePago[];


    @HasMany(() => Cuota)
    cuota!: Cuota[];
}
