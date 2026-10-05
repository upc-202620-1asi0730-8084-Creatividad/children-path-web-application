<script setup>
import { computed, onMounted, ref } from 'vue';
import { useI18n } from 'vue-i18n';
import useAssignmentStore from '@/assignments/application/assignment.store.js';
import AssignmentFormDialog from '../components/assignment-form-dialog.vue';
import AssignmentDetailDialog from '../components/assignment-detail-dialog.vue';

const { t } = useI18n();
const store = useAssignmentStore();

const statusFilters = ['all', 'validated', 'pending', 'conflict', 'inactive'];
const shiftFilters = ['all', 'morning', 'afternoon'];

const showFormDialog = ref(false);
const showDetailDialog = ref(false);
const editingAssignment = ref(null);
const viewingAssignment = ref(null);

const summaryCards = computed(() => {
  const s = store.dashboard.summary;
  return [
    { icon: 'assignment_turned_in', titleKey: 'assignments.metrics.total',     value: s.totalAssignments,          descriptionKey: 'assignments.metrics.totalDescription',     tone: 'blue' },
    { icon: 'verified_user',        titleKey: 'assignments.metrics.validated', value: s.validatedAssignments,      descriptionKey: 'assignments.metrics.validatedDescription', tone: 'green' },
    { icon: 'pending_actions',      titleKey: 'assignments.metrics.pending',   value: s.pendingAssignments,        descriptionKey: 'assignments.metrics.pendingDescription',   tone: 'amber' },
    { icon: 'report_problem',       titleKey: 'assignments.metrics.conflicts', value: s.conflictsDetected,         descriptionKey: 'assignments.metrics.conflictsDescription', tone: 'red' },
    { icon: 'groups',               titleKey: 'assignments.metrics.capacity',  value: `${s.averageCapacity}%`,     descriptionKey: 'assignments.metrics.capacityDescription',  tone: 'blue' }
  ];
});

const showReviewBanner = computed(() =>
    (store.dashboard.summary.pendingAssignments + store.dashboard.summary.conflictsDetected) > 0
);

function statusIcon(status) {
  return {
    all: 'groups',
    validated: 'verified',
    pending: 'pending_actions',
    conflict: 'report_problem',
    inactive: 'block'
  }[status] ?? 'help';
}

function statusLabelKey(status) {
  return `assignments.status.${status}`;
}

function shiftLabelKey(shift) {
  return `assignments.shift.${shift}`;
}

function validationLabelKey(validation) {
  return `assignments.validation.${validation}`;
}

function openCreateDialog() {
  editingAssignment.value = null;
  showFormDialog.value = true;
}

function openEditDialog(assignment) {
  editingAssignment.value = assignment;
  showFormDialog.value = true;
}

function openDetailDialog(assignment) {
  viewingAssignment.value = assignment;
  showDetailDialog.value = true;
}

async function onSaveAssignment(entity) {
  if (!entity.id) {
    entity.id = `AS-${String(Date.now()).slice(-4)}`;
    await store.createAssignment(entity);
  } else {
    await store.updateAssignment(entity);
  }
}

function onSelectStatus(status) {
  store.selectStatus(status);
}

function onSelectShift(shift) {
  store.selectShift(shift);
}

onMounted(() => {
  store.fetchDashboard();
});
</script>

<template>
  <section class="assignment-page">
    <!-- Hero -->
    <header class="hero-panel">
      <div>
        <small>{{ t('assignments.hero.eyebrow') }}</small>
        <h1>{{ t('assignments.hero.title') }}</h1>
        <p>{{ t('assignments.hero.subtitle') }}</p>
      </div>
      <div class="hero-badge">
        <span>{{ t('assignments.hero.readiness') }}</span>
        <strong>{{ store.dashboard.summary.assignmentReadiness }}%</strong>
      </div>
    </header>

    <!-- Metrics -->
    <section class="metrics-grid">
      <article
          v-for="metric in summaryCards"
          :key="metric.titleKey"
          class="metric-card"
          :class="metric.tone"
      >
        <div class="metric-icon"><i class="material-symbols-outlined">{{ metric.icon }}</i></div>
        <span>{{ t(metric.titleKey) }}</span>
        <strong>{{ metric.value }}</strong>
        <small>{{ t(metric.descriptionKey) }}</small>
      </article>
    </section>

    <!-- Review banner -->
    <section v-if="showReviewBanner" class="review-banner">
      <div class="banner-icon"><i class="material-symbols-outlined">warning</i></div>
      <div>
        <strong>{{ t('assignments.banner.title') }}</strong>
        <p>{{ t('assignments.banner.description') }}</p>
      </div>
      <pv-button @click="onSelectStatus('conflict')">
        {{ t('assignments.banner.action') }}
      </pv-button>
    </section>

    <!-- Content grid -->
    <main class="content-grid">
      <section class="primary-card roster-card">
        <div class="section-heading">
          <div>
            <small>{{ t('assignments.roster.eyebrow') }}</small>
            <h2>{{ t('assignments.roster.title') }}</h2>
          </div>
          <pv-button @click="openCreateDialog">
            <i class="material-symbols-outlined">add</i>
            {{ t('assignments.actions.new') }}
          </pv-button>
        </div>

        <div class="filters-row">
          <label class="search-box">
            <i class="material-symbols-outlined">search</i>
            <input
                type="search"
                :placeholder="t('assignments.filters.search')"
                :value="store.searchTerm"
                @input="store.updateSearch($event.target.value)"
            />
          </label>
          <div class="filter-pills">
            <button
                v-for="status in statusFilters"
                :key="status"
                type="button"
                class="filter-pill"
                :class="{ active: store.selectedStatus === status }"
                @click="onSelectStatus(status)"
            >
              <i class="material-symbols-outlined">{{ statusIcon(status) }}</i>
              {{ status === 'all' ? t('assignments.filters.allStatuses') : t(statusLabelKey(status)) }}
            </button>
          </div>
        </div>

        <div class="shift-tabs">
          <button
              v-for="shift in shiftFilters"
              :key="shift"
              type="button"
              :class="{ active: store.selectedShift === shift }"
              @click="onSelectShift(shift)"
          >
            {{ shift === 'all' ? t('assignments.filters.allShifts') : t(shiftLabelKey(shift)) }}
          </button>
        </div>

        <div class="assignment-cards">
          <article
              v-for="assignment in store.filteredAssignments"
              :key="assignment.id"
              class="assignment-card"
              :class="'status-' + assignment.status"
          >
            <div class="card-topline">
              <div class="student-avatar">{{ assignment.initials }}</div>
              <div>
                <h3>{{ assignment.studentName }}</h3>
                <p>{{ assignment.studentCode }} · {{ assignment.grade }}</p>
              </div>
              <span class="status-pill" :class="'status-' + assignment.status">
                {{ t(statusLabelKey(assignment.status)) }}
              </span>
            </div>

            <div class="assignment-meta">
              <span><i class="material-symbols-outlined">route</i>{{ assignment.routeName }}</span>
              <span><i class="material-symbols-outlined">directions_bus</i>{{ assignment.vehiclePlate }}</span>
              <span><i class="material-symbols-outlined">person</i>{{ assignment.driverName }}</span>
              <span><i class="material-symbols-outlined">schedule</i>{{ t(shiftLabelKey(assignment.shift)) }}</span>
            </div>

            <div class="assignment-details">
              <div>
                <span>{{ t('assignments.card.pickupPoint') }}</span>
                <strong>{{ assignment.pickupPoint }}</strong>
              </div>
              <div>
                <span>{{ t('assignments.card.pickupWindow') }}</span>
                <strong>{{ assignment.pickupWindow }}</strong>
              </div>
              <div>
                <span>{{ t('assignments.card.validation') }}</span>
                <strong>{{ t(validationLabelKey(assignment.validation)) }}</strong>
              </div>
            </div>

            <div class="progress-line">
              <div>
                <span>{{ t('assignments.card.validationScore') }}</span>
                <strong>{{ assignment.validationScore }}%</strong>
              </div>
              <div class="progress-track"><span :style="{ width: assignment.validationScore + '%' }"></span></div>
            </div>

            <footer>
              <span :class="{ warn: assignment.status !== 'validated' }">
                <i class="material-symbols-outlined">
                  {{ assignment.status === 'validated' ? 'verified' : 'priority_high' }}
                </i>
                {{ assignment.status === 'validated' ? t('assignments.card.ready') : t('assignments.card.needsReview') }}
              </span>
              <div class="card-actions">
                <button type="button" class="icon-action" @click="openEditDialog(assignment)">
                  <i class="material-symbols-outlined">edit</i>
                </button>
                <button type="button" class="icon-action" @click="openDetailDialog(assignment)">
                  <i class="material-symbols-outlined">arrow_forward</i>
                </button>
              </div>
            </footer>
          </article>

          <article v-if="store.filteredAssignments.length === 0" class="empty-state">
            <i class="material-symbols-outlined">search_off</i>
            <h3>{{ t('assignments.empty.title') }}</h3>
            <p>{{ t('assignments.empty.description') }}</p>
          </article>
        </div>
      </section>

      <aside class="side-stack">
        <article class="primary-card readiness-card">
          <div class="section-heading compact">
            <div>
              <small>{{ t('assignments.readiness.eyebrow') }}</small>
              <h2>{{ t('assignments.readiness.title') }}</h2>
            </div>
            <span>{{ store.dashboard.summary.assignmentReadiness }}%</span>
          </div>
          <div
              class="donut"
              :style="{
              background: `radial-gradient(circle at center, #fff 0 48%, transparent 49%), conic-gradient(#1683d5 ${store.dashboard.summary.assignmentReadiness}%, #e2eef8 0)`
            }"
          >
            <strong>{{ store.dashboard.summary.assignmentReadiness }}%</strong>
            <span>{{ t('assignments.readiness.caption') }}</span>
          </div>
          <div class="legend-row">
            <span><i class="ok"></i>{{ t('assignments.status.validated') }}</span>
            <span><i class="pending"></i>{{ t('assignments.status.pending') }}</span>
            <span><i class="conflict"></i>{{ t('assignments.status.conflict') }}</span>
          </div>
        </article>

        <article class="primary-card reviews-card">
          <div class="section-heading compact">
            <div>
              <small>{{ t('assignments.reviews.eyebrow') }}</small>
              <h2>{{ t('assignments.reviews.title') }}</h2>
            </div>
            <span>{{ store.dashboard.reviews.length }} {{ t('assignments.reviews.items') }}</span>
          </div>
          <div class="review-list">
            <article
                v-for="review in store.dashboard.reviews"
                :key="review.id"
                class="review-item"
                :class="review.severity"
            >
              <div class="review-icon">
                <i class="material-symbols-outlined">{{ review.severity === 'high' ? 'priority_high' : 'rule' }}</i>
              </div>
              <div>
                <h3>{{ review.title }}</h3>
                <p>{{ review.description }}</p>
                <strong>{{ review.assignmentCode }}</strong>
              </div>
              <span>{{ review.severity }}</span>
            </article>
          </div>
        </article>
      </aside>
    </main>

    <!-- Bottom grid -->
    <section class="bottom-grid">
      <article class="primary-card table-card">
        <div class="section-heading">
          <div>
            <small>{{ t('assignments.registry.eyebrow') }}</small>
            <h2>{{ t('assignments.registry.title') }}</h2>
          </div>
          <pv-button outlined @click="store.exportCsv">
            <i class="material-symbols-outlined">download</i>
            {{ t('assignments.actions.export') }}
          </pv-button>
        </div>

        <div class="table-scroll">
          <table>
            <thead>
            <tr>
              <th>{{ t('assignments.table.student') }}</th>
              <th>{{ t('assignments.table.route') }}</th>
              <th>{{ t('assignments.table.vehicle') }}</th>
              <th>{{ t('assignments.table.driver') }}</th>
              <th>{{ t('assignments.table.score') }}</th>
              <th>{{ t('assignments.table.status') }}</th>
              <th>{{ t('assignments.table.actions') }}</th>
            </tr>
            </thead>
            <tbody>
            <tr v-for="assignment in store.filteredAssignments" :key="assignment.id">
              <td>
                <strong>{{ assignment.studentName }}</strong>
                <small>{{ assignment.studentCode }}</small>
              </td>
              <td>{{ assignment.routeName }}</td>
              <td>{{ assignment.vehiclePlate }}</td>
              <td>{{ assignment.driverName }}</td>
              <td>
                <div class="table-score">
                  <span>{{ assignment.validationScore }}%</span>
                  <i><b :style="{ width: assignment.validationScore + '%' }"></b></i>
                </div>
              </td>
              <td>
                  <span class="status-pill" :class="'status-' + assignment.status">
                    {{ t(statusLabelKey(assignment.status)) }}
                  </span>
              </td>
              <td>
                <div class="row-actions">
                  <button type="button" @click="openDetailDialog(assignment)"><i class="material-symbols-outlined">visibility</i></button>
                  <button type="button" @click="openEditDialog(assignment)"><i class="material-symbols-outlined">edit</i></button>
                  <button type="button" @click="store.markValidated(assignment)"><i class="material-symbols-outlined">check_circle</i></button>
                  <button type="button" class="danger" @click="store.deleteAssignment(assignment.id)"><i class="material-symbols-outlined">delete</i></button>
                </div>
              </td>
            </tr>
            </tbody>
          </table>
        </div>
      </article>

      <article class="primary-card timeline-card">
        <div class="section-heading compact">
          <div>
            <small>{{ t('assignments.timeline.eyebrow') }}</small>
            <h2>{{ t('assignments.timeline.title') }}</h2>
          </div>
          <span>{{ t('assignments.timeline.today') }}</span>
        </div>
        <div class="timeline-list">
          <article
              v-for="activity in store.dashboard.activities"
              :key="activity.id"
              class="timeline-item"
              :class="activity.status"
          >
            <i></i>
            <div>
              <strong>{{ activity.time }}</strong>
              <h3>{{ activity.title }}</h3>
              <p>{{ activity.description }}</p>
            </div>
          </article>
        </div>
      </article>
    </section>

    <!-- Dialogs -->
    <assignment-form-dialog
        v-model:visible="showFormDialog"
        :data="editingAssignment"
        @save="onSaveAssignment"
    />

    <assignment-detail-dialog
        v-model:visible="showDetailDialog"
        :assignment="viewingAssignment"
    />
  </section>
</template>

<style scoped>
.assignment-page {
  padding: 32px;
  display: grid;
  gap: 26px;
  color: #0f172a;
}

.hero-panel,
.primary-card,
.metric-card,
.review-banner {
  border: 1px solid rgba(226, 232, 240, 0.9);
  background: rgba(255, 255, 255, 0.88);
  box-shadow: 0 20px 60px rgba(15, 78, 123, 0.09);
}

.hero-panel {
  min-height: 148px;
  border-radius: 28px;
  padding: 30px 34px;
  display: flex;
  justify-content: space-between;
  gap: 24px;
  align-items: center;
  background:
      radial-gradient(circle at 88% 25%, rgba(255, 184, 45, 0.25), transparent 22%),
      radial-gradient(circle at 45% 0%, rgba(40, 194, 177, 0.16), transparent 30%),
      linear-gradient(120deg, rgba(255, 255, 255, 0.94), rgba(231, 245, 255, 0.86));
}

.hero-panel small,
.section-heading small {
  color: #1683d5;
  font-weight: 950;
  letter-spacing: 0.14em;
  text-transform: uppercase;
}

.hero-panel h1 {
  margin: 8px 0;
  font-size: clamp(2.4rem, 5vw, 4rem);
  line-height: 0.95;
  letter-spacing: -0.075em;
}

.hero-panel p {
  margin: 0;
  color: var(--kw-muted);
  max-width: 680px;
  font-size: 1.04rem;
}

.hero-badge {
  min-width: 128px;
  border-radius: 20px;
  padding: 16px 18px;
  background: #ffffff;
  text-align: center;
  box-shadow: 0 12px 30px rgba(15, 78, 123, 0.1);
}
.hero-badge span { color: var(--kw-muted); font-size: 0.75rem; font-weight: 850; }
.hero-badge strong { display: block; color: #1683d5; font-size: 2rem; letter-spacing: -0.06em; }

.metrics-grid { display: grid; grid-template-columns: repeat(5, minmax(0, 1fr)); gap: 18px; }
.metric-card {
  min-height: 118px;
  border-radius: 20px;
  padding: 20px;
  position: relative;
  overflow: hidden;
}
.metric-card::after {
  content: '';
  position: absolute;
  right: -26px;
  bottom: -26px;
  width: 84px;
  height: 84px;
  border-radius: 50%;
  background: rgba(22, 131, 213, 0.11);
}
.metric-icon {
  width: 34px;
  height: 34px;
  border-radius: 12px;
  display: grid;
  place-items: center;
  background: #e6f4ff;
  color: #1683d5;
  margin-bottom: 12px;
}
.metric-card.green .metric-icon { background: #d1fae5; color: #047857; }
.metric-card.amber .metric-icon { background: #fef3c7; color: #b45309; }
.metric-card.red .metric-icon { background: #fee2e2; color: #b91c1c; }
.metric-card span, .metric-card small { display: block; color: var(--kw-muted); }
.metric-card span { font-weight: 850; font-size: 0.82rem; }
.metric-card strong { display: block; margin: 4px 0 5px; font-size: 2rem; letter-spacing: -0.06em; }
.metric-card small { font-size: 0.78rem; }

.review-banner {
  border-radius: 20px;
  padding: 18px 22px;
  display: grid;
  grid-template-columns: auto 1fr auto;
  gap: 16px;
  align-items: center;
  background: linear-gradient(90deg, rgba(255, 251, 235, 0.98), rgba(255, 255, 255, 0.88));
  border-color: rgba(251, 191, 36, 0.55);
}
.banner-icon {
  width: 44px;
  height: 44px;
  border-radius: 14px;
  display: grid;
  place-items: center;
  background: #fef3c7;
  color: #b45309;
}
.review-banner strong { color: #854d0e; }
.review-banner p { margin: 4px 0 0; color: var(--kw-muted); }

.content-grid {
  display: grid;
  grid-template-columns: minmax(0, 1fr) 320px;
  gap: 26px;
  align-items: start;
}

.primary-card { border-radius: 24px; padding: 22px; }

.section-heading {
  display: flex;
  justify-content: space-between;
  gap: 18px;
  align-items: center;
  margin-bottom: 16px;
}
.section-heading h2 { margin: 4px 0 0; font-size: 1.9rem; letter-spacing: -0.055em; }
.section-heading.compact h2 { font-size: 1.55rem; }
.section-heading > span {
  padding: 8px 12px;
  border-radius: 999px;
  background: #e6f4ff;
  color: #1683d5;
  font-weight: 900;
  font-size: 0.8rem;
}

.filters-row {
  display: flex;
  justify-content: space-between;
  gap: 14px;
  align-items: center;
  margin-bottom: 12px;
}

.search-box {
  flex: 1;
  display: flex;
  align-items: center;
  gap: 10px;
  min-height: 44px;
  border: 1px solid #dbe6f1;
  border-radius: 14px;
  padding: 0 14px;
  background: #fff;
  color: #1683d5;
}
.search-box input {
  width: 100%;
  border: 0;
  outline: 0;
  background: transparent;
  color: #0f172a;
}

.filter-pills, .shift-tabs, .card-actions, .row-actions, .legend-row {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}

.filter-pill, .shift-tabs button, .icon-action, .row-actions button {
  border: 1px solid #dbe6f1;
  background: #f8fbff;
  color: #31506d;
  cursor: pointer;
  transition: 160ms ease;
}

.filter-pill {
  min-height: 44px;
  border-radius: 999px;
  padding: 0 12px;
  display: inline-flex;
  align-items: center;
  gap: 7px;
  font-weight: 900;
}
.filter-pill .material-symbols-outlined,
.icon-action .material-symbols-outlined,
.row-actions .material-symbols-outlined { font-size: 18px; }

.filter-pill.active, .shift-tabs button.active {
  color: #fff;
  background: linear-gradient(135deg, #1683d5, #0f5f9f);
  border-color: transparent;
  box-shadow: 0 10px 24px rgba(22, 131, 213, 0.22);
}

.shift-tabs { margin: 12px 0 18px; }
.shift-tabs button {
  border-radius: 999px;
  padding: 9px 16px;
  font-weight: 900;
}

.assignment-cards {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 16px;
}
.assignment-card {
  border: 1px solid var(--kw-border);
  border-radius: 20px;
  padding: 18px;
  background: #fff;
  box-shadow: 0 10px 28px rgba(15, 78, 123, 0.05);
}
.card-topline {
  display: flex;
  gap: 12px;
  align-items: flex-start;
}
.student-avatar {
  width: 44px;
  height: 44px;
  border-radius: 15px;
  flex: 0 0 auto;
  display: grid;
  place-items: center;
  color: #fff;
  background: linear-gradient(135deg, #1683d5, #0f5f9f);
  font-weight: 950;
}
.card-topline h3 { margin: 0; font-size: 1.05rem; }
.card-topline p { margin: 3px 0 0; color: var(--kw-muted); }

.status-pill {
  margin-left: auto;
  display: inline-flex;
  align-items: center;
  border-radius: 999px;
  padding: 6px 10px;
  font-size: 0.76rem;
  font-weight: 950;
  text-transform: capitalize;
}
.status-validated { color: #047857; background: #d1fae5; }
.status-pending { color: #b45309; background: #fef3c7; }
.status-conflict { color: #b91c1c; background: #fee2e2; }
.status-inactive { color: #475569; background: #e2e8f0; }

.assignment-meta {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 9px;
  margin: 14px 0;
  color: #31506d;
  font-weight: 800;
  font-size: 0.82rem;
}
.assignment-meta span { display: flex; gap: 7px; align-items: center; min-width: 0; }
.assignment-meta .material-symbols-outlined { color: #1683d5; font-size: 17px; }

.assignment-details {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 10px;
  margin-bottom: 14px;
}
.assignment-details div {
  border-radius: 14px;
  padding: 11px;
  background: #f4f8fc;
}
.assignment-details span, .progress-line span, .table-score span {
  color: var(--kw-muted);
  font-size: 0.72rem;
  font-weight: 900;
}
.assignment-details strong { display: block; margin-top: 5px; color: #0f172a; }

.progress-line > div:first-child {
  display: flex;
  justify-content: space-between;
  margin-bottom: 7px;
}
.progress-track, .table-score i {
  display: block;
  height: 8px;
  border-radius: 999px;
  background: #e2eef8;
  overflow: hidden;
}
.progress-track span, .table-score b {
  display: block;
  height: 100%;
  border-radius: inherit;
  background: linear-gradient(90deg, #1683d5, #28c2b1);
}

.assignment-card footer {
  display: flex;
  justify-content: space-between;
  gap: 12px;
  align-items: center;
  margin-top: 14px;
}
.assignment-card footer > span {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  color: #047857;
  font-weight: 900;
  font-size: 0.82rem;
}
.assignment-card footer > span.warn { color: #b45309; }
.assignment-card footer .material-symbols-outlined { font-size: 17px; }

.icon-action, .row-actions button {
  width: 34px;
  height: 34px;
  border-radius: 12px;
  display: grid;
  place-items: center;
  color: #1683d5;
}
.icon-action:hover, .row-actions button:hover { background: #e6f4ff; }
.row-actions button.danger { color: #dc2626; }

.side-stack { display: grid; gap: 20px; }

.readiness-card { text-align: center; }
.readiness-card .section-heading { text-align: left; }

.donut {
  width: 178px;
  height: 178px;
  margin: 16px auto 12px;
  border-radius: 50%;
  display: grid;
  place-items: center;
  text-align: center;
}
.donut strong { color: #0f5f9f; font-size: 2.35rem; letter-spacing: -0.06em; line-height: 1; }
.donut span { color: var(--kw-muted); font-weight: 900; font-size: 0.72rem; }

.legend-row { justify-content: center; font-weight: 800; color: var(--kw-muted); font-size: 0.78rem; }
.legend-row span { display: inline-flex; align-items: center; gap: 6px; }
.legend-row i { width: 9px; height: 9px; border-radius: 50%; }
.legend-row .ok { background: #22c55e; }
.legend-row .pending { background: #f59e0b; }
.legend-row .conflict { background: #ef4444; }

.review-list, .timeline-list { display: grid; gap: 12px; }

.review-item, .timeline-item {
  border: 1px solid var(--kw-border);
  border-radius: 18px;
  background: #fff;
  padding: 14px;
}

.review-item {
  display: grid;
  grid-template-columns: auto 1fr auto;
  gap: 12px;
  align-items: start;
}
.review-icon {
  width: 36px;
  height: 36px;
  border-radius: 13px;
  display: grid;
  place-items: center;
  background: #fef3c7;
  color: #b45309;
}
.review-item.high .review-icon { background: #fee2e2; color: #dc2626; }
.review-item h3, .timeline-item h3 { margin: 0; font-size: 0.94rem; }
.review-item p, .timeline-item p { margin: 5px 0; color: var(--kw-muted); font-size: 0.82rem; }
.review-item strong { font-size: 0.78rem; color: #0f5f9f; }
.review-item > span {
  border-radius: 999px;
  padding: 5px 8px;
  font-weight: 900;
  color: #b91c1c;
  background: #fee2e2;
  font-size: 0.7rem;
  text-transform: capitalize;
}
.review-item.medium > span { color: #b45309; background: #fef3c7; }

.bottom-grid {
  display: grid;
  grid-template-columns: minmax(0, 1fr) 360px;
  gap: 26px;
}

.table-scroll { overflow-x: auto; max-width: 100%; }
table { width: 100%; border-collapse: collapse; min-width: 880px; }
th {
  text-align: left;
  padding: 13px 14px;
  color: var(--kw-muted);
  background: #f1f6fb;
  font-size: 0.75rem;
  letter-spacing: 0.08em;
  text-transform: uppercase;
}
td {
  padding: 14px;
  border-bottom: 1px solid #edf2f7;
  color: #31506d;
}
td strong, td small { display: block; }
td strong { color: #0f172a; }
td small { color: var(--kw-muted); margin-top: 3px; }
.table-score { min-width: 120px; }

.timeline-item { display: flex; gap: 12px; }
.timeline-item i {
  width: 12px;
  height: 12px;
  margin-top: 5px;
  border-radius: 50%;
  background: #22c55e;
  box-shadow: 0 0 0 5px rgba(34, 197, 94, 0.12);
}
.timeline-item.active i { background: #1683d5; box-shadow: 0 0 0 5px rgba(22, 131, 213, 0.12); }
.timeline-item.pending i { background: #f59e0b; box-shadow: 0 0 0 5px rgba(245, 158, 11, 0.12); }
.timeline-item strong { color: #1683d5; font-size: 0.78rem; }

.empty-state {
  grid-column: 1 / -1;
  border: 1px dashed #cbd5e1;
  border-radius: 20px;
  padding: 36px;
  text-align: center;
  color: var(--kw-muted);
}
.empty-state .material-symbols-outlined { color: #1683d5; font-size: 42px; }

@media (max-width: 1380px) { .assignment-cards { grid-template-columns: repeat(2, minmax(0, 1fr)); } }
@media (max-width: 1200px) {
  .metrics-grid { grid-template-columns: repeat(2, minmax(0, 1fr)); }
  .content-grid, .bottom-grid { grid-template-columns: 1fr; }
}
@media (max-width: 760px) {
  .assignment-page { padding: 20px; }
  .hero-panel, .review-banner, .filters-row, .section-heading { flex-direction: column; align-items: stretch; }
  .review-banner { grid-template-columns: 1fr; }
  .metrics-grid, .assignment-cards, .assignment-details, .assignment-meta { grid-template-columns: 1fr; }
}
</style>