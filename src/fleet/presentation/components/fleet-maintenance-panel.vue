<script setup>
import { useI18n } from 'vue-i18n';

defineProps({
  alerts: { type: Array, required: true }
});

const { t } = useI18n();
</script>

<template>
  <article class="maintenance-panel">
    <header>
      <div>
        <p>{{ t('fleet.maintenance.eyebrow') }}</p>
        <h2>{{ t('fleet.maintenance.title') }}</h2>
      </div>
      <span>{{ alerts.length }} {{ t('fleet.maintenance.items') }}</span>
    </header>

    <div class="alerts-list">
      <section
          v-for="alert in alerts"
          :key="alert.id"
          class="maintenance-alert"
          :class="alert.priority"
      >
        <span class="alert-icon">
          <i class="material-symbols-outlined">build_circle</i>
        </span>
        <div>
          <h3>{{ alert.title }}</h3>
          <p>{{ alert.description }}</p>
          <small>{{ alert.vehicleCode }} · {{ t('fleet.maintenance.due') }} {{ alert.dueDate }}</small>
        </div>
        <strong>{{ t('fleet.priority.' + alert.priority) }}</strong>
      </section>
    </div>
  </article>
</template>

<style scoped>
.maintenance-panel {
  display: grid;
  gap: 18px;
  padding: 22px;
  border: 1px solid var(--kw-border);
  border-radius: 20px;
  background: var(--kw-card);
  box-shadow: var(--kw-shadow);
}
header { display: flex; justify-content: space-between; align-items: flex-start; gap: 16px; }
header p { margin: 0 0 5px; color: var(--kw-blue-700); font-size: .78rem; font-weight: 900; text-transform: uppercase; letter-spacing: .1em; }
h2 { margin: 0; color: var(--kw-ink); font-size: 1.35rem; }
header span { padding: 7px 12px; border-radius: 999px; color: #0f5f9a; background: #e3f4ff; font-size: .78rem; font-weight: 900; }
.alerts-list { display: grid; gap: 12px; }
.maintenance-alert {
  display: grid;
  grid-template-columns: auto 1fr auto;
  gap: 13px;
  align-items: start;
  padding: 16px;
  border-radius: 16px;
  border: 1px solid var(--kw-border);
  background: rgba(255,255,255,.72);
}
.alert-icon {
  display: inline-grid;
  place-items: center;
  width: 38px;
  height: 38px;
  border-radius: 13px;
  color: #b77900;
  background: #fff4d8;
}
h3 { margin: 0; color: var(--kw-ink); font-size: .98rem; }
p { margin: 5px 0 8px; color: var(--kw-muted); line-height: 1.45; }
small { color: var(--kw-muted); font-weight: 700; }
strong { padding: 5px 9px; border-radius: 999px; font-size: .72rem; text-transform: uppercase; }
.maintenance-alert.high strong { color: #991b1b; background: #fee2e2; }
.maintenance-alert.medium strong { color: #92400e; background: #fef3c7; }
.maintenance-alert.low strong { color: #166534; background: #dcfce7; }
body.dark-theme .maintenance-alert { background: rgba(255,255,255,.04); }
@media (max-width: 640px) {
  .maintenance-alert { grid-template-columns: auto 1fr; }
  strong { grid-column: 2; justify-self: start; }
}
</style>