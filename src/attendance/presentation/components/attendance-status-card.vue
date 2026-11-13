<script setup>
import { useI18n } from 'vue-i18n';

const props = defineProps({
  record: { type: Object, required: true }
});

const emit = defineEmits(['view', 'change-status']);

const { t } = useI18n();

function statusKey(status) {
  return `attendance.status.${status}`;
}

function statusIcon(status) {
  return {
    waiting: 'location_on',
    on_board: 'directions_bus',
    arrived: 'where_to_vote',
    absent: 'cancel',
    pending_confirmation: 'pending_actions'
  }[status] ?? 'help';
}

function quickActions() {
  const current = props.record.status;
  const actions = [];
  if (current !== 'on_board') actions.push({ status: 'on_board', icon: 'directions_bus', label: 'attendance.actions.board' });
  if (current !== 'arrived') actions.push({ status: 'arrived', icon: 'where_to_vote', label: 'attendance.actions.arrived' });
  if (current !== 'absent') actions.push({ status: 'absent', icon: 'cancel', label: 'attendance.actions.absent' });
  return actions;
}
</script>

<template>
  <article class="status-card" :class="'status-' + record.status">
    <div class="card-topline">
      <div class="student-avatar">{{ record.initials }}</div>
      <div>
        <h3>{{ record.studentName }}</h3>
        <p>{{ record.studentCode }} · {{ record.grade }}</p>
      </div>
      <span class="status-pill" :class="'status-' + record.status">
        <i class="material-symbols-outlined">{{ statusIcon(record.status) }}</i>
        {{ t(statusKey(record.status)) }}
      </span>
    </div>

    <div class="card-meta">
      <span><i class="material-symbols-outlined">route</i>{{ record.routeName }}</span>
      <span><i class="material-symbols-outlined">directions_bus</i>{{ record.vehiclePlate }}</span>
      <span><i class="material-symbols-outlined">person</i>{{ record.driverName }}</span>
      <span><i class="material-symbols-outlined">location_on</i>{{ record.pickupPoint }}</span>
    </div>

    <div class="card-times">
      <div>
        <span>{{ t('attendance.card.checkIn') }}</span>
        <strong>{{ record.checkInTime ?? '—' }}</strong>
      </div>
      <div>
        <span>{{ t('attendance.card.dropOff') }}</span>
        <strong>{{ record.dropOffTime ?? '—' }}</strong>
      </div>
      <div>
        <span>{{ t('attendance.card.eta') }}</span>
        <strong>{{ record.estimatedArrival }}</strong>
      </div>
    </div>

    <div class="reliability-line">
      <div>
        <span>{{ t('attendance.card.reliability') }}</span>
        <strong>{{ record.reliability }}%</strong>
      </div>
      <div class="progress-track"><span :style="{ width: record.reliability + '%' }"></span></div>
    </div>

    <footer>
      <button class="link-button" type="button" @click="emit('view', record)">
        <i class="material-symbols-outlined">visibility</i>
        {{ t('attendance.actions.detail') }}
      </button>
      <div class="quick-actions">
        <button
            v-for="action in quickActions()"
            :key="action.status"
            type="button"
            class="icon-action"
            :title="t(action.label)"
            @click="emit('change-status', { record, status: action.status })"
        >
          <i class="material-symbols-outlined">{{ action.icon }}</i>
        </button>
      </div>
    </footer>
  </article>
</template>

<style scoped>
.status-card {
  border: 1px solid var(--kw-border);
  border-radius: 20px;
  padding: 18px;
  background: #fff;
  box-shadow: 0 10px 28px rgba(15, 78, 123, 0.05);
  display: grid;
  gap: 12px;
}
.card-topline { display: flex; gap: 12px; align-items: flex-start; }
.student-avatar {
  width: 44px; height: 44px; border-radius: 15px;
  flex: 0 0 auto; display: grid; place-items: center;
  color: #fff; background: linear-gradient(135deg, #1683d5, #0f5f9f);
  font-weight: 950;
}
.card-topline h3 { margin: 0; font-size: 1.05rem; }
.card-topline p { margin: 3px 0 0; color: var(--kw-muted); font-size: .85rem; }

.status-pill {
  margin-left: auto;
  display: inline-flex;
  align-items: center;
  gap: 5px;
  padding: 6px 10px;
  border-radius: 999px;
  font-size: .72rem;
  font-weight: 900;
  white-space: nowrap;
}
.status-pill .material-symbols-outlined { font-size: 15px; }
.status-pill.status-waiting { color: #64748b; background: #e2e8f0; }
.status-pill.status-on_board { color: #0f5f9a; background: #e6f4ff; }
.status-pill.status-arrived { color: #047857; background: #d1fae5; }
.status-pill.status-absent { color: #b91c1c; background: #fee2e2; }
.status-pill.status-pending_confirmation { color: #b45309; background: #fef3c7; }

.card-meta {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 8px;
  color: #31506d;
  font-size: .82rem;
  font-weight: 800;
}
.card-meta span { display: flex; gap: 6px; align-items: center; min-width: 0; }
.card-meta .material-symbols-outlined { color: #1683d5; font-size: 16px; }

.card-times { display: grid; grid-template-columns: repeat(3, 1fr); gap: 8px; }
.card-times div { padding: 10px; border-radius: 12px; background: #f4f8fc; }
.card-times span { display: block; color: var(--kw-muted); font-size: .7rem; font-weight: 900; }
.card-times strong { display: block; margin-top: 4px; color: var(--kw-ink); font-size: .95rem; }

.reliability-line > div:first-child { display: flex; justify-content: space-between; margin-bottom: 6px; }
.reliability-line span { color: var(--kw-muted); font-size: .72rem; font-weight: 900; }
.reliability-line strong { color: var(--kw-ink); font-size: .85rem; }
.progress-track { height: 8px; border-radius: 999px; background: #e2eef8; overflow: hidden; }
.progress-track span { display: block; height: 100%; border-radius: inherit; background: linear-gradient(90deg, #1683d5, #28c2b1); }

footer { display: flex; justify-content: space-between; align-items: center; gap: 8px; padding-top: 4px; }
.link-button {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  background: transparent;
  border: 0;
  color: #1683d5;
  font-weight: 900;
  cursor: pointer;
  font-size: .85rem;
}
.link-button .material-symbols-outlined { font-size: 17px; }
.quick-actions { display: flex; gap: 6px; }
.icon-action {
  width: 34px; height: 34px;
  border-radius: 12px;
  background: #e6f4ff;
  color: #1683d5;
  border: 0;
  display: grid;
  place-items: center;
  cursor: pointer;
}
.icon-action:hover { background: #cfe8ff; }
.icon-action .material-symbols-outlined { font-size: 18px; }
</style>