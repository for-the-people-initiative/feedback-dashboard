export default defineNuxtConfig({
  devtools: { enabled: false },
  css: [
    '@for-the-people-initiative/design-system/css',
    '@for-the-people-initiative/design-system/css/theme-dark.css',
  ],
  runtimeConfig: {
    tursoUrl: process.env.TURSO_DATABASE_URL || '',
    tursoToken: process.env.TURSO_AUTH_TOKEN || '',
    adminPassword: process.env.ADMIN_PASSWORD || 'admin',
  },
  compatibilityDate: '2025-01-30',
});
