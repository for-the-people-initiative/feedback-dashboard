<template>
  <div>
    <StatsCards :stats="stats" />

    <div class="filters">
      <select v-model="filters.type" class="select" @change="fetchFeedback">
        <option value="">Alle types</option>
        <option value="bug">🐛 Bug</option>
        <option value="suggestion">✨ Suggestie</option>
        <option value="question">❓ Vraag</option>
      </select>
      <select v-model="filters.status" class="select" @change="fetchFeedback">
        <option value="">Alle statussen</option>
        <option value="new">Nieuw</option>
        <option value="seen">Gezien</option>
        <option value="in_progress">In behandeling</option>
        <option value="resolved">Opgelost</option>
        <option value="wont_fix">Niet oplossen</option>
      </select>
      <input v-model="filters.search" class="input" placeholder="Zoeken..." @input="debouncedFetch" />
    </div>

    <FeedbackTable :items="items" :loading="loading" @select="(id) => navigateTo(`/feedback/${id}`)" />

    <div class="pagination" v-if="totalPages > 1">
      <button class="page-btn" :disabled="page <= 1" @click="page--; fetchFeedback()">← Vorige</button>
      <span class="page-info">Pagina {{ page }} van {{ totalPages }}</span>
      <button class="page-btn" :disabled="page >= totalPages" @click="page++; fetchFeedback()">Volgende →</button>
    </div>
  </div>
</template>

<script setup lang="ts">
const items = ref<any[]>([]);
const stats = ref<any>(null);
const loading = ref(true);
const page = ref(1);
const totalPages = ref(1);
const filters = reactive({ type: '', status: '', search: '' });

let debounceTimer: ReturnType<typeof setTimeout>;
function debouncedFetch() {
  clearTimeout(debounceTimer);
  debounceTimer = setTimeout(() => { page.value = 1; fetchFeedback(); }, 300);
}

async function fetchFeedback() {
  loading.value = true;
  try {
    const params: Record<string, string> = { page: String(page.value), limit: '20', sort: 'created_at', order: 'desc' };
    if (filters.type) params.type = filters.type;
    if (filters.status) params.status = filters.status;
    if (filters.search) params.search = filters.search;
    const data = await $fetch<any>('/api/feedback', { params });
    items.value = data.items;
    totalPages.value = data.totalPages;
  } catch (e: any) {
    if (e?.statusCode === 401) navigateTo('/login');
  } finally {
    loading.value = false;
  }
}

async function fetchStats() {
  try {
    stats.value = await $fetch('/api/feedback/stats');
  } catch {}
}

onMounted(() => {
  fetchFeedback();
  fetchStats();
});

// Auto-refresh
let interval: ReturnType<typeof setInterval>;
onMounted(() => { interval = setInterval(() => { fetchFeedback(); fetchStats(); }, 30000); });
onUnmounted(() => clearInterval(interval));
</script>

<style scoped>
.filters {
  display: flex;
  gap: var(--space-3, 12px);
  margin-bottom: var(--space-4, 16px);
  flex-wrap: wrap;
}
.select, .input {
  padding: 8px 12px;
  border: 1px solid var(--color-border, #444);
  border-radius: 8px;
  background: var(--color-surface, #1e1e2e);
  color: var(--color-text, #e0e0e0);
  font-size: 0.9rem;
}
.input { flex: 1; min-width: 180px; }
.pagination {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: var(--space-3, 12px);
  margin-top: var(--space-4, 16px);
}
.page-btn {
  padding: 6px 14px;
  border: 1px solid var(--color-border, #444);
  border-radius: 6px;
  background: var(--color-surface, #1e1e2e);
  color: var(--color-text, #e0e0e0);
  cursor: pointer;
  font-size: 0.85rem;
}
.page-btn:disabled { opacity: 0.4; cursor: not-allowed; }
.page-info { font-size: 0.85rem; color: var(--color-text-muted, #888); }
</style>
