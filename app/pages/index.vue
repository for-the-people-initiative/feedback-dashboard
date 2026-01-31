<template>
  <div>
    <Toolbar class="filters-toolbar">
      <template #start>
        <Select
          v-model="filters.type"
          :options="typeOptions"
          placeholder="Alle types"
          @change="fetchFeedback"
        />
        <Select
          v-model="filters.status"
          :options="statusOptions"
          placeholder="Alle statussen"
          @change="fetchFeedback"
        />
        <Select
          v-model="filters.app"
          :options="appOptions"
          placeholder="Alle apps"
          @change="fetchFeedback"
        />
      </template>
      <template #end>
        <InputText
          v-model="filters.search"
          placeholder="Zoeken..."
          @input="debouncedFetch"
        />
      </template>
    </Toolbar>

    <FeedbackTable :items="items" :loading="loading" @select="(id) => navigateTo(`/feedback/${id}`)" />

    <Paginator
      v-if="totalPages > 1"
      :total-records="totalRecords"
      :rows="20"
      :first="(page - 1) * 20"
      :show-info="true"
      @page="onPage"
    />
  </div>
</template>

<script setup lang="ts">
import Select from '@for-the-people-initiative/design-system/components/Select/Select.vue';
import InputText from '@for-the-people-initiative/design-system/components/InputText/InputText.vue';
import Toolbar from '@for-the-people-initiative/design-system/components/Toolbar/Toolbar.vue';
import Paginator from '@for-the-people-initiative/design-system/components/Paginator/Paginator.vue';

const items = ref<any[]>([]);
const loading = ref(true);
const page = ref(1);
const totalPages = ref(1);
const totalRecords = ref(0);
const filters = reactive({ type: '', status: '', search: '', app: '' });
const appOptions = ref([{ label: 'Alle apps', value: '' }]);

const typeOptions = [
  { label: 'Alle types', value: '' },
  { label: '🐛 Bug', value: 'bug' },
  { label: '✨ Suggestie', value: 'suggestion' },
  { label: '❓ Vraag', value: 'question' },
];

const statusOptions = [
  { label: 'Alle statussen', value: '' },
  { label: 'Nieuw', value: 'new' },
  { label: 'Gezien', value: 'seen' },
  { label: 'In behandeling', value: 'in_progress' },
  { label: 'Opgelost', value: 'resolved' },
  { label: 'Niet oplossen', value: 'wont_fix' },
];

function onPage(event: { page: number }) {
  page.value = event.page;
  fetchFeedback();
}

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
    if (filters.app) params.app = filters.app;
    if (filters.search) params.search = filters.search;
    const data = await $fetch<any>('/api/feedback', { params });
    items.value = data.items;
    totalPages.value = data.totalPages;
    totalRecords.value = data.total || data.totalPages * 20;
  } catch (e: any) {
    if (e?.statusCode === 401) navigateTo('/login');
  } finally {
    loading.value = false;
  }
}

async function fetchApps() {
  try {
    const apps = await $fetch<string[]>('/api/feedback/apps');
    appOptions.value = [
      { label: 'Alle apps', value: '' },
      ...apps.map(a => ({ label: a, value: a })),
    ];
  } catch {}
}

onMounted(() => {
  fetchFeedback();
  fetchApps();
});

let interval: ReturnType<typeof setInterval>;
onMounted(() => { interval = setInterval(() => { fetchFeedback(); }, 30000); });
onUnmounted(() => clearInterval(interval));
</script>

<style scoped>
.filters-toolbar {
  margin-bottom: var(--space-l);
}
</style>
