import { RRule } from "rrule";

//Intl estudiar para diferentes tipos de formatos. 

/**
 * Genera reglas de recurrencia quincenales.
 * 
 * 
 * @param {Date} fechaDeLaPrimeraCuota - La fecha de inicio de la recurrencia.
 * @param {number} cantidadDeFechasAGenerar - La cantidad especificada de fechas a generar.
 * @returns {RRRule} - Regla de recurrencia quincenal.
 * @example
 * // Genera una regla de recurrencia quincenal empezando el 1 de enero de 2024 y generando 10 fechas.
 * const reglaQuincenal = frecuenciaQuincenal(new Date(2024, 0, 1), 10);
 */
export const frecuenciaQuincenal = (fechaDeLaPrimeraCuota: Date, cantidadDeFechasAGenerar: number): RRule => {
    const fechaEstatica = new Date(fechaDeLaPrimeraCuota);
    
    return new RRule({
        freq: RRule.MONTHLY,
        bymonthday: [15, 30], // Días 15 y 30 de cada mes
        dtstart: fechaEstatica,
        count: cantidadDeFechasAGenerar,
    });
};

/**
 * Genera reglas de recurrencia diaria con un intervalo especificado.
 * 
 * @param {Date} fechaDeLaPrimeraCuota - La fecha de inicio de la recurrencia.
 * @param {number} cantidadDeFechasAGenerar - La cantidad especificada de fechas a generar.
 * @param {number} cadaCuantosDias - La frecuencia en días.
 * @returns {RRRule} - Regla de recurrencia diaria.
 * @example
 * // Genera una regla de recurrencia diaria con un intervalo de 3 días, empezando el 1 de enero de 2024 y generando 10 fechas.
 * const reglaDiaria = frecuenciaDiaria(new Date(2024, 0, 1), 10, 3);
 */
export const frecuenciaDiaria = (fechaDeLaPrimeraCuota: Date, cantidadDeFechasAGenerar: number, cadaCuantosDias: number): RRule => {
    const fechaEstatica = new Date(fechaDeLaPrimeraCuota);
    if (cadaCuantosDias > 28) {
        throw new Error('La frecuencia en días no puede ser mayor de 28');
    }

    return new RRule({
        freq: RRule.DAILY,
        interval: cadaCuantosDias,
        dtstart: fechaEstatica,
        count: cantidadDeFechasAGenerar,
    });
};

/**
 * Genera reglas de recurrencia semanal en un día específico.
 * 
 * @param {Date} fechaDeLaPrimeraCuota - La fecha de inicio de la recurrencia.
 * @param {number} cantidadDeFechasAGenerar - La cantidad especificada de fechas a generar.
 * @param {string} NombreDelDiaSemana - El nombre del día de la semana (Lunes, Martes, Miércoles, etc.).
 * @returns {RRRule} - Regla de recurrencia semanal.
 * @example
 * // Genera una regla de recurrencia semanal los martes, empezando el 1 de enero de 2024 y generando 10 fechas.
 * const reglaSemanal = frecuenciaSemanal(new Date(2024, 0, 1), 10, 'Martes');
 */
export const frecuenciaSemanal = (fechaDeLaPrimeraCuota: Date, cantidadDeFechasAGenerar: number, NombreDelDiaSemana: string): RRule => {
    let frecuenciaDias;
    const fechaEstatica = new Date(fechaDeLaPrimeraCuota);
   

    switch (NombreDelDiaSemana) {
        case 'Lunes':
            frecuenciaDias = RRule.MO;
            break;
        case 'Martes':
            frecuenciaDias = RRule.TU;
            break;
        case 'Miércoles':
            frecuenciaDias = RRule.WE;
            break;
        case 'Jueves':
            frecuenciaDias = RRule.TH;
            break;
        case 'Viernes':
            frecuenciaDias = RRule.FR;
            break;
        case 'Sábado':
            frecuenciaDias = RRule.SA;
            break;
        case 'Domingo':
            frecuenciaDias = RRule.SU;
            break;
        default:
            // Si el día no coincide con ninguno, puedes manejar el caso o lanzar un error
            throw new Error('Nombre de día de la semana no válido');
    }
    return new RRule({
        freq: RRule.WEEKLY,
        byweekday: [frecuenciaDias],
        dtstart: fechaEstatica,
        count: cantidadDeFechasAGenerar,
    });
};

/**
 * Genera reglas de recurrencia mensual en un día específico.
 * 
 * @param {Date} fechaDeLaPrimeraCuota - La fecha de inicio de la recurrencia.
 * @param {number} cantidadDeFechasAGenerar - La cantidad especificada de fechas a generar.
 * @param {number} diaDelMesEnNumero - El día del mes.
 * @returns {RRRule} - Regla de recurrencia mensual.
 * @example
 * // Genera una regla de recurrencia mensual para el día 5 de cada mes, empezando el 1 de enero de 2024 y generando 10 fechas.
 * const reglaMensual = frecuenciaMensual(new Date(2024, 0, 1), 10, 5);
 */
export const frecuenciaMensual = (fechaDeLaPrimeraCuota: Date, cantidadDeFechasAGenerar: number, diaDelMesEnNumero: number): RRule => {
    const fechaEstatica = new Date(fechaDeLaPrimeraCuota);
    
    if (false) {
        throw new Error('El día del mes no puede ser mayor de 28');
    }
    return new RRule({
        freq: RRule.MONTHLY,
        bymonthday: [diaDelMesEnNumero],
        dtstart: fechaEstatica,
        count: cantidadDeFechasAGenerar,
    });
};

/**
 * Genera reglas de recurrencia mensual para el último día de cada mes.
 * 
 * @param {Date} fechaDeLaPrimeraCuota - La fecha de inicio de la recurrencia.
 * @param {number} cantidadDeFechasAGenerar - La cantidad especificada de fechas a generar.
 * @returns {RRRule} - Regla de recurrencia mensual para el último día de cada mes.
 * @example
 * // Genera una regla de recurrencia mensual para el último día de cada mes, empezando el 1 de enero de 2024 y generando 10 fechas.
 * const reglaUltimoDia = frecuenciaUltimoDiaMensual(new Date(2024, 0, 1), 10);
 */
export const frecuenciaUltimoDiaMensual = (fechaDeLaPrimeraCuota: Date, cantidadDeFechasAGenerar: number): RRule => {
    const fechaEstatica = new Date(fechaDeLaPrimeraCuota);
    return new RRule({
        freq: RRule.MONTHLY,
        bymonthday: [-1],
        dtstart: fechaEstatica,
        count: cantidadDeFechasAGenerar,
    });
};
