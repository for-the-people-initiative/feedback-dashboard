<template>
  <div v-if="feedback">
    <button class="back-btn" @click="navigateTo('/')">← Terug</button>

    <div class="detail-header">
      <TypeIcon :type="String(feedback.type)" />
      <h1>{{ feedback.title || '(geen titel)' }}</h1>
      <StatusBadge :status="String(feedback.status || 'new')" />
    </div>

    <div class="detail-body" v-if="feedback.body">
      <h3>Beschrijving</h3>
      <p>{{ feedback.body }}</p>
    </div>

    <div class="screenshot" v-if="feedback.screenshot">
      <h3>Screenshot</h3>
      <img :src="screenshotSrc" alt="Screenshot" />
    </div>

    <div class="metadata">
      <h3>Metadata</h3>
      <dl>
        <template v-for="[label, value] in metaFields" :key="label">
          <dt>{{ label }}</dt>
          <dd>{{ value || '-' }}</dd>
        </template>
      </dl>
    </div>

    <div class="user-info">
      <h3>Gebruiker</h3>
      <p>{{ feedback.email || 'Anoniem' }}</p>
    </div>

    <div class="timestamps">
      <small>Aangemaakt: {{ formatDate(String(feedback.created_at || '')) }}</small>
      <small v-if="feedback.updated_at"> · Bijgewerkt: {{ formatDate(String(feedback.updated_at || '')) }}</small>
    </div>

    <div class="actions">
      <h3>Status wijzigen</h3>
      <div class="action-btns">
        <button v-for="s in statuses" :key="s.value" class="action-btn" :class="{ active: feedback.status === s.value }" @click="updateStatus(s.value)">
          {{ s.label }}
        </button>
      </div>
    </div>
  </div>
  <div v-else class="loading">Laden...</div>
</template>

<script setup lang="ts">
const route = useRoute();
const feedback = ref<any>(null);

const statuses = [
  { value: 'seen', label: 'Gezien' },
  { value: 'in_progress', label: 'In behandeling' },
  { value: 'resolved', label: 'Opgelost' },
  { value: 'wont_fix', label: 'Niet oplossen' },
];

const screenshotSrc = computed(() => {
  const s = feedback.value?.screenshot;
  if (!s) return '';
  return String(s).startsWith('data:') ? s : `data:image/png;base64,${s}`;
});

const metaFields = computed(() => {
  const f = feedback.value;
  if (!f) return [];
  return [
    ['URL', f.url],
    ['Route', f.route],
    ['Browser', f.browser],
    ['Viewport', f.viewport],
    ['Console errors', f.console_errors],
    ['App versie', f.app_version],
    ['App', f.app],
  ].filter(([, v]) => v);
});

function formatDate(d: string) {
  if (!d) return '-';
  try {
    return new Date(d).toLocaleDateString('nl-NL', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' });
  } catch { return d; }
}

async function fetchFeedback() {
  try {
    feedback.value = await $fetch(`/api/feedback/${route.params.id}`);
  } catch (e: any) {
    if (e?.statusCode === 401) navigateTo('/login');
  }
}

async function updateStatus(status: string) {
  try {
    feedback.value = await $fetch(`/api/feedback/${route.params.id}`, { method: 'PATCH', body: { status } });
  } catch {}
}

onMounted(fetchFeedback);
</script>

<style scoped>
.back-btn {
  background: transparent;
  border: 1px solid var(--color-border, #444);
  color: var(--color-text-muted, #aaa);
  padding: 6px 14px;
  border-radius: 6px;
  cursor: pointer;
  margin-bottom: var(--space-4, 16px);
}
.detail-header {
  display: flex;
  align-items: center;
  gap: var(--space-3, 12px);
  margin-bottom: var(--space-4, 16px);
}
.detail-header h1 { font-size: 1.4rem; margin: 0; flex: 1; }
.detail-body, .metadata, .user-info, .screenshot, .actions {
  background: var(--color-surface, #1e1e2e);
  border: 1px solid var(--color-border, #333);
  border-radius: 8px;
  padding: var(--space-4, 16px);
  margin-bottom: var(--space-3, 12px);
}
.detail-body p { white-space: pre-wrap; line-height: 1.6; }
h3 { margin: 0 0 8px; font-size: 0.9rem; color: var(--color-text-muted, #888); text-transform: uppercase; }
dl { display: grid; grid-template-columns: 140px 1fr; gap: 4px 12px; margin: 0; }
dt { color: var(--color-text-muted, #888); font-size: 0.85rem; }
dd { margin: 0; font-size: 0.9rem; word-break: break-all; }
.screenshot img { max-width: 100%; border-radius: 6px; margin-top: 8px; }
.timestamps { color: var(--color-text-muted, #888); font-size: 0.8rem; margin-bottom: var(--space-3, 12px); }
.action-btns { display: flex; gap: var(--space-2, 8px); flex-wrap: wrap; }
.action-btn {
  padding: 8px 16px;
  border: 1px solid var(--color-border, #444);
  border-radius: 6px;
  background: var(--color-background, #0f0f1a);
  color: var(--color-text, #e0e0e0);
  cursor: pointer;
  font-size: 0.85rem;
}
.action-btn:hover { background: var(--color-surface-hover, rgba(255,255,255,0.08)); }
.action-btn.active { background: var(--color-primary, #818cf8); color: white; border-color: transparent; }
.loading { text-align: center; padding: 40px; color: var(--color-text-muted, #888); }
</style>
