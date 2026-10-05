<script setup>
import { computed, onMounted, ref } from 'vue';
import { useI18n } from 'vue-i18n';
import useRoutesStore from '@/routes/application/routes.store.js';
import RouteKpiCard from '../components/route-kpi-card.vue';
import RouteStatusCard from '../components/route-status-card.vue';
import RouteMapPanel from '../components/route-map-panel.vue';
import RouteReadinessPanel from '../components/route-readiness-panel.vue';
import RouteDetailDialog from '../components/route-detail-dialog.vue';
import RouteFormDialog from '../components/route-form-dialog.vue';

const { t } = useI18n();
const store = useRoutesStore();

const statusFilters = ['all', 'active', 'scheduled', 'review', 'inactive'];

const showDetailDialog = ref(false);
const showFormDialog = ref(false);
const viewingRoute = ref(null);
const editingRoute = ref(null);

const kpis = computed(() => {
  const s = store.summary;
  return [
    { icon: 'account_tree', label: 'routesPage.kpis.totalRoutes',    value: s.totalRoutes,               helper: 'routesPage.kpis.totalRoutesHelper',    tone: 'blue' },
    { icon: 'play_circle',  label: 'routesPage.kpis.activeRoutes',   value: s.activeRoutes,              helper: 'routesPage.kpis.activeRoutesHelper',   tone: 'green' },
    { icon: 'pin_drop',     label: 'routesPage.kpis.scheduledStops', value: s.scheduledStops,            helper: 'routesPage.kpis.scheduledStopsHelper', tone: 'blue' },
    { icon: 'map',          label: 'routesPage.kpis.districts',      value: s.districtsCovered,          helper: 'routesPage.kpis.districtsHelper',      tone: 'amber' },
    { icon: 'auto_graph',   label: 'routesPage.kpis.optimization',   value: `${s.optimizationScore}%`,   helper: 'routesPage.kpis.optimizationHelper',   tone: 'blue' }
  ];
});

function openCreate() {
  editingRoute.value = null;
  showFormDialog.value = true;
}

function openDetail(route) {
  viewingRoute.value = route;
  showDetailDialog.value = true;
}

async function onSaveRoute(entity) {
  if (!entity.id) {
    entity.id = `route-${Date.now()}`;
    await store.createRoute(entity);
  } else {
    await store.updateRoute(entity);
  }
}

onMounted(() => {
  store.fetchDashboard();
});
</script>

<template>
  <main class="route-page">
    <!-- Hero -->
    <section class="hero-card">
      <div>
        <p>{{ t('routesPage.eyebrow') }}</p>
        <h1>{{ t('routesPage.title') }}</h1>
        <span>{{ t('routesPage.subtitle') }}</span>
      </div>
      <aside>
        <small>{{ t('routesPage.heroBadge') }}</small>
        <strong>{{ store.summary.routeCoverage }}%</strong>
      </aside>
    </section>

    <!-- KPIs -->
    <section class="kpi-grid">
      <route-kpi-card
          v-for="kpi in kpis"
          :key="kpi.label"
          :icon="kpi.icon"
          :label="t(kpi.label)"
          :value="kpi.value"
          :helper="t(kpi.helper)"
          :tone="kpi.tone"
      />
    </section>

    <!-- Content grid -->
    <section class="content-grid">
      <div class="main-column">
        <section class="routes-panel">
          <header>
            <div>
              <p>{{ t('routesPage.inventoryEyebrow') }}</p>
              <h2>{{ t('routesPage.operationalStatus') }}</h2>
            </div>
            <pv-button class="primary-action" @click="openCreate">
              <i class="material-symbols-outlined">add</i>
              {{ t('routesPage.actions.createRoute') }}
            </pv-button>
          </header>

          <div class="toolbar">
            <label class="search-box">
              <i class="material-symbols-outlined">search</i>
              <input
                  type="search"
                  :placeholder="t('routesPage.searchPlaceholder')"
                  :value="store.searchTerm"
                  @input="store.setSearchTerm($event.target.value)"
              />
            </label>
            <div class="filter-group">
              <button
                  v-for="status in statusFilters"
                  :key="status"
                  type="button"
                  :class="{ active: store.selectedStatus === status }"
                  @click="store.setStatus(status)"
              >
                <i class="material-symbols-outlined">{{ store.statusIcon(status) }}</i>
                {{ t('routesPage.filters.' + status) }}
              </button>
            </div>
          </div>

          <div class="route-cards-grid">
            <route-status-card
                v-for="route in store.filteredRoutes"
                :key="route.id"
                :route="route"
            />
            <div v-if="store.filteredRoutes.length === 0" class="empty-state">
              <i class="material-symbols-outlined">alt_route</i>
              <h3>{{ t('routesPage.empty.title') }}</h3>
              <p>{{ t('routesPage.empty.message') }}</p>
            </div>
          </div>
        </section>

        <route-map-panel :routes="store.routes" />
      </div>

      <aside class="side-column">
        <route-readiness-panel
            :optimization-score="store.summary.optimizationScore"
            :reviews="store.reviews"
        />
      </aside>
    </section>

    <!-- Bottom grid -->
    <section class="bottom-grid">
      <section class="table-card">
        <header>
          <div>
            <p>{{ t('routesPage.recordsEyebrow') }}</p>
            <h2>{{ t('routesPage.registryTitle') }}</h2>
          </div>
          <pv-button outlined @click="store.exportCsv">
            <i class="material-symbols-outlined">download</i>
            {{ t('routesPage.actions.exportList') }}
          </pv-button>
        </header>

        <div class="table-wrapper">
          <table>
            <thead>
            <tr>
              <th>{{ t('routesPage.table.route') }}</th>
              <th>{{ t('routesPage.table.driver') }}</th>
              <th>{{ t('routesPage.table.vehicle') }}</th>
              <th>{{ t('routesPage.table.stops') }}</th>
              <th>{{ t('routesPage.table.coverage') }}</th>
              <th>{{ t('routesPage.table.status') }}</th>
              <th>{{ t('routesPage.table.actions') }}</th>
            </tr>
            </thead>
            <tbody>
            <tr v-for="route in store.routes" :key="route.id">
              <td>
                <strong>{{ route.name }}</strong>
                <span>{{ route.code }} · {{ route.district }}</span>
              </td>
              <td>{{ route.assignedDriver }}</td>
              <td>{{ route.assignedVehicle }}</td>
              <td>{{ route.stops }}</td>
              <td>
                <div class="mini-progress">
                  <strong>{{ route.coveragePercentage }}%</strong>
                  <span><i :style="{ width: route.coveragePercentage + '%' }"></i></span>
                </div>
              </td>
              <td>
                  <span class="table-status" :class="route.status">
                    {{ t('routesPage.status.' + route.status) }}
                  </span>
              </td>
              <td>
                <button type="button" class="row-action" @click="openDetail(route)">
                  <i class="material-symbols-outlined">arrow_forward</i>
                </button>
              </td>
            </tr>
            </tbody>
          </table>
        </div>
      </section>

      <section class="timeline-card">
        <header>
          <div>
            <p>{{ t('routesPage.timelineEyebrow') }}</p>
            <h2>{{ t('routesPage.timelineTitle') }}</h2>
          </div>
          <span>{{ t('routesPage.today') }}</span>
        </header>
        <div class="timeline-list">
          <article
              v-for="activity in store.activities"
              :key="activity.id"
              :class="activity.status"
          >
            <span class="dot"></span>
            <div>
              <strong>{{ activity.time }} · {{ activity.routeName }}</strong>
              <h3>{{ activity.title }}</h3>
              <p>{{ activity.description }}</p>
            </div>
          </article>
        </div>
      </section>
    </section>

    <!-- Dialogs -->
    <route-detail-dialog v-model:visible="showDetailDialog" :route="viewingRoute" />
    <route-form-dialog v-model:visible="showFormDialog" :data="editingRoute" @save="onSaveRoute" />
  </main>
</template>

<style scoped>
.route-page { padding: clamp(22px, 3vw, 36px); color: #10233f; display: grid; gap: 24px; }

.hero-card {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 24px;
  min-height: 176px;
  padding: clamp(26px, 4vw, 44px);
  border: 1px solid rgba(15, 81, 130, 0.1);
  border-radius: 24px;
  background:
      radial-gradient(circle at 90% 50%, rgba(251, 191, 36, 0.24), transparent 28%),
      linear-gradient(110deg, rgba(255, 255, 255, 0.97), rgba(232, 247, 255, 0.9));
  box-shadow: 0 22px 48px rgba(7, 47, 80, 0.09);
}
.hero-card p, .routes-panel header p, .table-card header p, .timeline-card header p {
  margin: 0 0 6px;
  color: #1b83c9;
  font-size: 0.76rem;
  font-weight: 950;
  letter-spacing: 0.14em;
  text-transform: uppercase;
}
.hero-card h1 {
  margin: 0;
  color: #111827;
  font-size: clamp(2.45rem, 5vw, 4.2rem);
  font-weight: 950;
  line-height: 0.95;
  letter-spacing: -0.06em;
}
.hero-card span {
  display: block;
  max-width: 760px;
  margin-top: 14px;
  color: #697588;
  font-size: 1rem;
  font-weight: 650;
}
.hero-card aside {
  display: grid;
  min-width: 142px;
  min-height: 92px;
  place-items: center;
  padding: 18px;
  border-radius: 18px;
  background: rgba(255, 255, 255, 0.9);
  text-align: center;
  box-shadow: 0 14px 28px rgba(10, 55, 86, 0.08);
}
.hero-card aside small { color: #6b7890; font-size: 0.75rem; font-weight: 900; }
.hero-card aside strong { color: #1b83c9; font-size: 2.3rem; font-weight: 950; line-height: 1; }

.kpi-grid { display: grid; grid-template-columns: repeat(5, minmax(170px, 1fr)); gap: 18px; }

.content-grid { display: grid; grid-template-columns: minmax(0, 1fr) 360px; gap: 20px; align-items: start; }
.main-column { display: grid; gap: 20px; }
.routes-panel, .table-card, .timeline-card {
  padding: 24px;
  border: 1px solid #e3edf7;
  border-radius: 20px;
  background: rgba(255, 255, 255, 0.95);
  box-shadow: 0 18px 38px rgba(7, 47, 80, 0.08);
}
.routes-panel header, .table-card header, .timeline-card header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 18px;
  margin-bottom: 20px;
}
.routes-panel h2, .table-card h2, .timeline-card h2 {
  margin: 0;
  color: #10192d;
  font-size: clamp(1.5rem, 2.5vw, 2rem);
  font-weight: 950;
}
.primary-action { display: inline-flex; align-items: center; gap: 8px; }
.primary-action .material-symbols-outlined { font-size: 18px; }

.toolbar { display: grid; grid-template-columns: minmax(240px, 1fr) auto; gap: 12px; margin-bottom: 18px; }
.search-box {
  display: flex;
  align-items: center;
  gap: 10px;
  min-height: 48px;
  padding: 0 16px;
  border: 1px solid #dfeaf5;
  border-radius: 16px;
  background: #ffffff;
  color: #1b83c9;
}
.search-box input { width: 100%; border: none; outline: none; color: #10233f; font: inherit; font-size: 0.92rem; }
.search-box input::placeholder { color: #8b98aa; }
.filter-group { display: flex; flex-wrap: wrap; gap: 8px; justify-content: flex-end; }
.filter-group button {
  display: inline-flex;
  align-items: center;
  gap: 7px;
  min-height: 44px;
  padding: 0 14px;
  border: 1px solid #dfeaf5;
  border-radius: 999px;
  background: #f8fbfe;
  color: #5e6c7f;
  font-size: 0.82rem;
  font-weight: 950;
  cursor: pointer;
}
.filter-group button.active { border-color: #1b83c9; background: #1b83c9; color: #ffffff; }
.filter-group .material-symbols-outlined { font-size: 17px; }

.route-cards-grid { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 16px; }

.bottom-grid { display: grid; grid-template-columns: minmax(0, 1fr) 430px; gap: 20px; align-items: start; }
.table-wrapper { overflow-x: auto; }
table { width: 100%; min-width: 850px; border-collapse: collapse; }
th {
  padding: 14px 16px;
  background: #f1f6fc;
  color: #6f8094;
  font-size: 0.74rem;
  font-weight: 950;
  letter-spacing: 0.09em;
  text-align: left;
  text-transform: uppercase;
}
td { padding: 16px; border-bottom: 1px solid #edf2f7; color: #42526a; font-size: 0.86rem; font-weight: 700; }
td strong { display: block; color: #11365b; font-weight: 950; }
td span { display: block; margin-top: 4px; color: #7b8797; font-size: 0.78rem; }
.mini-progress { display: grid; gap: 6px; min-width: 110px; }
.mini-progress > strong { color: #0f5284; }
.mini-progress > span { height: 7px; overflow: hidden; border-radius: 999px; background: #e9eff7; display: block; margin: 0; }
.mini-progress i { display: block; height: 100%; border-radius: inherit; background: linear-gradient(90deg, #1b83c9, #22c3b6); }
.table-status {
  display: inline-flex;
  margin: 0;
  padding: 7px 10px;
  border-radius: 999px;
  font-size: 0.74rem;
  font-weight: 950;
  text-transform: capitalize;
}
.table-status.active { background: #dcfce7; color: #15803d; }
.table-status.scheduled { background: #e3f2fd; color: #1b83c9; }
.table-status.review { background: #fef3c7; color: #b45309; }
.table-status.inactive { background: #e5e7eb; color: #4b5563; }
.row-action {
  display: inline-grid;
  width: 34px;
  height: 34px;
  place-items: center;
  border: none;
  border-radius: 12px;
  background: #e3f2fd;
  color: #1b83c9;
  cursor: pointer;
}
.row-action .material-symbols-outlined { font-size: 18px; }

.timeline-card header > span {
  padding: 8px 12px;
  border-radius: 999px;
  background: #e3f2fd;
  color: #1b83c9;
  font-size: 0.78rem;
  font-weight: 950;
}
.timeline-list { display: grid; gap: 12px; }
.timeline-list article {
  display: grid;
  grid-template-columns: auto 1fr;
  gap: 12px;
  padding: 16px;
  border: 1px solid #e8eff7;
  border-radius: 16px;
  background: #ffffff;
}
.dot {
  width: 12px;
  height: 12px;
  margin-top: 4px;
  border-radius: 50%;
  background: #1b83c9;
  box-shadow: 0 0 0 5px rgba(27, 131, 201, 0.12);
}
.timeline-list article.completed .dot { background: #22c55e; box-shadow: 0 0 0 5px rgba(34, 197, 94, 0.12); }
.timeline-list article.pending .dot { background: #f59e0b; box-shadow: 0 0 0 5px rgba(245, 158, 11, 0.12); }
.timeline-list strong { color: #1b83c9; font-size: 0.78rem; font-weight: 950; }
.timeline-list h3 { margin: 4px 0; color: #10233f; font-size: 0.94rem; font-weight: 950; }
.timeline-list p {
  margin: 0;
  color: #6b7890;
  font-size: 0.82rem;
  font-weight: 650;
  letter-spacing: 0;
  text-transform: none;
}

.empty-state {
  grid-column: 1 / -1;
  display: grid;
  place-items: center;
  gap: 10px;
  padding: 40px;
  color: var(--kw-muted);
  text-align: center;
  border: 1px dashed #cbd5e1;
  border-radius: 20px;
}
.empty-state .material-symbols-outlined { font-size: 42px; color: #1b83c9; }
.empty-state h3, .empty-state p { margin: 0; }

@media (max-width: 1380px) {
  .kpi-grid { grid-template-columns: repeat(3, minmax(180px, 1fr)); }
  .content-grid, .bottom-grid { grid-template-columns: 1fr; }
}
@media (max-width: 980px) {
  .route-cards-grid, .toolbar { grid-template-columns: 1fr; }
  .filter-group { justify-content: flex-start; }
}
@media (max-width: 720px) {
  .route-page { padding: 16px; }
  .hero-card, .routes-panel header, .table-card header, .timeline-card header {
    align-items: flex-start;
    flex-direction: column;
  }
  .kpi-grid { grid-template-columns: 1fr; }
  .primary-action { width: 100%; justify-content: center; }
}
</style>