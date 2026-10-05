<script setup>
import { computed, onMounted } from 'vue';
import { useI18n } from 'vue-i18n';
import useAssignmentStore from '@/application/assignment.store.js';
import { authStore } from '@/iam/application/services/auth.service.js';

const { t } = useI18n();
const store = useAssignmentStore();

const currentParentName = computed(() => authStore.currentUser?.displayName ?? 'Parent');

const myKidsAssignments = computed(() => {
  const parent = currentParentName.value;
  return store.assignments.filter((a) => a.guardianName === parent);
});

function shiftKey(shift) {
  return `assignments.shift.${shift}`;
}

function statusKey(status) {
  return `assignments.status.${status}`;
}

onMounted(() => {
  store.fetchDashboard();
});
</script>

<template>
  <section class="parent-page">
    <div class="page-header">
      <small class="breadcrumbs">{{ t('assignments.management.breadcrumbs') }}</small>
      <h1>{{ t('assignments.tracking.title') }}</h1>
      <p>{{ t('assignments.tracking.subtitle') }} <strong>{{ currentParentName }}</strong>.</p>
    </div>

    <section class="stats-grid">
      <article class="stat-card">
        <div class="stat-icon"><i class="material-symbols-outlined">family_restroom</i></div>
        <div class="stat-info">
          <small>{{ t('assignments.tracking.stats.total_kids') }}</small>
          <strong>{{ myKidsAssignments.length }}</strong>
        </div>
      </article>
    </section>

    <div class="table-container">
      <div class="toolbar">
        <h3>{{ t('assignments.tracking.table_title') }}</h3>
      </div>

      <table class="kw-table">
        <thead>
        <tr>
          <th>{{ t('assignments.management.table.student') }}</th>
          <th>{{ t('assignments.management.table.route') }}</th>
          <th>{{ t('assignments.management.table.vehicle') }}</th>
          <th>{{ t('assignments.management.table.shift') }}</th>
          <th>{{ t('assignments.management.table.status') }}</th>
        </tr>
        </thead>
        <tbody>
        <tr v-for="assignment in myKidsAssignments" :key="assignment.id">
          <td>
            <div class="student-info">
              <strong>{{ assignment.studentName }}</strong>
              <small>{{ assignment.studentCode }}</small>
            </div>
          </td>
          <td><span>{{ assignment.routeName }}</span></td>
          <td><strong>{{ assignment.vehiclePlate }}</strong></td>
          <td>
            <div class="shift-tag">
              <i class="material-symbols-outlined">
                {{ assignment.shift === 'morning' ? 'wb_sunny' : 'nights_stay' }}
              </i>
              {{ t(shiftKey(assignment.shift)) }}
            </div>
          </td>
          <td>
              <span class="status-pill" :class="'status-' + assignment.status">
                {{ t(statusKey(assignment.status)) }}
              </span>
          </td>
        </tr>
        <tr v-if="myKidsAssignments.length === 0">
          <td colspan="5" class="empty-msg">{{ t('assignments.tracking.no_data') }}</td>
        </tr>
        </tbody>
      </table>
    </div>
  </section>
</template>

<style scoped>
.parent-page { padding: 24px; color: #334155; }
.page-header { margin-bottom: 24px; }
.breadcrumbs { color: var(--kw-muted); font-size: 0.85rem; font-weight: 600; }
.page-header h1 { margin: 8px 0 4px; font-size: 2rem; letter-spacing: -0.03em; color: #0f172a; }
.page-header p { margin: 0; color: var(--kw-muted); }

.stats-grid { margin-bottom: 24px; }
.stat-card {
  background: #ffffff;
  border: 1px solid var(--kw-border);
  border-radius: 16px;
  padding: 20px;
  display: inline-flex;
  align-items: center;
  gap: 16px;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05);
  min-width: 280px;
}
.stat-icon {
  width: 48px;
  height: 48px;
  border-radius: 12px;
  display: flex;
  justify-content: center;
  align-items: center;
  color: white;
  background-color: #3b82f6;
}
.stat-info { display: flex; flex-direction: column; }
.stat-info small { color: var(--kw-muted); font-size: 0.8rem; font-weight: 600; text-transform: uppercase; }
.stat-info strong { font-size: 1.8rem; font-weight: 800; color: #0f172a; }

.table-container {
  background: #ffffff;
  border-radius: 16px;
  border: 1px solid var(--kw-border);
  overflow: hidden;
}
.toolbar { padding: 20px; border-bottom: 1px solid var(--kw-border); background: #f8fafc; }
.toolbar h3 { margin: 0; font-size: 1.1rem; color: #0f172a; }

.kw-table { width: 100%; border-collapse: collapse; }
th {
  padding: 13px 16px;
  font-size: 0.75rem;
  font-weight: 700;
  color: var(--kw-muted);
  text-transform: uppercase;
  text-align: left;
  background: #f8fafc;
  border-bottom: 1px solid var(--kw-border);
}
td { padding: 16px; border-bottom: 1px solid #f1f5f9; }
.student-info { display: flex; flex-direction: column; }
.student-info strong { color: #0f172a; }
.student-info small { color: #94a3b8; }

.shift-tag {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  background: #f1f5f9;
  padding: 4px 10px;
  border-radius: 8px;
  font-size: 0.85rem;
}
.shift-tag .material-symbols-outlined { font-size: 16px; }

.status-pill {
  display: inline-flex;
  align-items: center;
  padding: 4px 10px;
  border-radius: 999px;
  font-weight: 700;
  font-size: 0.85rem;
}
.status-validated { color: #065f46; background-color: #d1fae5; }
.status-pending { color: #b45309; background-color: #fef3c7; }
.status-conflict { color: #991b1b; background-color: #fee2e2; }
.status-inactive { color: #475569; background-color: #e2e8f0; }

.empty-msg { text-align: center; padding: 40px !important; color: #94a3b8; }
</style>