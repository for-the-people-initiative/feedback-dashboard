<template>
  <Badge :value="label" :severity="severity" size="sm" />
</template>

<script setup lang="ts">
import Badge from '@for-the-people-initiative/design-system/components/Badge/Badge.vue';

const props = defineProps<{ status: string }>();

const labels: Record<string, string> = {
  new: 'Nieuw',
  seen: 'Gezien',
  in_progress: 'In behandeling',
  resolved: 'Opgelost',
  wont_fix: 'Niet oplossen',
};

const severityMap: Record<string, 'info' | 'warning' | 'primary' | 'success' | 'danger'> = {
  new: 'info',
  seen: 'warning',
  in_progress: 'primary',
  resolved: 'success',
  wont_fix: 'danger',
};

const label = computed(() => labels[props.status] || props.status);
const severity = computed(() => severityMap[props.status] || 'info');
</script>
