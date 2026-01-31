<template>
  <div v-if="loading" class="table-loading">
    <ProgressSpinner />
    <span>Laden...</span>
  </div>
  <DataTable
    v-else
    ref="tableRef"
    :value="items"
    :columns="columns"
    :hoverable="true"
    :striped="true"
    class="clickable-rows"
    @click="onRowClick"
  >
    <template #empty>
      Geen feedback gevonden
    </template>
    <template #column-type="{ data }">
      <span class="type-cell">{{ data.type === 'bug' ? 'Bug' : data.type === 'suggestion' ? 'Suggestie' : data.type === 'question' ? 'Vraag' : data.type }}</span>
    </template>
    <template #column-title="{ data }">
      <span class="title-cell">{{ data.title || '(geen titel)' }}</span>
    </template>
    <template #column-app="{ data }">
      <span class="app-cell">{{ data.app || '-' }}</span>
    </template>
    <template #column-status="{ data }">
      <span class="status-cell">{{ statusLabel(String(data.status || 'new')) }}</span>
    </template>
    <template #column-created_at="{ data }">
      <span class="date-cell">{{ formatDate(String(data.created_at || '')) }}</span>
    </template>
  </DataTable>
</template>

<script setup lang="ts">
import DataTable from '@for-the-people-initiative/design-system/components/DataTable/DataTable.vue';
import ProgressSpinner from '@for-the-people-initiative/design-system/components/ProgressSpinner/ProgressSpinner.vue';

const props = defineProps<{ items: any[]; loading: boolean }>();
const emit = defineEmits<{ select: [id: string | number] }>();

function onRowClick(e: MouseEvent) {
  const row = (e.target as HTMLElement).closest('tr.data-table__row') as HTMLElement | null;
  if (!row) return;
  const tbody = row.parentElement;
  if (!tbody) return;
  const index = Array.from(tbody.querySelectorAll('tr.data-table__row')).indexOf(row);
  if (index >= 0 && props.items[index]) {
    emit('select', props.items[index].id);
  }
}

const columns = [
  { field: 'type', header: 'Type', width: '100px' },
  { field: 'title', header: 'Titel' },
  { field: 'app', header: 'App', width: '120px' },
  { field: 'status', header: 'Status', width: '140px' },
  { field: 'created_at', header: 'Datum', width: '180px' },
];

const STATUS_LABELS: Record<string, string> = {
  new: 'Nieuw', seen: 'Gezien', in_progress: 'In behandeling', resolved: 'Opgelost', wont_fix: 'Niet oplossen',
};
function statusLabel(s: string) { return STATUS_LABELS[s] || s; }

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
.clickable-rows :deep(.data-table__row) {
  cursor: pointer;
}
.clickable-rows :deep(.data-table__row:hover) {
  background-color: var(--dataTable-body-background-hover) !important;
}
.title-cell {
  font-weight: 500;
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
