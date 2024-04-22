// src/config/sequelize.config.ts
import { Sequelize } from 'sequelize-typescript';
import { Cliente } from '../models/cliente';
import { Cuota } from '../models/cuota';
import { Usuario } from '../models/usuario';
import { Mora } from '../models/mora';
import { Prestamo } from '../models/prestamo';
import { Sucursal } from '../models/sucursal';
import { HistorialPago } from '../models/historialPago';
import { DetallePago } from '../models/detallePago';
import { DetalleFrecuencia } from '../models/detalleFrecuenciaPago';
import { FrecuenciaPago } from '../models/frecuenciaPago';
import { HistorialPagoMora } from '../models/historialPagoMora';
import { DetallePagoMora } from '../models/detallePagoMora';

export const sequelize = new Sequelize({
  dialect: 'mysql',
  host: 'localhost',
  username: 'root',
  password: '',
  database: 'prestamo_node_api_MySql',
  timezone: '+00:00', // Configura Sequelize para usar UTC
  models: [DetallePagoMora, HistorialPagoMora,Cliente, Cuota, DetallePago, Usuario, Mora, Prestamo, Sucursal, HistorialPago,FrecuenciaPago, DetalleFrecuencia],
  logging: false, // Desactiva los mensajes de registro de consultas SQL
});