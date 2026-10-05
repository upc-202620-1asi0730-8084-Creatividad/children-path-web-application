<script setup>
import { computed } from 'vue';
import { useI18n } from 'vue-i18n';

const props = defineProps({
  visible: { type: Boolean, default: false },
  trip: { type: Object, default: null }
});

const emit = defineEmits(['update:visible']);

const { t } = useI18n();

function close() {
  emit('update:visible', false);
}
</script>

<template>
  <pv-dialog
      :visible="visible"
      @update:visible="emit('update:visible', $event)"
      modal
      :style="{ width: '820px' }"
  >
    <template #header>
      <div v-if="trip" class="dialog-header">
        <div>
          <span>Trip details</span>
          <h2>{{ trip.routeName }}</h2>
          <p>{{ trip.code }} · {{ trip.vehiclePlate }} · {{ trip.driverName }}</p>
        </div>
      </div>
    </template>

    <div v-if="trip" class="detail-content">
      <div class="detail-grid">
        <div><small>Status</small><strong class="status" :class="trip.status">{{ trip.status.replace('_', ' ') }}</strong></div>
        <div><small>School</small><strong>{{ trip.school }}</strong></div>
        <div><small>District</small><strong>{{ trip.district }}</strong></div>
        <div><small>Students</small><strong>{{ trip.students }}/{{ trip.capacity }}</strong></div>
        <div><small>Schedule</small><strong>{{ trip.startTime }} - {{ trip.estimatedEndTime }}</strong></div>
        <div><small>Next stop</small><strong>{{ trip.nextStop }}</strong></div>
        <div><small>Progress</small><strong>{{ trip.progress }}%</strong></div>
        <div><small>Average speed</small><strong>{{ trip.averageSpeed }} km/h</strong></div>
      </div>

      <footer>
        <i class="material-symbols-outlined">fact_check</i>
        <span>{{ trip.validationMessage }}</span>
      </footer>
    </div>

    <template #footer>
      <pv-button label="Close" @click="close" />
    </template>
  </pv-dialog>
</template>

<style scoped>
.dialog-header span {
  color: #1985c7; font-size: 0.74rem; font-weight: 1000;
  text-transform: uppercase; letter-spacing: 0.14em;
}
.dialog-header h2 { margin: 6px 0; color: #0f172a; font-size: clamp(1.7rem, 3vw, 2.15rem); letter-spacing: -.055em; line-height: 1; }
.dialog-header p { margin: 0; color: #64748b; font-weight: 800; }

.detail-content { display: grid; gap: 16px; }
.detail-grid { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 12px; }
.detail-grid div { background: #f8fbfe; border: 1px solid #e5eef7; border-radius: 18px; padding: 16px; min-width: 0; }
small {
  display: block; color: #64748b; font-weight: 900; margin-bottom: 6px;
  text-transform: uppercase; letter-spacing: .07em; font-size: .72rem;
}
strong { color: #0f172a; text-transform: capitalize; }
.status { display: inline-flex; padding: 7px 11px; border-radius: 999px; font-weight: 950; }
.status.in_progress, .status.completed { background: #dcfce7; color: #15803d; }
.status.scheduled { background: #e0f2fe; color: #0369a1; }
.status.delayed { background: #fef3c7; color: #a16207; }
.status.canceled { background: #ffe4e6; color: #be123c; }
footer {
  margin-top: 18px; background: #fff7ed; color: #9a3412;
  border: 1px solid #fed7aa; border-radius: 18px; padding: 14px;
  display: flex; align-items: center; gap: 10px; font-weight: 900;
}
footer span { color: inherit; }
footer .material-symbols-outlined { font-size: 18px; }
@media (max-width: 640px) { .detail-grid { grid-template-columns: 1fr; } }
</style>