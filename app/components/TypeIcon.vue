<template>
  <Tag :value="label" :color="color" rounded />
</template>

<script setup lang="ts">
import Tag from '@for-the-people-initiative/design-system/components/Tag/Tag.vue';

const props = defineProps<{ type: string }>();

const labelMap: Record<string, string> = {
  bug: '🐛 Bug',
  suggestion: '✨ Suggestie',
  question: '❓ Vraag',
};

const colorMap: Record<string, 'danger' | 'info' | 'warning' | 'neutral'> = {
  bug: 'danger',
  suggestion: 'info',
  question: 'warning',
};

const label = computed(() => labelMap[props.type] || '📝 ' + props.type);
const color = computed(() => colorMap[props.type] || 'neutral');
</script>
