<template>
  <Stats v-if="statsItems.length" :stats="statsItems" :columns="3" />
</template>

<script setup lang="ts">
import Stats from '@for-the-people-initiative/design-system/components/Stats/Stats.vue';

const props = defineProps<{
  stats: { total: number; byType: Record<string, number>; byStatus: Record<string, number> } | null;
}>();

const statsItems = computed(() => {
  if (!props.stats) return [];
  const s = props.stats;
  return [
    { label: 'Totaal', value: s.total },
    { label: 'Bugs', value: s.byType.bug || 0, icon: '🐛' },
    { label: 'Suggesties', value: s.byType.suggestion || 0, icon: '✨' },
    { label: 'Vragen', value: s.byType.question || 0, icon: '❓' },
    { label: 'Nieuw', value: s.byStatus.new || 0 },
    { label: 'Open', value: (s.byStatus.new || 0) + (s.byStatus.seen || 0) + (s.byStatus.in_progress || 0) },
  ];
});
</script>
