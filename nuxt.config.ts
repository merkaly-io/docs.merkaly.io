import { defineNuxtConfig } from 'nuxt/config';

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  extends: ['docus'], // Nuxt Content + Nuxt UI docs layer: navigation, search, llms.txt

  modules: ['@nuxt/eslint', '@vueuse/nuxt'],

  compatibilityDate: 'latest',

  devServer: {
    port: Number(process.env.PORT || 6505),
  },

  devtools: { enabled: false },

  llms: {
    description: 'Documentación de Merkaly: glosario, flujos, ciclos de vida, arquitectura y decisiones.',
    full: {
      description: 'Todo el contenido de la documentación de Merkaly en un solo archivo, para pasárselo a una IA.',
      title: 'Merkaly Docs',
    },
    title: 'Merkaly Docs',
  },

  mcp: { enabled: false }, // Docus MCP server: not needed, llms.txt covers AI access

  routeRules: {
    '/arquitectura/mensajeria': { redirect: { statusCode: 301, to: '/plataforma/mensajeria' } }, // old paths, before the domain layers
    '/arquitectura/reintentos': { redirect: { statusCode: 301, to: '/plataforma/reintentos' } },
    '/arquitectura/servicios': { redirect: { statusCode: 301, to: '/plataforma/servicios' } },
    '/flujos/registro-auth0': { redirect: { statusCode: 301, to: '/flujos/auth0-avisa-cambio' } }, // signup moved to www /create
    '/decisiones/payments-sin-estado': { redirect: { statusCode: 301, to: '/pagos/decisiones/payments-sin-estado' } },
    '/decisiones/un-mensaje-por-proveedor': { redirect: { statusCode: 301, to: '/pagos/decisiones/un-mensaje-por-proveedor' } },
    '/decisiones/un-solo-estado-del-cobro': { redirect: { statusCode: 301, to: '/pagos/decisiones/un-solo-estado-del-cobro' } },
    '/decisiones/webhooks-puerta-sin-exchange': { redirect: { statusCode: 301, to: '/plataforma/decisiones/webhooks-puerta-sin-exchange' } },
    '/**': {
      headers: {
        'referrer-policy': 'strict-origin-when-cross-origin',
        'strict-transport-security': 'max-age=31536000', // no includeSubDomains: covers only docs
        'x-content-type-options': 'nosniff',
        'x-frame-options': 'DENY', // nobody frames the docs
      },
    },
  },

  site: {
    name: 'Merkaly Docs',
    url: process.env.NUXT_SITE_URL || 'https://docs.merkaly.io',
  },

  vite: {
    server: {
      allowedHosts: ['docs.merkaly.test'],
    },
  },
});
