<template>
  <div class="login-page">
    <div class="login-card">
      <h1 class="login-title">🔐 Feedback Dashboard</h1>
      <p class="login-subtitle">Voer het admin wachtwoord in om door te gaan.</p>
      <form @submit.prevent="login">
        <input
          v-model="password"
          type="password"
          placeholder="Wachtwoord"
          class="login-input"
          autofocus
        />
        <p v-if="error" class="login-error">{{ error }}</p>
        <button type="submit" class="login-btn" :disabled="loading">
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
  background: var(--surface-canvas);
  color: var(--text-default);
}
.login-card {
  background: var(--card-background);
  border: var(--card-border-width) solid var(--card-border-color);
  border-radius: var(--card-radius);
  box-shadow: var(--shadow-l);
  padding: var(--space-2xl);
  width: 100%;
  max-width: 400px;
  text-align: center;
}
.login-title {
  font-size: 1.5rem;
  font-weight: var(--card-title-fontWeight);
  color: var(--text-heading);
  margin: 0 0 var(--space-2xs);
}
.login-subtitle {
  color: var(--text-muted);
  font-size: var(--card-subtitle-fontSize);
  margin: 0 0 var(--space-l);
}
.login-input {
  width: 100%;
  padding: var(--input-text-padding-y) var(--input-text-padding-x);
  border: var(--input-text-border-width) solid var(--border-default);
  border-radius: var(--input-text-radius);
  background: var(--surface-canvas);
  color: var(--text-default);
  font-size: var(--input-text-fontSize-md);
  margin-bottom: var(--space-m);
  box-sizing: border-box;
  transition: border-color var(--button-transition-duration);
}
.login-input:focus {
  outline: none;
  border-color: var(--border-focus);
  box-shadow: 0 0 0 var(--button-focus-ringWidth) rgba(249, 115, 22, 0.25);
}
.login-input::placeholder {
  color: var(--text-subtle);
}
.login-btn {
  width: 100%;
  padding: var(--button-size-md-paddingY) var(--button-size-md-paddingX);
  border: none;
  border-radius: var(--button-radius-default);
  background: linear-gradient(135deg, var(--accent-gradient-start), var(--accent-gradient-end));
  color: var(--button-text-primary-default);
  font-size: var(--button-size-md-fontSize);
  font-weight: var(--button-fontWeight);
  cursor: pointer;
  transition: all var(--button-transition-duration);
  height: var(--button-size-md-height);
}
.login-btn:hover:not(:disabled) {
  background: linear-gradient(135deg, var(--accent-gradient-hoverStart), var(--accent-gradient-hoverEnd));
}
.login-btn:disabled {
  background: var(--button-background-primary-disabled);
  color: var(--button-text-primary-disabled);
  cursor: not-allowed;
}
.login-error {
  color: var(--feedback-errorEmphasis);
  font-size: var(--card-subtitle-fontSize);
  margin: 0 0 var(--space-s);
}
</style>
