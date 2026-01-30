<template>
  <span class="type-icon" :title="label">{{ icon }}</span>
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
.type-icon { font-size: 1.2rem; }
</style>
