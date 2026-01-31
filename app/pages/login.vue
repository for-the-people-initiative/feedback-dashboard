<template>
  <div class="login-page">
    <Card class="login-card">
      <template #title>🔐 Feedback Dashboard</template>
      <template #subtitle>Voer het admin wachtwoord in om door te gaan.</template>
      <template #content>
        <form @submit.prevent="login">
          <InputText
            v-model="password"
            type="password"
            placeholder="Wachtwoord"
            class="login-input"
            :is-invalid="!!error"
          />
          <p v-if="error" class="login-error">{{ error }}</p>
          <Button
            :label="loading ? 'Bezig...' : 'Inloggen'"
            variant="primary"
            :is-loading="loading"
            :is-disabled="loading"
            class="login-btn"
            @click="login"
          />
        </form>
      </template>
    </Card>
  </div>
</template>

<script setup lang="ts">
import Card from '@for-the-people-initiative/design-system/components/Card/Card.vue';
import InputText from '@for-the-people-initiative/design-system/components/InputText/InputText.vue';
import Button from '@for-the-people-initiative/design-system/components/Button/Button.vue';

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
  width: 100%;
  max-width: 400px;
  text-align: center;
}
.login-input {
  width: 100%;
  margin-bottom: var(--space-m);
  box-sizing: border-box;
}
.login-btn {
  width: 100%;
}
.login-error {
  color: var(--feedback-errorEmphasis);
  font-size: var(--card-subtitle-fontSize);
  margin: 0 0 var(--space-s);
}
</style>
