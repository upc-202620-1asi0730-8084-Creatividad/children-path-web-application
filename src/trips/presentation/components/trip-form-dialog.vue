<script setup>
import { ref, watch } from 'vue';
import { useI18n } from 'vue-i18n';
import { Trip } from '@/trips/domain/entities/trip.entity.js';

const props = defineProps({
  visible: { type: Boolean, default: false },
  data: { type: Object, default: null }
});

const emit = defineEmits(['update:visible', 'save']);

const { t } = useI18n();

const shiftOptions = ['morning', 'afternoon', 'return'];
const statusOptions = ['scheduled', 'in_progress', 'delayed', 'completed', 'canceled'];

const blank = () => ({
  routeName: '', vehiclePlate: '', driverName: '', school: '', district: '',
  shift: 'morning', status: 'scheduled',
  students: 0, capacity: 18,
  startTime: '06:45', estimatedEndTime: '07:45',
  nextStop: '', totalStops: 10
});

const form = ref(blank());

watch(() => props.visible, (visible) => {
  if (visible) {
    if (props.data) {
      form.value = {
        routeName: props.data.routeName,
        vehiclePlate: props.data.vehiclePlate,
        driverName: props.data.driverName,
        school: props.data.school,
        district: props.data.district,
        shift: props.data.shift,
        status: props.data.status,
        students: props.data.students,
        capacity: props.data.capacity,
        startTime: props.data.startTime,
        estimatedEndTime: props.data.estimatedEndTime,
        nextStop: props.data.nextStop,
        totalStops: props.data.totalStops
      };
    } else {
      form.value = blank();
    }
  }
});

function close() {
  emit('update:visible', false);
}

function save() {
  const isCompleted = form.value.status === 'completed';
  const isRunning = form.value.status === 'in_progress' || form.value.status === 'delayed';

  const entity = new Trip({
    id: props.data?.id,
    code: props.data?.code,
    ...form.value,
    students: Number(form.value.students),
    capacity: Number(form.value.capacity),
    totalStops: Number(form.value.totalStops),
    completedStops: props.data?.completedStops ?? (isCompleted ? Number(form.value.totalStops) : 0),
    progress: props.data?.progress ?? (isCompleted ? 100 : isRunning ? 35 : 0),
    averageSpeed: props.data?.averageSpeed ?? (form.value.status === 'scheduled' ? 0 : 30),
    attendanceRate: props.data?.attendanceRate ?? (form.value.status === 'scheduled' ? 0 : 92),
    incidents: props.data?.incidents ?? (form.value.status === 'delayed' ? 1 : 0),
    trackingStatus: props.data?.trackingStatus ?? (form.value.status === 'scheduled' ? 'ready' : isCompleted ? 'closed' : 'enabled'),
    validationMessage: props.data?.validationMessage ?? (form.value.status === 'scheduled' ? 'Trip ready for operational validation.' : 'Trip registered in operation control.'),
    updatedAt: 'Now'
  });

  emit('save', entity);
  close();
}
</script>

<template>
  <pv-dialog
      :visible="visible"
      @update:visible="emit('update:visible', $event)"
      :header="data ? 'Edit trip' : 'Schedule new trip'"
      modal
      :style="{ width: '880px' }"
  >
    <div class="form-grid">
      <label><span>Route name</span><pv-input-text v-model="form.routeName" /></label>
      <label><span>Vehicle plate</span><pv-input-text v-model="form.vehiclePlate" /></label>
      <label><span>Driver name</span><pv-input-text v-model="form.driverName" /></label>
      <label><span>School</span><pv-input-text v-model="form.school" /></label>
      <label><span>District</span><pv-input-text v-model="form.district" /></label>
      <label><span>Next stop</span><pv-input-text v-model="form.nextStop" /></label>
      <label><span>Students</span><pv-input-number v-model="form.students" /></label>
      <label><span>Capacity</span><pv-input-number v-model="form.capacity" /></label>
      <label><span>Start time</span><pv-input-text v-model="form.startTime" /></label>
      <label><span>Estimated end</span><pv-input-text v-model="form.estimatedEndTime" /></label>
      <label><span>Total stops</span><pv-input-number v-model="form.totalStops" /></label>
      <label><span>Shift</span><pv-select v-model="form.shift" :options="shiftOptions" /></label>
      <label><span>Status</span><pv-select v-model="form.status" :options="statusOptions" /></label>
    </div>

    <template #footer>
      <pv-button label="Cancel" text @click="close" />
      <pv-button label="Save trip" @click="save" />
    </template>
  </pv-dialog>
</template>

<style scoped>
.form-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 14px; }
.form-grid label { display: grid; gap: 6px; }
.form-grid label span { font-weight: 700; font-size: .85rem; color: var(--kw-muted); }
@media (max-width: 720px) { .form-grid { grid-template-columns: 1fr; } }
</style>
