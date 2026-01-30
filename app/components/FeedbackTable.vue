<template>
  <div class="table-wrap">
    <div v-if="loading" class="loading">Laden...</div>
    <div v-else-if="!items.length" class="empty">Geen feedback gevonden</div>
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
        <tr v-for="item in items" :key="item.id" @click="$emit('select', item.id)" class="clickable">
          <td><TypeIcon :type="String(item.type)" /></td>
          <td>{{ item.title || '(geen titel)' }}</td>
          <td>{{ item.app || '-' }}</td>
          <td><StatusBadge :status="String(item.status || 'new')" /></td>
          <td>{{ formatDate(String(item.created_at || '')) }}</td>
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
.table-wrap { overflow-x: auto; }
.feedback-table {
  width: 100%;
  border-collapse: collapse;
}
.feedback-table th, .feedback-table td {
  padding: var(--space-2, 8px) var(--space-3, 12px);
  text-align: left;
  border-bottom: 1px solid var(--color-border, #333);
}
.feedback-table th {
  font-size: 0.8rem;
  text-transform: uppercase;
  color: var(--color-text-muted, #888);
}
.clickable { cursor: pointer; }
.clickable:hover { background: var(--color-surface-hover, rgba(255,255,255,0.05)); }
.loading, .empty {
  text-align: center;
  padding: var(--space-6, 24px);
  color: var(--color-text-muted, #888);
}
</style>
