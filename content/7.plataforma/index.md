---
title: Plataforma
description: 'Los servicios, la mensajería entre ellos y los reintentos.'
navigation:
  title: Resumen
  icon: i-lucide-layers
---

## Qué es

Cómo se hablan los servicios de Merkaly. Cada servicio hace una sola cosa y los mensajes entre ellos viajan por RabbitMQ.

::u-page-grid
  :::u-page-card
  ---
  title: Servicios
  description: Quién hace qué, y quién le habla a quién.
  icon: i-lucide-server
  to: /plataforma/servicios
  ---
  :::

  :::u-page-card
  ---
  title: Mensajería
  description: Cómo viajan hoy los mensajes. Exchanges, colas, routing keys, emit, command e invoke, con recorridos animados.
  icon: i-lucide-send
  to: /plataforma/mensajeria
  ---
  :::

  :::u-page-card
  ---
  title: Reintentos
  description: Qué pasa cuando un handler falla y dónde terminan los mensajes muertos.
  icon: i-lucide-rotate-cw
  to: /plataforma/reintentos
  ---
  :::
::


## Ciclos de vida

::content-lifecycle-list{domain="plataforma"}
::

## Flujos

::content-flow-list{domain="plataforma"}
::

## Decisiones

- [webhooks es la puerta, sin exchange propio](/plataforma/decisiones/webhooks-puerta-sin-exchange)

## En el código

| Dónde | Qué hay |
| --- | --- |
| [webhooks.merkaly.io `src`](https://github.com/merkaly-io/webhooks.merkaly.io/tree/master/src) | La puerta de entrada de los proveedores |
| [payments.merkaly.io `src`](https://github.com/merkaly-io/payments.merkaly.io/tree/master/src) | El único que habla con el proveedor de pagos |
| [signals.merkaly.io `src`](https://github.com/merkaly-io/signals.merkaly.io/tree/master/src) | Notificaciones |
| [nest `docs`](https://github.com/merkaly-io/nest/tree/master/docs) | Contrato de eventos y mensajería compartida |

## Glosario

::content-glossary{domain="plataforma"}
::
