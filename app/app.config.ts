export default defineAppConfig({
  docus: {
    locale: 'es', // Docus UI strings (search, toc, edit); an i18n selector comes later
  },
  header: {
    logo: {
      alt: 'Merkaly',
      dark: 'https://cdn.merkaly.io/brand/isotipo/chip.svg',
      favicon: 'https://cdn.merkaly.io/brand/favicon/favicon.ico', // Docus falls back to /favicon.ico without it
      light: 'https://cdn.merkaly.io/brand/isotipo/chip.svg',
    },
    title: 'Merkaly Docs',
  },
  seo: {
    description: 'Cómo funciona Merkaly: dominios, glosario, flujos, ciclos de vida y decisiones.',
    title: 'Merkaly Docs',
  },
  socials: {},
  toc: {
    title: 'En esta página',
  },
  ui: {
    colors: {
      neutral: 'zinc',
      primary: 'merkaly',
    },
  },
});
