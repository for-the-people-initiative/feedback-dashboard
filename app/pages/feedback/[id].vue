<template>
  <div v-if="feedback">
    <button class="back-btn" @click="navigateTo('/')">
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><polyline points="15 18 9 12 15 6"/></svg>
      Terug naar overzicht
    </button>

    <div class="detail-header">
      <TypeIcon :type="String(feedback.type)" />
      <h1 class="detail-title">{{ feedback.title || '(geen titel)' }}</h1>
      <StatusBadge :status="String(feedback.status || 'new')" />
    </div>

    <div class="detail-grid">
      <!-- Left column -->
      <div class="detail-main">
        <div class="card" v-if="feedback.body">
          <h3 class="card-heading">Beschrijving</h3>
          <p class="body-text">{{ feedback.body }}</p>
        </div>

        <!-- Screenshots -->
        <div class="card" v-if="allScreenshots.length">
          <h3 class="card-heading">Screenshots ({{ allScreenshots.length }})</h3>
          <div class="screenshot-grid">
            <div v-for="(src, i) in allScreenshots" :key="i" class="screenshot-item" @click="openLightbox(i)">
              <img :src="src" :alt="`Screenshot ${i + 1}`" loading="lazy" />
              <div class="screenshot-overlay">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/><line x1="11" y1="8" x2="11" y2="14"/><line x1="8" y1="11" x2="14" y2="11"/></svg>
              </div>
            </div>
          </div>
        </div>

        <!-- Status actions -->
        <div class="card">
          <h3 class="card-heading">Status wijzigen</h3>
          <div class="action-btns">
            <button v-for="s in statuses" :key="s.value" class="action-btn" :class="{ active: feedback.status === s.value }" @click="updateStatus(s.value)">
              {{ s.label }}
            </button>
          </div>
        </div>
      </div>

      <!-- Right column / sidebar -->
      <div class="detail-sidebar">
        <div class="card">
          <h3 class="card-heading">Metadata</h3>
          <dl class="meta-list">
            <template v-for="[label, value] in metaFields" :key="label">
              <dt>{{ label }}</dt>
              <dd>{{ value || '-' }}</dd>
            </template>
          </dl>
        </div>

        <div class="card" v-if="enhancedMeta.length">
          <h3 class="card-heading">Device & Environment</h3>
          <dl class="meta-list">
            <template v-for="[label, value] in enhancedMeta" :key="label">
              <dt>{{ label }}</dt>
              <dd>{{ value }}</dd>
            </template>
          </dl>
        </div>

        <div class="card">
          <h3 class="card-heading">Gebruiker</h3>
          <p class="user-email">{{ feedback.email || feedback.user_email || 'Anoniem' }}</p>
        </div>

        <div class="timestamps">
          <span>Aangemaakt: {{ formatDate(String(feedback.created_at || '')) }}</span>
          <span v-if="feedback.updated_at">Bijgewerkt: {{ formatDate(String(feedback.updated_at || '')) }}</span>
        </div>
      </div>
    </div>

    <!-- Lightbox -->
    <Teleport to="body">
      <div v-if="lightboxIndex !== null" class="lightbox" @click.self="lightboxIndex = null">
        <button class="lightbox-close" @click="lightboxIndex = null">&times;</button>
        <button v-if="allScreenshots.length > 1 && lightboxIndex > 0" class="lightbox-nav lightbox-prev" @click="lightboxIndex = lightboxIndex! - 1">&lsaquo;</button>
        <img :src="allScreenshots[lightboxIndex]" alt="Screenshot" />
        <button v-if="allScreenshots.length > 1 && lightboxIndex < allScreenshots.length - 1" class="lightbox-nav lightbox-next" @click="lightboxIndex = lightboxIndex! + 1">&rsaquo;</button>
        <div class="lightbox-counter">{{ lightboxIndex + 1 }} / {{ allScreenshots.length }}</div>
      </div>
    </Teleport>
  </div>
  <div v-else class="loading-state">
    <div class="spinner"></div>
    <span>Laden...</span>
  </div>
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

function openLightbox(i: number) { lightboxIndex.value = i; }

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
  display: inline-flex;
  align-items: center;
  gap: var(--space-xs);
  background: var(--button-background-text-default);
  border: none;
  color: var(--text-secondary);
  padding: var(--button-size-sm-paddingY) 0;
  cursor: pointer;
  font-size: var(--button-size-sm-fontSize);
  font-weight: 500;
  transition: color var(--button-transition-duration);
  margin-bottom: var(--space-l);
}
.back-btn:hover { color: var(--text-link); }

.detail-header {
  display: flex;
  align-items: center;
  gap: var(--space-m);
  margin-bottom: var(--space-l);
  padding-bottom: var(--space-m);
  border-bottom: 1px solid var(--border-subtle);
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
}
@media (max-width: 900px) {
  .detail-grid { grid-template-columns: 1fr; }
}

.detail-main { display: flex; flex-direction: column; gap: var(--space-m); }
.detail-sidebar { display: flex; flex-direction: column; gap: var(--space-m); }

.card {
  background: var(--card-background);
  border: var(--card-border-width) solid var(--card-border-color);
  border-radius: var(--card-radius);
  padding: var(--card-padding);
  box-shadow: var(--card-shadow);
}

.card-heading {
  margin: 0 0 var(--space-m);
  font-size: 13px;
  font-weight: var(--dataTable-header-fontWeight);
  color: var(--text-muted);
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.body-text {
  white-space: pre-wrap;
  line-height: 1.7;
  color: var(--text-default);
  margin: 0;
}

/* Meta list */
.meta-list {
  display: grid;
  grid-template-columns: 1fr;
  gap: var(--space-s);
  margin: 0;
}
.meta-list dt {
  color: var(--text-muted);
  font-size: 12px;
  text-transform: uppercase;
  letter-spacing: 0.3px;
  margin-bottom: var(--space-3xs);
}
.meta-list dd {
  margin: 0 0 var(--space-xs);
  font-size: var(--dataTable-body-fontSize);
  word-break: break-all;
  color: var(--text-default);
  padding-bottom: var(--space-xs);
  border-bottom: 1px solid var(--border-subtle);
}
.meta-list dd:last-child { border-bottom: none; padding-bottom: 0; margin-bottom: 0; }

.user-email {
  margin: 0;
  color: var(--text-default);
}

.timestamps {
  display: flex;
  flex-direction: column;
  gap: var(--space-2xs);
  font-size: 12px;
  color: var(--text-muted);
  padding: var(--space-s) 0;
}

/* Screenshots */
.screenshot-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
  gap: var(--space-s);
}
.screenshot-item {
  cursor: pointer;
  border-radius: var(--radius-rounded);
  overflow: hidden;
  border: 1px solid var(--border-default);
  position: relative;
  transition: transform var(--button-transition-duration), box-shadow var(--button-transition-duration);
}
.screenshot-item:hover {
  transform: scale(1.03);
  box-shadow: var(--shadow-m);
}
.screenshot-item img {
  width: 100%;
  display: block;
}
.screenshot-overlay {
  position: absolute;
  inset: 0;
  background: rgba(0,0,0,0.4);
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0;
  transition: opacity 0.2s;
  color: white;
}
.screenshot-item:hover .screenshot-overlay { opacity: 1; }

/* Lightbox */
.lightbox {
  position: fixed;
  inset: 0;
  background: rgba(0,0,0,0.92);
  z-index: 10000;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: var(--space-xl);
}
.lightbox img {
  max-width: 90vw;
  max-height: 90vh;
  border-radius: var(--radius-rounded);
  object-fit: contain;
}
.lightbox-close {
  position: absolute;
  top: var(--space-m);
  right: var(--space-l);
  background: none;
  border: none;
  color: #fff;
  font-size: 2.5rem;
  cursor: pointer;
  z-index: 1;
  opacity: 0.7;
  transition: opacity 0.15s;
}
.lightbox-close:hover { opacity: 1; }
.lightbox-nav {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  background: rgba(255,255,255,0.1);
  border: 1px solid rgba(255,255,255,0.15);
  color: #fff;
  font-size: 2.5rem;
  padding: var(--space-s) var(--space-m);
  cursor: pointer;
  border-radius: var(--radius-rounded);
  transition: background 0.15s;
}
.lightbox-prev { left: var(--space-m); }
.lightbox-next { right: var(--space-m); }
.lightbox-nav:hover { background: rgba(255,255,255,0.2); }
.lightbox-counter {
  position: absolute;
  bottom: var(--space-l);
  left: 50%;
  transform: translateX(-50%);
  color: rgba(255,255,255,0.6);
  font-size: 13px;
}

/* Action buttons */
.action-btns {
  display: flex;
  gap: var(--space-s);
  flex-wrap: wrap;
}
.action-btn {
  padding: var(--button-size-sm-paddingY) var(--button-size-sm-paddingX);
  border: var(--button-border-width) solid var(--border-strong);
  border-radius: var(--button-radius-default);
  background: var(--surface-canvas);
  color: var(--text-default);
  cursor: pointer;
  font-size: var(--button-size-sm-fontSize);
  font-weight: 500;
  transition: all var(--button-transition-duration);
}
.action-btn:hover {
  background: var(--surface-elevated);
  border-color: var(--border-focus);
}
.action-btn.active {
  background: linear-gradient(135deg, var(--accent-gradient-start), var(--accent-gradient-end));
  color: var(--button-text-primary-default);
  border-color: transparent;
  box-shadow: var(--shadow-xs);
}

.loading-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--space-m);
  padding: var(--space-2xl);
  color: var(--text-muted);
}
.spinner {
  width: 32px;
  height: 32px;
  border: 3px solid var(--border-subtle);
  border-top-color: var(--brand-secondary);
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}
@keyframes spin { to { transform: rotate(360deg); } }
</style>
