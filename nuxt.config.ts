export default defineNuxtConfig({
  devtools: { enabled: false },
  modules: [
    '@nuxtjs/google-fonts',
  ],
  css: [
    '@for-the-people-initiative/design-system/css',
    '@for-the-people-initiative/design-system/css/theme-dark.css',
  ],
  googleFonts: {
    families: {
      Inter: [400, 500, 600, 700],
    },
    display: 'swap',
    preload: true,
    prefetch: true,
    preconnect: true,
    download: false,
    inject: true,
  },
  runtimeConfig: {
    tursoUrl: process.env.TURSO_DATABASE_URL || '',
    tursoToken: process.env.TURSO_AUTH_TOKEN || '',
    adminPassword: process.env.ADMIN_PASSWORD || 'admin',
  },
  srcDir: 'app/',
  compatibilityDate: '2025-01-30',
});
