<script setup>
import { computed } from 'vue';
import { useI18n } from 'vue-i18n';

const props = defineProps({
  visible: { type: Boolean, default: false },
  assignment: { type: Object, default: null }
});

const emit = defineEmits(['update:visible']);

const { t } = useI18n();

const statusLabel = computed(() => props.assignment ? `assignments.status.${props.assignment.status}` : '');
const shiftLabel = computed(() => props.assignment ? `assignments.shift.${props.assignment.shift}` : '');
const validationLabel = computed(() => props.assignment ? `assignments.validation.${props.assignment.validation}` : '');

function close() {
  emit('update:visible', false);
}
</script>

<template>
  <pv-dialog
      :visible="visible"
      @update:visible="emit('update:visible', $event)"
      modal
      :style="{ width: '760px' }"
  >
    <template #header>
      <div v-if="assignment" class="dialog-header">
        <small>{{ t('assignments.detail.eyebrow') }}</small>
        <h2>{{ assignment.studentName }}</h2>
        <p>{{ assignment.studentCode }} · {{ assignment.grade }}</p>
      </div>
    </template>

    <div v-if="assignment" class="detail-content">
      <span class="status-pill" :class="'status-' + assignment.status">
        {{ t(statusLabel) }}
      </span>

      <div class="detail-grid">
        <article>
          <span>{{ t('assignments.detail.route') }}</span>
          <strong>{{ assignment.routeName }}</strong>
          <small>{{ assignment.routeCode }}</small>
        </article>
        <article>
          <span>{{ t('assignments.detail.vehicle') }}</span>
          <strong>{{ assignment.vehiclePlate }}</strong>
          <small>{{ assignment.driverName }}</small>
        </article>
        <article>
          <span>{{ t('assignments.detail.pickup') }}</span>
          <strong>{{ assignment.pickupPoint }}</strong>
          <small>{{ assignment.pickupWindow }}</small>
        </article>
        <article>
          <span>{{ t('assignments.detail.guardian') }}</span>
          <strong>{{ assignment.guardianName }}</strong>
          <small>{{ t(shiftLabel) }}</small>
        </article>
      </div>

      <div class="validation-card">
        <div class="score-ring" :style="{ '--value': assignment.validationScore }">
          <strong>{{ assignment.validationScore }}%</strong>
          <span>{{ t('assignments.detail.score') }}</span>
        </div>
        <div>
          <h3>{{ t(validationLabel) }}</h3>
          <p>{{ assignment.notes }}</p>
          <div class="capacity-line">
            <span>{{ t('assignments.detail.capacity') }}</span>
            <strong>{{ assignment.capacityUsage }}%</strong>
          </div>
          <div class="progress-track"><span :style="{ width: assignment.capacityUsage + '%' }"></span></div>
        </div>
      </div>
    </div>

    <template #footer>
      <pv-button :label="t('shared.close')" @click="close" />
    </template>
  </pv-dialog>
</template>

<style scoped>
.dialog-header small { color: #1683d5; font-weight: 900; text-transform: uppercase; letter-spacing: .12em; }
.dialog-header h2 { margin: 6px 0 4px; font-size: 2rem; letter-spacing: -.05em; }
.dialog-header p { margin: 0; color: var(--kw-muted); }

.detail-content { display: grid; gap: 16px; }

.status-pill {
  display: inline-flex; width: fit-content;
  padding: 8px 14px; border-radius: 999px;
  font-weight: 900; font-size: .8rem;
}
.status-validated { color: #047857; background: #d1fae5; }
.status-pending { color: #b45309; background: #fef3c7; }
.status-conflict { color: #b91c1c; background: #fee2e2; }
.status-inactive { color: #475569; background: #e2e8f0; }

.detail-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 14px; }
.detail-grid article {
  border: 1px solid var(--kw-border);
  border-radius: 18px;
  background: #f8fafc;
  padding: 16px;
}
.detail-grid span { color: var(--kw-muted); font-weight: 800; font-size: .76rem; text-transform: uppercase; letter-spacing: .08em; }
.detail-grid strong { display: block; margin: 7px 0 3px; }
.detail-grid small { color: var(--kw-muted); }

.validation-card {
  display: grid;
  grid-template-columns: 132px 1fr;
  gap: 18px;
  align-items: center;
  padding: 16px;
  border: 1px solid var(--kw-border);
  border-radius: 18px;
  background: #f8fafc;
}
.score-ring {
  width: 116px; height: 116px; border-radius: 50%;
  display: grid; place-items: center; text-align: center;
  background: radial-gradient(circle at center, #ffffff 0 48%, transparent 49%),
  conic-gradient(#1683d5 calc(var(--value, 91) * 1%), #e2eef8 0);
  border: 10px solid #e2eef8;
}
.score-ring strong { color: #0f5f9f; font-size: 1.75rem; line-height: 1; }
.score-ring span { display: block; color: var(--kw-muted); font-size: .72rem; font-weight: 800; }
.validation-card h3 { margin: 0 0 8px; }
.validation-card p { color: var(--kw-muted); margin: 0 0 14px; }
.capacity-line { display: flex; justify-content: space-between; margin-bottom: 8px; }
.progress-track { height: 8px; border-radius: 999px; background: #e2eef8; overflow: hidden; }
.progress-track span { display: block; height: 100%; border-radius: inherit; background: linear-gradient(90deg, #1683d5, #28c2b1); }

@media (max-width: 640px) {
  .detail-grid, .validation-card { grid-template-columns: 1fr; }
}
</style>