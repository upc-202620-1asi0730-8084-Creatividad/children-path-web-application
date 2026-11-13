<script setup>
import { computed, onMounted, ref } from 'vue';
import { useI18n } from 'vue-i18n';
import useAttendanceStore from '@/attendance/application/attendance.store.js';
import AttendanceKpiCard from '../components/attendance-kpi-card.vue';
import AttendanceStatusCard from '../components/attendance-status-card.vue';
import AttendanceReadinessPanel from '../components/attendance-readiness-panel.vue';
import AttendanceDetailDialog from '../components/attendance-detail-dialog.vue';

const { t } = useI18n();
const store = useAttendanceStore();

const statusFilters = ['all', 'waiting', 'on_board', 'arrived', 'absent', 'pending_confirmation'];

const showDetailDialog = ref(false);
const viewingRecord = ref(null);

const kpis = computed(() => {
  const s = store.summary;
  return [
    { icon: 'fact_check',       label: 'attendance.kpis.total',      value: s.totalAssigned,       helper: 'attendance.kpis.totalHelper',      tone: 'blue' },
    { icon: 'directions_bus',   label: 'attendance.kpis.onBoard',    value: s.onBoard,             helper: 'attendance.kpis.onBoardHelper',    tone: 'blue' },
    { icon: 'where_to_vote',    label: 'attendance.kpis.arrived',    value: s.arrived,             helper: 'attendance.kpis.arrivedHelper',    tone: 'green' },
    { icon: 'location_on',      label: 'attendance.kpis.waiting',    value: s.waiting,             helper: 'attendance.kpis.waitingHelper',    tone: 'amber' },
    { icon: 'cancel',           label: 'attendance.kpis.absent',     value: s.absent,              helper: 'attendance.kpis.absentHelper',     tone: 'red' }
  ];
});

function statusIcon(status) {
  return {
    all: 'fact_check',
    waiting: 'location_on',
    on_board: 'directions_bus',
    arrived: 'where_to_vote',
    absent: 'cancel',
    pending_confirmation: 'pending_actions'
  }[status] ?? 'help';
}

function statusKey(status) {
  return status === 'all' ? 'attendance.filters.all' : `attendance.status.${status}`;
}

function openDetail(record) {
  viewingRecord.value = record;
  showDetailDialog.value = true;
}

function onChangeStatus({ record, status }) {
  store.changeStatus(record, status);
}

onMounted(() => {
  store.fetchDashboard();
});
</script>

<template>
  <section class="attendance-page">
    <!-- Hero -->
    <header class="hero-panel">
      <div>
        <small>{{ t('attendance.hero.eyebrow') }}</small>
        <h1>{{ t('attendance.hero.title') }}</h1>
        <p>{{ t('attendance.hero.subtitle') }}</p>
      </div>
      <div class="hero-badge">
        <span>{{ t('attendance.hero.reliability') }}</span>
        <strong>{{ store.summary.attendanceReliability }}%</strong>
      </div>
    </header>

    <!-- KPIs -->
    <section class="metrics-grid">
      <attendance-kpi-card
          v-for="kpi in kpis"
          :key="kpi.label"
          :icon="kpi.icon"
          :label="t(kpi.label)"
          :value="kpi.value"
          :helper="t(kpi.helper)"
          :tone="kpi.tone"
      />
    </section>

    <!-- Content grid -->
    <main class="content-grid">
      <section class="primary-card">
        <div class="section-heading">
          <div>
            <small>{{ t('attendance.roster.eyebrow') }}</small>
            <h2>{{ t('attendance.roster.title') }}</h2>
          </div>
          <pv-button outlined @click="store.exportCsv">
            <i class="material-symbols-outlined">download</i>
            {{ t('attendance.actions.export') }}
          </pv-button>
        </div>

        <div class="filters-row">
          <label class="search-box">
            <i class="material-symbols-outlined">search</i>
            <input
                type="search"
                :placeholder="t('attendance.filters.search')"
                :value="store.searchTerm"
                @input="store.setSearchTerm($event.target.value)"
            />
          </label>
          <pv-select
              v-model="store.selectedRoute"
              :options="store.availableRoutes"
              :placeholder="t('attendance.filters.route')"
              class="route-select"
              @update:model-value="store.setRoute($event)"
          />
        </div>

        <div class="status-tabs">
          <button
              v-for="status in statusFilters"
              :key="status"
              type="button"
              class="status-pill-button"
              :class="{ active: store.selectedStatus === status }"
              @click="store.setStatus(status)"
          >
            <i class="material-symbols-outlined">{{ statusIcon(status) }}</i>
            {{ t(statusKey(status)) }}
          </button>
        </div>

        <div class="record-cards">
          <attendance-status-card
              v-for="record in store.filteredRecords"
              :key="record.id"
              :record="record"
              @view="openDetail"
              @change-status="onChangeStatus"
          />

          <article v-if="store.filteredRecords.length === 0" class="empty-state">
            <i class="material-symbols-outlined">search_off</i>
            <h3>{{ t('attendance.empty.title') }}</h3>
            <p>{{ t('attendance.empty.description') }}</p>
          </article>
        </div>
      </section>

      <aside class="side-stack">
        <attendance-readiness-panel :summary="store.summary" />

        <article class="primary-card activity-panel">
          <div class="section-heading compact">
            <div>
              <small>{{ t('attendance.activity.eyebrow') }}</small>
              <h2>{{ t('attendance.activity.title') }}</h2>
            </div>
            <span>{{ t('attendance.activity.today') }}</span>
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
      </aside>
    </main>

    <attendance-detail-dialog
        v-model:visible="showDetailDialog"
        :record="viewingRecord"
        @change-status="onChangeStatus"
    />
  </section>
</template>

<style scoped>
.attendance-page {
  padding: 32px;
  display: grid;
  gap: 26px;
  color: #0f172a;
}

.hero-panel,
.primary-card,
.metric-card {
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
  display: grid;
  grid-template-columns: minmax(260px, 1fr) 220px;
  gap: 14px;
  align-items: center;
  margin-bottom: 14px;
}
.search-box {
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

.status-tabs { display: flex; gap: 8px; flex-wrap: wrap; margin-bottom: 18px; }
.status-pill-button {
  border: 1px solid #dbe6f1;
  background: #f8fbff;
  color: #31506d;
  cursor: pointer;
  border-radius: 999px;
  padding: 8px 14px;
  font-weight: 900;
  font-size: .82rem;
  display: inline-flex;
  align-items: center;
  gap: 6px;
}
.status-pill-button .material-symbols-outlined { font-size: 17px; }
.status-pill-button.active {
  color: #fff;
  background: linear-gradient(135deg, #1683d5, #0f5f9f);
  border-color: transparent;
  box-shadow: 0 10px 24px rgba(22, 131, 213, 0.22);
}

.record-cards {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 16px;
}

.empty-state {
  grid-column: 1 / -1;
  border: 1px dashed #cbd5e1;
  border-radius: 20px;
  padding: 36px;
  text-align: center;
  color: var(--kw-muted);
}
.empty-state .material-symbols-outlined { color: #1683d5; font-size: 42px; }

.side-stack { display: grid; gap: 20px; }

.timeline-list { display: grid; gap: 12px; }
.timeline-item {
  border: 1px solid var(--kw-border);
  border-radius: 18px;
  background: #fff;
  padding: 14px;
  display: flex;
  gap: 12px;
}
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
.timeline-item h3 { margin: 0; font-size: 0.94rem; }
.timeline-item p { margin: 5px 0; color: var(--kw-muted); font-size: 0.82rem; }
.timeline-item strong { color: #1683d5; font-size: 0.78rem; }

@media (max-width: 1200px) {
  .metrics-grid { grid-template-columns: repeat(2, minmax(0, 1fr)); }
  .content-grid { grid-template-columns: 1fr; }
}
@media (max-width: 760px) {
  .attendance-page { padding: 20px; }
  .hero-panel, .filters-row, .section-heading { flex-direction: column; align-items: stretch; }
  .filters-row { grid-template-columns: 1fr; }
  .metrics-grid, .record-cards { grid-template-columns: 1fr; }
}
</style>