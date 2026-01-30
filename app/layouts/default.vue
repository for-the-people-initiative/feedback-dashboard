<template>
  <div class="app-layout">
    <header class="app-header">
      <h1 class="app-title">📋 Feedback Dashboard</h1>
      <button class="logout-btn" @click="logout">Uitloggen</button>
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
  background: var(--color-background, #0f0f1a);
  color: var(--color-text, #e0e0e0);
}
.app-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: var(--space-3, 12px) var(--space-5, 20px);
  background: var(--color-surface, #1e1e2e);
  border-bottom: 1px solid var(--color-border, #333);
}
.app-title {
  font-size: 1.2rem;
  margin: 0;
}
.logout-btn {
  background: transparent;
  border: 1px solid var(--color-border, #444);
  color: var(--color-text-muted, #aaa);
  padding: 6px 14px;
  border-radius: 6px;
  cursor: pointer;
  font-size: 0.85rem;
}
.logout-btn:hover {
  background: var(--color-surface-hover, rgba(255,255,255,0.08));
}
.app-main {
  padding: var(--space-4, 16px) var(--space-5, 20px);
  max-width: 1200px;
  margin: 0 auto;
}
</style>
