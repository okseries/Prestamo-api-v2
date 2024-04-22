import { Column, Model, Table, DataType, ForeignKey, BelongsTo, BeforeSave } from 'sequelize-typescript';
//import bcrypt from 'bcrypt';
import { Sucursal } from './sucursal';

@Table({ tableName: 'Usuario' })
export class Usuario extends Model<Usuario> {
  @Column({ primaryKey: true, autoIncrement: true, type: DataType.INTEGER })
  idUsuario!: number;

  @Column({ type: DataType.STRING(25), unique: true })
  usuarioCorreo!: string;

  @Column({ type: DataType.STRING(25) })
  nombre!: string;

  @Column({ type: DataType.STRING(25) })
  clave!: string; 

  @Column({ defaultValue: true, type: DataType.BOOLEAN })
  estado!: boolean;

  @ForeignKey(() => Sucursal)
  @Column({ type: DataType.INTEGER })
  idSucursal!: number;

  @BelongsTo(() => Sucursal)
  sucursal!: Sucursal;

  // Antes de guardar, encriptar la contraseña si ha sido modificada
 /* @BeforeSave
  static async hashPassword(instance: Usuario) {
    if (instance.changed('clave')) {
      const hashedClave = await bcrypt.hash(instance.getDataValue('clave'), 10);
      instance.setDataValue('clave', hashedClave);
    }
  }*/
}
