<script setup>
import { useI18n } from 'vue-i18n';

defineProps({
  metrics: { type: Array, required: true }
});

const { t } = useI18n();
</script>

<template>
  <section class="metrics-grid" aria-label="Dashboard metrics">
    <article v-for="metric in metrics" :key="metric.id" class="metric-card">
      <div class="metric-icon">
        <i class="material-symbols-outlined">{{ metric.icon }}</i>
      </div>
      <div class="metric-content">
        <p class="metric-label">{{ t(metric.labelKey) }}</p>
        <strong>{{ metric.value }}</strong>
        <span>{{ t(metric.helperKey) }}</span>
      </div>
      <div v-if="metric.trend" class="metric-trend" :class="metric.trendDirection">
        {{ metric.trend }}
      </div>
    </article>
  </section>
</template>

<style scoped>
.metrics-grid {
  display: grid;
  grid-template-columns: repeat(6, minmax(140px, 1fr));
  gap: 1rem;
}

.metric-card {
  position: relative;
  min-height: 128px;
  padding: 1.15rem;
  border: 1px solid var(--kw-border);
  border-radius: 22px;
  background: linear-gradient(180deg, rgba(255,255,255,.96), rgba(255,255,255,.88));
  box-shadow: 0 16px 34px rgba(15, 43, 87, .08);
  display: flex;
  flex-direction: column;
  gap: .75rem;
  overflow: hidden;
}

body.dark-theme .metric-card {
  background: linear-gradient(180deg, rgba(20, 45, 74, .95), rgba(9, 25, 45, .9));
}

.metric-card::after {
  content: '';
  position: absolute;
  inset: auto -38px -44px auto;
  width: 96px;
  height: 96px;
  border-radius: 50%;
  background: rgba(34, 131, 198, .12);
}

.metric-icon {
  width: 38px;
  height: 38px;
  border-radius: 14px;
  display: grid;
  place-items: center;
  color: var(--kw-blue-700);
  background: rgba(34, 131, 198, .12);
}
.metric-icon .material-symbols-outlined { font-size: 21px; }

.metric-content { display: grid; gap: .2rem; }
.metric-label { margin: 0; color: var(--kw-muted); font-size: .84rem; }
strong { font-size: clamp(1.55rem, 2.2vw, 2.2rem); line-height: 1; color: var(--kw-ink); }
span { color: var(--kw-muted); font-size: .78rem; }

.metric-trend {
  position: absolute;
  top: .9rem;
  right: .9rem;
  border-radius: 999px;
  padding: .18rem .52rem;
  font-size: .72rem;
  font-weight: 800;
  color: #166534;
  background: rgba(34, 197, 94, .12);
}
.metric-trend.down { color: #0f766e; background: rgba(20, 184, 166, .12); }
.metric-trend.stable { color: #92400e; background: rgba(245, 158, 11, .16); }

@media (max-width: 1280px) { .metrics-grid { grid-template-columns: repeat(3, 1fr); } }
@media (max-width: 760px) { .metrics-grid { grid-template-columns: repeat(2, 1fr); } }
@media (max-width: 520px) { .metrics-grid { grid-template-columns: 1fr; } }
</style>