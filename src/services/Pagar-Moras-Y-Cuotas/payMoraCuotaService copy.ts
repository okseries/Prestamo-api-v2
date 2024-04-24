// import { sequelize } from "../../config/sequelize.config";
// import { Op, Transaction, where } from "sequelize";
// import { Cuota, EstadoPago } from "../../models/cuota";
// import { Mora } from "../../models/mora";
// import { HistorialPago } from "../../models/historialPago";
// import { DetallePago } from "../../models/detallePago";
// import { Prestamo } from "../../models/prestamo";

// // Función para realizar el pago de cuotas y moras
// export const PayMoraCuota = async (idsMoras: number[], idPrestamo: number, idsCuotas: number[], montoPagadoParametro: number): Promise<boolean> => {
//     try {
//         // console.log('Datos recibidos para el pago de cuotas y moras:');
//         // console.log('IDs de las moras:', idsMoras);
//         // console.log('ID del idPrestamo:', idPrestamo);
//         // console.log('IDs de las cuotas:', idsCuotas);
//         // console.log('Monto total pagado:', montoPagadoParametro);
//         await sequelize.transaction(async (t: Transaction) => {
//             // console.log('Iniciando transacción...');

//             const prestamo = await Prestamo.findByPk(idPrestamo)

//             if (!prestamo) {
//                 throw new Error(`No se ha encontrade el prestamo con el ID: ${idPrestamo}`)
//             }
//             const idCliente: number = (prestamo ? parseInt(prestamo?.dataValues.idCliente.toString()) : 0);
//             const idSucursal: number = (prestamo ? parseInt(prestamo?.dataValues.idSucursal.toString()) : 0);
//             //console.log('prestamo:', prestamo);
//             // console.log('idCliente:', idCliente);
//             // console.log('idSucursal:', idSucursal);

//             // Lógica para procesar el pago de cuotas y moras

//             // Calculamos el monto total a pagar
//             const { montoTotal } = await calcularMontoTotal(idsMoras, idsCuotas, t);
//             // console.log('montoTotal', montoTotal);


//             // Verificamos que el monto total pagado coincida exactamente con el monto total calculado
//             // if (montoPagadoParametro !== montoTotal) {
//             //     throw new Error(`El monto total pagado (${montoPagadoParametro}) no coincide con el monto total calculado (${montoTotal})`);
//             // }

//             await updateMoraCuota(montoPagadoParametro, idsMoras, idsCuotas, t);

//             // Creamos el historial de pago
//             const historialPago = await crearHistorialPago(montoPagadoParametro, idCliente, idSucursal, t);


//             // Creamos el detalle de pago asociado al historial de pago
//             await crearDetallePago(/*historialPago.idHistorialPago*/1, idsCuotas, idsMoras, montoPagadoParametro, idSucursal, t);
//         });

//         console.log('Transacción completada.');
//         return true;
//     } catch (error) {
//         console.error('Error en PayMoraCuota:', error);
//         return false;
//     }
// }

// const findCuotasByIds = async (idsCuotas: number[], transaction: Transaction) => {
//     return await Cuota.findAll({
//         where: { idCuota: { [Op.in]: idsCuotas }, deleted: false },
//         transaction: transaction,
//         include: [{ model: Prestamo, attributes: ['idSucursal'] }]

//     });
// };

// const findMorasByIds = async (idsMoras: number[], transaction: Transaction) => {
//     return await Mora.findAll({
//         where: { idMora: { [Op.in]: idsMoras }, deleted: false },
//         transaction: transaction,
//     });
// }

// const calculateTotalMontoMoras = (morasActuales: any[]) => {
//     return morasActuales.reduce((sum, mora) => {
//         const montoMora = parseFloat(mora.dataValues.montoMora.toString());
//         return sum + montoMora;
//     }, 0);
// };

// const calculateTotalMontoCuotas = (cuotasActuales: any[]) => {
//     return cuotasActuales.reduce((sum, cuota) => {
//         const montoCuota = parseFloat(cuota.dataValues.montoCuota.toString());
//         const montoPagado = parseFloat(cuota.dataValues.montoPagado?.toString() ?? "0");
//         return sum + (montoCuota - montoPagado);
//     }, 0);
// };

// // Función para calcular el monto total a pagar
// const calcularMontoTotal = async (idsMoras: number[], idsCuotas: number[], transaction: Transaction): Promise<{ montoTotal: number, montoTotalMora: number, montoTotalCuota: number }> => {
//     let montoTotal = 0;

//     // console.log('calcularMontoTotal : montoTotal', montoTotal);
//     // console.log('calcularMontoTotal : idsMoras', idsMoras);
//     // console.log('calcularMontoTotal : idsCuotas', idsCuotas);

//     // Calculamos el monto total de las moras seleccionadas
//     const morasActuales = await findMorasByIds(idsMoras, transaction);
//     const montoTotalMora = calculateTotalMontoMoras(morasActuales);

//     // console.log('*************************calculateTotalMontoMoras', montoTotalMora);


//     // Calculamos el monto total de las cuotas seleccionadas
//     const cuotasActuales = await findCuotasByIds(idsCuotas, transaction);
//     const montoTotalCuota = calculateTotalMontoCuotas(cuotasActuales);

//     // console.log('*************************calculateTotalMontoCuotas', montoTotalCuota);
//     montoTotal = montoTotalMora + montoTotalCuota

//     return { montoTotal, montoTotalMora, montoTotalCuota };
// };


// const updateMoraCuota = async (montoPagadoParametro: number, idsMoras: number[], idsCuotas: number[], transaction: Transaction): Promise<boolean> => {
//     try {

//         let { montoTotalMora, montoTotalCuota } = await calcularMontoTotal(idsMoras, idsCuotas, transaction);

//         // Procesar las cuotas
//         for (const idCuota of idsCuotas) {
//             const cuota = await Cuota.findByPk(idCuota, { transaction });

//             if (!cuota) {
//                 throw new Error(`Cuota con ID ${idCuota} no encontrada`);
//             }

//             // Verificar si la cuota ya ha sido saldada
//             if (cuota.estado === EstadoPago.Pagado) {
//                 throw new Error(`La cuota con ID ${idCuota} ya ha sido saldada`);
//             }

//             // Obtener el valor original de la cuota
//             const valorOriginalDeCuota = cuota && cuota.dataValues.montoCuota !== undefined
//                 ? parseFloat(cuota.dataValues.montoCuota.toString())
//                 : 0;

//             // Obtener el valor pagado de la cuota hasta ahora
//             const valorPagadoCuota = cuota && cuota.dataValues.montoPagado !== undefined
//                 ? parseFloat(cuota.dataValues.montoPagado.toString())
//                 : 0;

//             // Calcular el monto adeudado de la cuota
//             const montoAdeudadoCuota = valorOriginalDeCuota - valorPagadoCuota;

//             // este sera el monto al cual se actualizara la cuota como monto pagado.


//             // Determinar el nuevo estado de la cuota


//             montoTotalCuota -= montoAdeudadoCuota;
//             const nuevoMontoPagado = valorPagadoCuota + montoAdeudadoCuota;

//             console.log(`ID cuota: ${idCuota} Monto adeudado: ${montoAdeudadoCuota} `);
//             console.log(`ID cuota: ${idCuota} Monto que se esta pagando: ${nuevoMontoPagado} `);


//             const nuevoEstado = nuevoMontoPagado === valorOriginalDeCuota
//                 ? EstadoPago.Pagado
//                 : EstadoPago.PagoParcial;
//             // Actualizar la cuota
//             /*await Cuota.update(
//                 { estado: nuevoEstado, montoPagado: nuevoMontoPagado },
//                 { where: { idCuota: idCuota }, transaction }
//             );*/
//         }

//         // Procesar las moras
//         for (const idMora of idsMoras) {
//             if (idMora === null) {
//                 // Si el ID de la mora es nulo, lo ignoramos y pasamos al siguiente
//                 continue;
//             }

//             const mora = await Mora.findByPk(idMora, { transaction });

//             const montoAdeudadoMora = mora && mora.dataValues.montoMora !== undefined
//                 ? parseFloat(mora.dataValues.montoMora.toString())
//                 : 0;

//             montoTotalMora -= montoAdeudadoMora;

//             console.log(`ID mora: ${idMora} Monto adeudado: ${montoAdeudadoMora} `);


//             if (!mora) {
//                 throw new Error(`Mora con ID ${idMora} no encontrada`);
//             }

//             // Aquí puedes colocar la lógica para procesar las moras
//         }

//         return true; // Indicar que la actualización se realizó correctamente
//     } catch (error) {
//         console.error('Error al actualizar las cuotas y moras:', error);
//         return false; // Indicar que hubo un error durante la actualización
//     }
// }



// // Función para crear el historial de pago
// const crearHistorialPago = async (montoPagado: number, idCliente: number, idSucursal: number, transaction: Transaction): Promise<void> => {
//     try {


//         const historialData: HistorialPago = {
//             monto: montoPagado,
//             idCliente,
//             idSucursal,
//             estado: EstadoPago.Confirmado,
//         } as HistorialPago;

//         //const historialPago = await HistorialPago.create(historialData, { transaction });
//         console.log('=============================HistorialPago****************************');

//         console.log('Se ha creado el historial de pago., ', historialData);
//         console.log('=============================HistorialPago****************************');

//     } catch (error) {
//         console.error('Error al crear el historial de pago:', error);
//         throw error;
//     }
// };

// // Función para crear el detalle de pago asociado al historial de pago
// const crearDetallePago = async (idHistorialPago: number, idsCuotas: number[], idsMoras: number[], montoPagadoParametro: number, idSucursal: number, transaction: Transaction): Promise<void> => {
//     try {
//         let { montoTotalMora, montoTotalCuota } = await calcularMontoTotal(idsMoras, idsCuotas, transaction);

//         // Creamos el detalle de pago asociado a cada cuota seleccionada
//         for (const idCuota of idsCuotas) {
//             const cuota = await Cuota.findByPk(idCuota, { transaction });

//             // Obtener el valor original de la cuota
//             const valorOriginalDeCuota = cuota && cuota.dataValues.montoCuota !== undefined
//                 ? parseFloat(cuota.dataValues.montoCuota.toString())
//                 : 0;

//             // Obtener el valor pagado de la cuota hasta ahora
//             const valorPagadoCuota = cuota && cuota.dataValues.montoPagado !== undefined
//                 ? parseFloat(cuota.dataValues.montoPagado.toString())
//                 : 0;

//             // Calcular el monto adeudado de la cuota
//             const montoAdeudadoCuota = valorOriginalDeCuota - valorPagadoCuota;

//             // este sera el monto al cual se actualizara la cuota como monto pagado.
//             const nuevoMontoPagado = valorPagadoCuota + montoPagadoParametro;


//             montoTotalCuota -= montoAdeudadoCuota;

//             console.log(`ID cuota: ${idCuota} Monto adeudado: ${montoAdeudadoCuota} `);

//             console.log('******************detalleData****************************');

//             const detalleData: DetallePago = {
//                 idHistorialPago: 1,
//                 idCuota,
//                 montoPagado: montoAdeudadoCuota,
//                 idSucursal
//             } as DetallePago;
//             console.log(detalleData);
            

//             console.log('******************detalleData****************************');



//             //await DetallePago.create(detalleData, { transaction });
//         }

//         // Creamos el detalle de pago asociado a cada mora seleccionada
//         for (const idMora of idsMoras) {
//             if (idMora === null) {
//                 // Si el ID de la mora es nulo, lo ignoramos y pasamos al siguiente
//                 continue;
//             }
//             const mora = await Mora.findByPk(idMora, { transaction });
//             // Obtener el valor original de la cuota
//             const valorAdeudadoMora = mora && mora.dataValues.montoMora !== undefined
//                 ? parseFloat(mora.dataValues.montoMora.toString())
//                 : 0;

//                 montoTotalMora -= valorAdeudadoMora;
//                 console.log('+++++++++++++++++++++detalleData++++++++++++++++++++++++');
//             const detalleData: DetallePago = {
//                 idHistorialPago,
//                 idMora,
//                 montoPagado: valorAdeudadoMora,
//                 idSucursal

//             } as DetallePago;

//             console.log(detalleData);
            
//             console.log('******************detalleData++++++++++++++++++++++++');

//             // await DetallePago.create(detalleData, { transaction });
//         }

//         console.log('Se han creado los detalles de pago asociados al historial de pago.');
//     } catch (error) {
//         console.error('Error al crear los detalles de pago asociados al historial de pago:', error);
//         throw error;
//     }
// };
