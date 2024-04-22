Modulo pago:

Pago de Cuotas no Vencidas:
El monto pagado debe ser mayor que 0 y menor o igual al monto de la cuota.
No se puede pagar una cuota que ya está saldada.
Pagos Parciales:
Se permiten pagos parciales solo para una cuota a la vez.
Si se pagan varias cuotas, se debe pagar el monto total de todas las cuotas seleccionadas.
Pago de Mora:
Si una cuota tiene mora, se prioriza el pago de la mora.
El monto a pagar debe ser como mínimo el monto de la mora.
El monto sobrante después de pagar la mora se aplica a la cuota. Si es igual al monto de la cuota, se considera saldo; si es menor, se considera pago parcial.
Pago de Varias Cuotas con o sin Mora:
Si se seleccionan varias cuotas y al menos una tiene mora, el monto total a pagar debe ser exactamente la suma de todas las cuotas y moras seleccionadas.
Registro de Pagos:
Se crea un registro en la tabla de historial de pago con detalles como el monto total pagado y el cliente que realizó el pago.
Se crea un detalle de pago asociado a ese historial, indicando el monto pagado para cada cuota y mora, si corresponde.
