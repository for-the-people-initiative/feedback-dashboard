<template>
  <div class="table-container">
    <div v-if="loading" class="table-empty">
      <div class="spinner"></div>
      <span>Laden...</span>
    </div>
    <div v-else-if="!items.length" class="table-empty">
      Geen feedback gevonden
    </div>
    <table v-else class="feedback-table">
      <thead>
        <tr>
          <th>Type</th>
          <th>Titel</th>
          <th>App</th>
          <th>Status</th>
          <th>Datum</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="item in items" :key="item.id" @click="$emit('select', item.id)" class="table-row">
          <td><TypeIcon :type="String(item.type)" /></td>
          <td class="title-cell">{{ item.title || '(geen titel)' }}</td>
          <td class="app-cell">{{ item.app || '-' }}</td>
          <td><StatusBadge :status="String(item.status || 'new')" /></td>
          <td class="date-cell">{{ formatDate(String(item.created_at || '')) }}</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script setup lang="ts">
defineProps<{ items: any[]; loading: boolean }>();
defineEmits<{ select: [id: string | number] }>();

function formatDate(d: string) {
  if (!d) return '-';
  try {
    return new Date(d).toLocaleDateString('nl-NL', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' });
  } catch { return d; }
}
</script>

<style scoped>
.table-container {
  background: var(--dataTable-background);
  border: var(--dataTable-border-width) solid var(--dataTable-border-color);
  border-radius: var(--dataTable-radius);
  overflow: hidden;
}
.feedback-table {
  width: 100%;
  border-collapse: collapse;
}
.feedback-table th {
  background: var(--dataTable-header-background);
  color: var(--dataTable-header-color);
  padding: var(--dataTable-header-padding);
  font-size: var(--dataTable-header-fontSize);
  font-weight: var(--dataTable-header-fontWeight);
  text-align: left;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  border-bottom: 1px solid var(--dataTable-header-borderColor);
}
.feedback-table td {
  padding: var(--dataTable-body-padding);
  font-size: var(--dataTable-body-fontSize);
  color: var(--dataTable-body-color);
  border-bottom: 1px solid var(--dataTable-body-borderColor);
  vertical-align: middle;
}
.table-row {
  cursor: pointer;
  transition: background var(--dataTable-transition-duration);
}
.table-row:hover {
  background: var(--dataTable-body-background-hover);
}
.title-cell {
  font-weight: 500;
  max-width: 300px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.app-cell {
  color: var(--text-secondary);
}
.date-cell {
  color: var(--text-muted);
  white-space: nowrap;
  font-size: 13px;
}
.table-empty {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--space-s);
  padding: var(--dataTable-empty-padding);
  color: var(--dataTable-empty-color);
  text-align: center;
}
.spinner {
  width: 24px;
  height: 24px;
  border: 3px solid var(--border-subtle);
  border-top-color: var(--brand-secondary);
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}
@keyframes spin { to { transform: rotate(360deg); } }
</style>
