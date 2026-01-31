<template>
  <div v-if="feedback">
    <Button
      label="Terug naar overzicht"
      variant="text"
      size="sm"
      icon="pi pi-arrow-left"
      class="back-btn"
      @click="navigateTo('/')"
    />

    <div class="detail-header">
      <TypeIcon :type="String(feedback.type)" />
      <h1 class="detail-title">{{ feedback.title || '(geen titel)' }}</h1>
      <StatusBadge :status="String(feedback.status || 'new')" />
    </div>

    <Divider />

    <div class="detail-grid">
      <!-- Left column -->
      <div class="detail-main">
        <Card v-if="feedback.body">
          <template #title>Beschrijving</template>
          <template #content>
            <p class="body-text">{{ feedback.body }}</p>
          </template>
        </Card>

        <!-- Screenshots -->
        <Card v-if="allScreenshots.length">
          <template #title>Screenshots ({{ allScreenshots.length }})</template>
          <template #content>
            <Galleria
              :items="galleryItems"
              :fullscreen="true"
              :showThumbnails="true"
              :showItemNavigators="true"
              :circular="true"
              thumbnailsPosition="top"
            />
          </template>
        </Card>

        <!-- Status actions -->
        <Card>
          <template #title>Status wijzigen</template>
          <template #content>
            <SelectButton
              :modelValue="feedback.status"
              :options="statuses"
              optionLabel="label"
              optionValue="value"
              @update:modelValue="updateStatus"
            />
          </template>
        </Card>
      </div>

      <!-- Right column / sidebar -->
      <div class="detail-sidebar">
        <Card>
          <template #title>Metadata</template>
          <template #content>
            <div class="chip-list">
              <Chip v-for="[label, value] in metaFields" :key="label" :label="`${label}: ${value || '-'}`" />
            </div>
          </template>
        </Card>

        <Card v-if="enhancedMeta.length">
          <template #title>Device & Environment</template>
          <template #content>
            <div class="chip-list">
              <Chip v-for="[label, value] in enhancedMeta" :key="label" :label="`${label}: ${value}`" />
            </div>
          </template>
        </Card>

        <Card>
          <template #title>Gebruiker</template>
          <template #content>
            <p class="user-email">{{ feedback.email || feedback.user_email || 'Anoniem' }}</p>
          </template>
        </Card>

        <div class="timestamps">
          <Chip :label="`Aangemaakt: ${formatDate(String(feedback.created_at || ''))}`" />
          <Chip v-if="feedback.updated_at" :label="`Bijgewerkt: ${formatDate(String(feedback.updated_at || ''))}`" />
        </div>
      </div>
    </div>
  </div>
  <div v-else class="loading-state">
    <ProgressSpinner />
    <span>Laden...</span>
  </div>
</template>

<script setup lang="ts">
import Button from '@for-the-people-initiative/design-system/components/Button/Button.vue';
import Card from '@for-the-people-initiative/design-system/components/Card/Card.vue';
import SelectButton from '@for-the-people-initiative/design-system/components/SelectButton/SelectButton.vue';
import Chip from '@for-the-people-initiative/design-system/components/Chip/Chip.vue';
import Divider from '@for-the-people-initiative/design-system/components/Divider/Divider.vue';
import Galleria from '@for-the-people-initiative/design-system/components/Galleria/Galleria.vue';
import ProgressSpinner from '@for-the-people-initiative/design-system/components/ProgressSpinner/ProgressSpinner.vue';

const route = useRoute();
const feedback = ref<any>(null);

const statuses = [
  { value: 'seen', label: 'Gezien' },
  { value: 'in_progress', label: 'In behandeling' },
  { value: 'resolved', label: 'Opgelost' },
  { value: 'wont_fix', label: 'Niet oplossen' },
];

const allScreenshots = computed(() => {
  const f = feedback.value;
  if (!f) return [];
  const imgs: string[] = [];
  if (f.screenshots_json) {
    try {
      const arr = JSON.parse(String(f.screenshots_json));
      if (Array.isArray(arr)) {
        for (const s of arr) {
          if (typeof s === 'string' && s.length > 0) {
            imgs.push(s.startsWith('data:') ? s : `data:image/png;base64,${s}`);
          }
        }
      }
    } catch {}
  }
  if (f.screenshot_base64 && imgs.length === 0) {
    const s = String(f.screenshot_base64);
    imgs.push(s.startsWith('data:') ? s : `data:image/png;base64,${s}`);
  }
  return imgs;
});

const galleryItems = computed(() =>
  allScreenshots.value.map((src, i) => ({
    src,
    alt: `Screenshot ${i + 1}`,
    thumbnail: src,
  }))
);

const metaFields = computed(() => {
  const f = feedback.value;
  if (!f) return [];
  return [
    ['URL', f.page_url],
    ['Route', f.route],
    ['User Agent', f.user_agent],
    ['Viewport', f.viewport],
    ['Console errors', f.console_errors],
    ['App versie', f.app_version],
    ['App', f.app_id],
  ].filter(([, v]) => v);
});

const ENHANCED_LABELS: Record<string, string> = {
  device_type: '📱 Device', os: '💻 OS', browser: '🌐 Browser',
  screen_resolution: '🖥️ Schermresolutie', language: '🌍 Taal', languages: '🌍 Talen',
  timezone: '🕐 Tijdzone', connection_type: '📶 Verbinding', connection_downlink: '⬇️ Downlink (Mbps)',
  touch_support: '👆 Touch', color_scheme: '🎨 Kleurschema', pixel_ratio: '📐 Pixel ratio',
  online: '🔌 Online', cookie_enabled: '🍪 Cookies', do_not_track: '🚫 Do Not Track',
  hardware_concurrency: '⚙️ CPU cores', memory_gb: '💾 RAM (GB)', referrer: '🔗 Referrer',
};

const enhancedMeta = computed(() => {
  const f = feedback.value;
  if (!f?.metadata_json) return [];
  try {
    const meta = JSON.parse(String(f.metadata_json));
    return Object.entries(meta)
      .filter(([, v]) => v !== null && v !== undefined && v !== '')
      .map(([k, v]) => {
        const label = ENHANCED_LABELS[k] || k;
        let display = v;
        if (typeof v === 'boolean') display = v ? 'Ja' : 'Nee';
        return [label, String(display)];
      });
  } catch { return []; }
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
  margin-bottom: var(--space-l);
}
.detail-header {
  display: flex;
  align-items: center;
  gap: var(--space-m);
  margin-bottom: var(--space-m);
}
.detail-title {
  font-size: 1.5rem;
  font-weight: var(--card-title-fontWeight);
  color: var(--text-heading);
  margin: 0;
  flex: 1;
}
.detail-grid {
  display: grid;
  grid-template-columns: 1fr 360px;
  gap: var(--space-l);
  margin-top: var(--space-l);
}
@media (max-width: 900px) {
  .detail-grid { grid-template-columns: 1fr; }
}
.detail-main { display: flex; flex-direction: column; gap: var(--space-m); }
.detail-sidebar { display: flex; flex-direction: column; gap: var(--space-m); }
.body-text {
  white-space: pre-wrap;
  line-height: 1.7;
  color: var(--text-default);
  margin: 0;
}
.chip-list {
  display: flex;
  flex-wrap: wrap;
  gap: var(--space-xs);
}
.action-btns {
  display: flex;
  gap: var(--space-s);
  flex-wrap: wrap;
}
.user-email {
  margin: 0;
  color: var(--text-default);
}
.timestamps {
  display: flex;
  flex-direction: column;
  gap: var(--space-2xs);
}
.loading-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--space-m);
  padding: var(--space-2xl);
  color: var(--text-muted);
}
</style>
