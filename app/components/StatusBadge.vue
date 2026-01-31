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
  display: inline-flex;
  align-items: center;
  padding: var(--badge-padding-sm) var(--badge-padding-md);
  border-radius: var(--badge-radius);
  font-size: var(--badge-fontSize-sm);
  font-weight: var(--badge-fontWeight);
  line-height: 1;
  white-space: nowrap;
}
.new {
  background: var(--badge-background-info);
  color: var(--badge-text-info);
}
.seen {
  background: var(--badge-background-warning);
  color: var(--badge-text-warning);
}
.in_progress {
  background: var(--badge-background-primary);
  color: var(--badge-text-primary);
}
.resolved {
  background: var(--badge-background-success);
  color: var(--badge-text-success);
}
.wont_fix {
  background: var(--tag-background-neutral);
  color: var(--tag-text-neutral);
}
</style>
