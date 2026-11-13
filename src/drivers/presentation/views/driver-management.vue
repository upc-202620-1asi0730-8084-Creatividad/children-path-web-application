<script setup>
import { computed, onMounted, ref } from 'vue';
import { useI18n } from 'vue-i18n';
import useDriversStore from '@/drivers/application/drivers.store.js';
import { Driver } from '@/drivers/domain/entities/driver.entity.js';
import DriverKpiCard from '../components/driver-kpi-card.vue';
import DriverStatusCard from '../components/driver-status-card.vue';
import DriverCompliancePanel from '../components/driver-compliance-panel.vue';

const { t } = useI18n();
const store = useDriversStore();

const statusFilters = ['all', 'available', 'onRoute', 'review', 'offDuty'];

const showRegisterDialog = ref(false);
const showDetailDialog = ref(false);
const selectedDriver = ref(null);

const blankDriver = () => ({
  fullName: '', licenseNumber: '', licenseClass: '', phone: '', email: '',
  assignedVehicle: '', assignedRoute: '', status: 'available',
  safetyScore: 90, punctualityScore: 90
});

const driverDraft = ref(blankDriver());

const kpis = computed(() => {
  const s = store.dashboard.summary;
  return [
    { icon: 'groups',        label: 'drivers.kpis.totalDrivers',      value: s.totalDrivers,               helper: 'drivers.kpis.registeredDrivers', tone: 'blue' },
    { icon: 'verified_user', label: 'drivers.kpis.availableDrivers',  value: s.availableDrivers,           helper: 'drivers.kpis.readyForRoutes',    tone: 'green' },
    { icon: 'route',         label: 'drivers.kpis.onRouteDrivers',    value: s.onRouteDrivers,             helper: 'drivers.kpis.currentlyOperating', tone: 'blue' },
    { icon: 'assignment_late', label: 'drivers.kpis.pendingReviews',  value: s.pendingReviews,             helper: 'drivers.kpis.requiresValidation', tone: 'amber' },
    { icon: 'badge',         label: 'drivers.kpis.licenseCompliance', value: `${s.licenseCompliance}%`,     helper: 'drivers.kpis.validLicenses',     tone: 'blue' }
  ];
});

function openRegister() {
  driverDraft.value = blankDriver();
  showRegisterDialog.value = true;
}

function closeRegister() {
  showRegisterDialog.value = false;
}

async function saveDriver() {
  const names = driverDraft.value.fullName.trim().split(/\s+/);
  const initials = names.slice(0, 2).map((p) => p.charAt(0)).join('').toUpperCase() || 'ND';

  const driver = new Driver({
    id: `drv-${Date.now()}`,
    code: `DRV-${String(Date.now()).slice(-3)}`,
    photoInitials: initials,
    status: 'available',
    availabilityLabel: 'Ready for assignment',
    tripsToday: 0,
    studentsAssigned: 0,
    lastCheckIn: new Date().toISOString(),
    documentsValid: true,
    yearsOfExperience: 1,
    ...driverDraft.value
  });

  await store.createDriver(driver);
  closeRegister();
}

function openDetail(driver) {
  selectedDriver.value = driver;
  showDetailDialog.value = true;
}

function formatDate(iso) {
  if (!iso) return '';
  const d = new Date(iso);
  return d.toLocaleDateString('en-US', { day: '2-digit', month: 'short', year: 'numeric' });
}

onMounted(() => {
  store.fetchDashboard();
});
</script>

<template>
  <section class="drivers-page">
    <!-- Hero -->
    <header class="drivers-hero">
      <div>
        <p class="eyebrow">{{ t('drivers.eyebrow') }}</p>
        <h1>{{ t('drivers.title') }}</h1>
        <p class="hero-copy">{{ t('drivers.subtitle') }}</p>
      </div>
      <div class="hero-indicator">
        <span>{{ t('drivers.heroSafety') }}</span>
        <strong>{{ store.dashboard.summary.averageSafetyScore }}%</strong>
      </div>
    </header>

    <!-- KPI Grid -->
    <section class="kpi-grid">
      <driver-kpi-card
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
    <section class="drivers-content-grid">
      <article class="driver-panel drivers-panel">
        <div class="panel-header">
          <div>
            <p class="eyebrow">{{ t('drivers.inventory.eyebrow') }}</p>
            <h2>{{ t('drivers.inventory.title') }}</h2>
          </div>
          <pv-button class="primary-action" @click="openRegister">
            <i class="material-symbols-outlined">person_add</i>
            {{ t('drivers.actions.registerDriver') }}
          </pv-button>
        </div>

        <div class="drivers-toolbar">
          <label class="search-box">
            <i class="material-symbols-outlined">search</i>
            <input
                type="search"
                :placeholder="t('drivers.filters.searchPlaceholder')"
                :value="store.searchTerm"
                @input="store.setSearchTerm($event.target.value)"
            />
          </label>

          <div class="status-filters">
            <button
                v-for="status in statusFilters"
                :key="status"
                type="button"
                :class="{ active: store.selectedStatus === status }"
                @click="store.setStatus(status)"
            >
              <i class="material-symbols-outlined">{{ store.statusIcon(status) }}</i>
              {{ t('drivers.filters.' + status) }}
            </button>
          </div>
        </div>

        <div class="driver-cards">
          <driver-status-card
              v-for="driver in store.filteredDrivers"
              :key="driver.id"
              :driver="driver"
          />

          <div v-if="store.filteredDrivers.length === 0" class="empty-state">
            <i class="material-symbols-outlined">person_search</i>
            <h3>{{ t('drivers.empty.title') }}</h3>
            <p>{{ t('drivers.empty.message') }}</p>
          </div>
        </div>
      </article>

      <aside class="drivers-side">
        <article class="driver-panel readiness-panel">
          <div class="panel-header compact">
            <div>
              <p class="eyebrow">{{ t('drivers.readiness.eyebrow') }}</p>
              <h2>{{ t('drivers.readiness.title') }}</h2>
            </div>
            <span>{{ store.dashboard.summary.averageSafetyScore }}%</span>
          </div>

          <div class="readiness-chart">
            <div class="donut" :style="{ background: store.readinessGradient(store.dashboard.summary.averageSafetyScore) }">
              <strong>{{ store.dashboard.summary.averageSafetyScore }}%</strong>
              <small>{{ t('drivers.readiness.safeOperation') }}</small>
            </div>
          </div>

          <div class="legend-list">
            <span><i class="available"></i>{{ t('drivers.status.available') }}</span>
            <span><i class="on-route"></i>{{ t('drivers.status.onRoute') }}</span>
            <span><i class="review"></i>{{ t('drivers.status.review') }}</span>
          </div>
        </article>

        <driver-compliance-panel :reviews="store.dashboard.reviews" />
      </aside>
    </section>

    <!-- Lower grid -->
    <section class="lower-grid">
      <article class="driver-panel table-panel">
        <div class="panel-header">
          <div>
            <p class="eyebrow">{{ t('drivers.table.eyebrow') }}</p>
            <h2>{{ t('drivers.table.title') }}</h2>
          </div>
          <pv-button outlined @click="store.exportCsv">
            <i class="material-symbols-outlined">download</i>
            {{ t('drivers.actions.export') }}
          </pv-button>
        </div>

        <div class="table-wrap">
          <table>
            <thead>
            <tr>
              <th>{{ t('drivers.table.driver') }}</th>
              <th>{{ t('drivers.table.license') }}</th>
              <th>{{ t('drivers.table.vehicle') }}</th>
              <th>{{ t('drivers.table.route') }}</th>
              <th>{{ t('drivers.table.punctuality') }}</th>
              <th>{{ t('drivers.table.status') }}</th>
              <th>{{ t('drivers.table.actions') }}</th>
            </tr>
            </thead>
            <tbody>
            <tr v-for="driver in store.filteredDrivers" :key="driver.id">
              <td>
                <strong>{{ driver.fullName }}</strong>
                <small>{{ driver.code }} · {{ driver.email }}</small>
              </td>
              <td>
                <span>{{ driver.licenseNumber }}</span>
                <small>{{ driver.licenseClass }} · {{ formatDate(driver.licenseExpiresAt) }}</small>
              </td>
              <td>{{ driver.assignedVehicle }}</td>
              <td>{{ driver.assignedRoute }}</td>
              <td>
                <span>{{ driver.punctualityScore }}%</span>
                <div class="mini-progress"><i :style="{ width: driver.punctualityScore + '%' }"></i></div>
              </td>
              <td>
                  <span class="table-status" :class="driver.status">
                    {{ t('drivers.status.' + driver.status) }}
                  </span>
              </td>
              <td>
                <button type="button" class="icon-action" @click="openDetail(driver)">
                  <i class="material-symbols-outlined">arrow_forward</i>
                </button>
              </td>
            </tr>
            </tbody>
          </table>
        </div>
      </article>

      <article class="driver-panel timeline-panel">
        <div class="panel-header compact">
          <div>
            <p class="eyebrow">{{ t('drivers.timeline.eyebrow') }}</p>
            <h2>{{ t('drivers.timeline.title') }}</h2>
          </div>
          <span>{{ t('drivers.timeline.today') }}</span>
        </div>

        <div class="shift-list">
          <article
              v-for="shift in store.dashboard.shifts"
              :key="shift.id"
              class="shift-item"
              :class="shift.status"
          >
            <i></i>
            <div>
              <small>{{ shift.time }} · {{ shift.driverName }}</small>
              <strong>{{ shift.title }}</strong>
              <p>{{ shift.description }}</p>
            </div>
          </article>
        </div>
      </article>
    </section>

    <!-- Register dialog -->
    <pv-dialog
        v-model:visible="showRegisterDialog"
        :header="t('drivers.actions.registerDriver')"
        modal
        :style="{ width: '800px' }"
    >
      <div class="kw-form-grid">
        <label><span>{{ t('drivers.dialog.fullName') }}</span><pv-input-text v-model="driverDraft.fullName" /></label>
        <label><span>{{ t('drivers.dialog.license') }}</span><pv-input-text v-model="driverDraft.licenseNumber" /></label>
        <label><span>{{ t('drivers.dialog.licenseClass') }}</span><pv-input-text v-model="driverDraft.licenseClass" /></label>
        <label><span>{{ t('drivers.dialog.phone') }}</span><pv-input-text v-model="driverDraft.phone" /></label>
        <label><span>{{ t('drivers.dialog.email') }}</span><pv-input-text v-model="driverDraft.email" /></label>
        <label><span>{{ t('drivers.dialog.vehicle') }}</span><pv-input-text v-model="driverDraft.assignedVehicle" /></label>
        <label><span>{{ t('drivers.dialog.route') }}</span><pv-input-text v-model="driverDraft.assignedRoute" /></label>
        <label><span>{{ t('drivers.dialog.safety') }}</span><pv-input-number v-model="driverDraft.safetyScore" /></label>
        <label><span>{{ t('drivers.dialog.punctuality') }}</span><pv-input-number v-model="driverDraft.punctualityScore" /></label>
      </div>
      <template #footer>
        <pv-button :label="t('shared.cancel')" text @click="closeRegister" />
        <pv-button :label="t('drivers.dialog.create')" @click="saveDriver" />
      </template>
    </pv-dialog>

    <!-- Detail dialog -->
    <pv-dialog
        v-model:visible="showDetailDialog"
        modal
        :style="{ width: '700px' }"
        :header="selectedDriver?.fullName ?? ''"
    >
      <div v-if="selectedDriver" class="kw-detail-grid">
        <article><small>{{ t('drivers.dialog.license') }}</small><strong>{{ selectedDriver.licenseNumber }} · {{ selectedDriver.licenseClass }}</strong></article>
        <article><small>{{ t('drivers.dialog.phone') }}</small><strong>{{ selectedDriver.phone }}</strong></article>
        <article><small>{{ t('drivers.dialog.email') }}</small><strong>{{ selectedDriver.email }}</strong></article>
        <article><small>{{ t('drivers.dialog.vehicle') }}</small><strong>{{ selectedDriver.assignedVehicle }}</strong></article>
        <article><small>{{ t('drivers.dialog.route') }}</small><strong>{{ selectedDriver.assignedRoute }}</strong></article>
        <article><small>{{ t('drivers.dialog.status') }}</small><strong>{{ t('drivers.status.' + selectedDriver.status) }}</strong></article>
        <article><small>{{ t('drivers.dialog.safety') }}</small><strong>{{ selectedDriver.safetyScore }}%</strong></article>
        <article><small>{{ t('drivers.dialog.punctuality') }}</small><strong>{{ selectedDriver.punctualityScore }}%</strong></article>
      </div>
      <template #footer>
        <pv-button :label="t('shared.close')" @click="showDetailDialog = false" />
      </template>
    </pv-dialog>
  </section>
</template>

<style scoped>
.drivers-page { display: grid; gap: 26px; }

.drivers-hero {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 20px;
  padding: clamp(26px, 4vw, 40px);
  border: 1px solid rgba(34, 131, 198, .13);
  border-radius: 28px;
  background:
      radial-gradient(circle at 100% 15%, rgba(255, 181, 46, .26), transparent 24%),
      linear-gradient(135deg, rgba(255,255,255,.95), rgba(228,243,251,.9));
  box-shadow: var(--kw-shadow);
  overflow: hidden;
}
.eyebrow {
  margin: 0 0 8px;
  color: var(--kw-blue-700);
  font-size: .78rem;
  font-weight: 950;
  letter-spacing: .12em;
  text-transform: uppercase;
}
h1, h2, h3 { color: var(--kw-ink); }
h1 {
  margin: 0;
  font-size: clamp(2rem, 5vw, 3.6rem);
  line-height: .98;
  letter-spacing: -.055em;
}
.hero-copy { max-width: 850px; margin: 13px 0 0; color: var(--kw-muted); font-size: 1.05rem; }
.hero-indicator {
  min-width: 160px;
  padding: 18px 22px;
  border-radius: 18px;
  background: rgba(255,255,255,.82);
  box-shadow: 0 14px 35px rgba(15, 43, 87, .08);
  text-align: center;
}
.hero-indicator span { display: block; color: var(--kw-muted); font-size: .78rem; font-weight: 950; }
.hero-indicator strong { display: block; margin-top: 4px; color: var(--kw-blue-700); font-size: 2.1rem; line-height: 1; }

.kpi-grid { display: grid; grid-template-columns: repeat(5, minmax(0, 1fr)); gap: 18px; }

.drivers-content-grid { display: grid; grid-template-columns: minmax(0, 1fr) 420px; gap: 18px; align-items: start; }
.drivers-side { display: grid; gap: 18px; }

.driver-panel {
  padding: 22px;
  border: 1px solid var(--kw-border);
  border-radius: 22px;
  background: var(--kw-card);
  box-shadow: var(--kw-shadow);
}
.panel-header { display: flex; align-items: center; justify-content: space-between; gap: 16px; margin-bottom: 18px; }
.panel-header.compact { align-items: flex-start; }
.panel-header > div h2 { margin: 0; font-size: clamp(1.35rem, 3vw, 1.9rem); line-height: 1.05; }
.panel-header > div p.eyebrow { margin: 0 0 8px; }

.drivers-toolbar {
  display: grid;
  grid-template-columns: minmax(260px, 1fr) auto;
  gap: 14px;
  align-items: center;
  margin-bottom: 18px;
}
.search-box {
  display: flex;
  align-items: center;
  gap: 10px;
  min-height: 48px;
  padding: 0 16px;
  border: 1px solid var(--kw-border);
  border-radius: 16px;
  background: rgba(255,255,255,.78);
  color: var(--kw-blue-700);
}
.search-box input { width: 100%; border: 0; outline: 0; color: var(--kw-ink); background: transparent; }
.status-filters { display: flex; flex-wrap: wrap; gap: 8px; justify-content: flex-end; }
.status-filters button {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  min-height: 42px;
  padding: 0 13px;
  border-radius: 999px;
  color: #58708a;
  background: #f4f8fc;
  border: 1px solid var(--kw-border);
  cursor: pointer;
  font-weight: 900;
  font-size: .82rem;
}
.status-filters button.active { color: white; background: var(--kw-blue-700); border-color: transparent; box-shadow: 0 10px 22px rgba(34, 131, 198, .22); }
.status-filters .material-symbols-outlined { font-size: 17px; }

.driver-cards { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 14px; }
.empty-state {
  grid-column: 1 / -1;
  display: grid;
  place-items: center;
  gap: 10px;
  min-height: 220px;
  color: var(--kw-muted);
  text-align: center;
}
.empty-state .material-symbols-outlined { font-size: 48px; color: var(--kw-blue-700); }
.empty-state h3, .empty-state p { margin: 0; }

.readiness-panel .panel-header > span,
.timeline-panel .panel-header > span {
  padding: 7px 12px;
  border-radius: 999px;
  color: #0f5f9a;
  background: #e3f4ff;
  font-size: .82rem;
  font-weight: 900;
}
.readiness-chart { display: grid; place-items: center; padding: 10px 0 4px; }
.donut {
  display: grid;
  place-items: center;
  align-content: center;
  width: min(240px, 70vw);
  aspect-ratio: 1;
  border-radius: 50%;
  position: relative;
}
.donut::after { content: ''; position: absolute; inset: 24%; border-radius: inherit; background: var(--kw-card); }
.donut strong, .donut small { position: relative; z-index: 1; }
.donut strong { color: var(--kw-blue-900); font-size: 2.45rem; line-height: 1; }
.donut small { color: var(--kw-muted); font-weight: 800; }
.legend-list { display: grid; grid-template-columns: repeat(3, 1fr); gap: 8px; margin-top: 12px; }
.legend-list span { display: inline-flex; align-items: center; gap: 6px; color: var(--kw-muted); font-size: .82rem; font-weight: 800; }
.legend-list i { width: 10px; height: 10px; border-radius: 999px; }
.legend-list .available { background: #22c55e; }
.legend-list .on-route { background: var(--kw-blue-700); }
.legend-list .review { background: var(--kw-yellow-500); }

.lower-grid { display: grid; grid-template-columns: minmax(0, 1.45fr) minmax(360px, .8fr); gap: 18px; align-items: start; }
.table-wrap { overflow-x: auto; border: 1px solid var(--kw-border); border-radius: 16px; }
table { width: 100%; min-width: 1050px; border-collapse: collapse; }
th, td { padding: 15px 16px; text-align: left; border-bottom: 1px solid var(--kw-border); vertical-align: middle; }
th { background: #f3f8fd; color: #607795; font-size: .76rem; text-transform: uppercase; letter-spacing: .07em; }
td { color: #274461; }
td strong { display: block; color: var(--kw-blue-900); }
td small { display: block; margin-top: 3px; color: var(--kw-muted); }
.table-status { display: inline-flex; padding: 6px 10px; border-radius: 999px; font-size: .75rem; font-weight: 950; }
.table-status.available { color: #0f7a46; background: #dcfce7; }
.table-status.onRoute { color: #0f5f9a; background: #e3f4ff; }
.table-status.review { color: #9a6000; background: #fff4d8; }
.table-status.offDuty { color: #52616f; background: #edf2f7; }
.mini-progress { width: 110px; height: 8px; margin-top: 6px; border-radius: 999px; background: #e8f0f8; overflow: hidden; }
.mini-progress i { display: block; height: 100%; border-radius: inherit; background: linear-gradient(90deg, var(--kw-blue-700), #25c4b7); }
.icon-action {
  display: inline-grid;
  place-items: center;
  width: 36px;
  height: 36px;
  border-radius: 12px;
  color: var(--kw-blue-700);
  background: #e3f4ff;
  border: 0;
  cursor: pointer;
}
.icon-action .material-symbols-outlined { font-size: 18px; }

.shift-list { display: grid; gap: 12px; }
.shift-item {
  display: grid;
  grid-template-columns: auto 1fr;
  gap: 12px;
  padding: 15px;
  border: 1px solid var(--kw-border);
  border-radius: 16px;
  background: rgba(255,255,255,.68);
}
.shift-item > i {
  width: 12px;
  height: 12px;
  margin-top: 5px;
  border-radius: 999px;
  background: #94a3b8;
  box-shadow: 0 0 0 6px rgba(148,163,184,.12);
}
.shift-item.completed > i { background: #22c55e; box-shadow: 0 0 0 6px rgba(34,197,94,.12); }
.shift-item.active > i { background: var(--kw-blue-700); box-shadow: 0 0 0 6px rgba(34,131,198,.13); }
.shift-item.pending > i { background: var(--kw-yellow-500); box-shadow: 0 0 0 6px rgba(255,181,46,.16); }
.shift-item small { display: block; margin-bottom: 4px; color: var(--kw-blue-700); font-weight: 950; }
.shift-item strong { color: var(--kw-blue-900); }
.shift-item p { margin: 6px 0 0; color: var(--kw-muted); font-size: .9rem; line-height: 1.4; }

.kw-form-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 14px; }
.kw-form-grid label { display: grid; gap: 6px; }
.kw-form-grid label span { font-weight: 700; font-size: .85rem; color: var(--kw-muted); }
.kw-detail-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 14px; }
.kw-detail-grid article { padding: 12px; border: 1px solid var(--kw-border); border-radius: 12px; }
.kw-detail-grid small { color: var(--kw-muted); font-weight: 700; font-size: .78rem; }
.kw-detail-grid strong { display: block; margin-top: 4px; color: var(--kw-ink); }

body.dark-theme .drivers-hero { background: linear-gradient(135deg, rgba(12,31,52,.96), rgba(15,47,78,.88)); }
body.dark-theme .hero-indicator, body.dark-theme .search-box { background: rgba(255,255,255,.05); }
body.dark-theme th, body.dark-theme .status-filters button { background: rgba(255,255,255,.06); color: #d8e8f8; }
body.dark-theme td { color: #d5e3f4; }
body.dark-theme td strong, body.dark-theme .donut strong, body.dark-theme .shift-item strong { color: #eaf4ff; }
body.dark-theme .shift-item { background: rgba(255,255,255,.045); }

@media (max-width: 1500px) { .kpi-grid { grid-template-columns: repeat(3, minmax(0, 1fr)); } .driver-cards { grid-template-columns: 1fr; } }
@media (max-width: 1180px) { .drivers-content-grid, .lower-grid { grid-template-columns: 1fr; } .drivers-side { grid-template-columns: 1fr 1fr; } }
@media (max-width: 860px) {
  .drivers-hero, .panel-header, .drivers-toolbar { flex-direction: column; align-items: stretch; }
  .kpi-grid, .drivers-side { grid-template-columns: 1fr; }
  .status-filters { justify-content: flex-start; }
}
@media (max-width: 640px) {
  .driver-panel { padding: 18px; border-radius: 18px; }
  .drivers-hero { padding: 22px; border-radius: 22px; }
  .hero-indicator { width: 100%; }
  .kw-form-grid, .kw-detail-grid { grid-template-columns: 1fr; }
}
</style>