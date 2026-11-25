---
title: Pagos
description: 'Cómo cobra la tienda, cómo se reembolsa y cómo retira su dinero.'
navigation:
  title: Resumen
  icon: i-lucide-layers
---

## Qué es

Cómo la tienda recibe el dinero de sus ventas.

- Merkaly tiene la cuenta principal en el proveedor de pagos ([Asaas](/glosario/asaas) hoy). Cada organización tiene su propia **cuenta de pago**, que solo sirve para recibir.
- Cada cobro se crea en la cuenta de Merkaly con un **reparto del 100 %** a la cuenta de la tienda. Merkaly no cobra comisión.
- El comerciante pasa su saldo a su propia llave Pix con un **retiro** manual desde el admin.
- El [api](/glosario/api) guarda todos los registros y las reglas. Solo [payments](/glosario/payments) habla con el proveedor, y no guarda estado.

::note
El resto del dominio (reembolsos, retiros, contracargos, saldo retirable) se está pasando a esta documentación.
::


## Entidades

Toca una entidad para ver sus campos clave y con qué se relaciona. Las punteadas son de otro dominio.

::content-entity-map{domain="pagos"}
::

## Ciclos de vida

::content-lifecycle-list{domain="pagos"}
::

## Flujos

::content-flow-list{domain="pagos"}
::

## Decisiones

- [payments no guarda estado](/pagos/decisiones/payments-sin-estado)
- [Un solo estado del cobro](/pagos/decisiones/un-solo-estado-del-cobro)
- [Un mensaje por proveedor de pagos](/pagos/decisiones/un-mensaje-por-proveedor)

## En el código

| Dónde | Qué hay |
| --- | --- |
| [api.merkaly.io `src/domain/integration/payment`](https://github.com/merkaly-io/api.merkaly.io/tree/master/src/domain/integration/payment) | Cuenta de pago, cobros, retiros y el puente con payments |
| [api.merkaly.io `src/domain/finance`](https://github.com/merkaly-io/api.merkaly.io/tree/master/src/domain/finance) | Registros: pagos, reembolsos, retiros, contracargos y deudas |
| [payments.merkaly.io `docs`](https://github.com/merkaly-io/payments.merkaly.io/tree/master/docs) | Contrato de payments |

## Glosario

::content-glossary{domain="pagos"}
::
