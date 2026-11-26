export default defineAppConfig({
  docus: {
    locale: 'es', // Docus UI strings (search, toc, edit); an i18n selector comes later
  },
  header: {
    logo: {
      alt: 'Merkaly',
      class: 'h-7', // the imagotipo is wide (about 4:1)
      dark: 'https://cdn.merkaly.io/brand/imagotipo/dark.svg',
      favicon: 'https://cdn.merkaly.io/brand/favicon/favicon.ico', // Docus falls back to /favicon.ico without it
      light: 'https://cdn.merkaly.io/brand/imagotipo/ink.svg',
    },
    title: 'Merkaly Docs',
  },
  merkaly: {
    headerLinks: [ // Docus has no header links key: AppHeaderCTA renders these
      { icon: 'i-lucide-book-open', label: 'Glosario', to: '/glosario' },
      { icon: 'i-lucide-workflow', label: 'Flujos', to: '/flujos' },
      { icon: 'i-lucide-git-fork', label: 'Ciclos de vida', to: '/ciclos' },
      { icon: 'i-lucide-scale', label: 'Decisiones', to: '/decisiones' },
    ],
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
