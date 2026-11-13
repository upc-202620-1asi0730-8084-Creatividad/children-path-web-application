<script setup>
import { useI18n } from 'vue-i18n';

defineProps({
  alerts: { type: Array, required: true }
});

const { t } = useI18n();

const alertIcons = {
  delay: 'schedule',
  deviation: 'alt_route',
  incident: 'report_problem',
  emergency: 'sos',
  attendance: 'fact_check',
  system: 'settings_suggest'
};

function iconFor(type) {
  return alertIcons[type] ?? 'notifications_active';
}
</script>

<template>
  <section class="alerts-card">
    <div class="section-heading">
      <div>
        <p>{{ t('dashboardPage.alerts.eyebrow') }}</p>
        <h2>{{ t('dashboardPage.alerts.title') }}</h2>
      </div>
      <span class="open-count">{{ alerts.length }} {{ t('dashboardPage.alerts.items') }}</span>
    </div>

    <div v-if="alerts.length" class="alerts-list">
      <article
          v-for="alert in alerts"
          :key="alert.id"
          class="alert-item"
          :class="alert.priority"
      >
        <div class="alert-icon">
          <i class="material-symbols-outlined">{{ iconFor(alert.type) }}</i>
        </div>
        <div class="alert-content">
          <div class="alert-title-row">
            <strong>{{ alert.title }}</strong>
            <span :class="alert.priority">{{ alert.priority }}</span>
          </div>
          <p>{{ alert.message }}</p>
          <small>{{ alert.timestamp }}</small>
        </div>
      </article>
    </div>

    <div v-else class="empty-alerts">
      <i class="material-symbols-outlined">verified</i>
      <strong>{{ t('dashboardPage.alerts.emptyTitle') }}</strong>
      <span>{{ t('dashboardPage.alerts.emptyMessage') }}</span>
    </div>
  </section>
</template>

<style scoped>
.alerts-card {
  height: 100%;
  border: 1px solid var(--kw-border);
  border-radius: 24px;
  background: var(--kw-card);
  box-shadow: var(--kw-shadow);
  padding: 1.2rem;
}

.section-heading {
  display: flex;
  justify-content: space-between;
  gap: 1rem;
  align-items: flex-start;
  margin-bottom: 1rem;
}
.section-heading p {
  margin: 0 0 .25rem;
  color: var(--kw-blue-700);
  font-weight: 900;
  font-size: .78rem;
  letter-spacing: .12em;
  text-transform: uppercase;
}
.section-heading h2 { margin: 0; font-size: clamp(1.25rem, 1.8vw, 1.7rem); }
.open-count {
  border-radius: 999px;
  background: rgba(34, 131, 198, .12);
  color: var(--kw-blue-900);
  font-weight: 900;
  padding: .32rem .7rem;
  font-size: .75rem;
  white-space: nowrap;
}

.alerts-list { display: grid; gap: .85rem; }
.alert-item {
  display: grid;
  grid-template-columns: 46px 1fr;
  gap: .85rem;
  padding: .95rem;
  border-radius: 18px;
  background: rgba(248, 251, 255, .86);
  border: 1px solid rgba(17, 24, 39, .06);
  border-left: 4px solid #f59e0b;
}
body.dark-theme .alert-item { background: rgba(255,255,255,.04); }
.alert-item.high { border-left-color: #f97316; }
.alert-item.critical { border-left-color: #ef4444; }
.alert-item.medium { border-left-color: var(--kw-yellow-500); }
.alert-item.low { border-left-color: #22c55e; }

.alert-icon {
  width: 46px;
  height: 46px;
  border-radius: 16px;
  display: grid;
  place-items: center;
  background: rgba(255, 181, 46, .17);
  color: #b45309;
}

.alert-title-row {
  display: flex;
  justify-content: space-between;
  gap: .75rem;
  align-items: flex-start;
}
.alert-title-row strong { font-size: .95rem; }
.alert-title-row span {
  text-transform: capitalize;
  border-radius: 999px;
  padding: .16rem .48rem;
  font-size: .68rem;
  font-weight: 900;
  background: rgba(245, 158, 11, .16);
  color: #92400e;
}
.alert-title-row span.high { color: #c2410c; background: rgba(249, 115, 22, .13); }
.alert-title-row span.critical { color: #b91c1c; background: rgba(239, 68, 68, .13); }
.alert-title-row span.low { color: #166534; background: rgba(34,197,94,.13); }

.alert-content p { margin: .25rem 0 .35rem; color: var(--kw-muted); font-size: .84rem; line-height: 1.4; }
.alert-content small { color: var(--kw-muted); font-weight: 700; }

.empty-alerts {
  min-height: 180px;
  display: grid;
  place-items: center;
  text-align: center;
  gap: .35rem;
  color: var(--kw-muted);
  border-radius: 18px;
  background: rgba(34, 131, 198, .07);
}
.empty-alerts .material-symbols-outlined { color: #22c55e; font-size: 42px; }
.empty-alerts strong { color: var(--kw-ink); }
</style>