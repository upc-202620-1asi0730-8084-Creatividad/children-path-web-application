<script setup>
import { computed, onMounted, onUnmounted, ref, watch } from 'vue';
import { useI18n } from 'vue-i18n';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import useTrackingStore from '@/tracking/application/tracking.store.js';

const { t } = useI18n();
const store = useTrackingStore();

// ---- Map refs ----
const mapContainer = ref(null);
let map = null;
let markers = [];

// ---- Filters UI ----
const statusFilters = ['all', 'on-route', 'delayed', 'stopped'];

// ---- KPI cards ----
const kpis = computed(() => {
  const s = store.summary;
  return [
    { icon: 'directions_bus',      label: 'trackingBc.kpis.activeUnits',    value: s.activeUnits,              hint: 'trackingBc.kpis.activeUnitsHint',    tone: 'blue' },
    { icon: 'schedule',            label: 'trackingBc.kpis.delayedUnits',   value: s.delayedUnits,             hint: 'trackingBc.kpis.delayedUnitsHint',   tone: 'amber' },
    { icon: 'speed',               label: 'trackingBc.kpis.averageSpeed',   value: `${formatDecimal(s.averageSpeed)} km/h`, hint: 'trackingBc.kpis.averageSpeedHint', tone: 'blue' },
    { icon: 'timeline',            label: 'trackingBc.kpis.routeProgress',  value: `${s.routeProgress}%`,      hint: 'trackingBc.kpis.routeProgressHint',  tone: 'blue' },
    { icon: 'notifications_active',label: 'trackingBc.kpis.activeAlerts',   value: s.activeAlerts,             hint: 'trackingBc.kpis.activeAlertsHint',   tone: 'red' }
  ];
});

// ---- Helpers ----
function formatDecimal(value) {
  if (value === null || value === undefined) return '0.0';
  return Number(value).toFixed(1);
}

function setStatus(s) {
  store.setStatus(s);
}

function selectVehicle(vehicle) {
  store.selectVehicle(vehicle);
  if (map && vehicle) {
    map.setView([vehicle.latitude, vehicle.longitude], 14, { animate: true });
  }
}

// ---- Leaflet ----
function initMap() {
  if (map || !mapContainer.value) return;

  map = L.map(mapContainer.value, {
    zoomControl: true,
    attributionControl: true
  }).setView([-12.105, -77.015], 12);

  const cartoApiKey = import.meta.env.VITE_CARTO_API_KEY;

  L.tileLayer(
      `https://basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}.png?key=${cartoApiKey}`,
      {
        attribution: '&copy; OpenStreetMap & CartoDB',
        maxZoom: 18,
        minZoom: 10
      }
  ).addTo(map);

  map.setMaxBounds([[-12.35, -77.25], [-11.85, -76.70]]);

  updateMarkers(store.filteredVehicles);
  setTimeout(() => map?.invalidateSize(), 200);
}

function updateMarkers(vehicles) {
  if (!map) return;

  markers.forEach((m) => m.remove());
  markers = vehicles.map((vehicle) => {
    const marker = L.marker([vehicle.latitude, vehicle.longitude])
        .bindPopup(`
        <strong>${vehicle.vehicleId}</strong><br>
        ${vehicle.driverName}<br>
        ${vehicle.routeName}<br>
        ETA: ${vehicle.etaMinutes} min
      `)
        .on('click', () => store.selectVehicle(vehicle))
        .addTo(map);
    return marker;
  });

  if (markers.length > 0) {
    const group = L.featureGroup(markers);
    map.fitBounds(group.getBounds().pad(0.18));
    setTimeout(() => map?.invalidateSize(), 80);
  }
}

onMounted(() => {
  store.fetchDashboard().then(() => {
    setTimeout(() => initMap(), 150);
  });
});

onUnmounted(() => {
  markers.forEach((m) => m.remove());
  map?.remove();
  map = null;
});

watch(() => store.filteredVehicles, (newList) => {
  updateMarkers(newList);
});
</script>

<template>
  <section class="tracking-page">
    <!-- Hero -->
    <header class="hero-card">
      <div>
        <p class="eyebrow">{{ t('trackingBc.eyebrow') }}</p>
        <h1>{{ t('trackingBc.title') }}</h1>
        <p>{{ t('trackingBc.subtitle') }}</p>
      </div>
      <div class="hero-score">
        <span>{{ t('trackingBc.signalScore') }}</span>
        <strong>{{ store.summary.gpsSignal }}%</strong>
      </div>
    </header>

    <!-- KPIs -->
    <section class="kpi-grid">
      <article v-for="kpi in kpis" :key="kpi.label" class="kpi-card">
        <span class="icon-wrap" :class="kpi.tone">
          <i class="material-symbols-outlined">{{ kpi.icon }}</i>
        </span>
        <p>{{ t(kpi.label) }}</p>
        <strong>{{ kpi.value }}</strong>
        <small>{{ t(kpi.hint) }}</small>
      </article>
    </section>

    <!-- Toolbar -->
    <section class="tracking-toolbar">
      <div class="search-box">
        <i class="material-symbols-outlined">search</i>
        <input
            type="search"
            :placeholder="t('trackingBc.search')"
            :value="store.query"
            @input="store.setQuery($event.target.value)"
        />
      </div>
      <div class="filter-group">
        <button
            v-for="s in statusFilters"
            :key="s"
            type="button"
            :class="{ active: store.status === s }"
            @click="setStatus(s)"
        >
          <i class="material-symbols-outlined">
            {{ s === 'all' ? 'public' : s === 'on-route' ? 'near_me' : s === 'delayed' ? 'schedule' : 'pause_circle' }}
          </i>
          {{ t('trackingBc.filters.' + (s === 'on-route' ? 'onRoute' : s)) }}
        </button>
      </div>
      <pv-button class="primary-action" @click="store.fetchDashboard">
        <i class="material-symbols-outlined" :class="{ spin: store.isRefreshing }">sync</i>
        {{ t('trackingBc.refresh') }}
      </pv-button>
    </section>

    <!-- Map + Unit list -->
    <section class="content-grid">
      <article class="panel map-panel">
        <div class="panel-header">
          <div>
            <p class="eyebrow">{{ t('trackingBc.liveOperation') }}</p>
            <h2>{{ t('trackingBc.mapTitle') }}</h2>
          </div>
          <span class="live-pill"><span></span>{{ t('trackingBc.liveTracking') }}</span>
        </div>

        <div class="map-layout">
          <div ref="mapContainer" class="leaflet-map"></div>

          <aside v-if="store.selectedVehicle" class="selected-unit">
            <div class="vehicle-head">
              <span class="avatar">{{ store.selectedVehicle.shortId }}</span>
              <div>
                <h3>{{ store.selectedVehicle.vehicleId }}</h3>
                <p>{{ store.selectedVehicle.routeName }}</p>
              </div>
              <span class="status-chip" :class="store.statusBadgeClass(store.selectedVehicle.status)">
                {{ t(store.statusText(store.selectedVehicle.status)) }}
              </span>
            </div>

            <div class="detail-grid">
              <div><span>{{ t('trackingBc.unit.driver') }}</span><strong>{{ store.selectedVehicle.driverName }}</strong></div>
              <div><span>{{ t('trackingBc.unit.district') }}</span><strong>{{ store.selectedVehicle.district }}</strong></div>
              <div><span>{{ t('trackingBc.unit.nextStop') }}</span><strong>{{ store.selectedVehicle.nextStop }}</strong></div>
              <div><span>{{ t('trackingBc.unit.eta') }}</span><strong>{{ store.selectedVehicle.etaMinutes }} min</strong></div>
            </div>

            <div class="progress-line">
              <div class="progress-title">
                <span>{{ t('trackingBc.unit.progress') }}</span>
                <strong>{{ store.selectedVehicle.progressPercent }}%</strong>
              </div>
              <div class="bar">
                <span :style="{ width: store.selectedVehicle.progressPercent + '%' }"></span>
              </div>
            </div>

            <div class="signal-row">
              <span><i class="material-symbols-outlined">gps_fixed</i>{{ store.selectedVehicle.signalStrength }}% GPS</span>
              <span><i class="material-symbols-outlined">speed</i>{{ formatDecimal(store.selectedVehicle.speedKmh) }} km/h</span>
            </div>
          </aside>
        </div>
      </article>

      <aside class="panel unit-list-panel">
        <div class="panel-header compact">
          <div>
            <p class="eyebrow">{{ t('trackingBc.unitsEyebrow') }}</p>
            <h2>{{ t('trackingBc.unitsTitle') }}</h2>
          </div>
          <span class="count-pill">{{ store.filteredVehicles.length }}</span>
        </div>

        <div class="unit-list">
          <button
              v-for="vehicle in store.filteredVehicles"
              :key="vehicle.id"
              type="button"
              class="unit-card"
              :class="{ selected: store.selectedVehicle?.id === vehicle.id }"
              @click="selectVehicle(vehicle)"
          >
            <span class="unit-dot" :class="store.statusBadgeClass(vehicle.status)"></span>
            <div>
              <strong>{{ vehicle.vehicleId }}</strong>
              <small>{{ vehicle.driverName }} · {{ vehicle.etaMinutes }} min ETA</small>
              <small>{{ vehicle.routeName }}</small>
            </div>
            <i class="material-symbols-outlined">chevron_right</i>
          </button>

          <p v-if="store.filteredVehicles.length === 0" class="empty-state">
            {{ t('trackingBc.empty') }}
          </p>
        </div>
      </aside>
    </section>

    <!-- Alerts + Activity -->
    <section class="lower-grid">
      <article class="panel">
        <div class="panel-header">
          <div>
            <p class="eyebrow">{{ t('trackingBc.alertsEyebrow') }}</p>
            <h2>{{ t('trackingBc.alertsTitle') }}</h2>
          </div>
          <span class="count-pill">{{ store.alerts.length }} {{ t('trackingBc.items') }}</span>
        </div>

        <div class="alert-list">
          <article
              v-for="alert in store.alerts"
              :key="alert.id"
              class="alert-card"
              :class="alert.severity"
          >
            <i class="material-symbols-outlined">{{ store.alertIcon(alert.type) }}</i>
            <div>
              <h3>{{ alert.title }}</h3>
              <p>{{ alert.description }}</p>
              <small>{{ alert.vehicleId }} · {{ alert.time }}</small>
            </div>
            <span>{{ alert.severity }}</span>
          </article>
        </div>
      </article>

      <article class="panel">
        <div class="panel-header">
          <div>
            <p class="eyebrow">{{ t('trackingBc.activityEyebrow') }}</p>
            <h2>{{ t('trackingBc.activityTitle') }}</h2>
          </div>
          <span class="count-pill">{{ t('trackingBc.today') }}</span>
        </div>
        <div class="timeline-list">
          <article
              v-for="activity in store.activities"
              :key="activity.id"
              class="timeline-item"
              :class="activity.status"
          >
            <span class="timeline-dot"></span>
            <div>
              <small>{{ activity.time }}</small>
              <h3>{{ activity.title }}</h3>
              <p>{{ activity.description }}</p>
            </div>
          </article>
        </div>
      </article>
    </section>

    <!-- Registry -->
    <section class="panel registry-panel">
      <div class="panel-header">
        <div>
          <p class="eyebrow">{{ t('trackingBc.recordsEyebrow') }}</p>
          <h2>{{ t('trackingBc.recordsTitle') }}</h2>
        </div>
        <button class="ghost-action" type="button" @click="store.exportCsv">
          <i class="material-symbols-outlined">download</i>
          {{ t('trackingBc.export') }}
        </button>
      </div>

      <div class="table-wrap">
        <table>
          <thead>
          <tr>
            <th>{{ t('trackingBc.table.vehicle') }}</th>
            <th>{{ t('trackingBc.table.driver') }}</th>
            <th>{{ t('trackingBc.table.route') }}</th>
            <th>{{ t('trackingBc.table.speed') }}</th>
            <th>{{ t('trackingBc.table.progress') }}</th>
            <th>{{ t('trackingBc.table.status') }}</th>
            <th>{{ t('trackingBc.table.updated') }}</th>
            <th>{{ t('trackingBc.table.actions') }}</th>
          </tr>
          </thead>
          <tbody>
          <tr v-for="vehicle in store.filteredVehicles" :key="vehicle.id">
            <td>
              <strong>{{ vehicle.vehicleId }}</strong>
              <small>{{ vehicle.plate }} · {{ vehicle.district }}</small>
            </td>
            <td>{{ vehicle.driverName }}</td>
            <td>{{ vehicle.routeName }}</td>
            <td>{{ formatDecimal(vehicle.speedKmh) }} km/h</td>
            <td>
              <div class="table-progress">
                <span :style="{ width: vehicle.progressPercent + '%' }"></span>
              </div>
              {{ vehicle.progressPercent }}%
            </td>
            <td>
                <span class="status-chip" :class="store.statusBadgeClass(vehicle.status)">
                  {{ t(store.statusText(vehicle.status)) }}
                </span>
            </td>
            <td>{{ vehicle.lastUpdate }}</td>
            <td>
              <button type="button" class="icon-action" @click="selectVehicle(vehicle)">
                <i class="material-symbols-outlined">my_location</i>
              </button>
            </td>
          </tr>
          </tbody>
        </table>
      </div>
    </section>
  </section>
</template>

<style scoped>
.tracking-page {
  display: flex;
  flex-direction: column;
  gap: 1.6rem;
}

.hero-card,
.panel,
.kpi-card {
  background: var(--kw-card);
  border: 1px solid var(--kw-border);
  box-shadow: var(--kw-shadow);
  backdrop-filter: blur(18px);
}

.hero-card {
  min-height: 150px;
  border-radius: 26px;
  padding: 2.1rem 2.3rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 2rem;
  background:
      radial-gradient(circle at 57% 0%, rgba(57, 195, 202, 0.2), transparent 32%),
      radial-gradient(circle at 97% 44%, rgba(255, 181, 46, 0.22), transparent 28%),
      rgba(255, 255, 255, 0.88);
}
.eyebrow {
  color: var(--kw-blue-700);
  font-size: 0.74rem;
  font-weight: 900;
  letter-spacing: 0.14em;
  margin: 0 0 0.25rem;
  text-transform: uppercase;
}
.hero-card h1,
.panel h2 {
  margin: 0;
  color: #101827;
  letter-spacing: -0.06em;
}
.hero-card h1 {
  font-size: clamp(2.2rem, 5vw, 4rem);
  line-height: 0.95;
}
.hero-card p:not(.eyebrow) {
  color: var(--kw-muted);
  font-size: 1rem;
  margin: 0.9rem 0 0;
  max-width: 760px;
}
.hero-score {
  min-width: 150px;
  border-radius: 20px;
  padding: 1rem 1.2rem;
  text-align: center;
  background: rgba(255, 255, 255, 0.9);
  box-shadow: 0 16px 35px rgba(21, 104, 159, 0.1);
}
.hero-score span { display: block; font-size: 0.78rem; font-weight: 800; color: var(--kw-muted); }
.hero-score strong { color: var(--kw-blue-700); display: block; font-size: 2.2rem; line-height: 1; }

.kpi-grid {
  display: grid;
  grid-template-columns: repeat(5, minmax(170px, 1fr));
  gap: 1rem;
}
.kpi-card {
  border-radius: 18px;
  min-height: 126px;
  overflow: hidden;
  padding: 1.2rem;
  position: relative;
}
.kpi-card::after {
  background: rgba(34, 131, 198, 0.12);
  border-radius: 999px;
  bottom: -24px;
  content: '';
  height: 72px;
  position: absolute;
  right: -22px;
  width: 72px;
}
.icon-wrap {
  align-items: center;
  background: #e1f2ff;
  border-radius: 12px;
  color: var(--kw-blue-700);
  display: inline-flex;
  height: 36px;
  justify-content: center;
  width: 36px;
}
.icon-wrap.amber { background: #fff1cf; color: #cc8500; }
.icon-wrap.red { background: #ffe1e1; color: #ef4444; }
.kpi-card p { font-size: 0.84rem; font-weight: 800; margin: 0.8rem 0 0.2rem; color: var(--kw-muted); }
.kpi-card strong { color: #111827; display: block; font-size: 2rem; line-height: 1; }
.kpi-card small { display: block; font-weight: 600; margin-top: 0.45rem; color: var(--kw-muted); }

.tracking-toolbar {
  align-items: center;
  display: grid;
  gap: 0.8rem;
  grid-template-columns: minmax(250px, 1fr) auto auto;
}
.search-box {
  align-items: center;
  background: var(--kw-card);
  border: 1px solid var(--kw-border);
  border-radius: 16px;
  display: flex;
  gap: 0.6rem;
  min-height: 48px;
  padding: 0 1rem;
}
.search-box .material-symbols-outlined { color: var(--kw-blue-700); }
.search-box input {
  background: transparent;
  border: 0;
  color: var(--kw-ink);
  outline: none;
  width: 100%;
}
.filter-group { display: flex; flex-wrap: wrap; gap: 0.5rem; }
.filter-group button {
  align-items: center;
  border: 1px solid var(--kw-border);
  border-radius: 999px;
  background: rgba(255, 255, 255, 0.82);
  color: #43536a;
  cursor: pointer;
  display: inline-flex;
  font-weight: 900;
  gap: 0.35rem;
  min-height: 42px;
  padding: 0 0.9rem;
}
.filter-group button.active {
  background: linear-gradient(135deg, #1788d5, #0067ba);
  color: white;
  border-color: transparent;
  box-shadow: 0 14px 25px rgba(0, 103, 186, 0.2);
}
.primary-action { display: inline-flex; align-items: center; gap: 6px; }
.spin { animation: spin 1s linear infinite; }
@keyframes spin { to { transform: rotate(360deg); } }

.content-grid {
  display: grid;
  gap: 1.2rem;
  grid-template-columns: minmax(0, 2.2fr) minmax(300px, 0.8fr);
}
.lower-grid {
  display: grid;
  gap: 1.2rem;
  grid-template-columns: minmax(0, 1fr) minmax(320px, 0.78fr);
}
.panel {
  border-radius: 22px;
  padding: 1.25rem;
}
.panel-header {
  align-items: center;
  display: flex;
  justify-content: space-between;
  gap: 1rem;
  margin-bottom: 1rem;
}
.panel-header.compact { margin-bottom: 0.75rem; }
.panel h2 { font-size: clamp(1.45rem, 2vw, 2rem); }
.count-pill, .live-pill {
  align-items: center;
  border-radius: 999px;
  display: inline-flex;
  font-size: 0.78rem;
  font-weight: 900;
  gap: 0.35rem;
  padding: 0.5rem 0.75rem;
}
.count-pill { background: #e3f3ff; color: var(--kw-blue-700); }
.live-pill { background: #dffbea; color: #059669; }
.live-pill span {
  background: #22c55e;
  border-radius: 999px;
  height: 8px;
  width: 8px;
}

.map-layout {
  display: grid;
  gap: 1rem;
  grid-template-columns: minmax(0, 1.7fr) minmax(290px, 0.75fr);
}
.leaflet-map {
  background: #dcebf4;
  border-radius: 18px;
  height: 440px;
  overflow: hidden;
  width: 100%;
}

.selected-unit,
.unit-card,
.alert-card,
.timeline-item {
  background: rgba(255, 255, 255, 0.72);
  border: 1px solid var(--kw-border);
  border-radius: 18px;
}

.selected-unit { padding: 1rem; }
.vehicle-head {
  align-items: center;
  display: flex;
  gap: 0.75rem;
  margin-bottom: 1rem;
}
.avatar {
  align-items: center;
  background: linear-gradient(135deg, #1687d5, #0067ba);
  border-radius: 14px;
  color: white;
  display: inline-flex;
  font-weight: 900;
  height: 46px;
  justify-content: center;
  width: 46px;
}
.vehicle-head h3 { margin: 0; }
.vehicle-head p { margin: 0.2rem 0 0; color: var(--kw-muted); }
.status-chip {
  border-radius: 999px;
  font-size: 0.74rem;
  font-weight: 900;
  margin-left: auto;
  padding: 0.4rem 0.62rem;
  text-transform: capitalize;
}
.status-on-route { background: #d8fce6; color: #047857; }
.status-delayed { background: #fff0c2; color: #b45309; }
.status-stopped { background: #e3f3ff; color: #0a68a5; }
.status-offline { background: #fee2e2; color: #dc2626; }

.detail-grid {
  display: grid;
  gap: 0.7rem;
  grid-template-columns: 1fr 1fr;
}
.detail-grid div { background: #f4f8fb; border-radius: 14px; padding: 0.8rem; }
.detail-grid span, .progress-title span {
  display: block;
  font-size: 0.75rem;
  font-weight: 800;
  color: var(--kw-muted);
}
.detail-grid strong { display: block; margin-top: 0.25rem; }

.progress-line { margin-top: 1rem; }
.progress-title { display: flex; justify-content: space-between; margin-bottom: 0.4rem; }
.bar, .table-progress {
  background: #e5f1f9;
  border-radius: 999px;
  height: 9px;
  overflow: hidden;
}
.bar span, .table-progress span {
  background: linear-gradient(90deg, #1687d5, #22c6b7);
  border-radius: inherit;
  display: block;
  height: 100%;
}

.signal-row { display: flex; flex-wrap: wrap; gap: 0.8rem; margin-top: 1rem; }
.signal-row span {
  align-items: center;
  display: inline-flex;
  font-weight: 900;
  gap: 0.35rem;
  color: var(--kw-muted);
}

.unit-list { display: flex; flex-direction: column; gap: 0.7rem; }
.unit-card {
  align-items: center;
  color: var(--kw-ink);
  display: grid;
  gap: 0.75rem;
  grid-template-columns: auto 1fr auto;
  padding: 0.85rem;
  text-align: left;
  width: 100%;
  cursor: pointer;
}
.unit-card.selected {
  border-color: rgba(34, 131, 198, 0.45);
  box-shadow: 0 12px 24px rgba(34, 131, 198, 0.12);
}
.unit-dot {
  border-radius: 999px;
  height: 13px;
  width: 13px;
}
.unit-dot.status-on-route { background: #22c55e; }
.unit-dot.status-delayed { background: #f59e0b; }
.unit-dot.status-stopped { background: #1687d5; }
.unit-dot.status-offline { background: #ef4444; }
.unit-card small { color: var(--kw-muted); display: block; font-weight: 700; margin-top: 0.15rem; }

.alert-list, .timeline-list { display: flex; flex-direction: column; gap: 0.85rem; }
.alert-card {
  align-items: center;
  display: grid;
  gap: 0.8rem;
  grid-template-columns: auto 1fr auto;
  padding: 0.95rem;
}
.alert-card .material-symbols-outlined {
  background: #fff2cf;
  border-radius: 14px;
  color: #e09700;
  padding: 0.45rem;
}
.alert-card.high { border-left: 4px solid #ef4444; }
.alert-card.medium { border-left: 4px solid #f59e0b; }
.alert-card.low { border-left: 4px solid #22c55e; }
.alert-card h3, .timeline-item h3 { font-size: 0.94rem; margin: 0; }
.alert-card p, .timeline-item p { color: var(--kw-muted); margin: 0.15rem 0; }
.alert-card > span:last-child {
  border-radius: 999px;
  font-size: 0.72rem;
  font-weight: 900;
  padding: 0.35rem 0.55rem;
  text-transform: capitalize;
}
.alert-card.high > span:last-child { background: #fee2e2; color: #dc2626; }
.alert-card.medium > span:last-child { background: #fff1c7; color: #b45309; }
.alert-card.low > span:last-child { background: #dcfce7; color: #047857; }

.timeline-item {
  display: grid;
  gap: 0.75rem;
  grid-template-columns: auto 1fr;
  padding: 0.95rem;
}
.timeline-dot {
  border-radius: 999px;
  height: 12px;
  margin-top: 0.3rem;
  width: 12px;
}
.timeline-item.completed .timeline-dot { background: #22c55e; }
.timeline-item.active .timeline-dot { background: #1687d5; }
.timeline-item.pending .timeline-dot { background: #f59e0b; }

.table-wrap { overflow-x: auto; }
table { border-collapse: collapse; min-width: 1000px; width: 100%; }
th {
  background: #f0f6fb;
  color: #607089;
  font-size: 0.74rem;
  letter-spacing: 0.08em;
  padding: 0.9rem 1rem;
  text-align: left;
  text-transform: uppercase;
}
td {
  border-top: 1px solid var(--kw-border);
  color: #1f3758;
  font-weight: 700;
  padding: 0.95rem 1rem;
  vertical-align: middle;
}
td small { display: block; margin-top: 0.2rem; color: var(--kw-muted); }
.table-progress {
  display: inline-block;
  margin-right: 0.45rem;
  min-width: 110px;
  vertical-align: middle;
}
.icon-action {
  background: #e3f3ff;
  border: 0;
  border-radius: 12px;
  color: var(--kw-blue-700);
  height: 36px;
  width: 36px;
  display: inline-grid;
  place-items: center;
  cursor: pointer;
}
.empty-state { color: var(--kw-muted); font-weight: 800; text-align: center; }

:deep(.leaflet-control-attribution) { font-size: 10px; }

@media (max-width: 1280px) {
  .kpi-grid { grid-template-columns: repeat(3, 1fr); }
  .content-grid, .lower-grid { grid-template-columns: 1fr; }
  .map-layout { grid-template-columns: 1fr; }
}
@media (max-width: 860px) {
  .tracking-page { padding: 1rem; }
  .hero-card { align-items: flex-start; flex-direction: column; }
  .kpi-grid { grid-template-columns: 1fr; }
  .tracking-toolbar { grid-template-columns: 1fr; }
  .leaflet-map { height: 360px; }
}
@media (max-width: 560px) {
  .detail-grid { grid-template-columns: 1fr; }
  .filter-group button { flex: 1 1 100%; justify-content: center; }
}
</style>