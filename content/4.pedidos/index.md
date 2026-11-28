---
title: Pedidos
description: 'Ventas al comprador, compras al proveedor y envíos.'
navigation:
  title: Resumen
  icon: i-lucide-layers
---

## Qué es

Cómo una venta pasa del carrito a la puerta del comprador.

- La [venta](/glosario/sale) es lo que el comprador compró. Nace en el checkout del store o en una importación; el admin no crea ventas.
- Para cumplirla, la tienda hace una [compra](/glosario/purchase) al proveedor por cada cuenta del proveedor. Con el pago online confirmado, esa compra es [automática](/glosario/procurement).
- El proveedor despacha en uno o varios [envíos](/glosario/shipment), cada uno con su seguimiento.
- El estado de la venta **se deriva** del pago, las compras y los envíos. Nadie lo escribe.
- El comprador nunca ve al proveedor: ni su nombre, ni sus links, ni sus códigos.
- Cómo se arma lo que paga el comprador (productos, flete, impuestos y tarifa) y qué cobra el proveedor: [Cómo se arma el cobro](/pedidos/cobro).

## Tres dominios, una venta

| Dominio | Pregunta | Estados |
| --- | --- | --- |
| Pagos | ¿Pagó el comprador? | `PENDING` `PAID` `DISPUTED` `CANCELLED` `REFUND_PENDING` `REFUND_PROCESSING` `REFUNDED` `CHARGED_BACK` |
| Pedidos | ¿Se compró al proveedor? | [Estado de la compra](/ciclos/purchase-status) |
| Pedidos (logística) | ¿Dónde está el paquete? | [Estado del envío](/ciclos/shipment-status) |
| Pedidos | Resumen para comerciante y comprador | [Estado de la venta](/ciclos/sale-status), derivado |

## Cómo se deriva el estado de la venta

La primera regla que se cumple gana.

| Estado | Regla |
| --- | --- |
| `CANCELLED` | La venta fue cancelada, el pago está cancelado, o está reembolsado o contracargado sin compra viva pagada en el proveedor. |
| `AWAITING_PAYMENT` | El pago no está pagado (ni en disputa). |
| `DELIVERED` | Sin compras vivas y todos los envíos del comerciante entregados. |
| `SUPPLIER_CANCELLED` | Sin compras vivas y una compra ya pedida fue cancelada por el proveedor. |
| `TO_ORDER` | Pagada, sin compra viva pedida todavía (ninguna, o todas `TO_PLACE` o `FAILED`). |
| `DELIVERED` | Todas las compras vivas despachadas y todos los envíos entregados. |
| `SHIPPED` | Todas las compras vivas despachadas y cada envío en tránsito o entregado. |
| `TO_PAY` | Una compra viva está pedida pero sin pagar en el proveedor. |
| `ORDERED` | En cualquier otro caso: pedida y pagada, esperando el despacho. |

Un envío `PENDING` se ignora si otro ya se mueve. Un envío en `EXCEPTION` nunca mueve la venta solo: el admin lo marca y el comerciante decide.

## Quién puede hacer qué

| Acción | Quién | Cuándo | Qué pasa |
| --- | --- | --- | --- |
| Cancelar | comerciante | `AWAITING_PAYMENT`, `TO_ORDER`, `TO_PAY`, `ORDERED` o `SUPPLIER_CANCELLED`, sin compra viva pagada en el proveedor (si no, 409) | Compras sin pagar canceladas; pago pendiente cancelado o pagado reembolsado |
| Cancelar | comprador (pedido propio del store) | `AWAITING_PAYMENT`, o pagada sin compra pagada en el proveedor | Igual que el comerciante, sin aprobación; reembolso total |
| Pedir reembolso | comprador | `DELIVERED`, pagada, dentro de los 7 días de la entrega | Venta cancelada por el comprador; las compras se mantienen (ya están pagadas); reembolso total |
| Confirmar recibido | comprador | `SHIPPED`, o `DELIVERED` dentro de los 7 días si todavía no confirmó | Envíos entregados por el comprador; venta `DELIVERED` |
| Marcar entregado | nadie | | No existe: ver la [decisión](/pedidos/decisiones/sin-entregado-manual) |

Las acciones del comprador son idempotentes: un doble clic nunca reembolsa dos veces.

## Entidades

Toca una entidad para ver sus campos clave y con qué se relaciona. Las punteadas son de otro dominio.

::content-entity-map{domain="pedidos"}
::

## Ciclos de vida

::content-lifecycle-list{domain="pedidos"}
::

## Flujos

::content-flow-list{domain="pedidos"}
::

La compra automática, paso a paso:

::content-flow{flow="compra-automatica"}
::

## Decisiones

- [El estado de la venta se deriva](/pedidos/decisiones/estado-derivado)
- [No hay "marcar como entregado"](/pedidos/decisiones/sin-entregado-manual)
- [Los descuentos del proveedor son de Merkaly](/pedidos/decisiones/descuentos-del-proveedor)

## En el código

| Dónde | Qué hay |
| --- | --- |
| [api.merkaly.io `src/domain/order`](https://github.com/merkaly-io/api.merkaly.io/tree/master/src/domain/order) | Ventas, compras, checkout, compra automática, cancelación y reembolsos |
| [api.merkaly.io `src/domain/order/flows`](https://github.com/merkaly-io/api.merkaly.io/tree/master/src/domain/order/flows) | Un archivo por flujo de negocio |
| [api.merkaly.io `src/domain/logistics`](https://github.com/merkaly-io/api.merkaly.io/tree/master/src/domain/logistics) | Envíos y sus eventos de seguimiento |
| [api.merkaly.io `docs/architecture/order-lifecycle.md`](https://github.com/merkaly-io/api.merkaly.io/blob/master/docs/architecture/order-lifecycle.md) | Lado técnico del ciclo: servicios, campos y disparadores |

## Glosario

::content-glossary{domain="pedidos"}
::
