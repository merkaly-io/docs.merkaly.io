---
title: Proveedores
description: 'El proveedor de cada tienda: de dónde salen los productos y dónde se hacen los pedidos.'
navigation:
  title: Resumen
  icon: i-lucide-layers
---

## Qué es

De dónde salen los productos y a quién se le compra cada venta.

- Un [proveedor](/glosario/provider) es una fuente de dropshipping: su catálogo aparece en la tienda y los pedidos se hacen ahí automáticamente. No es una [integración](/glosario/integration) ni [configuración](/glosario/settings) ([la decisión](/proveedores/decisiones/proveedor-no-es-integracion)).
- Hoy el único proveedor es [AliExpress](/glosario/aliexpress), con **una cuenta por organización**, creada y operada por Merkaly ([cuenta del proveedor](/glosario/supplier-account)), que se conecta desde el dashboard. No hay una cuenta compartida de respaldo.
- El proveedor alimenta el [catálogo](/catalogo) (importar y sincronizar) y los [pedidos](/pedidos) (cotizar, comprar, seguir y cancelar).
- Cada tienda vende en un solo [mercado](/glosario/market) (hoy Brasil). Las lecturas usan ese país; el costo real se recotiza con el destino del pedido.
- El comprador nunca ve al proveedor. Los documentos internos sí lo nombran.

## Qué hace Merkaly con AliExpress

| Qué | Cómo |
| --- | --- |
| Importar un producto | Vista previa y luego importación, siempre releyendo al proveedor |
| Sincronizar | A pedido del comerciante; no hay sondeo |
| Cotizar | Costo, stock y flete por línea; el impuesto de importación sale de las reglas del proveedor |
| Comprar | Un pedido sin pagar con todas las líneas; el comerciante lo paga en su cuenta |
| Seguir | Avisos de pedido (mensaje 53) más la relectura del pedido y del tracking |
| Cancelar | AliExpress no lo permite por api: el pedido queda sin pagar y se cierra solo |
| Importar un pedido externo | Venta IMPORT con su compra y sus envíos |

## Lo que AliExpress no dice

- **Choice**: no hay un campo que lo diga. Solo el flete lo insinúa (puede ser envío de plataforma) y trae el umbral de envío gratis en la moneda del mercado. Un umbral de 0 (como en AliExpress Selection Standard) se cotiza como envío gratis: en los pedidos reales AliExpress descuenta todo el flete. Sin ese dato, la línea paga el flete de su tienda. El flete cobrado se mide en cada pedido (flete base y descuento) y se avisa si un envío cotizado gratis termina cobrado.
- **Impuesto de importación**: ninguna llamada lo cotiza. Cada proveedor trae sus reglas por país: AliExpress cobra por pedido (uno por tienda) con las reglas de la Receita y el ICMS del estado del comprador. Un envío desde el mismo país no paga. Ver [la decisión](/proveedores/decisiones/impuestos-de-importacion) y [el flujo](/flujos/calcular-impuestos).
- **Ciudades**: solo acepta las de su propia lista. El checkout y la edición de la entrega la validan; si la lista no responde, aceptan la ciudad con un aviso.
- **Plazo de pago**: cada pedido sin pagar tiene el suyo, de 2 horas a 20 días.
- **Sandbox**: no hay. En desarrollo y pruebas los pedidos se arman pero nunca se crean.

## Valores de las opciones

Cada propiedad trae el alias del vendedor y el valor estándar. Se muestra el que dice más (letras, después otro contenido, después un número suelto).

| Alias | Estándar | Se muestra |
| --- | --- | --- |
| 35-36 | 0 | 35-36 |
| 2 | Azul | Azul |
| 1 Pairs green | Ouro | 1 Pairs green |
| 2 | 0 | 2 (0), con aviso |

## Entidades

Toca una entidad para ver sus campos clave y con qué se relaciona. Las punteadas son de otro dominio.

::content-entity-map{domain="proveedores"}
::

## Ciclos de vida

::content-lifecycle-list{domain="proveedores"}
::

## Flujos

::content-flow-list{domain="proveedores"}
::

::content-flow{flow="conectar-aliexpress"}
::

## Decisiones

- [El proveedor no es una integración](/proveedores/decisiones/proveedor-no-es-integracion)
- [Una cuenta de AliExpress por organización](/proveedores/decisiones/cuenta-por-organizacion)
- [Solo la cuenta propia del comerciante](/proveedores/decisiones/solo-cuenta-propia) (reemplazada)
- [Un solo mercado por tienda](/proveedores/decisiones/mercado-unico)

## En el código

| Dónde | Qué hay |
| --- | --- |
| [api.merkaly.io `src/domain/provider`](https://github.com/merkaly-io/api.merkaly.io/tree/master/src/domain/provider) | Cuenta del proveedor, importación, sincronización, cotización y pedidos |
| [api.merkaly.io `src/domain/provider/aliexpress`](https://github.com/merkaly-io/api.merkaly.io/tree/master/src/domain/provider/aliexpress) | Un archivo por rol: transporte, conexión, adaptadores y mappers |
| [api.merkaly.io `src/application/dashboard/providers`](https://github.com/merkaly-io/api.merkaly.io/tree/master/src/application/dashboard/providers) | Conexión de la cuenta desde el dashboard (solo el equipo de Merkaly) |
| [webhooks.merkaly.io `src`](https://github.com/merkaly-io/webhooks.merkaly.io/tree/master/src) | La puerta de los avisos de AliExpress |

## Glosario

::content-glossary{domain="proveedores"}
::
