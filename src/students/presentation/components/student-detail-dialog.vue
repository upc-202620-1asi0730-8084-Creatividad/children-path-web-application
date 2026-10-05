<script setup>
import { computed } from 'vue';
import { useI18n } from 'vue-i18n';

const props = defineProps({
  visible: { type: Boolean, default: false },
  student: { type: Object, default: null }
});

const emit = defineEmits(['update:visible']);

const { t } = useI18n();

const fullName = computed(() =>
    props.student ? `${props.student.firstName}${props.student.lastName}` : ''
);
const initials = computed(() =>
    props.student ? `${props.student.firstName.charAt(0)}${props.student.lastName.charAt(0)}`.toUpperCase() : ''
);

function close() {
  emit('update:visible', false);
}
</script>

<template>
  <pv-dialog
      :visible="visible"
      @update:visible="emit('update:visible', $event)"
      modal
      :style="{ width: '780px' }"
  >
    <template #header>
      <div v-if="student" class="dialog-header">
        <span class="avatar">{{ initials }}</span>
        <div>
          <p>{{ t('studentsPage.dialogs.detailEyebrow') }}</p>
          <h2>{{ fullName }}</h2>
          <small>{{ student.code }} · {{ student.grade }}</small>
        </div>
      </div>
    </template>

    <div v-if="student" class="detail-content">
      <div class="status-row">
        <span class="status-pill" :class="student.status">
          {{ t('studentsPage.status.' + student.status) }}
        </span>
        <span class="auth-pill" :class="student.authorizationStatus">
          <i class="material-symbols-outlined">
            {{ student.authorizationStatus === 'verified' ? 'verified' : 'priority_high' }}
          </i>
          {{ t('studentsPage.authorization.' + student.authorizationStatus) }}
        </span>
      </div>

      <div class="detail-grid">
        <article>
          <small>{{ t('studentsPage.table.school') }}</small>
          <strong>{{ student.school }}</strong>
        </article>
        <article>
          <small>{{ t('studentsPage.table.guardian') }}</small>
          <strong>{{ student.guardianName }}</strong>
          <span>{{ student.guardianPhone }}</span>
        </article>
        <article>
          <small>{{ t('studentsPage.card.route') }}</small>
          <strong>{{ student.routeName ?? t('studentsPage.unassignedRoute') }}</strong>
          <span>{{ student.assignedVehicle ?? t('studentsPage.emptyValue') }}</span>
        </article>
        <article>
          <small>{{ t('studentsPage.card.driver') }}</small>
          <strong>{{ student.assignedDriver ?? t('studentsPage.pendingAssignment') }}</strong>
        </article>
        <article>
          <small>{{ t('studentsPage.card.window') }}</small>
          <strong>{{ student.pickupWindow ?? t('studentsPage.pendingAssignment') }}</strong>
        </article>
        <article>
          <small>{{ t('studentsPage.dialogs.pickupPoint') }}</small>
          <strong>{{ student.pickupPoint ?? t('studentsPage.emptyValue') }}</strong>
        </article>
      </div>

      <div class="progress-block">
        <div>
          <span>{{ t('studentsPage.card.attendance') }}</span>
          <strong>{{ student.attendanceRate }}%</strong>
        </div>
        <span class="bar"><i :style="{ width: student.attendanceRate + '%' }"></i></span>
      </div>

      <div v-if="student.notes" class="notes">
        <small>{{ t('studentsPage.dialogs.notes') }}</small>
        <p>{{ student.notes }}</p>
      </div>
    </div>

    <template #footer>
      <pv-button :label="t('studentsPage.dialogs.close')" @click="close" />
    </template>
  </pv-dialog>
</template>

<style scoped>
.dialog-header {
  display: grid;
  grid-template-columns: auto 1fr;
  gap: 14px;
  align-items: center;
}
.avatar {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 52px;
  height: 52px;
  border-radius: 18px;
  color: #fff;
  background: linear-gradient(135deg, #1c84c7, #126199);
  font-weight: 900;
}
h2, p, small { margin: 0; }
.dialog-header p {
  color: #1682c6;
  font-size: .74rem;
  font-weight: 900;
  letter-spacing: .14em;
  text-transform: uppercase;
}
.dialog-header h2 { color: #0f172a; font-size: 1.7rem; letter-spacing: -.04em; }
.dialog-header small, article span, .progress-block span, .notes p { color: #64748b; }

.detail-content { display: grid; gap: 16px; }
.status-row { display: flex; flex-wrap: wrap; gap: 10px; }
.status-pill, .auth-pill {
  display: inline-flex;
  align-items: center;
  gap: 7px;
  border-radius: 999px;
  padding: 8px 12px;
  font-size: .78rem;
  font-weight: 900;
}
.status-pill.active, .auth-pill.verified { color: #067647; background: #dcfce7; }
.status-pill.unassigned, .auth-pill.pending { color: #a16207; background: #fef3c7; }
.status-pill.review, .auth-pill.expired { color: #b45309; background: #fff7ed; }
.status-pill.inactive { color: #475569; background: #e2e8f0; }

.detail-grid { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 12px; }
article, .progress-block, .notes {
  border: 1px solid #e5eef7;
  border-radius: 16px;
  background: #f8fbfe;
  padding: 14px;
}
article small, .notes small {
  display: block;
  color: #718096;
  font-size: .72rem;
  font-weight: 900;
  text-transform: uppercase;
  letter-spacing: .08em;
  margin-bottom: 5px;
}
article strong { display: block; color: #0f172a; font-size: .95rem; }
.progress-block { display: grid; gap: 9px; }
.progress-block div { display: flex; justify-content: space-between; font-weight: 900; }
.progress-block strong { color: #0f5f98; }
.bar { display: block; overflow: hidden; height: 9px; border-radius: 999px; background: #e7f0f8; }
.bar i { display: block; height: 100%; border-radius: inherit; background: linear-gradient(90deg, #2186c8, #28c4b7); }
.notes p { margin: 0; line-height: 1.45; }
.auth-pill .material-symbols-outlined { font-size: 18px; }

@media (max-width: 620px) {
  .detail-grid { grid-template-columns: 1fr; }
}
</style>
