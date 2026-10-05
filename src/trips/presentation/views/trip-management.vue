<script setup>
import { computed, onMounted, ref } from 'vue';
import { useI18n } from 'vue-i18n';
import useTripsStore from '@/trips/application/trips.store.js';
import TripKpiCard from '../components/trip-kpi-card.vue';
import TripStatusCard from '../components/trip-status-card.vue';
import TripReadinessPanel from '../components/trip-readiness-panel.vue';
import TripDetailDialog from '../components/trip-detail-dialog.vue';
import TripFormDialog from '../components/trip-form-dialog.vue';

const { t } = useI18n();
const store = useTripsStore();

const statusFilters = ['all', 'scheduled', 'in_progress', 'delayed', 'completed', 'canceled'];
const shiftFilters = ['all', 'morning', 'afternoon', 'return'];

const showDetailDialog = ref(false);
const showFormDialog = ref(false);
const viewingTrip = ref(null);
const editingTrip = ref(null);

const kpis = computed(() => {
  const s = store.summary;
  return [
    { icon: 'route',          label: 'Total trips',     value: s.totalTrips,          helper: 'Daily operational records',       tone: 'blue' },
    { icon: 'play_circle',    label: 'Active trips',    value: s.activeTrips,         helper: 'Running or delayed now',          tone: 'green' },
    { icon: 'event_available',label: 'Scheduled trips', value: s.scheduledTrips,      helper: 'Waiting for departure',           tone: 'blue' },
    { icon: 'schedule',       label: 'Delayed trips',   value: s.delayedTrips,        helper: 'Require operational review',      tone: 'amber' },
    { icon: 'check_circle',   label: 'Completed trips', value: s.completedTrips,      helper: 'Closed transport records',        tone: 'green' }
  ];
});

const showWarning = computed(() => store.summary.delayedTrips > 0);

function openCreate() {
  editingTrip.value = null;
  showFormDialog.value = true;
}

function openEdit(trip) {
  editingTrip.value = trip;
  showFormDialog.value = true;
}

function openDetail(trip) {
  viewingTrip.value = trip;
  showDetailDialog.value = true;
}

async function onSaveTrip(entity) {
  if (!entity.id) {
    entity.id = `trip-${Date.now()}`;
    entity.code = `TP-${String(Date.now()).slice(-3)}`;
    await store.createTrip(entity);
  } else {
    await store.updateTrip(entity, 'Trip updated', `${entity.routeName} was updated.`, 'completed');
  }
}

onMounted(() => {
  store.fetchDashboard();
});
</script>

<template>
  <main class="trip-page">
    <!-- Hero -->
    <section class="trip-hero">
      <div>
        <span>{{ t('tripsBc.eyebrow') }}</span>
        <h1>{{ t('tripsBc.title') }}</h1>
        <p>{{ t('tripsBc.subtitle') }}</p>
      </div>
      <aside>
        <small>{{ t('tripsBc.serviceReliability') }}</small>
        <strong>{{ store.summary.serviceReliability }}%</strong>
      </aside>
    </section>

    <!-- KPIs -->
    <section class="kpi-grid">
      <trip-kpi-card
          v-for="kpi in kpis"
          :key="kpi.label"
          :icon="kpi.icon"
          :label="kpi.label"
          :value="kpi.value"
          :helper="kpi.helper"
          :tone="kpi.tone"
      />
    </section>

    <!-- Warning -->
    <section v-if="showWarning" class="operation-warning">
      <i class="material-symbols-outlined">warning</i>
      <div>
        <strong>Trips require operational follow-up</strong>
        <p>Some trips have delay or checklist issues. Review route progress before closing the service day.</p>
      </div>
      <button type="button" @click="store.setStatus('delayed')">Review delayed trips</button>
    </section>

    <!-- Main grid -->
    <section class="trip-main-grid">
      <div class="trip-roster panel-card">
        <header class="section-header">
          <div>
            <span>{{ t('tripsBc.control') }}</span>
            <h2>{{ t('tripsBc.operationalStatus') }}</h2>
          </div>
          <pv-button class="primary-action" @click="openCreate">
            <i class="material-symbols-outlined">add</i>
            New trip
          </pv-button>
        </header>

        <div class="toolbar-row">
          <label class="search-box">
            <i class="material-symbols-outlined">search</i>
            <input
                type="search"
                placeholder="Search by route, vehicle, driver, school or district..."
                :value="store.searchTerm"
                @input="store.setSearchTerm($event.target.value)"
            />
          </label>
          <div class="filter-group">
            <button
                v-for="s in statusFilters"
                :key="s"
                type="button"
                :class="{ active: store.selectedStatus === s }"
                @click="store.setStatus(s)"
            >
              <i class="material-symbols-outlined">{{ store.statusIcon(s) }}</i>
              {{ s.replace('_', ' ') }}
            </button>
          </div>
        </div>

        <div class="shift-row">
          <button
              v-for="sh in shiftFilters"
              :key="sh"
              type="button"
              :class="{ active: store.selectedShift === sh }"
              @click="store.setShift(sh)"
          >
            <i class="material-symbols-outlined">{{ store.shiftIcon(sh) }}</i>
            {{ sh }}
          </button>
        </div>

        <section class="trip-card-grid">
          <trip-status-card
              v-for="trip in store.filteredTrips"
              :key="trip.id"
              :trip="trip"
              @view="openDetail"
              @start="store.startTrip"
              @complete="store.completeTrip"
              @cancel="store.cancelTrip"
          />

          <div v-if="store.filteredTrips.length === 0" class="empty-state">
            <i class="material-symbols-outlined">route</i>
            <strong>No trips found</strong>
            <p>Try changing the search term, status filter or shift filter.</p>
          </div>
        </section>
      </div>

      <aside>
        <trip-readiness-panel
            :score="store.summary.serviceReliability"
            :reviews="store.reviews"
        />
      </aside>
    </section>

    <!-- Bottom grid -->
    <section class="bottom-grid">
      <div class="registry-card panel-card">
        <header class="section-header compact">
          <div>
            <span>{{ t('tripsBc.records') }}</span>
            <h2>{{ t('tripsBc.registry') }}</h2>
          </div>
          <button type="button" class="export-btn" @click="store.exportCsv(store.trips)">
            <i class="material-symbols-outlined">download</i>
            Export list
          </button>
        </header>

        <div class="table-scroll">
          <table>
            <thead>
            <tr>
              <th>Trip</th>
              <th>Vehicle</th>
              <th>Driver</th>
              <th>Schedule</th>
              <th>Progress</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
            </thead>
            <tbody>
            <tr v-for="trip in store.trips" :key="trip.id">
              <td>
                <strong>{{ trip.routeName }}</strong>
                <small>{{ trip.code }} · {{ trip.school }}</small>
              </td>
              <td>{{ trip.vehiclePlate }}</td>
              <td>{{ trip.driverName }}</td>
              <td>{{ trip.startTime }} - {{ trip.estimatedEndTime }}</td>
              <td>
                <b>{{ trip.progress }}%</b>
                <span class="mini-progress"><i :style="{ width: trip.progress + '%' }"></i></span>
              </td>
              <td>
                  <span class="table-status" :class="trip.status">
                    {{ trip.status.replace('_', ' ') }}
                  </span>
              </td>
              <td class="table-actions">
                <button type="button" @click="openDetail(trip)"><i class="material-symbols-outlined">visibility</i></button>
                <button type="button" @click="openEdit(trip)"><i class="material-symbols-outlined">edit</i></button>
                <button v-if="trip.status === 'scheduled'" type="button" @click="store.startTrip(trip)">
                  <i class="material-symbols-outlined">play_arrow</i>
                </button>
              </td>
            </tr>
            </tbody>
          </table>
        </div>
      </div>

      <div class="timeline-card panel-card">
        <header class="section-header compact">
          <div>
            <span>{{ t('tripsBc.latestActivity') }}</span>
            <h2>{{ t('tripsBc.timeline') }}</h2>
          </div>
          <small>Today</small>
        </header>
        <div class="timeline-list">
          <article
              v-for="activity in store.activities"
              :key="activity.id"
              :class="activity.status"
          >
            <i></i>
            <div>
              <strong>{{ activity.time }} · {{ activity.title }}</strong>
              <p>{{ activity.description }}</p>
            </div>
          </article>
        </div>
      </div>
    </section>

    <!-- Dialogs -->
    <trip-detail-dialog v-model:visible="showDetailDialog" :trip="viewingTrip" />
    <trip-form-dialog v-model:visible="showFormDialog" :data="editingTrip" @save="onSaveTrip" />
  </main>
</template>

<style scoped>
.trip-page {
  min-height: 100%;
  padding: clamp(24px, 3vw, 40px);
  color: #0f172a;
  display: grid;
  gap: 24px;
}

.trip-hero {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 24px;
  min-height: 178px;
  border-radius: 24px;
  padding: clamp(24px, 3vw, 36px);
  background:
      radial-gradient(circle at 40% 20%, rgba(66, 194, 208, 0.18), transparent 28%),
      radial-gradient(circle at 88% 36%, rgba(250, 191, 61, 0.22), transparent 32%),
      rgba(255, 255, 255, 0.76);
  border: 1px solid rgba(15, 73, 116, 0.08);
  box-shadow: 0 20px 48px rgba(15, 73, 116, 0.08);
}
.trip-hero span, .section-header span {
  color: #1985c7;
  font-weight: 1000;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  font-size: 0.72rem;
}
.trip-hero h1 {
  margin: 10px 0 12px;
  font-size: clamp(2.6rem, 4vw, 4.4rem);
  line-height: 0.94;
  letter-spacing: -0.06em;
}
.trip-hero p { margin: 0; max-width: 760px; color: #64748b; font-weight: 700; font-size: 1rem; }
.trip-hero aside {
  background: #fff;
  border-radius: 18px;
  min-width: 148px;
  text-align: center;
  padding: 18px;
  box-shadow: 0 16px 36px rgba(15, 73, 116, 0.08);
}
.trip-hero aside small { color: #64748b; font-weight: 1000; display: block; }
.trip-hero aside strong { color: #1985c7; font-size: 2.2rem; line-height: 1; }

.kpi-grid { display: grid; grid-template-columns: repeat(5, minmax(0, 1fr)); gap: 20px; }

.operation-warning {
  display: grid;
  grid-template-columns: auto 1fr auto;
  align-items: center;
  gap: 16px;
  padding: 18px 22px;
  border-radius: 18px;
  border: 1px solid #f7c948;
  background: linear-gradient(90deg, #fff8e1, #fff);
}
.operation-warning .material-symbols-outlined { color: #d97706; font-size: 24px; }
.operation-warning strong { color: #92400e; }
.operation-warning p { margin: 4px 0 0; color: #64748b; font-weight: 700; }
.operation-warning button {
  border: 0;
  border-radius: 14px;
  padding: 12px 18px;
  font-weight: 1000;
  color: #fff;
  background: linear-gradient(135deg, #1b8bd1, #0564a8);
  cursor: pointer;
  box-shadow: 0 14px 28px rgba(5, 100, 168, 0.22);
}

.trip-main-grid {
  display: grid;
  grid-template-columns: minmax(0, 1fr) 310px;
  gap: 24px;
  align-items: start;
}
.panel-card {
  border-radius: 22px;
  background: rgba(255, 255, 255, 0.96);
  border: 1px solid rgba(15, 73, 116, 0.08);
  box-shadow: 0 18px 40px rgba(15, 73, 116, 0.08);
  padding: 24px;
}
.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 18px;
  margin-bottom: 18px;
}
.section-header h2 {
  margin: 6px 0 0;
  color: #0f172a;
  font-size: clamp(1.45rem, 2vw, 2rem);
  line-height: 1;
  letter-spacing: -0.04em;
}
.primary-action { display: inline-flex; align-items: center; gap: 8px; }
.primary-action .material-symbols-outlined { font-size: 18px; }

.toolbar-row {
  display: grid;
  grid-template-columns: minmax(280px, 1fr) auto;
  gap: 14px;
  align-items: center;
}
.search-box {
  display: flex;
  align-items: center;
  gap: 10px;
  border: 1px solid #d9e6f2;
  background: #fff;
  border-radius: 16px;
  padding: 0 14px;
  height: 50px;
}
.search-box .material-symbols-outlined { color: #1985c7; }
.search-box input {
  border: 0;
  outline: 0;
  width: 100%;
  font: inherit;
  color: #0f172a;
}
.filter-group, .shift-row { display: flex; flex-wrap: wrap; gap: 10px; }
.shift-row { margin-top: 12px; }
.filter-group button, .shift-row button {
  border: 1px solid #d9e6f2;
  background: #fff;
  color: #334155;
  border-radius: 999px;
  padding: 10px 14px;
  display: inline-flex;
  align-items: center;
  gap: 7px;
  font-weight: 1000;
  text-transform: capitalize;
  cursor: pointer;
}
.filter-group button.active, .shift-row button.active {
  background: #1685c7;
  color: #fff;
  border-color: transparent;
  box-shadow: 0 12px 22px rgba(22, 133, 199, 0.22);
}
.filter-group .material-symbols-outlined,
.shift-row .material-symbols-outlined { font-size: 18px; }
.filter-group button.active .material-symbols-outlined,
.shift-row button.active .material-symbols-outlined { color: #fff; }

.trip-card-grid {
  margin-top: 18px;
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 18px;
}
.empty-state {
  grid-column: 1 / -1;
  min-height: 220px;
  border: 1px dashed #b9d7ec;
  border-radius: 18px;
  display: grid;
  place-items: center;
  align-content: center;
  color: #64748b;
}
.empty-state .material-symbols-outlined { font-size: 44px; color: #1985c7; }
.empty-state strong { color: #0f172a; font-size: 1.2rem; margin-top: 10px; }

.bottom-grid {
  display: grid;
  grid-template-columns: minmax(0, 1fr) 360px;
  gap: 24px;
  align-items: start;
}
.section-header.compact { margin-bottom: 14px; }
.export-btn {
  border: 1px solid #d9e6f2;
  background: #fff;
  color: #0f5f99;
  border-radius: 14px;
  padding: 10px 14px;
  font-weight: 1000;
  display: inline-flex;
  gap: 8px;
  align-items: center;
  cursor: pointer;
}
.export-btn .material-symbols-outlined { font-size: 18px; }

.table-scroll { overflow-x: auto; }
table { width: 100%; border-collapse: collapse; min-width: 860px; }
th {
  text-align: left;
  color: #64748b;
  text-transform: uppercase;
  font-size: 0.72rem;
  letter-spacing: 0.08em;
  background: #f1f7fc;
  padding: 14px;
}
td { padding: 16px 14px; border-bottom: 1px solid #e7eef6; color: #334155; font-weight: 800; }
td strong, td small { display: block; }
td small { color: #64748b; margin-top: 4px; }
.mini-progress {
  display: block;
  width: 120px;
  height: 7px;
  border-radius: 999px;
  background: #e8f2f9;
  overflow: hidden;
  margin-top: 7px;
}
.mini-progress i {
  display: block;
  height: 100%;
  background: linear-gradient(90deg, #1b8bd1, #22c1b6);
}
.table-status {
  text-transform: capitalize;
  border-radius: 999px;
  padding: 8px 14px;
  font-weight: 1000;
}
.table-status.in_progress, .table-status.completed { background: #dcfce7; color: #15803d; }
.table-status.scheduled { background: #e0f2fe; color: #0369a1; }
.table-status.delayed { background: #fef3c7; color: #a16207; }
.table-status.canceled { background: #ffe4e6; color: #be123c; }
.table-actions { display: flex; gap: 8px; }
.table-actions button {
  width: 34px;
  height: 34px;
  border: 0;
  border-radius: 12px;
  background: #e5f4ff;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
}
.table-actions .material-symbols-outlined { font-size: 18px; color: #1985c7; }

.timeline-card small {
  background: #e5f4ff;
  color: #1985c7;
  padding: 8px 12px;
  border-radius: 999px;
  font-weight: 1000;
}
.timeline-list { display: grid; gap: 12px; }
.timeline-list article {
  display: grid;
  grid-template-columns: auto 1fr;
  gap: 12px;
  padding: 16px;
  border-radius: 16px;
  border: 1px solid #e7eef6;
  background: #fff;
}
.timeline-list i {
  width: 10px;
  height: 10px;
  margin-top: 5px;
  border-radius: 50%;
  background: #1985c7;
  box-shadow: 0 0 0 6px #e5f4ff;
}
.timeline-list article.completed i { background: #22c55e; box-shadow: 0 0 0 6px #dcfce7; }
.timeline-list article.pending i { background: #f59e0b; box-shadow: 0 0 0 6px #fef3c7; }
.timeline-list strong { color: #0f172a; }
.timeline-list p { margin: 6px 0 0; color: #64748b; font-weight: 700; }

@media (max-width: 1320px) {
  .kpi-grid { grid-template-columns: repeat(3, 1fr); }
  .trip-main-grid, .bottom-grid { grid-template-columns: 1fr; }
}
@media (max-width: 900px) {
  .trip-page { padding: 20px; }
  .trip-hero { flex-direction: column; align-items: flex-start; }
  .kpi-grid, .trip-card-grid { grid-template-columns: 1fr; }
  .toolbar-row { grid-template-columns: 1fr; }
  .operation-warning { grid-template-columns: 1fr; }
}
</style>