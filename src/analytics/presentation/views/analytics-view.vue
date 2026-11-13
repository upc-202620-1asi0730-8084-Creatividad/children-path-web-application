<script setup>
import { computed, onMounted } from 'vue';
import { useI18n } from 'vue-i18n';
import useAnalyticsStore from '@/analytics/application/analytics.store.js';

const { t } = useI18n();
const store = useAnalyticsStore();

const statusOptions = [
  { value: 'all', labelKey: 'analyticsBc.filters.allRoutes', icon: 'select_all' },
  { value: 'healthy', labelKey: 'analyticsBc.status.healthy', icon: 'check_circle' },
  { value: 'attention', labelKey: 'analyticsBc.status.attention', icon: 'pending_actions' },
  { value: 'risk', labelKey: 'analyticsBc.status.risk', icon: 'warning' }
];

const reportTypeOptions = [
  { value: 'all', labelKey: 'analyticsBc.reports.all', icon: 'dashboard' },
  { value: 'fleet', labelKey: 'analyticsBc.reports.fleet', icon: 'directions_bus' },
  { value: 'trip', labelKey: 'analyticsBc.reports.trip', icon: 'route' },
  { value: 'attendance', labelKey: 'analyticsBc.reports.attendance', icon: 'fact_check' },
  { value: 'incident', labelKey: 'analyticsBc.reports.incident', icon: 'report_problem' },
  { value: 'service_quality', labelKey: 'analyticsBc.reports.quality', icon: 'monitoring' }
];

const statusLabel = (status) => `analyticsBc.status.${status}`;

const donutStyle = (value) => {
  const percentage = Math.max(0, Math.min(100, value));
  return `conic-gradient(#2283c6 0 ${percentage}%, #e5f1f8 ${percentage}% 100%)`;
};

const formatShortTime = (iso) => {
  if (!iso) return '';
  const date = new Date(iso);
  return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
};

const formatShort = (iso) => {
  if (!iso) return '';
  const date = new Date(iso);
  return date.toLocaleDateString('en-US', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' });
};

onMounted(() => {
  store.refreshDashboard();
});
</script>

<template>
  <section class="analytics-page">
    <!-- Hero -->
    <header class="hero-card">
      <div>
        <span class="eyebrow">{{ t('analyticsBc.hero.eyebrow') }}</span>
        <h1>{{ t('analyticsBc.hero.title') }}</h1>
        <p>{{ t('analyticsBc.hero.subtitle') }}</p>
      </div>
      <aside class="hero-badge">
        <span>{{ t('analyticsBc.hero.score') }}</span>
        <strong>{{ store.summary.serviceQualityScore }}%</strong>
      </aside>
    </header>

    <!-- Metric grid -->
    <div class="metric-grid">
      <article class="metric-card">
        <span class="metric-icon blue"><i class="material-symbols-outlined">route</i></span>
        <small>{{ t('analyticsBc.metrics.totalTrips') }}</small>
        <strong>{{ store.summary.totalTrips }}</strong>
        <p>{{ t('analyticsBc.metrics.totalTripsHint') }}</p>
      </article>
      <article class="metric-card">
        <span class="metric-icon green"><i class="material-symbols-outlined">fact_check</i></span>
        <small>{{ t('analyticsBc.metrics.attendance') }}</small>
        <strong>{{ store.summary.attendanceRate }}%</strong>
        <p>{{ t('analyticsBc.metrics.attendanceHint') }}</p>
      </article>
      <article class="metric-card">
        <span class="metric-icon amber"><i class="material-symbols-outlined">schedule</i></span>
        <small>{{ t('analyticsBc.metrics.delay') }}</small>
        <strong>{{ store.summary.averageDelayMinutes }} min</strong>
        <p>{{ t('analyticsBc.metrics.delayHint') }}</p>
      </article>
      <article class="metric-card">
        <span class="metric-icon cyan"><i class="material-symbols-outlined">directions_bus</i></span>
        <small>{{ t('analyticsBc.metrics.fleetUsage') }}</small>
        <strong>{{ store.summary.fleetUsage }}%</strong>
        <p>{{ t('analyticsBc.metrics.fleetUsageHint') }}</p>
      </article>
      <article class="metric-card">
        <span class="metric-icon red"><i class="material-symbols-outlined">report_problem</i></span>
        <small>{{ t('analyticsBc.metrics.incidentRate') }}</small>
        <strong>{{ store.summary.incidentRate }}%</strong>
        <p>{{ t('analyticsBc.metrics.incidentRateHint') }}</p>
      </article>
    </div>

    <!-- Command banner -->
    <div class="command-banner">
      <span><i class="material-symbols-outlined">monitoring</i></span>
      <div>
        <strong>{{ t('analyticsBc.banner.title') }}</strong>
        <p>{{ t('analyticsBc.banner.message') }}</p>
      </div>
      <button type="button" @click="store.refreshDashboard()">
        <i class="material-symbols-outlined">sync</i>
        {{ t('analyticsBc.actions.refresh') }}
      </button>
    </div>

    <!-- Monitoring grid -->
    <section class="monitoring-grid">
      <article class="center-card live-card">
        <div class="section-head">
          <div>
            <span class="eyebrow">{{ t('analyticsBc.sections.monitoringEyebrow') }}</span>
            <h2>{{ t('analyticsBc.sections.monitoringTitle') }}</h2>
          </div>
          <span class="count-pill">
            {{ t('analyticsBc.labels.updated') }} {{ formatShortTime(store.dashboard.lastUpdated) }}
          </span>
        </div>

        <div class="monitoring-list">
          <article
              v-for="metric in store.dashboard.monitoringMetrics"
              :key="metric.id"
              class="monitoring-item"
              :class="metric.status"
          >
            <span class="monitor-icon" :class="metric.status">
              <i class="material-symbols-outlined">{{ metric.icon }}</i>
            </span>
            <div>
              <strong>{{ metric.label }}</strong>
              <p>{{ metric.helper }}</p>
            </div>
            <strong class="monitor-value">{{ metric.value }}</strong>
            <i class="material-symbols-outlined trend" :class="metric.trend">
              {{ store.trendIcon(metric.trend) }}
            </i>
          </article>
        </div>
      </article>

      <aside class="center-card score-card">
        <div class="section-head compact">
          <div>
            <span class="eyebrow">{{ t('analyticsBc.sections.analyticsEyebrow') }}</span>
            <h2>{{ t('analyticsBc.sections.qualityTitle') }}</h2>
          </div>
          <span class="count-pill">{{ store.summary.serviceQualityScore }}%</span>
        </div>
        <div class="donut" :style="{ background: donutStyle(store.summary.serviceQualityScore) }">
          <div>
            <strong>{{ store.summary.serviceQualityScore }}%</strong>
            <span>{{ t('analyticsBc.labels.safeService') }}</span>
          </div>
        </div>
        <div class="legend-row">
          <span><i class="green-dot"></i>{{ t('analyticsBc.labels.monitoring') }}</span>
          <span><i class="blue-dot"></i>{{ t('analyticsBc.labels.analytics') }}</span>
          <span><i class="amber-dot"></i>{{ t('analyticsBc.labels.reports') }}</span>
        </div>
      </aside>
    </section>

    <!-- Content grid -->
    <section class="content-grid">
      <article class="center-card route-card">
        <div class="section-head">
          <div>
            <span class="eyebrow">{{ t('analyticsBc.sections.routeEyebrow') }}</span>
            <h2>{{ t('analyticsBc.sections.routeTitle') }}</h2>
          </div>
          <button class="primary-action" type="button" @click="store.exportCsv()">
            <i class="material-symbols-outlined">download</i>
            {{ t('analyticsBc.actions.export') }}
          </button>
        </div>

        <div class="filters-row">
          <label class="search-control">
            <i class="material-symbols-outlined">search</i>
            <input
                type="search"
                :placeholder="t('analyticsBc.filters.search')"
                :value="store.query"
                @input="store.query = $event.target.value"
            />
          </label>
          <div class="chip-row">
            <button
                v-for="option in statusOptions"
                :key="option.value"
                type="button"
                :class="{ active: store.routeStatus === option.value }"
                @click="store.setRouteStatus(option.value)"
            >
              <i class="material-symbols-outlined">{{ option.icon }}</i>
              {{ t(option.labelKey) }}
            </button>
          </div>
        </div>

        <div class="route-list">
          <article
              v-for="route in store.filteredRoutes"
              :key="route.id"
              class="route-row"
              :class="[route.status, { selected: store.selectedRoute?.id === route.id }]"
              @click="store.selectRoute(route.id)"
          >
            <span class="route-icon" :class="route.status">
              <i class="material-symbols-outlined">{{ store.statusIcon(route.status) }}</i>
            </span>
            <div class="route-main">
              <div class="route-title">
                <div>
                  <strong>{{ route.routeName }}</strong>
                  <p>{{ route.district }} · {{ route.driverName }} · {{ route.vehiclePlate }}</p>
                </div>
                <span class="status-pill" :class="route.status">
                  {{ t(statusLabel(route.status)) }}
                </span>
              </div>
              <div class="route-bars">
                <div>
                  <span>{{ t('analyticsBc.labels.onTime') }}</span>
                  <strong>{{ route.onTimeRate }}%</strong>
                  <i><em :style="{ width: route.onTimeRate + '%' }"></em></i>
                </div>
                <div>
                  <span>{{ t('analyticsBc.labels.attendance') }}</span>
                  <strong>{{ route.attendanceRate }}%</strong>
                  <i><em :style="{ width: route.attendanceRate + '%' }"></em></i>
                </div>
                <div>
                  <span>{{ t('analyticsBc.labels.score') }}</span>
                  <strong>{{ route.serviceScore }}%</strong>
                  <i><em :style="{ width: route.serviceScore + '%' }"></em></i>
                </div>
              </div>
            </div>
            <button class="icon-action" type="button" @click.stop="store.selectRoute(route.id)">
              <i class="material-symbols-outlined">arrow_forward</i>
            </button>
          </article>

          <div v-if="store.filteredRoutes.length === 0" class="empty-state">
            <i class="material-symbols-outlined">query_stats</i>
            <strong>{{ t('analyticsBc.empty.title') }}</strong>
            <p>{{ t('analyticsBc.empty.message') }}</p>
          </div>
        </div>
      </article>

      <aside class="side-stack">
        <article class="center-card detail-panel">
          <div class="section-head compact">
            <div>
              <span class="eyebrow">{{ t('analyticsBc.sections.selectedEyebrow') }}</span>
              <h2>{{ t('analyticsBc.sections.selectedTitle') }}</h2>
            </div>
          </div>
          <div v-if="store.selectedRoute" class="selected-route" :class="store.selectedRoute.status">
            <span class="route-icon large" :class="store.selectedRoute.status">
              <i class="material-symbols-outlined">{{ store.statusIcon(store.selectedRoute.status) }}</i>
            </span>
            <h3>{{ store.selectedRoute.routeName }}</h3>
            <p>{{ store.selectedRoute.district }} · {{ store.selectedRoute.driverName }}</p>
            <dl>
              <div><dt>{{ t('analyticsBc.detail.vehicle') }}</dt><dd>{{ store.selectedRoute.vehiclePlate }}</dd></div>
              <div><dt>{{ t('analyticsBc.detail.completedTrips') }}</dt><dd>{{ store.selectedRoute.completedTrips }}</dd></div>
              <div><dt>{{ t('analyticsBc.detail.delayMinutes') }}</dt><dd>{{ store.selectedRoute.delayMinutes }} min</dd></div>
              <div><dt>{{ t('analyticsBc.detail.incidents') }}</dt><dd>{{ store.selectedRoute.incidentCount }}</dd></div>
              <div><dt>{{ t('analyticsBc.detail.serviceScore') }}</dt><dd>{{ store.selectedRoute.serviceScore }}%</dd></div>
            </dl>
            <button type="button" @click="store.setRouteStatus(store.selectedRoute.status)">
              {{ t('analyticsBc.actions.filterSimilar') }}
            </button>
          </div>
        </article>

        <article class="center-card insight-panel">
          <div class="section-head compact">
            <div>
              <span class="eyebrow">{{ t('analyticsBc.sections.insightEyebrow') }}</span>
              <h2>{{ t('analyticsBc.sections.insightTitle') }}</h2>
            </div>
            <span class="count-pill">
              {{ store.dashboard.insights.length }} {{ t('analyticsBc.labels.items') }}
            </span>
          </div>
          <div class="insight-list">
            <article
                v-for="insight in store.dashboard.insights"
                :key="insight.id"
                :class="insight.impact"
            >
              <span><i class="material-symbols-outlined">psychology_alt</i></span>
              <div>
                <strong>{{ insight.title }}</strong>
                <p>{{ insight.description }}</p>
                <small>{{ insight.source }} · {{ insight.action }}</small>
              </div>
            </article>
          </div>
        </article>
      </aside>
    </section>

    <!-- Lower grid -->
    <section class="lower-grid">
      <article class="center-card trends-panel">
        <div class="section-head">
          <div>
            <span class="eyebrow">{{ t('analyticsBc.sections.trendEyebrow') }}</span>
            <h2>{{ t('analyticsBc.sections.trendTitle') }}</h2>
          </div>
          <span class="count-pill">{{ t('analyticsBc.labels.currentWeek') }}</span>
        </div>
        <div class="trend-grid">
          <article v-for="point in store.dashboard.trend" :key="point.label">
            <strong>{{ point.label }}</strong>
            <div class="stack-bar">
              <span class="on-time" :style="{ height: point.onTimeRate + '%' }"></span>
              <span class="attendance" :style="{ height: point.attendanceRate + '%' }"></span>
              <span class="delay" :style="{ height: (point.delayMinutes * 4) + '%' }"></span>
            </div>
            <small>{{ point.delayMinutes }} min</small>
          </article>
        </div>
        <div class="legend-row left">
          <span><i class="blue-dot"></i>{{ t('analyticsBc.labels.onTime') }}</span>
          <span><i class="green-dot"></i>{{ t('analyticsBc.labels.attendance') }}</span>
          <span><i class="amber-dot"></i>{{ t('analyticsBc.labels.delay') }}</span>
        </div>
      </article>

      <article class="center-card reports-panel">
        <div class="section-head">
          <div>
            <span class="eyebrow">{{ t('analyticsBc.sections.reportsEyebrow') }}</span>
            <h2>{{ t('analyticsBc.sections.reportsTitle') }}</h2>
          </div>
          <button class="primary-action" type="button" @click="store.generateReport()">
            <i class="material-symbols-outlined">add_chart</i>
            {{ t('analyticsBc.actions.generate') }}
          </button>
        </div>
        <div class="report-filters chip-row">
          <button
              v-for="option in reportTypeOptions"
              :key="option.value"
              type="button"
              :class="{ active: store.reportType === option.value }"
              @click="store.setReportType(option.value)"
          >
            <i class="material-symbols-outlined">{{ option.icon }}</i>
            {{ t(option.labelKey) }}
          </button>
        </div>
        <div class="table-wrap">
          <table>
            <thead>
            <tr>
              <th>{{ t('analyticsBc.table.report') }}</th>
              <th>{{ t('analyticsBc.table.period') }}</th>
              <th>{{ t('analyticsBc.table.records') }}</th>
              <th>{{ t('analyticsBc.table.status') }}</th>
              <th>{{ t('analyticsBc.table.generated') }}</th>
              <th>{{ t('analyticsBc.table.actions') }}</th>
            </tr>
            </thead>
            <tbody>
            <tr v-for="report in store.filteredReports" :key="report.id">
              <td>
                <strong>{{ report.title }}</strong>
                <small>{{ report.owner }}</small>
              </td>
              <td>{{ report.period }}</td>
              <td>{{ report.records }}</td>
              <td><span class="status-pill" :class="report.status">{{ report.status }}</span></td>
              <td>{{ formatShort(report.generatedAt) }}</td>
              <td>
                <button class="icon-action" type="button" @click="store.exportCsv()">
                  <i class="material-symbols-outlined">download</i>
                </button>
              </td>
            </tr>
            </tbody>
          </table>
        </div>
      </article>

      <aside class="center-card activity-panel">
        <div class="section-head compact">
          <div>
            <span class="eyebrow">{{ t('analyticsBc.sections.activityEyebrow') }}</span>
            <h2>{{ t('analyticsBc.sections.activityTitle') }}</h2>
          </div>
          <span class="count-pill">{{ t('analyticsBc.labels.today') }}</span>
        </div>
        <div class="activity-list">
          <article
              v-for="activity in store.dashboard.activities"
              :key="activity.id"
              :class="activity.status"
          >
            <span></span>
            <div>
              <small>{{ formatShortTime(activity.time) }}</small>
              <strong>{{ activity.title }}</strong>
              <p>{{ activity.description }}</p>
            </div>
          </article>
        </div>
      </aside>
    </section>
  </section>
</template>

<style scoped>
.analytics-page {
  display: grid;
  gap: 1.4rem;
}

.hero-card,
.center-card,
.metric-card,
.command-banner {
  border: 1px solid var(--kw-border);
  border-radius: 26px;
  background: var(--kw-card);
  box-shadow: var(--kw-shadow);
}

.hero-card {
  min-height: 150px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 2rem;
  padding: 2rem;
  background:
      radial-gradient(circle at 60% 10%, rgba(43, 213, 202, 0.22), transparent 28%),
      radial-gradient(circle at 92% 20%, rgba(255, 181, 46, 0.25), transparent 28%),
      var(--kw-card);
}

.eyebrow {
  display: inline-flex;
  color: var(--kw-blue-700);
  font-size: .78rem;
  font-weight: 900;
  letter-spacing: .16em;
  text-transform: uppercase;
}

h1, h2, h3, p { margin: 0; }
h1 { margin-top: .4rem; font-size: clamp(2.2rem, 5vw, 4rem); line-height: .95; letter-spacing: -.06em; }
h2 { font-size: clamp(1.45rem, 2vw, 2rem); letter-spacing: -.04em; }
h3 { font-size: 1.1rem; }
.hero-card p { margin-top: .85rem; max-width: 720px; color: var(--kw-muted); font-weight: 600; }

.hero-badge {
  min-width: 148px;
  padding: 1rem 1.2rem;
  border-radius: 18px;
  background: rgba(255, 255, 255, .86);
  text-align: center;
  box-shadow: 0 14px 30px rgba(15, 43, 87, .09);
}
.hero-badge span { display: block; color: var(--kw-muted); font-size: .75rem; font-weight: 900; }
.hero-badge strong { color: var(--kw-blue-700); font-size: 2.2rem; line-height: 1; }

.metric-grid {
  display: grid;
  grid-template-columns: repeat(5, minmax(150px, 1fr));
  gap: 1rem;
}
.metric-card { position: relative; overflow: hidden; padding: 1.2rem; min-height: 138px; }
.metric-card::after {
  content: '';
  position: absolute;
  right: -26px;
  bottom: -32px;
  width: 86px;
  height: 86px;
  border-radius: 50%;
  background: rgba(34, 131, 198, .12);
}
.metric-icon,
.monitor-icon,
.route-icon {
  width: 38px;
  height: 38px;
  display: inline-grid;
  place-items: center;
  border-radius: 14px;
  margin-bottom: .85rem;
}
.metric-icon .material-symbols-outlined,
.monitor-icon .material-symbols-outlined,
.route-icon .material-symbols-outlined { font-size: 20px; }
.metric-icon.blue, .route-icon.healthy, .monitor-icon.healthy { color: #147dcc; background: #e4f3fb; }
.metric-icon.green { color: #0c9b61; background: #dff9ea; }
.metric-icon.amber, .route-icon.attention, .monitor-icon.attention { color: #c78300; background: #fff1c7; }
.metric-icon.cyan { color: #128c99; background: #dcfbff; }
.metric-icon.red, .route-icon.risk, .monitor-icon.risk { color: #d92d20; background: #ffe0e0; }
.metric-card small { display: block; color: var(--kw-muted); font-size: .78rem; font-weight: 900; }
.metric-card strong { display: block; margin-top: .25rem; font-size: 2rem; letter-spacing: -.04em; }
.metric-card p { margin-top: .25rem; color: var(--kw-muted); font-size: .85rem; font-weight: 600; }

.command-banner {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1rem 1.2rem;
  border-color: rgba(255, 181, 46, .55);
  background: linear-gradient(90deg, rgba(255, 244, 216, .96), rgba(255, 255, 255, .92));
}
.command-banner > span {
  width: 44px;
  height: 44px;
  border-radius: 16px;
  display: grid;
  place-items: center;
  color: #c78300;
  background: #fff0c2;
}
.command-banner p { color: var(--kw-muted); font-weight: 600; }
.command-banner button, .primary-action {
  margin-left: auto;
  border: 0;
  border-radius: 14px;
  background: linear-gradient(135deg, var(--kw-blue-700), #0c77bc);
  color: white;
  min-height: 44px;
  padding: 0 1.1rem;
  display: inline-flex;
  align-items: center;
  gap: .45rem;
  font-weight: 900;
  cursor: pointer;
  box-shadow: 0 12px 26px rgba(34, 131, 198, .25);
}

.monitoring-grid,
.content-grid,
.lower-grid {
  display: grid;
  grid-template-columns: minmax(0, 1fr) 330px;
  gap: 1rem;
  align-items: start;
}
.lower-grid { grid-template-columns: minmax(360px, .75fr) minmax(520px, 1fr) 330px; }
.center-card { padding: 1.25rem; }
.section-head { display: flex; justify-content: space-between; align-items: start; gap: 1rem; margin-bottom: 1rem; }
.section-head.compact { align-items: center; }
.count-pill {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-height: 32px;
  padding: 0 .8rem;
  border-radius: 999px;
  color: var(--kw-blue-700);
  background: #e4f3fb;
  font-weight: 900;
  font-size: .8rem;
  white-space: nowrap;
}

.monitoring-list { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: .8rem; }
.monitoring-item {
  display: grid;
  grid-template-columns: auto minmax(0, 1fr) auto auto;
  align-items: center;
  gap: .85rem;
  padding: 1rem;
  border: 1px solid var(--kw-border);
  border-radius: 18px;
  background: rgba(248, 251, 255, .8);
}
.monitoring-item p { color: var(--kw-muted); font-weight: 600; font-size: .86rem; }
.monitor-value { font-size: 1.35rem; }
.trend.up { color: #0c9b61; }
.trend.down { color: #d92d20; }
.trend.stable { color: #64748b; }

.donut {
  width: 210px;
  height: 210px;
  border-radius: 50%;
  margin: 1rem auto;
  display: grid;
  place-items: center;
}
.donut > div {
  width: 122px;
  height: 122px;
  display: grid;
  place-items: center;
  align-content: center;
  border-radius: 50%;
  background: white;
  color: var(--kw-blue-900);
  text-align: center;
}
.donut strong { display: block; font-size: 2.1rem; }
.donut span { color: var(--kw-muted); font-size: .74rem; font-weight: 900; }
.legend-row { display: flex; justify-content: center; gap: .8rem; flex-wrap: wrap; color: var(--kw-muted); font-size: .82rem; font-weight: 800; }
.legend-row.left { justify-content: flex-start; margin-top: 1rem; }
.legend-row i { display: inline-block; width: 9px; height: 9px; border-radius: 50%; margin-right: .35rem; }
.green-dot { background: #19c37d; }
.blue-dot { background: #2283c6; }
.amber-dot { background: #ffb52e; }

.filters-row { display: flex; gap: .7rem; align-items: center; margin-bottom: 1rem; }
.search-control {
  flex: 1;
  min-height: 44px;
  display: flex;
  align-items: center;
  gap: .55rem;
  padding: 0 1rem;
  border-radius: 16px;
  background: white;
  border: 1px solid var(--kw-border);
}
.search-control .material-symbols-outlined { color: var(--kw-blue-700); }
.search-control input { width: 100%; border: 0; outline: 0; color: var(--kw-ink); background: transparent; }
.chip-row { display: flex; gap: .5rem; flex-wrap: wrap; }
.chip-row button {
  border: 1px solid var(--kw-border);
  background: rgba(255,255,255,.88);
  border-radius: 999px;
  min-height: 38px;
  padding: 0 .8rem;
  display: inline-flex;
  align-items: center;
  gap: .35rem;
  font-weight: 900;
  color: #2d3a4f;
  cursor: pointer;
}
.chip-row button.active { background: var(--kw-blue-700); color: white; box-shadow: 0 12px 24px rgba(34, 131, 198, .24); }
.chip-row .material-symbols-outlined { font-size: 18px; }

.route-list { display: grid; gap: .75rem; }
.route-row {
  display: grid;
  grid-template-columns: auto minmax(0, 1fr) auto;
  gap: .9rem;
  align-items: center;
  padding: 1rem;
  border: 1px solid var(--kw-border);
  border-radius: 20px;
  background: white;
  cursor: pointer;
  transition: transform .18s ease, border-color .18s ease, box-shadow .18s ease;
}
.route-row:hover, .route-row.selected { transform: translateY(-2px); border-color: rgba(34, 131, 198, .38); box-shadow: 0 14px 28px rgba(15, 43, 87, .09); }
.route-title { display: flex; justify-content: space-between; gap: .8rem; }
.route-title p { color: var(--kw-muted); font-weight: 700; margin-top: .2rem; }
.status-pill {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 80px;
  border-radius: 999px;
  padding: .35rem .65rem;
  font-size: .75rem;
  font-weight: 900;
}
.status-pill.healthy, .status-pill.ready { color: #0b7d4a; background: #dff9ea; }
.status-pill.attention, .status-pill.review, .status-pill.scheduled { color: #9a6400; background: #fff1c7; }
.status-pill.risk { color: #b42318; background: #ffe0e0; }
.route-bars { display: grid; grid-template-columns: repeat(3, 1fr); gap: .7rem; margin-top: .8rem; }
.route-bars div { display: grid; grid-template-columns: 1fr auto; gap: .35rem; color: var(--kw-muted); font-weight: 900; font-size: .78rem; }
.route-bars i { grid-column: 1 / -1; height: 8px; border-radius: 999px; background: #e8f2f8; overflow: hidden; }
.route-bars em { display: block; height: 100%; border-radius: inherit; background: linear-gradient(90deg, #2283c6, #20c7b4); }

.side-stack { display: grid; gap: 1rem; }
.selected-route { padding: 1rem; border-radius: 20px; border: 1px solid var(--kw-border); background: #f7fbff; }
.route-icon.large { width: 54px; height: 54px; border-radius: 18px; }
.selected-route p { color: var(--kw-muted); font-weight: 700; margin-top: .25rem; }
dl { margin: 1rem 0; display: grid; gap: .55rem; }
dl div { display: flex; justify-content: space-between; gap: .8rem; padding-bottom: .55rem; border-bottom: 1px solid var(--kw-border); }
dt { color: var(--kw-muted); font-weight: 900; }
dd { margin: 0; font-weight: 900; text-align: right; }
.selected-route button {
  width: 100%;
  border: 0;
  border-radius: 14px;
  min-height: 42px;
  color: white;
  background: var(--kw-blue-700);
  font-weight: 900;
  cursor: pointer;
}
.insight-list, .activity-list { display: grid; gap: .8rem; }
.insight-list article, .activity-list article {
  display: flex;
  gap: .7rem;
  padding: .95rem;
  border: 1px solid var(--kw-border);
  border-radius: 18px;
  background: white;
}
.insight-list span { width: 38px; height: 38px; border-radius: 14px; display: grid; place-items: center; background: #e4f3fb; color: var(--kw-blue-700); flex: 0 0 auto; }
.insight-list article.high { border-left: 4px solid #ef4444; }
.insight-list article.medium { border-left: 4px solid #ffb52e; }
.insight-list article.low { border-left: 4px solid #19c37d; }
.insight-list p, .activity-list p { color: var(--kw-muted); font-weight: 600; margin-top: .25rem; }
.insight-list small { display: block; margin-top: .55rem; color: var(--kw-blue-700); font-weight: 900; }

.trend-grid { min-height: 250px; display: grid; grid-template-columns: repeat(5, 1fr); align-items: end; gap: 1rem; padding: 1rem 0 0; }
.trend-grid article { display: grid; justify-items: center; gap: .5rem; color: var(--kw-muted); font-weight: 900; }
.stack-bar { width: 58px; height: 210px; border-radius: 18px; background: #f0f6fb; display: flex; align-items: flex-end; justify-content: center; gap: 4px; padding: 6px; }
.stack-bar span { width: 12px; border-radius: 999px; min-height: 8px; }
.stack-bar .on-time { background: #2283c6; }
.stack-bar .attendance { background: #20c7b4; }
.stack-bar .delay { background: #ffb52e; }

.reports-panel { min-width: 0; }
.report-filters { margin-bottom: 1rem; }
.table-wrap { overflow-x: auto; }
table { width: 100%; border-collapse: collapse; min-width: 720px; }
th { text-align: left; padding: .9rem 1rem; color: #718096; font-size: .76rem; text-transform: uppercase; letter-spacing: .08em; background: #f0f6fb; }
td { padding: .95rem 1rem; border-bottom: 1px solid var(--kw-border); font-weight: 800; }
td small { display: block; color: var(--kw-muted); margin-top: .2rem; font-weight: 700; }

.icon-action { border: 0; background: #e4f3fb; color: var(--kw-blue-700); border-radius: 12px; width: 36px; height: 36px; display: inline-grid; place-items: center; cursor: pointer; }

.activity-list article { position: relative; padding-left: 1.4rem; }
.activity-list article > span { position: absolute; left: .55rem; top: 1.15rem; width: 10px; height: 10px; border-radius: 50%; }
.activity-list article.healthy > span { background: #19c37d; }
.activity-list article.attention > span { background: #ffb52e; }
.activity-list article.risk > span { background: #ef4444; }
.activity-list small { color: var(--kw-blue-700); font-weight: 900; }
.empty-state { display: grid; place-items: center; padding: 2rem; color: var(--kw-muted); text-align: center; gap: .5rem; }
.empty-state .material-symbols-outlined { font-size: 44px; color: var(--kw-blue-700); }

@media (max-width: 1280px) {
  .metric-grid { grid-template-columns: repeat(3, 1fr); }
  .monitoring-grid, .content-grid, .lower-grid { grid-template-columns: 1fr; }
}

@media (max-width: 760px) {
  .analytics-page { padding: 1rem; }
  .hero-card { align-items: flex-start; flex-direction: column; }
  .metric-grid, .monitoring-list { grid-template-columns: 1fr; }
  .filters-row, .route-title { flex-direction: column; align-items: stretch; }
  .route-row { grid-template-columns: 1fr; }
  .route-bars { grid-template-columns: 1fr; }
  .trend-grid { grid-template-columns: repeat(3, 1fr); }
}
</style>