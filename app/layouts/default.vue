<template>
  <div class="app-layout">
    <header class="app-header">
      <div class="app-header-inner">
        <h1 class="app-title">📋 Feedback Dashboard</h1>
        <button class="logout-btn" @click="logout">Uitloggen</button>
      </div>
    </header>
    <main class="app-main">
      <slot />
    </main>
  </div>
</template>

<script setup lang="ts">
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
}
.app-header {
  background: var(--surface-panel);
  border-bottom: 1px solid var(--border-default);
  box-shadow: var(--shadow-s);
  position: sticky;
  top: 0;
  z-index: 100;
}
.app-header-inner {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: var(--space-s) var(--space-l);
  max-width: 1280px;
  margin: 0 auto;
}
.app-title {
  font-size: var(--card-title-fontSize);
  font-weight: var(--card-title-fontWeight);
  margin: 0;
  color: var(--text-heading);
}
.logout-btn {
  background: var(--button-background-secondary-default);
  border: var(--button-border-width) solid var(--border-strong);
  color: var(--text-secondary);
  padding: var(--button-size-sm-paddingY) var(--button-size-sm-paddingX);
  border-radius: var(--button-radius-default);
  cursor: pointer;
  font-size: var(--button-size-sm-fontSize);
  font-weight: var(--button-fontWeight);
  transition: all var(--button-transition-duration);
}
.logout-btn:hover {
  background: var(--button-background-secondary-hover);
  color: var(--text-default);
}
.app-main {
  padding: var(--space-l) var(--space-l);
  max-width: 1280px;
  margin: 0 auto;
}
</style>
