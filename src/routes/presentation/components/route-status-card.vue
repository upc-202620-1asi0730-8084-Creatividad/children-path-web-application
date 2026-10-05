<script setup>
import { computed } from 'vue';
import { useI18n } from 'vue-i18n';

const props = defineProps({
  route: { type: Object, required: true }
});

const { t } = useI18n();

const capacityUsage = computed(() => props.route.capacityUsage);
</script>

<template>
  <article class="route-card">
    <header>
      <div class="route-id">
        <span class="icon-circle">
          <i class="material-symbols-outlined">alt_route</i>
        </span>
        <div>
          <h3>{{ route.name }}</h3>
          <p>{{ route.code }} · {{ route.district }}</p>
        </div>
      </div>
      <span class="status-pill" :class="route.status">
        {{ t('routesPage.status.' + route.status) }}
      </span>
    </header>

    <div class="meta-row">
      <span><i class="material-symbols-outlined">directions_bus</i>{{ route.assignedVehicle }}</span>
      <span><i class="material-symbols-outlined">person</i>{{ route.assignedDriver }}</span>
      <span><i class="material-symbols-outlined">school</i>{{ route.school }}</span>
    </div>

    <div class="metrics-row">
      <div>
        <small>{{ t('routesPage.card.stops') }}</small>
        <strong>{{ route.stops }}</strong>
      </div>
      <div>
        <small>{{ t('routesPage.card.students') }}</small>
        <strong>{{ route.assignedStudents }}/{{ route.vehicleCapacity }}</strong>
      </div>
      <div>
        <small>{{ t('routesPage.card.duration') }}</small>
        <strong>{{ route.estimatedDuration }}</strong>
      </div>
    </div>

    <section class="progress-group">
      <div class="progress-label">
        <span>{{ t('routesPage.card.coverage') }}</span>
        <strong>{{ route.coveragePercentage }}%</strong>
      </div>
      <div class="progress-track">
        <span :style="{ width: route.coveragePercentage + '%' }"></span>
      </div>
    </section>

    <section class="progress-group compact">
      <div class="progress-label">
        <span>{{ t('routesPage.card.capacityUsage') }}</span>
        <strong>{{ capacityUsage }}%</strong>
      </div>
      <div class="progress-track capacity">
        <span :style="{ width: capacityUsage + '%' }"></span>
      </div>
    </section>

    <footer>
      <span>
        <i class="material-symbols-outlined">schedule</i>
        {{ route.scheduleLabel }} · {{ route.startTime }} - {{ route.endTime }}
      </span>
      <strong v-if="route.needsOptimization" class="warning">
        <i class="material-symbols-outlined">warning</i>
        {{ t('routesPage.card.optimizationNeeded') }}
      </strong>
      <strong v-else class="valid">
        <i class="material-symbols-outlined">verified</i>
        {{ t('routesPage.card.optimizedRoute') }}
      </strong>
    </footer>
  </article>
</template>

<style scoped>
.route-card {
  padding: 20px;
  border: 1px solid #e4edf6;
  border-radius: 18px;
  background: #ffffff;
  box-shadow: 0 14px 30px rgba(11, 52, 86, 0.07);
}
header, .route-id, .meta-row, .metrics-row, .progress-label, footer {
  display: flex;
  align-items: center;
}
header { justify-content: space-between; gap: 16px; }
.route-id { gap: 12px; }
.icon-circle {
  display: inline-flex;
  width: 42px;
  height: 42px;
  align-items: center;
  justify-content: center;
  border-radius: 14px;
  background: #e3f2fd;
  color: #1b83c9;
}
h3 { margin: 0; color: #11365b; font-size: 1.02rem; font-weight: 900; }
p { margin: 4px 0 0; color: #6b7890; font-size: 0.8rem; font-weight: 700; }
.status-pill { padding: 8px 12px; border-radius: 999px; font-size: 0.74rem; font-weight: 900; }
.status-pill.active { background: #dcfce7; color: #15803d; }
.status-pill.scheduled { background: #e3f2fd; color: #1b83c9; }
.status-pill.review { background: #fef3c7; color: #b45309; }
.status-pill.inactive { background: #e5e7eb; color: #4b5563; }
.meta-row {
  flex-wrap: wrap;
  gap: 14px;
  margin: 18px 0;
  color: #536177;
  font-size: 0.8rem;
  font-weight: 800;
}
.meta-row span, footer span, footer strong {
  display: inline-flex;
  align-items: center;
  gap: 6px;
}
.meta-row .material-symbols-outlined,
footer .material-symbols-outlined,
.icon-circle .material-symbols-outlined { font-size: 17px; }
.metrics-row { gap: 10px; margin-bottom: 16px; }
.metrics-row div { flex: 1; padding: 12px; border-radius: 14px; background: #f6f9fc; }
small { display: block; color: #7a8798; font-size: 0.72rem; font-weight: 800; }
.metrics-row strong { display: block; margin-top: 4px; color: #10233f; font-size: 1rem; font-weight: 950; }
.progress-group { margin-top: 12px; }
.progress-group.compact { margin-top: 10px; }
.progress-label {
  justify-content: space-between;
  margin-bottom: 8px;
  color: #5e6c7f;
  font-size: 0.78rem;
  font-weight: 800;
}
.progress-label strong { color: #0f5284; }
.progress-track { height: 8px; overflow: hidden; border-radius: 999px; background: #e8eff7; }
.progress-track span {
  display: block;
  height: 100%;
  border-radius: inherit;
  background: linear-gradient(90deg, #1b83c9, #22c3b6);
}
.progress-track.capacity span { background: linear-gradient(90deg, #34a8eb, #fbbf24); }
footer {
  justify-content: space-between;
  gap: 12px;
  margin-top: 16px;
  color: #6b7890;
  font-size: 0.76rem;
  font-weight: 800;
}
.warning { color: #d97706; }
.valid { color: #607080; }
@media (max-width: 720px) {
  header, footer { align-items: flex-start; flex-direction: column; }
  .metrics-row { flex-direction: column; }
}
</style>