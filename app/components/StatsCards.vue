<template>
  <div class="stats-grid" v-if="stats">
    <div class="stat-card" v-for="card in cards" :key="card.label" :class="card.variant">
      <div class="stat-value">{{ card.count }}</div>
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
    { label: 'Totaal', count: s.total, variant: 'accent' },
    { label: '🐛 Bugs', count: s.byType.bug || 0, variant: 'danger' },
    { label: '✨ Suggesties', count: s.byType.suggestion || 0, variant: 'info' },
    { label: '❓ Vragen', count: s.byType.question || 0, variant: 'warning' },
    { label: 'Nieuw', count: s.byStatus.new || 0, variant: 'new' },
    { label: 'Open', count: (s.byStatus.new || 0) + (s.byStatus.seen || 0) + (s.byStatus.in_progress || 0), variant: 'open' },
  ];
});
</script>

<style scoped>
.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: var(--space-m);
  margin-bottom: var(--space-l);
}
.stat-card {
  background: var(--card-background);
  border: var(--card-border-width) solid var(--card-border-color);
  border-radius: var(--card-radius);
  padding: var(--card-padding);
  text-align: center;
  transition: transform var(--button-transition-duration), box-shadow var(--button-transition-duration);
}
.stat-card:hover {
  transform: translateY(-2px);
  box-shadow: var(--shadow-m);
}
.stat-value {
  font-size: 2rem;
  font-weight: 700;
  line-height: 1.2;
  margin-bottom: var(--space-2xs);
}
.stat-label {
  font-size: var(--card-subtitle-fontSize);
  color: var(--text-muted);
}

/* Variant colors for the value */
.accent .stat-value { color: var(--brand-secondary); }
.danger .stat-value { color: var(--feedback-errorEmphasis); }
.info .stat-value { color: var(--feedback-infoEmphasis); }
.warning .stat-value { color: var(--feedback-warningEmphasis); }
.new .stat-value { color: var(--feedback-infoEmphasis); }
.open .stat-value { color: var(--brand-accent); }

/* Subtle top border accent */
.accent { border-top: 3px solid var(--brand-secondary); }
.danger { border-top: 3px solid var(--feedback-error); }
.info { border-top: 3px solid var(--feedback-info); }
.warning { border-top: 3px solid var(--feedback-warning); }
.new { border-top: 3px solid var(--feedback-info); }
.open { border-top: 3px solid var(--brand-accent); }
</style>
