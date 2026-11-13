<script setup>
import { onMounted, onUnmounted, ref, watch } from 'vue';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

const props = defineProps({
  routes: { type: Array, default: () => [] }
});

const mapContainer = ref(null);
let map = null;
let layers = [];

const cartoApiKey = import.meta.env.VITE_CARTO_API_KEY;

/**
 * Iconos personalizados según tipo de checkpoint.
 */
function getCheckpointIcon(type, color) {
  const symbols = {
    pickup: '🏠',
    school: '🎓',
    checkpoint: '📍'
  };

  return L.divIcon({
    className: '',
    html: `
      <div class="kw-checkpoint-marker" style="background: ${color}">
        <span>${symbols[type] ?? '📍'}</span>
      </div>
    `,
    iconSize: [36, 36],
    iconAnchor: [18, 18],
    popupAnchor: [0, -18]
  });
}

/**
 * Icono para el destino final.
 */
function getSchoolIcon(color) {
  return L.divIcon({
    className: '',
    html: `
      <div class="kw-school-marker" style="background: ${color}">
        <span>🎓</span>
      </div>
    `,
    iconSize: [44, 44],
    iconAnchor: [22, 22],
    popupAnchor: [0, -22]
  });
}

function initMap() {
  if (map || !mapContainer.value) return;

  map = L.map(mapContainer.value, {
    zoomControl: true,
    attributionControl: true,
    scrollWheelZoom: false
  }).setView([-12.1000, -77.0100], 12);

  const cartoApiKey = import.meta.env.VITE_CARTO_API_KEY;

  L.tileLayer(
      `https://basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}.png?key=${cartoApiKey}`,
      {
        attribution: '&copy; OpenStreetMap & CartoDB',
        maxZoom: 18,
        minZoom: 10
      }
  ).addTo(map);

  map.setMaxBounds([
    [-12.35, -77.25],
    [-11.85, -76.70]
  ]);

  drawRoutes();
  setTimeout(() => map?.invalidateSize(), 200);
}

/**
 * Limpia todas las capas actuales.
 */
function clearLayers() {
  layers.forEach((layer) => layer.remove());
  layers = [];
}

/**
 * Dibuja las rutas.
 */
function drawRoutes() {
  if (!map) return;

  clearLayers();

  props.routes.forEach((route) => {
    if (route.coordinates && route.coordinates.length > 1) {
      const latLngs = route.coordinates.map((c) => [c.lat, c.lng]);

      const polyline = L.polyline(latLngs, {
        color: route.color || '#1b83c9',
        weight: 5,
        opacity: 0.85,
        lineCap: 'round',
        lineJoin: 'round'
      })
          .bindPopup(`
          <div style="font-family: system-ui; padding: 4px;">
            <strong style="color: ${route.color}">${route.code} · ${route.name}</strong><br>
            <small>${route.district} · ${route.stops} paradas · ${route.estimatedDuration}</small><br>
            <small>Conductor: ${route.assignedDriver}</small>
          </div>
        `)
          .addTo(map);

      layers.push(polyline);
    }

    if (route.checkpoints && route.checkpoints.length > 0) {
      route.checkpoints.forEach((checkpoint) => {
        const isSchool = checkpoint.type === 'school';
        const icon = isSchool
            ? getSchoolIcon(route.color)
            : getCheckpointIcon(checkpoint.type, route.color);

        const marker = L.marker([checkpoint.lat, checkpoint.lng], { icon })
            .bindPopup(`
            <div style="font-family: system-ui; padding: 4px;">
              <strong>${checkpoint.name}</strong><br>
              <small>${isSchool ? '🏫 Colegio destino' : checkpoint.type === 'pickup' ? '🏠 Punto de recojo' : '📍 Punto de paso'}</small><br>
              <small>Ruta: ${route.code}</small>
            </div>
          `)
            .addTo(map);

        layers.push(marker);
      });
    }
  });

  if (layers.length > 0) {
    const group = L.featureGroup(layers);
    map.fitBounds(group.getBounds().pad(0.15));
  }
}

onMounted(() => {
  setTimeout(() => {
    initMap();
    drawRoutes();
  }, 100);
});

onUnmounted(() => {
  clearLayers();
  map?.remove();
  map = null;
});

// Re-dibujar
watch(
    () => props.routes,
    () => {
      drawRoutes();
      setTimeout(() => map?.invalidateSize(), 80);
    },
    { deep: true }
);
</script>

<template>
  <section class="map-card">
    <header>
      <div>
        <p>ROUTE COVERAGE</p>
        <h2>Service coverage map</h2>
      </div>
      <span><i class="material-symbols-outlined">near_me</i> Planning view</span>
    </header>

    <div ref="mapContainer" class="leaflet-map"></div>

    <div class="route-mini-list">
      <article v-for="route in routes.slice(0, 3)" :key="route.id">
        <span :style="{ background: route.color }"></span>
        <div>
          <strong>{{ route.code }}</strong>
          <p>{{ route.name }}</p>
        </div>
        <small>{{ route.coveragePercentage }}%</small>
      </article>
    </div>
  </section>
</template>

<style scoped>
.map-card {
  padding: 24px;
  border: 1px solid #e3edf7;
  border-radius: 20px;
  background: rgba(255, 255, 255, 0.94);
  box-shadow: 0 18px 38px rgba(7, 47, 80, 0.08);
}

header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 16px;
  margin-bottom: 18px;
}
header p {
  margin: 0 0 4px;
  color: #1b83c9;
  font-size: 0.72rem;
  font-weight: 950;
  letter-spacing: 0.12em;
}
h2 {
  margin: 0;
  color: #10192d;
  font-size: clamp(1.35rem, 2vw, 1.8rem);
  font-weight: 950;
}
header > span {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 8px 12px;
  border-radius: 999px;
  background: #dcfce7;
  color: #15803d;
  font-size: 0.78rem;
  font-weight: 950;
}
header .material-symbols-outlined { font-size: 18px; }

.leaflet-map {
  height: 380px;
  width: 100%;
  border-radius: 18px;
  overflow: hidden;
  border: 1px solid #dbe9f5;
  background: #edf6fb;
  z-index: 1;
}

.route-mini-list {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 12px;
  margin-top: 14px;
}
.route-mini-list article {
  display: grid;
  grid-template-columns: auto 1fr auto;
  gap: 10px;
  align-items: center;
  padding: 12px;
  border: 1px solid #e8eff7;
  border-radius: 14px;
  background: #ffffff;
}
.route-mini-list article > span {
  width: 10px;
  height: 10px;
  border-radius: 999px;
}
.route-mini-list strong {
  color: #11365b;
  font-size: 0.84rem;
  font-weight: 950;
}
.route-mini-list p {
  margin: 2px 0 0;
  color: #6b7890;
  font-size: 0.72rem;
  font-weight: 700;
}
.route-mini-list small { color: #0f5284; font-weight: 950; }

/* Marcadores personalizados */
:deep(.kw-checkpoint-marker),
:deep(.kw-school-marker) {
  display: grid;
  place-items: center;
  border-radius: 50%;
  border: 3px solid #fff;
  box-shadow: 0 10px 24px rgba(15, 43, 87, 0.25);
  font-size: 16px;
  color: #fff;
}
:deep(.kw-school-marker) {
  font-size: 20px;
}

@media (max-width: 920px) {
  .route-mini-list { grid-template-columns: 1fr; }
  .leaflet-map { height: 320px; }
}
</style>