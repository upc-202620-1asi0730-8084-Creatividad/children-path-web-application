<script setup>
import { onMounted, onUnmounted, ref, watch } from 'vue';
import { useI18n } from 'vue-i18n';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

const props = defineProps({
  vehicles: { type: Array, required: true }
});

const { t } = useI18n();

const mapElement = ref(null);
const isLoading = ref(true);

let map = null;
let markers = [];

const statusColor = {
  'on-route': '#22c55e',
  delayed: '#f59e0b',
  stopped: '#64748b',
  emergency: '#ef4444',
  available: '#2283c6'
};

function initMap() {
  if (map || !mapElement.value) return;

  map = L.map(mapElement.value, {
    zoomControl: true,
    attributionControl: true,
    scrollWheelZoom: false
  }).setView([-12.071, -77.041], 12);

  const cartoApiKey = import.meta.env.VITE_CARTO_API_KEY;

  L.tileLayer(
      `https://basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}.png?key=${cartoApiKey}`,
      {
        attribution: '&copy; OpenStreetMap & CartoDB',
        maxZoom: 18,
        minZoom: 10
      }
  ).addTo(map);
}

function updateMarkers() {
  if (!map) return;

  markers.forEach((marker) => marker.remove());
  markers = props.vehicles.map((vehicle) => {
    const color = statusColor[vehicle.status] ?? '#2283c6';
    const icon = L.divIcon({
      className: '',
      html: `<div class="kw-vehicle-marker" style="background:${color}">⌁</div>`,
      iconSize: [28, 28],
      iconAnchor: [14, 14]
    });

    return L.marker([vehicle.lat, vehicle.lng], { icon })
        .bindPopup(`
        <strong>${vehicle.plate}</strong><br>
        ${vehicle.driverName}<br>
        ${vehicle.route}<br>
        ETA: ${vehicle.etaMinutes} min
      `)
        .addTo(map);
  });

  if (markers.length > 1) {
    const bounds = L.featureGroup(markers).getBounds().pad(0.25);
    map.fitBounds(bounds, { animate: false, maxZoom: 13 });
  } else if (markers.length === 1) {
    const latLng = markers[0].getLatLng();
    map.setView(latLng, 13, { animate: false });
  }
}

onMounted(() => {
  setTimeout(() => {
    initMap();
    updateMarkers();
    map?.invalidateSize(true);
    isLoading.value = false;
  }, 80);
});

onUnmounted(() => {
  markers.forEach((marker) => marker.remove());
  map?.remove();
  map = null;
});

watch(() => props.vehicles, () => {
  updateMarkers();
  setTimeout(() => map?.invalidateSize(true), 60);
}, { deep: true });
</script>

<template>
  <section class="map-card">
    <div class="map-header">
      <div>
        <p>{{ t('dashboardPage.map.eyebrow') }}</p>
        <h2>{{ t('dashboardPage.map.title') }}</h2>
      </div>
      <span class="live-pill"><span></span>{{ t('dashboardPage.map.live') }}</span>
    </div>

    <div class="map-layout">
      <div class="map-wrapper">
        <div v-if="isLoading" class="map-loading">
          <i class="material-symbols-outlined">map</i>
          <strong>{{ t('dashboardPage.map.loading') }}</strong>
        </div>
        <div ref="mapElement" class="map-container" :class="{ 'is-hidden': isLoading }"></div>
      </div>

      <aside class="vehicle-panel">
        <div class="vehicle-panel-header">
          <strong>{{ t('dashboardPage.map.activeUnits') }}</strong>
          <span>{{ vehicles.length }}</span>
        </div>
        <article
            v-for="vehicle in vehicles"
            :key="vehicle.id"
            class="vehicle-item"
            :class="vehicle.status"
        >
          <div class="vehicle-dot"></div>
          <div>
            <strong>{{ vehicle.plate }}</strong>
            <p>{{ vehicle.route }}</p>
            <small>{{ vehicle.driverName }} · ETA {{ vehicle.etaMinutes }} min</small>
          </div>
        </article>
      </aside>
    </div>
  </section>
</template>

<style scoped>
.map-card {
  height: 100%;
  border: 1px solid var(--kw-border);
  border-radius: 24px;
  background: var(--kw-card);
  box-shadow: var(--kw-shadow);
  padding: 1.2rem;
  overflow: hidden;
}

.map-header {
  display: flex;
  justify-content: space-between;
  gap: 1rem;
  align-items: flex-start;
  margin-bottom: 1rem;
}
.map-header p {
  margin: 0 0 .25rem;
  color: var(--kw-blue-700);
  font-weight: 900;
  font-size: .78rem;
  letter-spacing: .12em;
  text-transform: uppercase;
}
.map-header h2 { margin: 0; font-size: clamp(1.25rem, 1.9vw, 1.8rem); }

.live-pill {
  display: inline-flex;
  align-items: center;
  gap: .45rem;
  border-radius: 999px;
  background: rgba(34,197,94,.12);
  color: #166534;
  font-weight: 900;
  padding: .35rem .75rem;
  font-size: .75rem;
  white-space: nowrap;
}
.live-pill span {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: #22c55e;
  box-shadow: 0 0 0 6px rgba(34,197,94,.13);
}

.map-layout {
  display: grid;
  grid-template-columns: minmax(0, 1fr) 320px;
  gap: 1rem;
  align-items: stretch;
}

.map-wrapper {
  position: relative;
  min-height: 420px;
  border-radius: 20px;
  overflow: hidden;
  border: 1px solid rgba(17,24,39,.07);
  background: linear-gradient(135deg, #e8f4fb, #fff8e7);
}

.map-container { height: 420px; width: 100%; z-index: 1; }
.map-container.is-hidden { opacity: 0; }

.map-loading {
  position: absolute;
  inset: 0;
  display: grid;
  place-items: center;
  align-content: center;
  gap: .4rem;
  color: var(--kw-muted);
  background: linear-gradient(135deg, #e8f4fb, #fff8e7);
  z-index: 2;
}
.map-loading .material-symbols-outlined { color: var(--kw-blue-700); font-size: 42px; }

.vehicle-panel {
  border-radius: 20px;
  padding: 1rem;
  background: rgba(248,251,255,.78);
  border: 1px solid rgba(17,24,39,.06);
  display: grid;
  gap: .8rem;
  align-content: start;
}
body.dark-theme .vehicle-panel { background: rgba(255,255,255,.04); }

.vehicle-panel-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  color: var(--kw-ink);
  margin-bottom: .1rem;
}
.vehicle-panel-header span {
  width: 28px;
  height: 28px;
  border-radius: 50%;
  display: grid;
  place-items: center;
  color: white;
  background: var(--kw-blue-700);
  font-weight: 900;
  font-size: .76rem;
}

.vehicle-item {
  display: grid;
  grid-template-columns: 12px 1fr;
  gap: .7rem;
  padding: .85rem;
  border-radius: 16px;
  background: rgba(255,255,255,.82);
  border: 1px solid rgba(17,24,39,.06);
}
body.dark-theme .vehicle-item { background: rgba(255,255,255,.05); }
.vehicle-dot { width: 11px; height: 11px; border-radius: 50%; margin-top: .25rem; background: #22c55e; box-shadow: 0 0 0 5px rgba(34,197,94,.12); }
.vehicle-item.delayed .vehicle-dot { background: #f59e0b; box-shadow: 0 0 0 5px rgba(245,158,11,.13); }
.vehicle-item.stopped .vehicle-dot { background: #64748b; box-shadow: 0 0 0 5px rgba(100,116,139,.13); }
.vehicle-item.emergency .vehicle-dot { background: #ef4444; box-shadow: 0 0 0 5px rgba(239,68,68,.14); }

.vehicle-item strong { font-size: .9rem; }
.vehicle-item p { margin: .18rem 0 .25rem; color: var(--kw-muted); font-size: .78rem; }
.vehicle-item small { color: var(--kw-muted); font-weight: 700; font-size: .72rem; }

/* Leaflet custom marker */
:deep(.kw-vehicle-marker) {
  width: 28px;
  height: 28px;
  border-radius: 50%;
  border: 3px solid #fff;
  box-shadow: 0 10px 24px rgba(15,43,87,.25);
  display: grid;
  place-items: center;
  color: #fff;
  font-size: 16px;
  font-weight: 900;
}

:deep(.leaflet-control-attribution) { font-size: 10px; }

@media (max-width: 1100px) {
  .map-layout { grid-template-columns: 1fr; }
  .vehicle-panel { grid-template-columns: repeat(3, minmax(0, 1fr)); }
  .vehicle-panel-header { grid-column: 1 / -1; }
}
@media (max-width: 760px) {
  .map-wrapper, .map-container { min-height: 340px; height: 340px; }
  .vehicle-panel { grid-template-columns: 1fr; }
}
</style>