<template>
  <div class="login-page">
    <div class="login-card">
      <h1>🔐 Feedback Dashboard</h1>
      <p>Voer het admin wachtwoord in om door te gaan.</p>
      <form @submit.prevent="login">
        <input
          v-model="password"
          type="password"
          placeholder="Wachtwoord"
          class="input"
          autofocus
        />
        <p v-if="error" class="error">{{ error }}</p>
        <button type="submit" class="btn" :disabled="loading">
          {{ loading ? 'Bezig...' : 'Inloggen' }}
        </button>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({ layout: false });

const password = ref('');
const error = ref('');
const loading = ref(false);

async function login() {
  error.value = '';
  loading.value = true;
  try {
    await $fetch('/api/auth/login', { method: 'POST', body: { password: password.value } });
    navigateTo('/');
  } catch (e: any) {
    error.value = 'Ongeldig wachtwoord';
  } finally {
    loading.value = false;
  }
}
</script>

<style scoped>
.login-page {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--color-background, #0f0f1a);
  color: var(--color-text, #e0e0e0);
}
.login-card {
  background: var(--color-surface, #1e1e2e);
  border: 1px solid var(--color-border, #333);
  border-radius: 12px;
  padding: var(--space-6, 32px);
  width: 100%;
  max-width: 380px;
  text-align: center;
}
.login-card h1 { font-size: 1.4rem; margin-bottom: 8px; }
.login-card p { color: var(--color-text-muted, #888); font-size: 0.9rem; margin-bottom: 20px; }
.input {
  width: 100%;
  padding: 10px 14px;
  border: 1px solid var(--color-border, #444);
  border-radius: 8px;
  background: var(--color-background, #0f0f1a);
  color: var(--color-text, #e0e0e0);
  font-size: 1rem;
  margin-bottom: 12px;
  box-sizing: border-box;
}
.btn {
  width: 100%;
  padding: 10px;
  border: none;
  border-radius: 8px;
  background: var(--color-primary, #818cf8);
  color: white;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
}
.btn:hover { opacity: 0.9; }
.btn:disabled { opacity: 0.5; cursor: not-allowed; }
.error { color: var(--color-error, #f87171); font-size: 0.85rem; }
</style>
