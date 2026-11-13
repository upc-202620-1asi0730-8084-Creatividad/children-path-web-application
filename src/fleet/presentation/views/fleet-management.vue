<script setup>
import { onMounted, ref, computed } from 'vue';
import { useI18n } from 'vue-i18n';
import useFleetStore from '@/fleet/application/fleet.store.js';
import FleetKpiCard from '../components/fleet-kpi-card.vue';
import FleetMaintenancePanel from '../components/fleet-maintenance-panel.vue';
import VehicleStatusCard from '../components/vehicle-status-card.vue';

const { t } = useI18n();
const store = useFleetStore();

const showRegister = ref(false);
const selectedVehicle = ref(null);

const showVehicleDetails = computed({
  get: () => !!selectedVehicle.value,
  set: (value) => {
    if (!value) selectedVehicle.value = null;
  }
});

const statusFilters = ['all', 'available', 'onRoute', 'maintenance', 'inactive'];

const vehicleDraft = ref({
  code: '', plate: '', brand: 'Toyota', model: 'Hiace',
  year: new Date().getFullYear(), capacity: 15,
  driverName: 'Not assigned', routeName: 'Backup unit',
  status: 'available', mileageKm: 0
});

onMounted(() => {
  store.fetchDashboard();
});

function onSearch(event) {
  store.setSearchTerm(event.target.value);
}

function setStatus(status) {
  store.setStatus(status);
}

function statusIcon(status) {
  const icons = {
    available: 'check_circle',
    onRoute: 'route',
    maintenance: 'build_circle',
    inactive: 'block'
  };
  return icons[status] ?? 'directions_bus';
}

function availabilityGradient(value) {
  const safe = Math.max(0, Math.min(value, 100));
  return `conic-gradient(var(--kw-blue-700) ${safe}%, #e9eff7 0)`;
}

async function saveVehicle() {
  const vehicle = {
    id: `veh-${Date.now()}`,
    ...vehicleDraft.value,
    assignedStudents: 0,
    energyType: 'gasoline',
    ownershipType: 'company',
    nextMaintenanceDate: new Date().toISOString().slice(0, 10),
    lastInspectionDate: new Date().toISOString().slice(0, 10),
    availabilityScore: 90,
    documentsValid: true
  };
  const created = await store.createVehicle(vehicle);
  selectedVehicle.value = created;
  showRegister.value = false;
}

function exportList() {
  const header = ['Code', 'Plate', 'Brand', 'Model', 'Driver', 'Route', 'Status', 'Capacity', 'Inspection'];
  const rows = store.filteredVehicles.map((v) => [
    v.code, v.plate, v.brand, v.model, v.driverName, v.routeName,
    v.status, `${v.assignedStudents}/${v.capacity}`, v.lastInspectionDate
  ]);
  const csv = [header, ...rows]
      .map((row) => row.map((v) => `"${String(v).replace(/"/g, '""')}"`).join(','))
      .join('\n');
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = 'children-path-fleet-registry.csv';
  link.click();
  URL.revokeObjectURL(url);
}
</script>

<template>
  <section class="fleet-page">
    <!-- Hero -->
    <header class="fleet-hero">
      <div>
        <p class="eyebrow">{{ t('fleet.eyebrow') }}</p>
        <h1>{{ t('fleet.title') }}</h1>
        <p class="hero-copy">{{ t('fleet.subtitle') }}</p>
      </div>
      <div class="hero-indicator">
        <span>{{ t('fleet.heroAvailability') }}</span>
        <strong>{{ store.summary.averageAvailability }}%</strong>
      </div>
    </header>

    <!-- KPIs -->
    <section class="kpi-grid">
      <fleet-kpi-card
          icon="directions_bus"
          :label="t('fleet.kpis.totalVehicles')"
          :value="store.summary.totalVehicles"
          :helper="t('fleet.kpis.registeredUnits')"
      />
      <fleet-kpi-card
          icon="verified"
          tone="green"
          :label="t('fleet.kpis.availableVehicles')"
          :value="store.summary.availableVehicles"
          :helper="t('fleet.kpis.readyForService')"
      />
      <fleet-kpi-card
          icon="route"
          :label="t('fleet.kpis.onRouteVehicles')"
          :value="store.summary.onRouteVehicles"
          :helper="t('fleet.kpis.activeRoutes')"
      />
      <fleet-kpi-card
          icon="construction"
          tone="amber"
          :label="t('fleet.kpis.maintenanceVehicles')"
          :value="store.summary.maintenanceVehicles"
          :helper="t('fleet.kpis.requiresReview')"
      />
      <fleet-kpi-card
          icon="groups"
          :label="t('fleet.kpis.capacityUsage')"
          :value="store.summary.averageCapacityUsage + '%'"
          :helper="t('fleet.kpis.studentCapacity')"
      />
    </section>

    <!-- Content grid -->
    <section class="fleet-content-grid">
      <article class="fleet-panel vehicles-panel">
        <div class="panel-header">
          <div>
            <p class="eyebrow">{{ t('fleet.inventory.eyebrow') }}</p>
            <h2>{{ t('fleet.inventory.title') }}</h2>
          </div>
          <pv-button class="primary-action" @click="showRegister = true">
            <i class="material-symbols-outlined">add</i>
            {{ t('fleet.actions.registerVehicle') }}
          </pv-button>
        </div>

        <div class="fleet-toolbar">
          <label class="search-box">
            <i class="material-symbols-outlined">search</i>
            <input
                type="search"
                :placeholder="t('fleet.filters.searchPlaceholder')"
                :value="store.searchTerm"
                @input="onSearch"
            />
          </label>

          <div class="status-filters">
            <button
                v-for="status in statusFilters"
                :key="status"
                type="button"
                :class="{ active: store.selectedStatus === status }"
                @click="setStatus(status)"
            >
              <i v-if="status !== 'all'" class="material-symbols-outlined">{{ statusIcon(status) }}</i>
              {{ t('fleet.filters.' + status) }}
            </button>
          </div>
        </div>

        <div class="vehicle-cards">
          <vehicle-status-card
              v-for="vehicle in store.filteredVehicles"
              :key="vehicle.id"
              :vehicle="vehicle"
          />
          <div v-if="store.filteredVehicles.length === 0" class="empty-state">
            <i class="material-symbols-outlined">search_off</i>
            <h3>{{ t('fleet.empty.title') }}</h3>
            <p>{{ t('fleet.empty.message') }}</p>
          </div>
        </div>
      </article>

      <aside class="fleet-side">
        <article class="fleet-panel availability-panel">
          <div class="panel-header compact">
            <div>
              <p class="eyebrow">{{ t('fleet.availability.eyebrow') }}</p>
              <h2>{{ t('fleet.availability.title') }}</h2>
            </div>
            <span>{{ store.summary.averageAvailability }}%</span>
          </div>
          <div class="availability-chart">
            <div class="donut" :style="{ background: availabilityGradient(store.summary.averageAvailability) }">
              <strong>{{ store.summary.averageAvailability }}%</strong>
              <small>{{ t('fleet.availability.ready') }}</small>
            </div>
          </div>
          <div class="legend-list">
            <span><i class="available"></i>{{ t('fleet.status.available') }}</span>
            <span><i class="on-route"></i>{{ t('fleet.status.onRoute') }}</span>
            <span><i class="maintenance"></i>{{ t('fleet.status.maintenance') }}</span>
          </div>
        </article>

        <fleet-maintenance-panel :alerts="store.maintenanceAlerts" />
      </aside>
    </section>

    <!-- Table -->
    <article class="fleet-panel table-panel">
      <div class="panel-header">
        <div>
          <p class="eyebrow">{{ t('fleet.table.eyebrow') }}</p>
          <h2>{{ t('fleet.table.title') }}</h2>
        </div>
        <pv-button class="secondary-action" @click="exportList">
          <i class="material-symbols-outlined">download</i>
          {{ t('fleet.actions.export') }}
        </pv-button>
      </div>

      <div class="table-wrap">
        <table>
          <thead>
          <tr>
            <th>{{ t('fleet.table.vehicle') }}</th>
            <th>{{ t('fleet.table.driver') }}</th>
            <th>{{ t('fleet.table.route') }}</th>
            <th>{{ t('fleet.table.capacity') }}</th>
            <th>{{ t('fleet.table.status') }}</th>
            <th>{{ t('fleet.table.inspection') }}</th>
            <th>{{ t('fleet.table.actions') }}</th>
          </tr>
          </thead>
          <tbody>
          <tr v-for="vehicle in store.filteredVehicles" :key="vehicle.id">
            <td>
              <strong>{{ vehicle.code }}</strong>
              <small>{{ vehicle.plate }} · {{ vehicle.brand }} {{ vehicle.model }}</small>
            </td>
            <td>{{ vehicle.driverName }}</td>
            <td>{{ vehicle.routeName }}</td>
            <td>
              <span>{{ vehicle.assignedStudents }} / {{ vehicle.capacity }}</span>
              <div class="mini-progress"><i :style="{ width: vehicle.capacityUsage + '%' }"></i></div>
            </td>
            <td>
                <span class="table-status" :class="vehicle.status">
                  {{ t('fleet.status.' + vehicle.status) }}
                </span>
            </td>
            <td>{{ vehicle.lastInspectionDate }}</td>
            <td>
              <button class="icon-action" @click="selectedVehicle = vehicle">
                <i class="material-symbols-outlined">arrow_forward</i>
              </button>
            </td>
          </tr>
          </tbody>
        </table>
      </div>
    </article>

    <!-- Modal: Register vehicle -->
    <pv-dialog
        v-model:visible="showRegister"
        :header="t('fleet.actions.registerVehicle')"
        modal
        :style="{ width: '720px' }"
    >
      <div class="kw-form-grid">
        <label><span>{{ t('fleet.dialog.code') }}</span><pv-input-text v-model="vehicleDraft.code" /></label>
        <label><span>{{ t('fleet.dialog.plate') }}</span><pv-input-text v-model="vehicleDraft.plate" /></label>
        <label><span>{{ t('fleet.dialog.brand') }}</span><pv-input-text v-model="vehicleDraft.brand" /></label>
        <label><span>{{ t('fleet.dialog.model') }}</span><pv-input-text v-model="vehicleDraft.model" /></label>
        <label><span>{{ t('fleet.dialog.year') }}</span><pv-input-number v-model="vehicleDraft.year" /></label>
        <label><span>{{ t('fleet.dialog.capacity') }}</span><pv-input-number v-model="vehicleDraft.capacity" /></label>
        <label><span>{{ t('fleet.dialog.driver') }}</span><pv-input-text v-model="vehicleDraft.driverName" /></label>
        <label><span>{{ t('fleet.dialog.route') }}</span><pv-input-text v-model="vehicleDraft.routeName" /></label>
        <label><span>{{ t('fleet.dialog.mileage') }}</span><pv-input-number v-model="vehicleDraft.mileageKm" /></label>
      </div>
      <template #footer>
        <pv-button :label="t('shared.cancel')" text @click="showRegister = false" />
        <pv-button :label="t('fleet.dialog.create')" @click="saveVehicle" />
      </template>
    </pv-dialog>

    <!-- Modal: Vehicle details -->
    <pv-dialog
        v-model:visible="showVehicleDetails"
        :header="selectedVehicle ? `${selectedVehicle.code} · ${selectedVehicle.plate}` : ''"
        modal
        :style="{ width: '720px' }"
    >
      <div v-if="selectedVehicle" class="kw-detail-grid">
        <article><small>{{ t('fleet.dialog.brand') }}</small><strong>{{ selectedVehicle.brand }} {{ selectedVehicle.model }} · {{ selectedVehicle.year }}</strong></article>
        <article><small>{{ t('fleet.dialog.driver') }}</small><strong>{{ selectedVehicle.driverName }}</strong></article>
        <article><small>{{ t('fleet.dialog.route') }}</small><strong>{{ selectedVehicle.routeName }}</strong></article>
        <article><small>{{ t('fleet.dialog.status') }}</small><strong>{{ t('fleet.status.' + selectedVehicle.status) }}</strong></article>
        <article><small>{{ t('fleet.dialog.capacity') }}</small><strong>{{ selectedVehicle.assignedStudents }} / {{ selectedVehicle.capacity }}</strong></article>
        <article><small>{{ t('fleet.dialog.availability') }}</small><strong>{{ selectedVehicle.availabilityScore }}%</strong></article>
      </div>
      <template #footer>
        <pv-button :label="t('shared.close')" @click="selectedVehicle = null" />
      </template>
    </pv-dialog>
  </section>
</template>

<style scoped>
.fleet-page { display: grid; gap: 26px; }
.fleet-hero {
  display: flex; justify-content: space-between; align-items: center; gap: 20px;
  padding: clamp(26px, 4vw, 40px);
  border: 1px solid rgba(34, 131, 198, .13);
  border-radius: 28px;
  background:
      radial-gradient(circle at 100% 15%, rgba(255, 181, 46, .26), transparent 24%),
      linear-gradient(135deg, rgba(255,255,255,.95), rgba(228,243,251,.9));
  box-shadow: var(--kw-shadow);
}
.eyebrow {
  margin: 0 0 8px; color: var(--kw-blue-700);
  font-size: .78rem; font-weight: 900;
  letter-spacing: .12em; text-transform: uppercase;
}
h1, h2, h3 { color: var(--kw-ink); }
h1 { margin: 0; font-size: clamp(2rem, 5vw, 3.6rem); line-height: .98; letter-spacing: -.055em; }
.hero-copy { max-width: 820px; margin: 13px 0 0; color: var(--kw-muted); font-size: 1.05rem; }
.hero-indicator {
  min-width: 160px; padding: 18px 22px; border-radius: 18px;
  background: rgba(255,255,255,.82);
  box-shadow: 0 14px 35px rgba(15, 43, 87, .08);
  text-align: center;
}
.hero-indicator span { display: block; color: var(--kw-muted); font-size: .78rem; font-weight: 900; }
.hero-indicator strong { display: block; margin-top: 4px; color: var(--kw-blue-700); font-size: 2.1rem; line-height: 1; }
.kpi-grid { display: grid; grid-template-columns: repeat(5, minmax(0, 1fr)); gap: 18px; }
.fleet-content-grid { display: grid; grid-template-columns: minmax(0, 1fr) 420px; gap: 18px; align-items: start; }
.fleet-side { display: grid; gap: 18px; }
.fleet-panel {
  padding: 22px; border: 1px solid var(--kw-border);
  border-radius: 22px; background: var(--kw-card);
  box-shadow: var(--kw-shadow);
}
.panel-header { display: flex; align-items: center; justify-content: space-between; gap: 16px; margin-bottom: 18px; }
.panel-header.compact { align-items: flex-start; }
h2 { margin: 0; font-size: clamp(1.35rem, 3vw, 1.9rem); line-height: 1.05; }
.primary-action, .secondary-action { display: inline-flex; align-items: center; gap: 8px; }
.fleet-toolbar { display: grid; grid-template-columns: minmax(260px, 1fr) auto; gap: 14px; align-items: center; margin-bottom: 18px; }
.search-box {
  display: flex; align-items: center; gap: 10px;
  min-height: 48px; padding: 0 16px;
  border: 1px solid var(--kw-border); border-radius: 16px;
  background: rgba(255,255,255,.78);
  color: var(--kw-blue-700);
}
.search-box input { width: 100%; border: 0; outline: 0; color: var(--kw-ink); background: transparent; }
.status-filters { display: flex; flex-wrap: wrap; gap: 8px; justify-content: flex-end; }
.status-filters button {
  display: inline-flex; align-items: center; gap: 6px;
  min-height: 42px; padding: 0 13px;
  border-radius: 999px; color: #58708a;
  background: #f4f8fc; border: 1px solid var(--kw-border);
  font-weight: 900; cursor: pointer;
}
.status-filters button.active { color: white; background: var(--kw-blue-700); border-color: transparent; }
.status-filters .material-symbols-outlined { font-size: 17px; }
.vehicle-cards { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 14px; }
.empty-state { grid-column: 1 / -1; display: grid; place-items: center; gap: 10px; min-height: 220px; color: var(--kw-muted); text-align: center; }
.empty-state .material-symbols-outlined { font-size: 48px; color: var(--kw-blue-700); }
.availability-panel .panel-header span { padding: 7px 12px; border-radius: 999px; color: #0f5f9a; background: #e3f4ff; font-size: .82rem; font-weight: 900; }
.availability-chart { display: grid; place-items: center; padding: 10px 0 4px; }
.donut {
  display: grid; place-items: center; align-content: center;
  width: min(240px, 70vw); aspect-ratio: 1;
  border-radius: 50%; position: relative;
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
.legend-list .maintenance { background: var(--kw-yellow-500); }
.table-wrap { overflow-x: auto; border: 1px solid var(--kw-border); border-radius: 16px; }
table { width: 100%; min-width: 980px; border-collapse: collapse; }
th, td { padding: 15px 16px; text-align: left; border-bottom: 1px solid var(--kw-border); vertical-align: middle; }
th { background: #f3f8fd; color: #607795; font-size: .76rem; text-transform: uppercase; letter-spacing: .07em; }
td { color: #274461; }
td strong { display: block; color: var(--kw-blue-900); }
td small { display: block; margin-top: 3px; color: var(--kw-muted); }
.table-status { display: inline-flex; padding: 6px 10px; border-radius: 999px; font-size: .75rem; font-weight: 900; }
.table-status.available { color: #0f7a46; background: #dcfce7; }
.table-status.onRoute { color: #0f5f9a; background: #e3f4ff; }
.table-status.maintenance { color: #9a6000; background: #fff4d8; }
.table-status.inactive { color: #8a1f2d; background: #ffe4e6; }
.mini-progress { width: 110px; height: 8px; margin-top: 6px; border-radius: 999px; background: #e8f0f8; overflow: hidden; }
.mini-progress i { display: block; height: 100%; border-radius: inherit; background: linear-gradient(90deg, var(--kw-blue-700), #25c4b7); }
.icon-action { display: inline-grid; place-items: center; width: 36px; height: 36px; border-radius: 12px; color: var(--kw-blue-700); background: #e3f4ff; border: 0; cursor: pointer; }
.kw-form-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 14px; }
.kw-form-grid label { display: grid; gap: 6px; }
.kw-form-grid label span { font-weight: 700; font-size: .85rem; color: var(--kw-muted); }
.kw-detail-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 14px; }
.kw-detail-grid article { padding: 12px; border: 1px solid var(--kw-border); border-radius: 12px; }
.kw-detail-grid small { color: var(--kw-muted); font-weight: 700; font-size: .78rem; }
.kw-detail-grid strong { display: block; margin-top: 4px; color: var(--kw-ink); }
body.dark-theme .fleet-hero { background: linear-gradient(135deg, rgba(12,31,52,.96), rgba(15,47,78,.88)); }
body.dark-theme .hero-indicator, body.dark-theme .search-box { background: rgba(255,255,255,.05); }
body.dark-theme th, body.dark-theme .status-filters button { background: rgba(255,255,255,.06); color: #d8e8f8; }
body.dark-theme td { color: #d5e3f4; }
body.dark-theme td strong, body.dark-theme .donut strong { color: #eaf4ff; }
@media (max-width: 1500px) { .kpi-grid { grid-template-columns: repeat(3, minmax(0, 1fr)); } .vehicle-cards { grid-template-columns: 1fr; } }
@media (max-width: 1180px) { .fleet-content-grid { grid-template-columns: 1fr; } .fleet-side { grid-template-columns: 1fr 1fr; } }
@media (max-width: 860px) { .kpi-grid, .fleet-side { grid-template-columns: 1fr; } .status-filters { justify-content: flex-start; } }
@media (max-width: 640px) { .fleet-panel { padding: 18px; border-radius: 18px; } .fleet-hero { padding: 22px; border-radius: 22px; } .hero-indicator { width: 100%; } }
</style>