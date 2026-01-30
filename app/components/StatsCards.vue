<template>
  <div class="stats-grid">
    <div class="stat-card" v-for="card in cards" :key="card.label">
      <div class="stat-count">{{ card.count }}</div>
      <div class="stat-label">{{ card.label }}</div>
    </div>
  </div>
</template>

<script setup lang="ts">
const props = defineProps<{
  stats: { total: number; byType: Record<string, number>; byStatus: Record<string, number> } | null;
}>();

const cards = computed(() => {
  if (!props.stats) return [];
  const s = props.stats;
  return [
    { label: 'Totaal', count: s.total },
    { label: '🐛 Bugs', count: s.byType.bug || 0 },
    { label: '✨ Suggesties', count: s.byType.suggestion || 0 },
    { label: '❓ Vragen', count: s.byType.question || 0 },
    { label: 'Nieuw', count: s.byStatus.new || 0 },
    { label: 'Open', count: (s.byStatus.new || 0) + (s.byStatus.seen || 0) + (s.byStatus.in_progress || 0) },
  ];
});
</script>

<style scoped>
.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(140px, 1fr));
  gap: var(--space-3, 12px);
  margin-bottom: var(--space-4, 16px);
}
.stat-card {
  background: var(--color-surface, #1e1e2e);
  border: 1px solid var(--color-border, #333);
  border-radius: 8px;
  padding: var(--space-4, 16px);
  text-align: center;
}
.stat-count {
  font-size: 2rem;
  font-weight: 700;
  color: var(--color-primary, #818cf8);
}
.stat-label {
  font-size: 0.85rem;
  color: var(--color-text-muted, #aaa);
  margin-top: 4px;
}
</style>
