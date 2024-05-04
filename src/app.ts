import express, { Express } from "express";
import bodyParser from 'body-parser';
import { sequelize } from "./config/sequelize.config";
import { Rutas } from "./routes/rutas";
import cors from 'cors';
import { obtenerInformacionMoras } from "./services/GestorFinancieroService";

const app: Express = express();

app.use(express.json()); 
app.use(bodyParser.json());
app.use(cors()); //cors sin restricciones 


app.use('/api/v1/cuotas', Rutas.cuotaRoute);
app.use('/api/v1/detallePagos', Rutas.detallePagoRoute);
app.use('/api/v1/clientes', Rutas.clienteRoute);
app.use('/api/v1/prestamos', Rutas.prestamoRoute);
app.use('/api/v1/moras', Rutas.moraRoute); 
app.use('/api/v1/usuarios', Rutas.usuarioRoute);
app.use('/api/v1/sucursales', Rutas.sucursalRoute); 
app.use('/api/v1/historialPagos', Rutas.historialPagoRoute); 
app.use('/api/v1/frecuenciaPagos', Rutas.frecuenciaPagoRoute); 
app.use('/api/v1/gestorFinanciero', Rutas.GestorFinancieroRoutes); 
app.use('/api/v1/', Rutas.payMoraCuotaController); 
app.use('/api/v1/historialMora', Rutas.historialPagoMoraRoute); 
app.use('/api/v1/detallePagoMora', Rutas.detallePagoMoraRoute); 



// Sincroniza los modelos con la base de datos antes de iniciar el servidor
sequelize.sync()
  .then(() => {
    console.log('Base de datos sincronizada correctamente');
    // Inicia el servidor después de sincronizar la base de datos
    const PORT = process.env.PORT || 8080;
    app.listen(PORT, () => {
      console.log(`Servidor en ejecución en el puerto ${PORT}`);
    });
  })
  .catch((error) => {
    console.error('Error al sincronizar la base de datos:', error);
  });



;


/*// Suponiendo que tienes un array de IDs de cuotas
const idsCuotas: number[] = [21];

// Luego, llamas a la función createMoras con este array como argumento
createMoras(idsCuotas)
  .then((result) => {
    console.log(result); // Aquí puedes manejar el resultado si es necesario
  })
  .catch((error) => {
    console.error(error); // Maneja cualquier error que ocurra durante el proceso
  });*/



 //const pago = payMoras([34, 35], 12384);
 //const pago = payMoras([34], 8352);
 //console.log(pago);

 

 
 
