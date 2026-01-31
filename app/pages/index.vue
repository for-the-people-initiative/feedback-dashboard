<template>
  <div>
    <StatsCards :stats="stats" />

    <div class="filters-bar">
      <select v-model="filters.type" class="filter-select" @change="fetchFeedback">
        <option value="">Alle types</option>
        <option value="bug">🐛 Bug</option>
        <option value="suggestion">✨ Suggestie</option>
        <option value="question">❓ Vraag</option>
      </select>
      <select v-model="filters.status" class="filter-select" @change="fetchFeedback">
        <option value="">Alle statussen</option>
        <option value="new">Nieuw</option>
        <option value="seen">Gezien</option>
        <option value="in_progress">In behandeling</option>
        <option value="resolved">Opgelost</option>
        <option value="wont_fix">Niet oplossen</option>
      </select>
      <div class="search-wrap">
        <svg class="search-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
        <input v-model="filters.search" class="search-input" placeholder="Zoeken..." @input="debouncedFetch" />
      </div>
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

let interval: ReturnType<typeof setInterval>;
onMounted(() => { interval = setInterval(() => { fetchFeedback(); fetchStats(); }, 30000); });
onUnmounted(() => clearInterval(interval));
</script>

<style scoped>
.filters-bar {
  display: flex;
  gap: var(--space-s);
  margin-bottom: var(--space-l);
  flex-wrap: wrap;
}
.filter-select {
  padding: var(--input-text-padding-y) var(--input-text-padding-x);
  border: var(--input-text-border-width) solid var(--border-default);
  border-radius: var(--input-text-radius);
  background: var(--surface-panel);
  color: var(--text-default);
  font-size: var(--input-text-fontSize-sm);
  height: var(--input-text-height-md);
  cursor: pointer;
  transition: border-color var(--button-transition-duration);
}
.filter-select:focus {
  outline: none;
  border-color: var(--border-focus);
}
.search-wrap {
  flex: 1;
  min-width: 200px;
  position: relative;
}
.search-icon {
  position: absolute;
  left: var(--space-s);
  top: 50%;
  transform: translateY(-50%);
  color: var(--text-subtle);
  pointer-events: none;
}
.search-input {
  width: 100%;
  padding: var(--input-text-padding-y) var(--input-text-padding-x);
  padding-left: 36px;
  border: var(--input-text-border-width) solid var(--border-default);
  border-radius: var(--input-text-radius);
  background: var(--surface-panel);
  color: var(--text-default);
  font-size: var(--input-text-fontSize-sm);
  height: var(--input-text-height-md);
  box-sizing: border-box;
  transition: border-color var(--button-transition-duration);
}
.search-input:focus {
  outline: none;
  border-color: var(--border-focus);
  box-shadow: 0 0 0 var(--button-focus-ringWidth) rgba(249, 115, 22, 0.2);
}
.search-input::placeholder {
  color: var(--text-subtle);
}
.pagination {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: var(--space-m);
  margin-top: var(--space-l);
  padding: var(--space-m) 0;
}
.page-btn {
  padding: var(--button-size-sm-paddingY) var(--button-size-sm-paddingX);
  border: var(--button-border-width) solid var(--border-strong);
  border-radius: var(--button-radius-default);
  background: var(--surface-panel);
  color: var(--text-default);
  cursor: pointer;
  font-size: var(--button-size-sm-fontSize);
  font-weight: var(--button-fontWeight);
  transition: all var(--button-transition-duration);
}
.page-btn:hover:not(:disabled) {
  background: var(--surface-elevated);
  border-color: var(--border-focus);
}
.page-btn:disabled {
  opacity: 0.35;
  cursor: not-allowed;
}
.page-info {
  font-size: var(--paginator-info-fontSize);
  color: var(--paginator-info-color);
}
</style>
