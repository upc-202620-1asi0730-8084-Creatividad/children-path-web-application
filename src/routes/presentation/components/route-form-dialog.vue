<script setup>
import { ref, watch } from 'vue';
import { useI18n } from 'vue-i18n';
import { SchoolRoute } from '@/routes/domain/entities/school-route.entity.js';

const props = defineProps({
  visible: { type: Boolean, default: false },
  data: { type: Object, default: null }
});

const emit = defineEmits(['update:visible', 'save']);

const { t } = useI18n();

const statusOptions = ['active', 'scheduled', 'review', 'inactive'];

const blank = () => ({
  code: 'RT-000', name: '', district: '', school: '',
  assignedDriver: '', assignedVehicle: '',
  assignedStudents: 0, vehicleCapacity: 15,
  stops: 8, status: 'scheduled'
});

const form = ref(blank());

watch(() => props.visible, (visible) => {
  if (visible) {
    if (props.data) {
      form.value = {
        code: props.data.code,
        name: props.data.name,
        district: props.data.district,
        school: props.data.school,
        assignedDriver: props.data.assignedDriver,
        assignedVehicle: props.data.assignedVehicle,
        assignedStudents: props.data.assignedStudents,
        vehicleCapacity: props.data.vehicleCapacity,
        stops: props.data.stops,
        status: props.data.status
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
  const entity = new SchoolRoute({
    id: props.data?.id,
    code: form.value.code || `RT-${String(Date.now()).slice(-3)}`,
    name: form.value.name,
    district: form.value.district,
    school: form.value.school,
    scheduleLabel: props.data?.scheduleLabel ?? 'Morning service',
    startTime: props.data?.startTime ?? '06:45',
    endTime: props.data?.endTime ?? '07:45',
    assignedDriver: form.value.assignedDriver,
    assignedVehicle: form.value.assignedVehicle,
    assignedStudents: Number(form.value.assignedStudents) || 0,
    vehicleCapacity: Number(form.value.vehicleCapacity) || 1,
    stops: Number(form.value.stops) || 1,
    coveragePercentage: props.data?.coveragePercentage ?? 90,
    optimizationScore: props.data?.optimizationScore ?? 88,
    estimatedDuration: props.data?.estimatedDuration ?? '60 min',
    status: form.value.status,
    nextServiceAt: props.data?.nextServiceAt ?? new Date().toISOString(),
    lastOptimizedAt: props.data?.lastOptimizedAt ?? new Date().toISOString().slice(0, 10),
    needsOptimization: (props.data?.optimizationScore ?? 88) < 80,
    checkpoints: props.data?.checkpoints ?? ['Pickup point', 'School gate']
  });
  emit('save', entity);
  close();
}
</script>

<template>
  <pv-dialog
      :visible="visible"
      @update:visible="emit('update:visible', $event)"
      :header="data ? 'Edit route' : t('routesPage.actions.createRoute')"
      modal
      :style="{ width: '820px' }"
  >
    <div class="form-grid">
      <label><span>{{ t('routesPage.dialog.code') }}</span><pv-input-text v-model="form.code" /></label>
      <label><span>{{ t('routesPage.dialog.name') }}</span><pv-input-text v-model="form.name" /></label>
      <label><span>{{ t('routesPage.dialog.district') }}</span><pv-input-text v-model="form.district" /></label>
      <label><span>{{ t('routesPage.dialog.school') }}</span><pv-input-text v-model="form.school" /></label>
      <label><span>{{ t('routesPage.dialog.driver') }}</span><pv-input-text v-model="form.assignedDriver" /></label>
      <label><span>{{ t('routesPage.dialog.vehicle') }}</span><pv-input-text v-model="form.assignedVehicle" /></label>
      <label><span>{{ t('routesPage.dialog.students') }}</span><pv-input-number v-model="form.assignedStudents" /></label>
      <label><span>{{ t('routesPage.dialog.capacity') }}</span><pv-input-number v-model="form.vehicleCapacity" /></label>
      <label><span>{{ t('routesPage.dialog.stops') }}</span><pv-input-number v-model="form.stops" /></label>
      <label><span>{{ t('routesPage.dialog.status') }}</span><pv-select v-model="form.status" :options="statusOptions" /></label>
    </div>
    <template #footer>
      <pv-button :label="t('shared.cancel')" text @click="close" />
      <pv-button :label="data ? t('shared.save') : t('routesPage.dialog.create')" @click="save" />
    </template>
  </pv-dialog>
</template>

<style scoped>
.form-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 14px; }
.form-grid label { display: grid; gap: 6px; }
.form-grid label span { font-weight: 700; font-size: .85rem; color: var(--kw-muted); }
@media (max-width: 640px) { .form-grid { grid-template-columns: 1fr; } }
</style>