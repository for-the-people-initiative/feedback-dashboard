<template>
  <span class="type-icon" :class="type" :title="label">{{ icon }}</span>
</template>

<script setup lang="ts">
const props = defineProps<{ type: string }>();

const icons: Record<string, string> = {
  bug: '🐛',
  suggestion: '✨',
  question: '❓',
};
const labels: Record<string, string> = {
  bug: 'Bug',
  suggestion: 'Suggestie',
  question: 'Vraag',
};

const icon = computed(() => icons[props.type] || '📝');
const label = computed(() => labels[props.type] || props.type);
</script>

<style scoped>
.type-icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  border-radius: var(--radius-rounded);
  font-size: 1rem;
  background: var(--surface-elevated);
}
</style>
