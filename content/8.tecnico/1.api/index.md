---
title: api.merkaly.io
description: Arquitectura, convenciones, runbooks y datos de prueba del api.
navigation:
  title: Resumen
  icon: i-lucide-layers
---

El api guarda todos los registros y aplica las reglas de negocio. Código: [merkaly-io/api.merkaly.io](https://github.com/merkaly-io/api.merkaly.io). Los README de carpeta (`src/domain/**/README.md`, `src/infrastructure/README.md`) siguen en el repo, junto al código.

## Arquitectura

- [Applications and routing](/tecnico/api/architecture/applications)
- [Business domain boundaries](/tecnico/api/architecture/domains)
- [Tenants: store host -> Auth0 organization](/tecnico/api/architecture/tenants)
- [Order lifecycle: finance, order and logistics](/tecnico/api/architecture/order-lifecycle)

## Convenciones

- [Layers and file roles](/tecnico/api/conventions/layers)
- [Cross-collection access](/tecnico/api/conventions/cross-collection-access)
- [Search queries](/tecnico/api/conventions/search-queries)
- [Money convention: integer cents](/tecnico/api/conventions/money)
- [Async errors convention](/tecnico/api/conventions/async-errors)
- [Rate limiting](/tecnico/api/conventions/rate-limiting)
- [Clients: which Auth0 app calls the api](/tecnico/api/conventions/clients)
- [Flows: execute y helpers](/tecnico/api/conventions/flows)

## Runbooks

- [Asaas main account setup](/tecnico/api/runbooks/asaas-account-setup)

## Desarrollo

- [Test data seeding: order fixtures](/tecnico/api/test-data-seeding)
