<script setup>
import { onMounted } from 'vue';
import { useI18n } from 'vue-i18n';
import useDashboardStore from '@/dashboard/application/dashboard.store.js';
import DashboardMetrics from '../components/dashboard-metrics.vue';
import MapView from '../components/map-view.vue';
import AlertsWidget from '../components/alerts-widget.vue';
import CompanyMetrics from '../components/company-metrics.vue';

const { t } = useI18n();
const store = useDashboardStore();

onMounted(() => {
  store.fetchDashboard();
});
</script>

<template>
  <main class="dashboard-page">
    <!-- Hero -->
    <section class="dashboard-hero">
      <div class="hero-copy">
        <span class="eyebrow">{{ t('dashboardPage.eyebrow') }}</span>
        <h1>{{ t(store.overview.titleKey) }}</h1>
        <p>{{ t(store.overview.subtitleKey) }}</p>
      </div>

      <div class="hero-insight">
        <span>{{ t(store.overview.heroLabelKey) }}</span>
        <strong>{{ store.overview.heroValue }}</strong>
      </div>
    </section>

    <!-- KPI Metrics -->
    <DashboardMetrics :metrics="store.metrics" />

    <!-- Map + Company KPIs -->
    <section class="dashboard-grid">
      <div class="map-column">
        <MapView :vehicles="store.vehicles" />
      </div>
      <div class="side-column">
        <CompanyMetrics
            :eyebrow="t('dashboardPage.kpis.eyebrow')"
            :title="t('dashboardPage.kpis.title')"
            :items="store.operationItems"
        />
      </div>
    </section>

    <!-- Alerts + Activity -->
    <section class="bottom-grid">
      <AlertsWidget :alerts="store.alerts" />

      <section class="activity-card">
        <div class="section-heading">
          <div>
            <p>{{ t('dashboardPage.activity.eyebrow') }}</p>
            <h2>{{ t('dashboardPage.activity.title') }}</h2>
          </div>
          <span>{{ t('dashboardPage.activity.today') }}</span>
        </div>

        <div class="activity-list">
          <article
              v-for="activity in store.activities"
              :key="activity.id"
              class="activity-item"
              :class="activity.status"
          >
            <div class="activity-status"></div>
            <div>
              <time>{{ activity.time }}</time>
              <strong>{{ activity.title }}</strong>
              <p>{{ activity.description }}</p>
            </div>
          </article>
        </div>
      </section>
    </section>
  </main>
</template>

<style scoped>
.dashboard-page {
  padding: clamp(1rem, 2vw, 1.6rem);
  display: grid;
  gap: 1.15rem;
}

.dashboard-hero {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 2rem;
  border-radius: 28px;
  padding: clamp(1.25rem, 3vw, 2rem);
  border: 1px solid rgba(34, 131, 198, .12);
  background:
      radial-gradient(circle at 16% 10%, rgba(34, 131, 198, .18), transparent 36%),
      radial-gradient(circle at 82% 18%, rgba(255, 181, 46, .24), transparent 34%),
      linear-gradient(135deg, rgba(255,255,255,.94), rgba(236,247,252,.9));
  box-shadow: var(--kw-shadow);
  overflow: hidden;
}

body.dark-theme .dashboard-hero {
  background:
      radial-gradient(circle at 16% 10%, rgba(34, 131, 198, .26), transparent 36%),
      radial-gradient(circle at 82% 18%, rgba(255, 181, 46, .17), transparent 34%),
      linear-gradient(135deg, rgba(20, 45, 74, .94), rgba(7, 23, 41, .92));
}

.dashboard-hero::after {
  content: '';
  position: absolute;
  width: 220px;
  height: 220px;
  right: -80px;
  bottom: -90px;
  border-radius: 50%;
  background: rgba(34, 131, 198, .10);
}

.hero-copy { position: relative; z-index: 1; }
.eyebrow {
  display: inline-block;
  margin-bottom: .45rem;
  color: var(--kw-blue-700);
  font-weight: 950;
  letter-spacing: .14em;
  font-size: .78rem;
  text-transform: uppercase;
}
h1 {
  margin: 0;
  color: var(--kw-ink);
  font-size: clamp(2.15rem, 4vw, 4.6rem);
  line-height: .98;
  letter-spacing: -.05em;
}
.hero-copy p {
  margin: .8rem 0 0;
  color: var(--kw-muted);
  max-width: 720px;
  font-size: clamp(.95rem, 1.3vw, 1.1rem);
  line-height: 1.6;
}

.hero-insight {
  position: relative;
  z-index: 1;
  min-width: 170px;
  border-radius: 24px;
  padding: 1rem 1.15rem;
  text-align: right;
  background: rgba(255,255,255,.7);
  border: 1px solid rgba(34,131,198,.12);
  box-shadow: 0 16px 34px rgba(15, 43, 87, .08);
}
body.dark-theme .hero-insight { background: rgba(255,255,255,.06); }
.hero-insight span { display: block; color: var(--kw-muted); font-size: .8rem; font-weight: 800; }
.hero-insight strong { display: block; color: var(--kw-blue-900); font-size: 2.2rem; line-height: 1.1; }

.dashboard-grid {
  display: grid;
  grid-template-columns: minmax(0, 1.65fr) minmax(320px, .75fr);
  gap: 1.15rem;
  align-items: stretch;
}

.bottom-grid {
  display: grid;
  grid-template-columns: minmax(0, 1fr) minmax(320px, .85fr);
  gap: 1.15rem;
  align-items: stretch;
}

.activity-card {
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
.section-heading span {
  color: var(--kw-blue-900);
  background: rgba(34, 131, 198, .12);
  border-radius: 999px;
  padding: .32rem .7rem;
  font-weight: 900;
  font-size: .75rem;
}

.activity-list { display: grid; gap: .9rem; }
.activity-item {
  display: grid;
  grid-template-columns: 12px 1fr;
  gap: .8rem;
  padding: .88rem;
  border-radius: 18px;
  background: rgba(248,251,255,.86);
  border: 1px solid rgba(17,24,39,.06);
}
body.dark-theme .activity-item { background: rgba(255,255,255,.04); }
.activity-status {
  width: 11px;
  height: 11px;
  border-radius: 50%;
  margin-top: .3rem;
  background: #22c55e;
  box-shadow: 0 0 0 5px rgba(34,197,94,.12);
}
.activity-item.warning .activity-status { background: #f59e0b; box-shadow: 0 0 0 5px rgba(245,158,11,.14); }
.activity-item.in-progress .activity-status { background: var(--kw-blue-700); box-shadow: 0 0 0 5px rgba(34,131,198,.13); }
time { display: block; color: var(--kw-muted); font-weight: 900; font-size: .72rem; margin-bottom: .15rem; }
.activity-item strong { display: block; font-size: .94rem; }
.activity-item p { margin: .22rem 0 0; color: var(--kw-muted); font-size: .84rem; line-height: 1.4; }

@media (max-width: 1280px) {
  .dashboard-grid, .bottom-grid { grid-template-columns: 1fr; }
}

@media (max-width: 760px) {
  .dashboard-page { padding: .9rem; }
  .dashboard-hero { align-items: flex-start; flex-direction: column; }
  .hero-insight { text-align: left; width: 100%; }
}
</style>