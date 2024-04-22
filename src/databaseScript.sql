CREATE DATABASE   database: prestamo_node_api_MySql;
USE prestamo_node_api_MySql;

CREATE TABLE cliente (
  idCliente int(11) PRIMARY KEY AUTO_INCREMENT,
  identificacion varchar(15) NOT NULL,
  primerNombre varchar(25) NOT NULL,
  segundoNombre varchar(25) DEFAULT NULL,
  apellidoPaterno varchar(25) DEFAULT NULL,
  apellidoMaterno varchar(25) DEFAULT NULL,
  telefono varchar(15) DEFAULT NULL,
  correo varchar(50) DEFAULT NULL,
  direccion varchar(100) NOT NULL,
  ingresos decimal(10,2) DEFAULT NULL,
  dondeLabora varchar(50) DEFAULT NULL,
  estado tinyint(1) DEFAULT 1,
  idSucursal int(11) NOT NULL REFERENCES sucursal (idSucursal)
);

CREATE TABLE cuota (
  idCuota int(11) PRIMARY KEY AUTO_INCREMENT,
  numeroCuota int(11) NOT NULL,
  fechaCuota date NOT NULL,
  montoCuota decimal(10,2) NOT NULL,
  montoPagado decimal(10,2) DEFAULT 0.00,
  estado enum('Pendiente','Pagado','Cancelado','Vencido','Pago Parcial') DEFAULT 'Pendiente',
  idPrestamo int(11) NOT NULL REFERENCES prestamo (idPrestamo),
  idSucursal int(11) NOT NULL REFERENCES sucursal (idSucursal)
);

CREATE TABLE historialPago (
  idHistorialPago int(11) PRIMARY KEY AUTO_INCREMENT,
  idCliente int(11) NOT NULL REFERENCES cliente (idCliente),
  idSucursal int(11) NOT NULL REFERENCES sucursal (idSucursal),
  monto decimal(10,2) NOT NULL
);

CREATE TABLE detallePago (
  idDetallePago int(11) PRIMARY KEY AUTO_INCREMENT,
  estado enum('Pendiente','Pagado','Cancelado','Vencido','PagoParcial') NOT NULL,
  idCuota int(11) NOT NULL REFERENCES cuota (idCuota),
  montoPagado decimal(10,2) NOT NULL,
  idHistorialPago int(11) NOT NULL REFERENCES historialPago(idHistorialPago),
  idSucursal int(11) NOT NULL REFERENCES sucursal (idSucursal)
);

CREATE TABLE mora (
  idMora int(11) PRIMARY KEY AUTO_INCREMENT,
  montoMora decimal(10,2) NOT NULL,
  idCuota int(11) NOT NULL REFERENCES cuota (idCuota),
  idSucursal int(11) NOT NULL REFERENCES sucursal (idSucursal)
);

CREATE TABLE prestamo (
  idPrestamo int(11) PRIMARY KEY AUTO_INCREMENT,
  capital decimal(10,2) NOT NULL,
  tasaPorcentaje decimal(10,2) NOT NULL,
  porcentajeMora decimal(10,2) NOT NULL,
  tiempo int(11) NOT NULL,
  interes decimal(10,2) NOT NULL,
  monto decimal(10,2) NOT NULL,
  cuota decimal(10,2) NOT NULL,
  montoRestante decimal(10,2) DEFAULT NULL,
  frecuenciaCuota varchar(25) NOT NULL,
  fechaInicioPago date NOT NULL,
  fechaFin date DEFAULT NULL,
  estado tinyint(1) DEFAULT 1,
  idCliente int(11) NOT NULL REFERENCES cliente (idCliente),
  idSucursal int(11) NOT NULL REFERENCES sucursal (idSucursal)
);

CREATE TABLE FrecuenciaPago (
    idFrecuencia INT PRIMARY KEY AUTO_INCREMENT,
    descripcion VARCHAR(50)
);

CREATE TABLE DetalleFrecuencia (
    idDetalleFrecuencia INT PRIMARY KEY AUTO_INCREMENT,
    idPrestamo INT,
    idFrecuencia INT,
    cadaCuantosDias INT,
    diaDelMesEnNumero INT,
    nombreDiaSemana VARCHAR(20),
    FOREIGN KEY (idPrestamo) REFERENCES Prestamo(idPrestamo),
    FOREIGN KEY (idFrecuencia) REFERENCES FrecuenciaPago(idFrecuencia)
);


CREATE TABLE sucursal (
  idSucursal int(11) PRIMARY KEY AUTO_INCREMENT,
  nombreSucursal varchar(25) DEFAULT NULL,
  estadoSucursal tinyint(1) DEFAULT 1
);

CREATE TABLE usuario (
  idUsuario int(11) PRIMARY KEY AUTO_INCREMENT,
  usuarioCorreo varchar(25) DEFAULT NULL,
  nombre varchar(25) DEFAULT NULL,
  clave varchar(25) DEFAULT NULL,
  estado tinyint(1) DEFAULT 1,
  idSucursal int(11) NOT NULL REFERENCES sucursal (idSucursal)
);


INSERT INTO `frecuenciapago` (`idFrecuencia`, `descripcion`, `createdAt`, `updatedAt`) 
VALUES (NULL, 'Mensual', '2024-04-10 05:23:48.000000', '2024-04-10 05:23:48.000000'), 
(NULL, 'Quincenal', '2024-04-10 05:23:48.000000', '2024-04-10 05:23:48.000000'), 
(NULL, 'Quincenal', '2024-04-10 05:23:48.000000', '2024-04-10 05:23:48.000000'), 
(NULL, 'Diario', '2024-04-10 05:23:48.000000', '2024-04-10 05:23:48.000000');