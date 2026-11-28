# Borrador de trabajo: planes comerciales

**Fecha de conversación:** 27 de noviembre de 2026  
**Para:** CEO / Founder  
**Estado:** borrador interno; no es una regla vigente ni una decisión lista para publicar.

Esta nota conserva lo conversado para decidirlo después. Los **acuerdos** registran lo que el CEO / Founder aclaró o decidió durante la conversación, pero todavía requieren reconciliación con la documentación y la implementación. Las **propuestas** y los **puntos abiertos** no deben presentarse como condiciones comerciales aprobadas.

## Punto de partida documentado

La web muestra tres planes: **Empezando / Gratis**, R$ 0; **Vendiendo**, hasta R$ 10 por producto distinto vendido; y **Escalando / Fijo**, R$ 500 al mes. El antiguo `docs/pricing.md` del monorepo describe esos planes, pero contiene reglas en revisión y no es el destino para futuras decisiones. La fuente de verdad de documentación será `docs.merkaly.io`.

La documentación pública actual de pagos en `docs.merkaly.io` describe un split del 100 % a la tienda, ninguna comisión de Merkaly, retiros manuales y liberación siete días después de la entrega. Por tanto, las formas de cobro, los retiros automáticos y el plazo de **días hábiles** conversados aquí no describen necesariamente el producto implementado hoy.

## Acuerdos y aclaraciones del CEO / Founder

### Vendiendo: base y límite

- El límite se cuenta por **producto distinto**, no por unidad ni por variante. Si se venden 100 unidades de un producto y 15 de otro, el máximo conjunto del período es R$ 20: hasta R$ 10 para cada producto.
- La base de cálculo es la **ganancia después de costos atribuible a cada producto**, nunca el importe bruto pagado por el comprador. Merkaly toma hasta el **50 % de esa ganancia**, con un máximo de **R$ 10 por producto en el período**. Hay que definir el período de imputación antes de convertirlo en una regla operativa.
- Ejemplo de un producto: cinco unidades con R$ 4 de ganancia neta cada una aportan R$ 2 cada una a Merkaly y completan los R$ 10. Las unidades posteriores de ese producto no aportan más en ese período.
- Ejemplo de dos productos: uno con R$ 5 de ganancia neta aporta R$ 2,50; otro con R$ 10 aporta R$ 5. Se computan por separado.
- Si un producto no alcanza R$ 10 durante el período, el faltante no pasa al mes siguiente.
- El CEO / Founder prefirió calcular y descontar el cargo **en un único momento de extracción**, sobre ventas válidas, sin reservar ni mover fondos por cada venta. La frecuencia final de extracción sigue abierta.
- Una venta totalmente cancelada o reembolsada no debe generar ganancia para Merkaly. Si después de un retiro Merkaly adelanta dinero para reembolsar al comprador porque la tienda no tiene saldo suficiente, nace una deuda de la tienda con Merkaly. El CEO / Founder rechazó tratar artificialmente el cargo del plan como una deuda separada; el efecto numérico de un reembolso tardío sobre un cargo ya cobrado sigue abierto.

### Disponibilidad y cierre del mes

- La ganancia se vuelve retirable cuando la venta ha sido entregada y han pasado **siete días hábiles** para reclamación o reembolso. Falta conciliar este plazo con los siete días sin calificación que indican los documentos actuales.
- El mes calendario termina al finalizar su último día. En el **esquema mensual automático discutido**, el cálculo y la extracción ocurrirían el día 1 siguiente, con intervalo de ventas `[inicio del mes, inicio del mes siguiente)`. Este esquema sirve como referencia del debate, no como decisión de frecuencia final ni como descripción de la implementación actual.

## Propuestas en evaluación

### Gratis: tarifa de servicio al comprador

El CEO / Founder propuso que, además de los anuncios, **Gratis** incluya una tarifa de servicio de Merkaly expresada como porcentaje de la venta general y pagada por el **consumidor final**. No se descontaría de la ganancia del comerciante. El propósito comercial sería financiar recursos del plan Gratis y hacer que los compradores de tiendas en Vendiendo tengan un precio final menor. **No se aprobó un porcentaje**: 5 % y 10 % fueron solo ejemplos.

Se empleó también la palabra «impuesto» en la conversación, pero esta nota usa **tarifa de servicio** hasta que se revise el tratamiento fiscal. No se adopta aquí ninguna interpretación legal.

### Cambios de plan y Escalando

- Se planteó inicialmente que un cambio de plan a mitad de mes surtiera efecto el siguiente día 1, mientras que una tienda nueva que elige un plan de pago empezaría de inmediato. El CEO / Founder reabrió la primera regla para estudiar upgrades y prorrateo: **es provisional**.
- Escalando mantiene como referencia R$ 500 mensuales. Para una tienda nueva que entra a mitad de mes se debatieron cobro completo, días iniciales gratis y cobro proporcional. El CEO / Founder mencionó **R$ 250 como ejemplo de media mensualidad**, no R$ 150. No quedó aprobada una fórmula, una fecha de cobro ni una política de upgrades o downgrades.
- Se retiró una recomendación de renovación por aniversario al entrar en conflicto con la idea de cambios el día 1. No debe tratarse como opción preferida.

## Decisiones abiertas para el CEO / Founder

1. **Retiros y cómputo:** definir la frecuencia final de retiros. Una sola extracción mensual podría demorar ganancias ya liberadas. Definir si el tope de Vendiendo corresponde al mes de la venta o al mes de liberación o extracción, y cómo se aplica cuando las ventas cruzan el cierre.
2. **Reembolsos tardíos:** fijar el cálculo cuando un reembolso ocurre después de haber cobrado el cargo del plan, sin inventar una compensación ni tratarlo artificialmente como una deuda separada. Precisar también qué ventas cuentan como válidas al extraer.
3. **Cambios de plan:** resolver vigencia, upgrades, downgrades, prorrateo, inicio de un plan de pago en una tienda nueva y fechas de cobro de Escalando.
4. **Gratis:** decidir porcentaje; base exacta (ítems, flete, impuestos y tarifa Pix); tratamiento de reembolsos; presentación transparente del precio final; destinatario y contabilidad de la tarifa; y posible pérdida de conversión para el comerciante.

## Discrepancias que habrá que resolver antes de publicar reglas

- El antiguo `docs/pricing.md` aún habla de descontar el cargo de Vendiendo venta por venta y afirma que ningún plan toma un porcentaje del importe de la venta. Ambas afirmaciones requieren revisión si se aprueban las propuestas de hoy; no se modifica ese archivo con esta nota.
- La web actual presenta tres planes y promete «sin porcentaje por venta». Esa promesa tendrá que revisarse si se adopta la tarifa de servicio de Gratis. La propuesta no cambia por sí sola los precios públicos.
- `docs.merkaly.io` describe split del 100 % a la tienda, ausencia de comisión, retiros solo manuales y siete días tras la entrega. La extracción del cargo de Vendiendo, cualquier automatización del retiro y el plazo de siete **días hábiles** necesitan una decisión cerrada y una actualización coordinada de documentación e implementación.

**Próximo uso de esta nota:** cerrar los puntos abiertos con el CEO / Founder y, solo entonces, trasladar las decisiones aprobadas a los términos, flujos o decisiones canónicas de `docs.merkaly.io` junto con los cambios de producto correspondientes.
