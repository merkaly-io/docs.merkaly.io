import type { DefaultThemeOptions } from 'vuepress'
import { defineUserConfig } from 'vuepress'

export default defineUserConfig<DefaultThemeOptions>({
  lang: 'en-US',

  /** Ref: https://v2.vuepress.vuejs.org/reference/config.html#dest */
  dest: './dump/dist',

  /** Ref: https://v2.vuepress.vuejs.org/reference/config.html#temp */
  temp: './dump/temp',

  /** Ref: https://v2.vuepress.vuejs.org/reference/config.html#cache */
  cache: './dump/cache',

  /** Ref: https://v2.vuepress.vuejs.org/reference/config.html#public */
  public: './dump/public',

  /** Ref：https://v1.vuepress.vuejs.org/config/#title */
  title: 'Merkaly Docs',

  /** Ref：https://v1.vuepress.vuejs.org/config/#description*/
  description: 'Just playing around',

  /**
   * Extra tags to be injected to the page HTML `<head>`
   *
   * ref：https://v1.vuepress.vuejs.org/config/#head
   */
  head: [
    ['meta', { name: 'theme-color', content: '#af3e3e' }],
    ['meta', { name: 'apple-mobile-web-app-capable', content: 'yes' }],
    ['meta', { name: 'apple-mobile-web-app-status-bar-style', content: 'black' }]
  ],

  themeConfig: {
    logo: 'https://www.merkaly.io/icon.png',
    repo: 'https://github.com/sk-merkaly'
  }

})
