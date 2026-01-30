<template>
  <span class="status-badge" :class="status">{{ label }}</span>
</template>

<script setup lang="ts">
const props = defineProps<{ status: string }>();

const labels: Record<string, string> = {
  new: 'Nieuw',
  seen: 'Gezien',
  in_progress: 'In behandeling',
  resolved: 'Opgelost',
  wont_fix: 'Niet oplossen',
};

const label = computed(() => labels[props.status] || props.status);
</script>

<style scoped>
.status-badge {
  display: inline-block;
  padding: 2px 10px;
  border-radius: 12px;
  font-size: 0.8rem;
  font-weight: 600;
  text-transform: capitalize;
}
.new { background: var(--color-info, #3b82f6); color: white; }
.seen { background: var(--color-warning, #eab308); color: #1a1a1a; }
.in_progress { background: var(--color-accent, #f97316); color: white; }
.resolved { background: var(--color-success, #22c55e); color: white; }
.wont_fix { background: var(--color-muted, #6b7280); color: white; }
</style>
