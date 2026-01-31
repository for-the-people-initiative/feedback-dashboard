<template>
  <div class="app-layout">
    <AppBar :fixed="true" :elevated="true">
      <template #start>
        <span class="app-title">📋 Feedback Dashboard</span>
      </template>
      <template #end>
        <Button label="Uitloggen" variant="secondary" size="sm" @click="logout" />
      </template>
    </AppBar>
    <main class="app-main">
      <slot />
    </main>
  </div>
</template>

<script setup lang="ts">
import AppBar from '@for-the-people-initiative/design-system/components/AppBar/AppBar.vue';
import Button from '@for-the-people-initiative/design-system/components/Button/Button.vue';

async function logout() {
  await $fetch('/api/auth/logout', { method: 'POST' });
  navigateTo('/login');
}
</script>

<style scoped>
.app-layout {
  min-height: 100vh;
  background: var(--surface-canvas);
  color: var(--text-default);
  font-family: 'Inter', system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
}
:global(:root) {
  --dataTable-body-background-striped: #0d1225;
}
:global(body) {
  font-family: 'Inter', system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}
.app-title {
  font-size: var(--card-title-fontSize);
  font-weight: var(--card-title-fontWeight);
  color: var(--text-heading);
}
.app-main {
  padding: var(--space-l);
  padding-top: calc(var(--space-l) + 64px);
  max-width: 1280px;
  margin: 0 auto;
}
</style>
