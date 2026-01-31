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

    <!-- Screenshots section -->
    <div class="screenshots" v-if="allScreenshots.length">
      <h3>Screenshots ({{ allScreenshots.length }})</h3>
      <div class="screenshot-grid">
        <div v-for="(src, i) in allScreenshots" :key="i" class="screenshot-item" @click="openLightbox(i)">
          <img :src="src" :alt="`Screenshot ${i + 1}`" loading="lazy" />
        </div>
      </div>
    </div>

    <!-- Lightbox -->
    <Teleport to="body">
      <div v-if="lightboxIndex !== null" class="lightbox" @click.self="lightboxIndex = null">
        <button class="lightbox-close" @click="lightboxIndex = null">&times;</button>
        <button v-if="allScreenshots.length > 1 && lightboxIndex > 0" class="lightbox-nav lightbox-prev" @click="lightboxIndex!--">&lsaquo;</button>
        <img :src="allScreenshots[lightboxIndex]" alt="Screenshot" />
        <button v-if="allScreenshots.length > 1 && lightboxIndex < allScreenshots.length - 1" class="lightbox-nav lightbox-next" @click="lightboxIndex!++">&rsaquo;</button>
      </div>
    </Teleport>

    <!-- Basic metadata -->
    <div class="metadata">
      <h3>Metadata</h3>
      <dl>
        <template v-for="[label, value] in metaFields" :key="label">
          <dt>{{ label }}</dt>
          <dd>{{ value || '-' }}</dd>
        </template>
      </dl>
    </div>

    <!-- Enhanced metadata -->
    <div class="metadata" v-if="enhancedMeta.length">
      <h3>Device & Environment</h3>
      <dl>
        <template v-for="[label, value] in enhancedMeta" :key="label">
          <dt>{{ label }}</dt>
          <dd>{{ value }}</dd>
        </template>
      </dl>
    </div>

    <div class="user-info">
      <h3>Gebruiker</h3>
      <p>{{ feedback.email || feedback.user_email || 'Anoniem' }}</p>
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
const lightboxIndex = ref<number | null>(null);

const statuses = [
  { value: 'seen', label: 'Gezien' },
  { value: 'in_progress', label: 'In behandeling' },
  { value: 'resolved', label: 'Opgelost' },
  { value: 'wont_fix', label: 'Niet oplossen' },
];

// Collect all screenshots from both columns
const allScreenshots = computed(() => {
  const f = feedback.value;
  if (!f) return [];
  const imgs: string[] = [];

  // screenshots_json (array of data URLs)
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

  // Fallback: screenshot_base64 (single image, only if not already covered)
  if (f.screenshot_base64 && imgs.length === 0) {
    const s = String(f.screenshot_base64);
    imgs.push(s.startsWith('data:') ? s : `data:image/png;base64,${s}`);
  }

  return imgs;
});

function openLightbox(i: number) {
  lightboxIndex.value = i;
}

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
  device_type: '📱 Device',
  os: '💻 OS',
  browser: '🌐 Browser',
  screen_resolution: '🖥️ Schermresolutie',
  language: '🌍 Taal',
  languages: '🌍 Talen',
  timezone: '🕐 Tijdzone',
  connection_type: '📶 Verbinding',
  connection_downlink: '⬇️ Downlink (Mbps)',
  touch_support: '👆 Touch',
  color_scheme: '🎨 Kleurschema',
  pixel_ratio: '📐 Pixel ratio',
  online: '🔌 Online',
  cookie_enabled: '🍪 Cookies',
  do_not_track: '🚫 Do Not Track',
  hardware_concurrency: '⚙️ CPU cores',
  memory_gb: '💾 RAM (GB)',
  referrer: '🔗 Referrer',
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
.detail-body, .metadata, .user-info, .screenshots, .actions {
  background: var(--color-surface, #1e1e2e);
  border: 1px solid var(--color-border, #333);
  border-radius: 8px;
  padding: var(--space-4, 16px);
  margin-bottom: var(--space-3, 12px);
}
.detail-body p { white-space: pre-wrap; line-height: 1.6; }
h3 { margin: 0 0 8px; font-size: 0.9rem; color: var(--color-text-muted, #888); text-transform: uppercase; }
dl { display: grid; grid-template-columns: 180px 1fr; gap: 4px 12px; margin: 0; }
dt { color: var(--color-text-muted, #888); font-size: 0.85rem; }
dd { margin: 0; font-size: 0.9rem; word-break: break-all; }

/* Screenshot grid */
.screenshot-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 12px;
  margin-top: 8px;
}
.screenshot-item {
  cursor: pointer;
  border-radius: 6px;
  overflow: hidden;
  border: 1px solid var(--color-border, #444);
  transition: transform 0.15s, box-shadow 0.15s;
}
.screenshot-item:hover {
  transform: scale(1.02);
  box-shadow: 0 4px 12px rgba(0,0,0,0.3);
}
.screenshot-item img {
  width: 100%;
  display: block;
}

/* Lightbox */
.lightbox {
  position: fixed;
  inset: 0;
  background: rgba(0,0,0,0.9);
  z-index: 10000;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 40px;
}
.lightbox img {
  max-width: 90vw;
  max-height: 90vh;
  border-radius: 8px;
  object-fit: contain;
}
.lightbox-close {
  position: absolute;
  top: 16px;
  right: 24px;
  background: none;
  border: none;
  color: #fff;
  font-size: 2.5rem;
  cursor: pointer;
  z-index: 1;
}
.lightbox-nav {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  background: rgba(255,255,255,0.1);
  border: none;
  color: #fff;
  font-size: 3rem;
  padding: 8px 16px;
  cursor: pointer;
  border-radius: 8px;
}
.lightbox-prev { left: 16px; }
.lightbox-next { right: 16px; }
.lightbox-nav:hover { background: rgba(255,255,255,0.2); }

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
