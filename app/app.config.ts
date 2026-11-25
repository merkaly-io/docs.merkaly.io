export default defineAppConfig({
  docus: {
    locale: 'es', // Docus UI strings (search, toc, edit); an i18n selector comes later
  },
  header: {
    logo: {
      alt: 'Merkaly',
      dark: '/favicon.svg',
      light: '/favicon.svg',
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
