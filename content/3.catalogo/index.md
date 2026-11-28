---
title: Catálogo
description: 'Productos, variantes, categorías, marcas y las páginas de la tienda.'
navigation:
  title: Resumen
  icon: i-lucide-layers
---

## Qué es

Lo que la tienda vende y cómo lo muestra.

- Un [producto](/glosario/product) solo nace de una importación del proveedor. Tiene una o más [variantes](/glosario/variant), una por combinación de opciones.
- El precio vive en la variante: [costo, precio de venta y margen](/glosario/variant-price). Cuando el proveedor cambia el costo, el precio de venta se recalcula con el mismo margen.
- El catálogo no tiene stock propio: el stock es el del proveedor.
- El comprador nunca ve el costo, el margen ni los datos del proveedor.
- La home del store se arma con [páginas de la tienda](/glosario/store-page) que el comerciante edita.

## Qué edita cada uno

| Dato | Lo escribe |
| --- | --- |
| Nombre, descripción, categoría, marca, póster, activo | el comerciante (admin) |
| Precio de venta | el comerciante; se guarda el margen que implica |
| Costo, imágenes, opciones, origen, atributos, rating y vendidos | el proveedor (importación y sincronización) |
| Salud del producto (supplier.state) | el proveedor |

## Precio

| Pieza | Regla |
| --- | --- |
| Margen por defecto | 10 % al importar (se puede elegir de 0 a 1000 %) |
| Precio de venta | costo más el margen, redondeado, en centavos |
| Costo nuevo del proveedor | recalcula el precio de venta con el mismo margen (sincronización, cotización y checkout) |
| Ventas ya hechas | guardan su precio; un cambio del catálogo no las toca |

## Páginas de la tienda

La home tiene bloques fijos en un orden fijo. El comerciante cambia textos, imágenes y links, u oculta un bloque. No hay borrador: guardar publica.

| Bloque | Qué edita |
| --- | --- |
| Anuncio | hasta 3 mensajes de la barra superior (aparece en todas las páginas) |
| Hero | banner y acción secundaria |
| Destacados | hasta 4 ítems con ícono |
| Colecciones | hasta 4 categorías |
| Novedades | título y banner; los productos son los 8 últimos activos |
| Tendencias | título; 8 productos |
| Liquidación | banner y código de cupón |
| Ofertas | título y fecha de fin; 4 productos |
| Marcas | las marcas a mostrar |
| Newsletter | título y texto |
| Pie | los sellos, en el orden elegido |

Lo que no está guardado muestra el contenido de fábrica del store.

## Entidades

Toca una entidad para ver sus campos clave y con qué se relaciona. Las punteadas son de otro dominio.

::content-entity-map{domain="catalogo"}
::

## Ciclos de vida

::content-lifecycle-list{domain="catalogo"}
::

## Flujos

::content-flow-list{domain="catalogo"}
::

::content-flow{flow="importar-producto"}
::

## Decisiones

- [El catálogo solo nace de una importación](/catalogo/decisiones/catalogo-solo-por-importacion)

## En el código

| Dónde | Qué hay |
| --- | --- |
| [api.merkaly.io `src/domain/catalog`](https://github.com/merkaly-io/api.merkaly.io/tree/master/src/domain/catalog) | Productos, variantes, categorías, marcas y la regla de precio |
| [api.merkaly.io `src/domain/content`](https://github.com/merkaly-io/api.merkaly.io/tree/master/src/domain/content) | Páginas de la tienda |
| [api.merkaly.io `src/domain/provider`](https://github.com/merkaly-io/api.merkaly.io/tree/master/src/domain/provider) | Importación y sincronización desde el proveedor |

## Glosario

::content-glossary{domain="catalogo"}
::
