<script setup>
import { computed } from 'vue';
import { useI18n } from 'vue-i18n';

const props = defineProps({
  vehicle: { type: Object, required: true }
});

const { t } = useI18n();

const capacityUsage = computed(() => {
  if (!props.vehicle.capacity) return 0;
  return Math.min(Math.round((props.vehicle.assignedStudents / props.vehicle.capacity) * 100), 100);
});
</script>

<template>
  <article class="vehicle-card">
    <div class="vehicle-head">
      <div class="vehicle-main">
        <span class="bus-icon">
          <i class="material-symbols-outlined">directions_bus</i>
        </span>
        <div>
          <h3>{{ vehicle.code }}</h3>
          <p>{{ vehicle.brand }} {{ vehicle.model }} · {{ vehicle.year }}</p>
        </div>
      </div>
      <span class="status-pill" :class="vehicle.status">
        {{ t('fleet.status.' + vehicle.status) }}
      </span>
    </div>

    <div class="vehicle-meta">
      <span><i class="material-symbols-outlined">confirmation_number</i>{{ vehicle.plate }}</span>
      <span><i class="material-symbols-outlined">person</i>{{ vehicle.driverName }}</span>
      <span><i class="material-symbols-outlined">route</i>{{ vehicle.routeName }}</span>
    </div>

    <div class="usage-block">
      <div>
        <span>{{ t('fleet.vehicle.capacityUsage') }}</span>
        <strong>{{ vehicle.assignedStudents }} / {{ vehicle.capacity }}</strong>
      </div>
      <div class="progress"><i :style="{ width: capacityUsage + '%' }"></i></div>
    </div>

    <footer>
      <small>
        <i class="material-symbols-outlined">event_available</i>
        {{ t('fleet.vehicle.nextMaintenance') }} {{ vehicle.nextMaintenanceDate }}
      </small>
      <small :class="{ invalid: !vehicle.documentsValid }">
        <i class="material-symbols-outlined">
          {{ vehicle.documentsValid ? 'verified' : 'warning' }}
        </i>
        {{ vehicle.documentsValid ? t('fleet.vehicle.documentsValid') : t('fleet.vehicle.documentsPending') }}
      </small>
    </footer>
  </article>
</template>

<style scoped>
.vehicle-card {
  display: grid;
  gap: 18px;
  padding: 20px;
  border: 1px solid var(--kw-border);
  border-radius: 18px;
  background: var(--kw-card);
  box-shadow: 0 14px 35px rgba(15, 43, 87, .08);
}
.vehicle-head, .vehicle-main, .vehicle-meta, footer, .usage-block > div:first-child {
  display: flex;
  align-items: center;
}
.vehicle-head { justify-content: space-between; gap: 12px; }
.vehicle-main { gap: 12px; min-width: 0; }
.bus-icon {
  display: inline-grid;
  place-items: center;
  width: 44px;
  height: 44px;
  border-radius: 15px;
  color: var(--kw-blue-700);
  background: #e3f4ff;
  flex: 0 0 auto;
}
h3 { margin: 0; color: var(--kw-ink); font-size: 1.05rem; }
p { margin: 4px 0 0; color: var(--kw-muted); font-size: .9rem; }
.status-pill {
  padding: 6px 11px;
  border-radius: 999px;
  font-size: .75rem;
  font-weight: 900;
  white-space: nowrap;
}
.status-pill.available { color: #0f7a46; background: #dcfce7; }
.status-pill.onRoute { color: #0f5f9a; background: #e3f4ff; }
.status-pill.maintenance { color: #9a6000; background: #fff4d8; }
.status-pill.inactive { color: #8a1f2d; background: #ffe4e6; }
.vehicle-meta { flex-wrap: wrap; gap: 10px; color: var(--kw-muted); font-size: .88rem; }
.vehicle-meta span { display: inline-flex; align-items: center; gap: 5px; }
.vehicle-meta .material-symbols-outlined,
footer .material-symbols-outlined { font-size: 16px; }
.usage-block { display: grid; gap: 8px; }
.usage-block > div:first-child { justify-content: space-between; color: var(--kw-muted); }
.usage-block strong { color: var(--kw-blue-900); }
.progress { height: 9px; border-radius: 999px; background: #e8f0f8; overflow: hidden; }
.progress i { display: block; height: 100%; border-radius: inherit; background: linear-gradient(90deg, var(--kw-blue-700), #25c4b7); transition: width .3s ease; }
footer { justify-content: space-between; gap: 12px; flex-wrap: wrap; padding-top: 2px; }
footer small { display: inline-flex; align-items: center; gap: 5px; color: var(--kw-muted); }
footer small.invalid { color: #c2410c; font-weight: 800; }
body.dark-theme .bus-icon { background: rgba(125, 205, 255, .12); }
@media (max-width: 560px) { .vehicle-head { align-items: flex-start; flex-direction: column; } }
</style>