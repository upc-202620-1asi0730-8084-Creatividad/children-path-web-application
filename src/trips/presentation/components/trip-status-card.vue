<script setup>
import { useI18n } from 'vue-i18n';

defineProps({
  trip: { type: Object, required: true }
});

const emit = defineEmits(['view', 'start', 'complete', 'cancel']);

const { t } = useI18n();
</script>

<template>
  <article class="trip-status-card" :class="trip.status">
    <header>
      <div class="trip-identity">
        <span class="trip-avatar">{{ trip.codeSuffix }}</span>
        <div>
          <h3>{{ trip.routeName }}</h3>
          <p>{{ trip.code }} · {{ trip.school }}</p>
        </div>
      </div>
      <span class="status-pill" :class="trip.status">
        {{ trip.status.replace('_', ' ') }}
      </span>
    </header>

    <div class="trip-meta">
      <span><i class="material-symbols-outlined">directions_bus</i>{{ trip.vehiclePlate }}</span>
      <span><i class="material-symbols-outlined">person</i>{{ trip.driverName }}</span>
      <span><i class="material-symbols-outlined">schedule</i>{{ trip.shift }}</span>
    </div>

    <section class="mini-grid">
      <div>
        <small>Students</small>
        <strong>{{ trip.students }}/{{ trip.capacity }}</strong>
      </div>
      <div>
        <small>Stops</small>
        <strong>{{ trip.completedStops }}/{{ trip.totalStops }}</strong>
      </div>
      <div>
        <small>ETA</small>
        <strong>{{ trip.estimatedEndTime }}</strong>
      </div>
    </section>

    <div class="progress-row">
      <span>Trip progress</span>
      <b>{{ trip.progress }}%</b>
    </div>
    <div class="progress-track">
      <span :style="{ width: trip.progress + '%' }"></span>
    </div>

    <footer>
      <span class="validation">
        <i class="material-symbols-outlined">
          {{ trip.trackingStatus === 'enabled' ? 'gps_fixed' : 'fact_check' }}
        </i>
        {{ trip.validationMessage }}
      </span>
      <div class="actions">
        <button
            v-if="trip.status === 'scheduled'"
            type="button"
            class="icon-action start"
            @click="emit('start', trip)"
            aria-label="Start trip"
        >
          <i class="material-symbols-outlined">play_arrow</i>
        </button>
        <button
            v-if="trip.status === 'in_progress' || trip.status === 'delayed'"
            type="button"
            class="icon-action complete"
            @click="emit('complete', trip)"
            aria-label="Complete trip"
        >
          <i class="material-symbols-outlined">check</i>
        </button>
        <button
            v-if="trip.status !== 'completed' && trip.status !== 'canceled'"
            type="button"
            class="icon-action cancel"
            @click="emit('cancel', trip)"
            aria-label="Cancel trip"
        >
          <i class="material-symbols-outlined">close</i>
        </button>
        <button type="button" class="icon-action" @click="emit('view', trip)" aria-label="View trip">
          <i class="material-symbols-outlined">arrow_forward</i>
        </button>
      </div>
    </footer>
  </article>
</template>

<style scoped>
.trip-status-card {
  border-radius: 20px;
  padding: 22px;
  background: #fff;
  border: 1px solid rgba(15, 73, 116, 0.08);
  box-shadow: 0 12px 32px rgba(15, 73, 116, 0.08);
}
.trip-status-card.in_progress { background: linear-gradient(135deg, #eff6ff 0%, #fff 68%); }
.trip-status-card.completed { background: linear-gradient(135deg, #ecfdf5 0%, #fff 68%); }
.trip-status-card.delayed { background: linear-gradient(135deg, #fff7ed 0%, #fff 68%); }
.trip-status-card.canceled { background: linear-gradient(135deg, #fff1f2 0%, #fff 68%); }
header { display: flex; align-items: flex-start; justify-content: space-between; gap: 14px; }
.trip-identity { display: flex; align-items: center; gap: 14px; }
.trip-avatar {
  width: 46px; height: 46px; border-radius: 16px;
  background: linear-gradient(135deg, #1b8bd1, #0564a8);
  color: #fff; display: inline-flex; align-items: center; justify-content: center; font-weight: 900;
}
h3 { margin: 0; color: #0f172a; font-size: 1.04rem; }
p { margin: 4px 0 0; color: #64748b; font-weight: 700; }
.status-pill {
  text-transform: capitalize;
  border-radius: 999px;
  padding: 8px 12px;
  font-weight: 900;
  font-size: 0.75rem;
}
.status-pill.scheduled { background: #e0f2fe; color: #0369a1; }
.status-pill.in_progress { background: #dcfce7; color: #15803d; }
.status-pill.delayed { background: #fef3c7; color: #a16207; }
.status-pill.completed { background: #d1fae5; color: #047857; }
.status-pill.canceled { background: #ffe4e6; color: #be123c; }
.trip-meta { margin-top: 18px; display: flex; flex-wrap: wrap; gap: 14px; color: #334155; font-weight: 800; }
.trip-meta span, .validation { display: inline-flex; align-items: center; gap: 6px; }
.trip-meta .material-symbols-outlined,
.validation .material-symbols-outlined { font-size: 18px; color: #1985c7; }
.mini-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 10px; margin-top: 18px; }
.mini-grid div { background: #f1f7fc; border-radius: 14px; padding: 14px; }
small { display: block; color: #64748b; font-weight: 900; margin-bottom: 6px; }
strong { color: #0f172a; font-weight: 900; }
.progress-row {
  margin-top: 18px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  color: #64748b;
  font-weight: 900;
}
.progress-track {
  height: 8px;
  border-radius: 999px;
  background: #e8f2f9;
  overflow: hidden;
  margin-top: 8px;
}
.progress-track span {
  display: block;
  height: 100%;
  border-radius: inherit;
  background: linear-gradient(90deg, #1b8bd1, #22c1b6);
  transition: width .3s ease;
}
footer {
  margin-top: 18px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
}
.validation { color: #475569; font-weight: 800; font-size: 0.8rem; }
.actions { display: flex; gap: 8px; }
.icon-action {
  width: 34px; height: 34px;
  border-radius: 12px; border: 0;
  display: inline-flex; align-items: center; justify-content: center;
  background: #e5f4ff; cursor: pointer;
  transition: 0.2s ease;
}
.icon-action:hover { transform: translateY(-2px); background: #d9efff; }
.icon-action.start { background: #dcfce7; }
.icon-action.complete { background: #dbeafe; }
.icon-action.cancel { background: #ffe4e6; }
.icon-action .material-symbols-outlined { font-size: 18px; }
@media (max-width: 720px) {
  .mini-grid { grid-template-columns: 1fr; }
  footer { align-items: flex-start; flex-direction: column; }
}
</style>