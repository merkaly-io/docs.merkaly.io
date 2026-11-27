---
title: Documentación técnica
description: Arquitectura, convenciones, setup, runbooks y contratos de cada repositorio de Merkaly.
navigation:
  title: Resumen
  icon: i-lucide-layers
---

## Qué es

La parte técnica de Merkaly: cómo está escrito el código, no cómo funciona el negocio. Las reglas de negocio están en los dominios; aquí está lo que necesitas para trabajar en cada repositorio.

Cada repositorio conserva solo sus README de carpeta, junto al código que explican, y un enlace a esta sección. Todo lo demás (arquitectura, convenciones, setup, runbooks y contratos) vive aquí. Las páginas se mantienen en inglés, como el código.

## Repositorios

| Repositorio | Qué documenta |
| --- | --- |
| [api](/tecnico/api) | Arquitectura (aplicaciones, dominios, tenants, ciclo del pedido), convenciones, runbooks y datos de prueba. |
| [auth](/tecnico/auth) | Configuración del tenant de Auth0 y checklists de tenant y app nuevos. |
| [payments](/tecnico/payments) | Contrato entre api, webhooks y payments sobre RabbitMQ. |
| [admin](/tecnico/admin) | El layout del admin y cómo se relacionan las páginas con él. |
| [nest](/tecnico/nest) | Mensajería entre servicios con `@merkaly/nest` y la propuesta del paquete. |
