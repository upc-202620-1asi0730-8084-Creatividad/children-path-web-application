<script setup>
import { ref, watch } from 'vue';
import { useI18n } from 'vue-i18n';
import { Student } from '@/students/domain/entities/student.entity.js';

const props = defineProps({
  visible: { type: Boolean, default: false },
  data: { type: Object, default: null }
});

const emit = defineEmits(['update:visible', 'save']);

const { t } = useI18n();

const statusOptions = ['active', 'unassigned', 'review', 'inactive'];

const blank = () => ({
  firstName: '', lastName: '', grade: '', school: '',
  guardianName: '', guardianPhone: '', guardianEmail: '', emergencyContact: '',
  routeName: '', pickupPoint: '', pickupWindow: '', status: 'unassigned'
});

const form = ref(blank());

watch(() => props.visible, (visible) => {
  if (visible) {
    if (props.data) {
      form.value = {
        firstName: props.data.firstName,
        lastName: props.data.lastName,
        grade: props.data.grade,
        school: props.data.school,
        guardianName: props.data.guardianName,
        guardianPhone: props.data.guardianPhone,
        guardianEmail: props.data.guardianEmail,
        emergencyContact: props.data.emergencyContact,
        routeName: props.data.routeName ?? '',
        pickupPoint: props.data.pickupPoint ?? '',
        pickupWindow: props.data.pickupWindow ?? '',
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
  const hasRoute = Boolean(form.value.routeName);
  const entity = new Student({
    id: props.data?.id,
    code: props.data?.code,
    firstName: form.value.firstName.trim(),
    lastName: form.value.lastName.trim(),
    grade: form.value.grade.trim(),
    school: form.value.school.trim(),
    guardianName: form.value.guardianName.trim(),
    guardianPhone: form.value.guardianPhone.trim(),
    guardianEmail: form.value.guardianEmail.trim(),
    emergencyContact: form.value.emergencyContact.trim(),
    routeName: form.value.routeName.trim() || null,
    pickupPoint: form.value.pickupPoint.trim() || null,
    pickupWindow: form.value.pickupWindow.trim() || null,
    status: hasRoute && form.value.status === 'unassigned' ? 'active' : form.value.status
  });
  emit('save', entity);
  close();
}
</script>

<template>
  <pv-dialog
      :visible="visible"
      @update:visible="emit('update:visible', $event)"
      :header="data ? t('studentsPage.dialogs.editTitle') : t('studentsPage.dialogs.registerTitle')"
      modal
      :style="{ width: '880px' }"
  >
    <div class="form-grid">
      <label><span>{{ t('studentsPage.dialogs.firstName') }}</span><pv-input-text v-model="form.firstName" /></label>
      <label><span>{{ t('studentsPage.dialogs.lastName') }}</span><pv-input-text v-model="form.lastName" /></label>
      <label><span>{{ t('studentsPage.dialogs.grade') }}</span><pv-input-text v-model="form.grade" /></label>
      <label><span>{{ t('studentsPage.dialogs.school') }}</span><pv-input-text v-model="form.school" /></label>
      <label><span>{{ t('studentsPage.dialogs.guardianName') }}</span><pv-input-text v-model="form.guardianName" /></label>
      <label><span>{{ t('studentsPage.dialogs.guardianPhone') }}</span><pv-input-text v-model="form.guardianPhone" /></label>
      <label><span>{{ t('studentsPage.dialogs.guardianEmail') }}</span><pv-input-text v-model="form.guardianEmail" /></label>
      <label><span>{{ t('studentsPage.dialogs.emergencyContact') }}</span><pv-input-text v-model="form.emergencyContact" /></label>
      <label><span>{{ t('studentsPage.dialogs.route') }}</span><pv-input-text v-model="form.routeName" /></label>
      <label><span>{{ t('studentsPage.dialogs.pickupPoint') }}</span><pv-input-text v-model="form.pickupPoint" /></label>
      <label><span>{{ t('studentsPage.dialogs.pickupWindow') }}</span><pv-input-text v-model="form.pickupWindow" /></label>
      <label><span>{{ t('studentsPage.dialogs.status') }}</span>
        <pv-select v-model="form.status" :options="statusOptions" />
      </label>
    </div>

    <template #footer>
      <pv-button :label="t('studentsPage.dialogs.cancel')" text @click="close" />
      <pv-button :label="data ? t('studentsPage.dialogs.save') : t('studentsPage.dialogs.register')" @click="save" />
    </template>
  </pv-dialog>
</template>

<style scoped>
.form-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 14px; }
.form-grid label { display: grid; gap: 6px; }
.form-grid label span { font-weight: 700; font-size: .85rem; color: var(--kw-muted); }
@media (max-width: 640px) { .form-grid { grid-template-columns: 1fr; } }
</style>