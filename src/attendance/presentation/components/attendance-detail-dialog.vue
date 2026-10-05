<script setup>
import { computed } from 'vue';
import { useI18n } from 'vue-i18n';

const props = defineProps({
  visible: { type: Boolean, default: false },
  record: { type: Object, default: null }
});

const emit = defineEmits(['update:visible', 'change-status']);

const { t } = useI18n();

const statusLabel = computed(() => props.record ? `attendance.status.${props.record.status}` : '');

function close() {
  emit('update:visible', false);
}
</script>

<template>
  <pv-dialog
      :visible="visible"
      @update:visible="emit('update:visible', $event)"
      modal
      :style="{ width: '700px' }"
  >
    <template #header>
      <div v-if="record" class="dialog-header">
        <small>{{ t('attendance.detail.eyebrow') }}</small>
        <h2>{{ record.studentName }}</h2>
        <p>{{ record.studentCode }} · {{ record.grade }}</p>
      </div>
    </template>

    <div v-if="record" class="detail-content">
      <span class="status-pill" :class="'status-' + record.status">
        {{ t(statusLabel) }}
      </span>

      <div class="detail-grid">
        <article>
          <span>{{ t('attendance.detail.route') }}</span>
          <strong>{{ record.routeName }}</strong>
        </article>
        <article>
          <span>{{ t('attendance.detail.vehicle') }}</span>
          <strong>{{ record.vehiclePlate }}</strong>
          <small>{{ record.driverName }}</small>
        </article>
        <article>
          <span>{{ t('attendance.detail.pickup') }}</span>
          <strong>{{ record.pickupPoint }}</strong>
          <small>{{ record.estimatedArrival }}</small>
        </article>
        <article>
          <span>{{ t('attendance.detail.school') }}</span>
          <strong>{{ record.school }}</strong>
        </article>
        <article>
          <span>{{ t('attendance.detail.checkIn') }}</span>
          <strong>{{ record.checkInTime ?? '—' }}</strong>
        </article>
        <article>
          <span>{{ t('attendance.detail.dropOff') }}</span>
          <strong>{{ record.dropOffTime ?? '—' }}</strong>
        </article>
      </div>

      <div class="notes-card">
        <span>{{ t('attendance.detail.notes') }}</span>
        <p>{{ record.notes }}</p>
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
  display: inline-flex;
  width: fit-content;
  padding: 8px 14px;
  border-radius: 999px;
  font-weight: 900;
  font-size: .8rem;
}
.status-pill.status-waiting { color: #475569; background: #e2e8f0; }
.status-pill.status-on_board { color: #0f5f9a; background: #e6f4ff; }
.status-pill.status-arrived { color: #047857; background: #d1fae5; }
.status-pill.status-absent { color: #b91c1c; background: #fee2e2; }
.status-pill.status-pending_confirmation { color: #b45309; background: #fef3c7; }

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

.notes-card {
  border: 1px solid var(--kw-border);
  border-radius: 18px;
  background: #f8fafc;
  padding: 16px;
}
.notes-card span { color: var(--kw-muted); font-weight: 800; font-size: .76rem; text-transform: uppercase; letter-spacing: .08em; }
.notes-card p { margin: 8px 0 0; color: #0f172a; }

@media (max-width: 640px) {
  .detail-grid { grid-template-columns: 1fr; }
}
</style>