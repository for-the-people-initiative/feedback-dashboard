<template>
  <div v-if="loading" class="table-loading">
    <ProgressSpinner />
    <span>Laden...</span>
  </div>
  <DataTable
    v-else
    :value="items"
    :columns="columns"
    :hoverable="true"
    :striped="true"
  >
    <template #empty>
      Geen feedback gevonden
    </template>
    <template #column-type="{ data }">
      <TypeIcon :type="String(data.type)" />
    </template>
    <template #column-title="{ data }">
      <span class="title-cell" @click="$emit('select', data.id)">{{ data.title || '(geen titel)' }}</span>
    </template>
    <template #column-app="{ data }">
      <span class="app-cell">{{ data.app || '-' }}</span>
    </template>
    <template #column-status="{ data }">
      <StatusBadge :status="String(data.status || 'new')" />
    </template>
    <template #column-created_at="{ data }">
      <span class="date-cell">{{ formatDate(String(data.created_at || '')) }}</span>
    </template>
  </DataTable>
</template>

<script setup lang="ts">
import DataTable from '@for-the-people-initiative/design-system/components/DataTable/DataTable.vue';
import ProgressSpinner from '@for-the-people-initiative/design-system/components/ProgressSpinner/ProgressSpinner.vue';

defineProps<{ items: any[]; loading: boolean }>();
defineEmits<{ select: [id: string | number] }>();

const columns = [
  { field: 'type', header: 'Type', width: '100px' },
  { field: 'title', header: 'Titel' },
  { field: 'app', header: 'App', width: '120px' },
  { field: 'status', header: 'Status', width: '140px' },
  { field: 'created_at', header: 'Datum', width: '180px' },
];

function formatDate(d: string) {
  if (!d) return '-';
  try {
    return new Date(d).toLocaleDateString('nl-NL', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' });
  } catch { return d; }
}
</script>

<style scoped>
.table-loading {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--space-s);
  padding: var(--space-2xl);
  color: var(--text-muted);
}
.title-cell {
  font-weight: 500;
  cursor: pointer;
}
.title-cell:hover {
  color: var(--text-link);
}
.app-cell {
  color: var(--text-secondary);
}
.date-cell {
  color: var(--text-muted);
  white-space: nowrap;
  font-size: 13px;
}
</style>
