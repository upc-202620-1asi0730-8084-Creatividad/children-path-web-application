<script setup>
import { ref, watch } from 'vue';
import { useI18n } from 'vue-i18n';
import { Assignment } from '@/assignments/domain/entities/assignment.entity.js';

const props = defineProps({
  visible: { type: Boolean, default: false },
  data: { type: Object, default: null } // null = create mode
});

const emit = defineEmits(['update:visible', 'save']);

const { t } = useI18n();

const shiftOptions = ['morning', 'afternoon'];
const statusOptions = ['validated', 'pending', 'conflict', 'inactive'];
const validationOptions = ['ready', 'capacity-risk', 'schedule-conflict', 'missing-route', 'inactive'];

const blank = () => ({
  studentCode: '', studentName: '', grade: '', guardianName: '',
  routeCode: '', routeName: '', vehiclePlate: '', driverName: '',
  shift: 'morning', pickupPoint: '', pickupWindow: '',
  capacityUsage: 75, validationScore: 90, validation: 'ready',
  status: 'validated', notes: ''
});

const form = ref(blank());

watch(() => props.data, (newData) => {
  if (newData) {
    form.value = { ...newData };
  } else {
    form.value = blank();
  }
}, { immediate: true });

watch(() => props.visible, (visible) => {
  if (visible) {
    form.value = props.data ? { ...props.data } : blank();
  }
});

function close() {
  emit('update:visible', false);
}

function save() {
  const entity = new Assignment({
    id: props.data?.id,
    lastUpdated: props.data?.lastUpdated ?? 'Just now',
    ...form.value
  });
  emit('save', entity);
  close();
}
</script>

<template>
  <pv-dialog
      :visible="visible"
      @update:visible="emit('update:visible', $event)"
      :header="data ? t('assignments.form.editTitle') : t('assignments.form.createTitle')"
      modal
      :style="{ width: '900px' }"
  >
    <p class="form-subtitle">{{ t('assignments.form.subtitle') }}</p>

    <div class="form-grid">
      <label><span>{{ t('assignments.form.studentCode') }}</span>
        <pv-input-text v-model="form.studentCode" />
      </label>
      <label><span>{{ t('assignments.form.studentName') }}</span>
        <pv-input-text v-model="form.studentName" />
      </label>
      <label><span>{{ t('assignments.form.grade') }}</span>
        <pv-input-text v-model="form.grade" />
      </label>
      <label><span>{{ t('assignments.form.guardianName') }}</span>
        <pv-input-text v-model="form.guardianName" />
      </label>
      <label><span>{{ t('assignments.form.routeCode') }}</span>
        <pv-input-text v-model="form.routeCode" />
      </label>
      <label><span>{{ t('assignments.form.routeName') }}</span>
        <pv-input-text v-model="form.routeName" />
      </label>
      <label><span>{{ t('assignments.form.vehiclePlate') }}</span>
        <pv-input-text v-model="form.vehiclePlate" />
      </label>
      <label><span>{{ t('assignments.form.driverName') }}</span>
        <pv-input-text v-model="form.driverName" />
      </label>
      <label><span>{{ t('assignments.form.shift') }}</span>
        <pv-select v-model="form.shift" :options="shiftOptions" />
      </label>
      <label><span>{{ t('assignments.form.status') }}</span>
        <pv-select v-model="form.status" :options="statusOptions" />
      </label>
      <label><span>{{ t('assignments.form.pickupPoint') }}</span>
        <pv-input-text v-model="form.pickupPoint" />
      </label>
      <label><span>{{ t('assignments.form.pickupWindow') }}</span>
        <pv-input-text v-model="form.pickupWindow" />
      </label>
      <label><span>{{ t('assignments.form.validation') }}</span>
        <pv-select v-model="form.validation" :options="validationOptions" />
      </label>
      <label><span>{{ t('assignments.form.validationScore') }}</span>
        <pv-input-number v-model="form.validationScore" />
      </label>
      <label><span>{{ t('assignments.form.capacityUsage') }}</span>
        <pv-input-number v-model="form.capacityUsage" />
      </label>
      <label class="full"><span>{{ t('assignments.form.notes') }}</span>
        <pv-textarea v-model="form.notes" rows="3" />
      </label>
    </div>

    <template #footer>
      <pv-button :label="t('shared.cancel')" text @click="close" />
      <pv-button :label="t('shared.save')" icon="pi pi-save" @click="save" />
    </template>
  </pv-dialog>
</template>

<style scoped>
.form-subtitle { color: var(--kw-muted); margin: 0 0 16px; }
.form-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 14px; }
.form-grid label { display: grid; gap: 6px; }
.form-grid label span { font-weight: 700; font-size: .85rem; color: var(--kw-muted); }
.form-grid .full { grid-column: 1 / -1; }
@media (max-width: 680px) { .form-grid { grid-template-columns: 1fr; } }
</style>