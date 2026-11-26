---
title: Identidad
description: 'Usuarios, organizaciones, membresías, roles y sesión.'
navigation:
  title: Resumen
  icon: i-lucide-layers
---

## Qué es

Quién es quién en Merkaly, y qué puede abrir cada uno.

- [Auth0](/glosario/auth0) es la fuente de verdad: [usuarios](/glosario/user), [organizaciones](/glosario/organization) (una por tienda), [membresías](/glosario/membership) y [roles](/glosario/role).
- Cada usuario tiene **un solo rol**. `MK_*` es staff de Merkaly; `ORG_*` es de la tienda.
- El api no guarda usuarios propios: lee Auth0 y guarda una copia del equipo por tienda.
- Auth0 avisa sus cambios por Event Streams; llegan al api por [webhooks](/glosario/webhooks) y [merkaly.auth](/glosario/merkaly-auth).

## Quién entra a qué

| App | Quién entra | Organización en el login | Quién lo controla |
| --- | --- | --- | --- |
| admin | miembros de la tienda (cualquier rol) | obligatoria: elige la tienda | Auth0 (membresía) y el api (`org_id` del token) |
| dashboard | solo staff (`MK_*`), solo lectura | ninguna: trabaja sobre todas | Action [Enforce surface access](/glosario/enforce-surface-access) y el api |
| www | cualquiera; el login es opcional | ninguna: el registro pasa antes de tener tienda | nadie |
| store | compradores; el login es opcional | permitida, sin pedirla | la tienda sale del host, nunca del cliente |

Además, cada app solo puede llamar a sus rutas del api y a `/auth/*` ([superficie](/glosario/surface)).

## Entidades

Toca una entidad para ver sus campos clave y con qué se relaciona. Las punteadas son de otro dominio.

::content-entity-map{domain="identidad"}
::

## Ciclos de vida

::content-lifecycle-list{domain="identidad"}
::

## Flujos

::content-flow-list{domain="identidad"}
::

El registro, de punta a punta:

::content-flow{flow="alta-tienda"}
::

## Decisiones

- [El registro vive en www, no en una Action](/identidad/decisiones/registro-en-www)
- [Un solo rol por usuario](/identidad/decisiones/un-rol-por-usuario)
- [Cambiar el subdominio no redirige](/identidad/decisiones/subdominio-sin-redireccion)
- [Auth0 manda en la identidad de la tienda](/identidad/decisiones/auth0-fuente-de-verdad)

## En el código

| Dónde | Qué hay |
| --- | --- |
| [auth.merkaly.io `src/actions`](https://github.com/merkaly-io/auth.merkaly.io/tree/master/src/actions) | Actions de login: claim de rol, acceso por app, vincular por email |
| [auth.merkaly.io `docs/tenant-setup.md`](https://github.com/merkaly-io/auth.merkaly.io/blob/master/docs/tenant-setup.md) | Configuración del tenant de Auth0: apps, roles, conexiones, tokens |
| [api.merkaly.io `src/domain/account`](https://github.com/merkaly-io/api.merkaly.io/tree/master/src/domain/account) | Registro, equipo, perfil, datos personales, subdominio |
| [api.merkaly.io `src/application/auth`](https://github.com/merkaly-io/api.merkaly.io/tree/master/src/application/auth) | Rutas `/auth/*` que usan todas las apps |
| [api.merkaly.io `docs/architecture/tenants.md`](https://github.com/merkaly-io/api.merkaly.io/blob/master/docs/architecture/tenants.md) | Mapa de tiendas: host a organización |
| [api.merkaly.io `docs/conventions/clients.md`](https://github.com/merkaly-io/api.merkaly.io/blob/master/docs/conventions/clients.md) | Qué app puede llamar a qué rutas |
| [www.merkaly.io `app/pages/create`](https://github.com/merkaly-io/www.merkaly.io/tree/master/app/pages/create) | La pantalla de registro |
| [nuxt `README.md`](https://github.com/merkaly-io/nuxt/blob/master/README.md) | Sesión en las apps: login, renovación y sesión expirada |

## Glosario

::content-glossary{domain="identidad"}
::
