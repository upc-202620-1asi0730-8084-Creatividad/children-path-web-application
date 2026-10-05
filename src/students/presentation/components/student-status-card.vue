<script setup>
import { computed } from 'vue';
import { useI18n } from 'vue-i18n';

const props = defineProps({
  student: { type: Object, required: true }
});

const emit = defineEmits(['view']);

const { t } = useI18n();

const fullName = computed(() => `${props.student.firstName}${props.student.lastName}`.trim());
const initials = computed(() =>
    `${props.student.firstName.charAt(0)}${props.student.lastName.charAt(0)}`.toUpperCase()
);
const attendanceWidth = computed(() =>
    Math.max(0, Math.min(100, props.student.attendanceRate))
);
</script>

<template>
  <article class="student-card" :class="student.status">
    <header>
      <div class="student-main">
        <span class="avatar">{{ initials }}</span>
        <div>
          <h3>{{ fullName }}</h3>
          <p>{{ student.code }} · {{ student.grade }}</p>
        </div>
      </div>
      <span class="status-pill" :class="student.status">
        {{ t('studentsPage.status.' + student.status) }}
      </span>
    </header>

    <div class="meta-grid">
      <span><i class="material-symbols-outlined">school</i>{{ student.school }}</span>
      <span><i class="material-symbols-outlined">supervisor_account</i>{{ student.guardianName }}</span>
      <span><i class="material-symbols-outlined">directions_bus</i>{{ student.assignedVehicle ?? t('studentsPage.emptyValue') }}</span>
      <span><i class="material-symbols-outlined">person_pin_circle</i>{{ student.pickupPoint ?? t('studentsPage.emptyValue') }}</span>
    </div>

    <section class="assignment-block">
      <div>
        <small>{{ t('studentsPage.card.route') }}</small>
        <strong v-if="student.routeName">{{ student.routeName }}</strong>
        <strong v-else class="muted">{{ t('studentsPage.unassignedRoute') }}</strong>
      </div>
      <div>
        <small>{{ t('studentsPage.card.driver') }}</small>
        <strong>{{ student.assignedDriver ?? t('studentsPage.pendingAssignment') }}</strong>
      </div>
      <div>
        <small>{{ t('studentsPage.card.window') }}</small>
        <strong>{{ student.pickupWindow ?? t('studentsPage.pendingAssignment') }}</strong>
      </div>
    </section>

    <div class="progress-row">
      <div>
        <span>{{ t('studentsPage.card.attendance') }}</span>
        <strong>{{ student.attendanceRate }}%</strong>
      </div>
      <span class="bar"><i :style="{ width: attendanceWidth + '%' }"></i></span>
    </div>

    <footer>
      <span :class="student.authorizationStatus">
        <i class="material-symbols-outlined">
          {{ student.authorizationStatus === 'verified' ? 'verified' : 'priority_high' }}
        </i>
        {{ t('studentsPage.authorization.' + student.authorizationStatus) }}
      </span>
      <button type="button" @click="emit('view', student)" :aria-label="'View ' + fullName">
        <i class="material-symbols-outlined">arrow_forward</i>
      </button>
    </footer>
  </article>
</template>

<style scoped>
.student-card {
  display: flex;
  flex-direction: column;
  gap: 18px;
  border: 1px solid #dfeaf5;
  border-radius: 18px;
  background: #ffffff;
  box-shadow: 0 14px 30px rgba(17, 55, 88, 0.07);
  padding: 20px;
}
header, .student-main, footer, .progress-row > div { display: flex; align-items: center; }
header, footer, .progress-row > div { justify-content: space-between; }
.student-main { gap: 12px; }
.avatar {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 42px;
  height: 42px;
  border-radius: 15px;
  color: #ffffff;
  background: linear-gradient(135deg, #1c84c7, #126199);
  font-weight: 900;
  letter-spacing: -0.03em;
}
h3 { margin: 0; color: #10233f; font-size: 1rem; font-weight: 900; }
p, small, span { color: #64748b; }
p { margin: 3px 0 0; font-size: 0.82rem; }
.status-pill {
  border-radius: 999px;
  padding: 7px 12px;
  font-size: 0.76rem;
  font-weight: 900;
  text-transform: capitalize;
}
.status-pill.active { color: #067647; background: #dcfce7; }
.status-pill.unassigned { color: #a16207; background: #fef3c7; }
.status-pill.review { color: #b45309; background: #fff7ed; }
.status-pill.inactive { color: #475569; background: #e2e8f0; }
.meta-grid { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 10px; }
.meta-grid span, footer span {
  display: inline-flex;
  align-items: center;
  gap: 7px;
  min-width: 0;
  font-size: 0.8rem;
  font-weight: 700;
}
.assignment-block { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 10px; }
.assignment-block div { border-radius: 14px; background: #f5f9fd; padding: 12px; }
.assignment-block small { display: block; margin-bottom: 4px; font-size: 0.74rem; font-weight: 900; }
.assignment-block strong { color: #10233f; font-size: 0.86rem; }
.assignment-block .muted { color: #b45309; }
.progress-row { display: grid; gap: 8px; }
.progress-row span { font-size: 0.82rem; font-weight: 800; }
.progress-row strong { color: #0f5f98; }
.bar { display: block; overflow: hidden; height: 8px; border-radius: 999px; background: #e7f0f8; }
.bar i { display: block; height: 100%; border-radius: inherit; background: linear-gradient(90deg, #2186c8, #28c4b7); }
footer { padding-top: 2px; }
footer span.verified { color: #0f766e; }
footer span.pending, footer span.expired { color: #c2410c; }
button {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 34px;
  height: 34px;
  border: none;
  border-radius: 12px;
  color: #1782c6;
  background: #e4f3ff;
  cursor: pointer;
}
.meta-grid .material-symbols-outlined,
footer .material-symbols-outlined { font-size: 17px; }
@media (max-width: 760px) {
  header, footer { align-items: flex-start; gap: 12px; flex-direction: column; }
  .meta-grid, .assignment-block { grid-template-columns: 1fr; }
}
</style>
