import { router as clienteRoute } from "./clienteRoute";
import { router as cuotaRoute } from "./cuotaRoute";
import { router as prestamoRoute } from "./prestamoRoute";
import { router as detallePagoRoute } from "./detallePagoRoute";
import { router as moraRoute } from "./moraRoute";
import { router as usuarioRoute } from "./usuarioRoute";
import { router as sucursalRoute } from "./sucursalRoute";
import { router as historialPagoRoute } from "./historialPagoRoute";
import { router as frecuenciaPagoRoute } from "./frecuenciaPagoRoute";
import { router as GestorFinancieroRoutes } from "./GestorFinancieroRoutes";
import { router as payMoraCuotaController } from "./payCuotaMoraRoute";
import { router as historialPagoMoraRoute } from "./historialPagoMoraRoute";
import { router as detallePagoMoraRoute } from "./detallePagoMora";

/**
 * Conjunto de rutas disponibles en la aplicación.
 */
export const Rutas = {
    /**
     * Rutas relacionadas con la gestión de clientes.
     */
    clienteRoute,

    /**
     * Rutas relacionadas con la gestión de cuotas.
     */
    cuotaRoute,

    /**
     * Rutas relacionadas con la gestión de préstamos.
     */
    prestamoRoute,

    /**
     * Rutas relacionadas con el detalle de pago.
     */
    detallePagoRoute,

    /**
     * Rutas relacionadas con la gestión de moras.
     */
    moraRoute,

    /**
     * Rutas relacionadas con la gestión de usuarios.
     */
    usuarioRoute,

    /**
     * Rutas relacionadas con la gestión de sucursales.
     */
    sucursalRoute,

    /**
     * Rutas relacionadas con el historial de pagos.
     */
    historialPagoRoute,

    frecuenciaPagoRoute,

    GestorFinancieroRoutes,
    payMoraCuotaController,
    historialPagoMoraRoute,
    detallePagoMoraRoute,
};
