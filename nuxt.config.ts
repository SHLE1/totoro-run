import inject from '@rollup/plugin-inject';

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  srcDir: 'app',
  pages: true,
  ssr: false,
  devtools: { enabled: false },
  routeRules: { '/totoro/**': { proxy: 'https://app.xtotoro.com/app/**' } },
  css: [
    '@unocss/reset/tailwind.css',
    '~/assets/styles/tokens.css',
    '~/assets/styles/base.css',
  ],
  modules: ['@unocss/nuxt', '@pinia/nuxt'],
  vite: {
    build: { commonjsOptions: { transformMixedEsModules: true } },
    resolve: { alias: { buffer: 'buffer' } },
    define: { global: 'globalThis' },
    plugins: [inject({ Buffer: ['buffer', 'Buffer'] })],
    optimizeDeps: {
      include: ['@vueuse/core', 'date-fns', 'uuid', 'md5'],
    },
  },
});
