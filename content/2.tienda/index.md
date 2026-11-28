---
title: Tienda
description: 'La organización como tienda: su configuración, su perfil, su dominio y sus apps.'
navigation:
  title: Resumen
  icon: i-lucide-layers
---

## Qué es

La [organización](/glosario/organization) vista como tienda.

- Cada tienda tiene su propia base de datos y su [configuración](/glosario/organization-settings): perfil, marca, contacto, mercado y numeración.
- Se ve en `<nombre>.merkaly.store` (o un dominio propio). El host dice qué tienda es; nunca el cliente.
- Vende en un solo [mercado](/glosario/market) (hoy Brasil, BRL, pt).
- Está lista para vender cuando tiene productos activos y su cuenta de pago puede cobrar ([readiness](/glosario/store-readiness)).
- Paga a Merkaly según su plan: Empezando, Vendiendo o Escalando ([Planes](/tienda/planes)).

## Las apps

| App | Para quién | Qué hace |
| --- | --- | --- |
| www.merkaly.io | cualquiera | Sitio de Merkaly y registro de tiendas (`/create`) |
| admin.merkaly.io | miembros de la tienda | Catálogo, ventas, compras, finanzas, configuración, equipo e integraciones |
| `<nombre>.merkaly.store` | compradores | La tienda: catálogo, carrito, checkout y pedidos |
| dashboard.merkaly.io | staff de Merkaly | Vista de solo lectura sobre todas las tiendas (pagos, caja, clientes) |

Quién entra a cada una está en [Identidad](/identidad).

## Lista para vender

| Pieza | De dónde sale |
| --- | --- |
| productos | cantidad de productos activos |
| pagos | la [cuenta de pago](/glosario/payment-account) puede cobrar |
| lista | productos > 0 y pagos |
| proveedor (solo admin) | la [conexión con AliExpress](/glosario/supplier-connection) está vigente |

Todo sale de datos guardados, sin llamar a ningún proveedor. Sin pagos, el store muestra el checkout como no disponible, sin decir por qué.

## Entidades

Toca una entidad para ver sus campos clave y con qué se relaciona. Las punteadas son de otro dominio.

::content-entity-map{domain="tienda"}
::

## Flujos

::content-flow-list{domain="tienda"}
::

::content-flow{flow="preparar-tienda"}
::

## Decisiones

Las decisiones que tocan a la tienda viven en su dominio: [Cambiar el subdominio no redirige](/identidad/decisiones/subdominio-sin-redireccion), [Auth0 manda en la identidad de la tienda](/identidad/decisiones/auth0-fuente-de-verdad) y [Un solo mercado por tienda](/proveedores/decisiones/mercado-unico).

## En el código

| Dónde | Qué hay |
| --- | --- |
| [api.merkaly.io `src/domain/settings`](https://github.com/merkaly-io/api.merkaly.io/tree/master/src/domain/settings) | Configuración de cada tienda, perfil, marca y subdominio |
| [api.merkaly.io `docs/architecture/tenants.md`](https://github.com/merkaly-io/api.merkaly.io/blob/master/docs/architecture/tenants.md) | Cómo el host se convierte en la tienda |
| [api.merkaly.io `docs/architecture/applications.md`](https://github.com/merkaly-io/api.merkaly.io/blob/master/docs/architecture/applications.md) | Dónde vive cada ruta según quién la llama |
| [admin.merkaly.io](https://github.com/merkaly-io/admin.merkaly.io) | El panel de la tienda |
| [store.merkaly.io](https://github.com/merkaly-io/store.merkaly.io) | La tienda del comprador |
| [dashboard.merkaly.io](https://github.com/merkaly-io/dashboard.merkaly.io) | El panel interno de Merkaly |
| [www.merkaly.io](https://github.com/merkaly-io/www.merkaly.io) | El sitio y el registro |

## Glosario

::content-glossary{domain="tienda"}
::
