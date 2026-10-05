<script setup>
import { computed, onMounted, ref } from 'vue';
import { useI18n } from 'vue-i18n';
import useStudentsStore from '@/students/application/students.store.js';
import StudentKpiCard from '../components/student-kpi-card.vue';
import StudentStatusCard from '../components/student-status-card.vue';
import StudentReadinessPanel from '../components/student-readiness-panel.vue';
import StudentDetailDialog from '../components/student-detail-dialog.vue';
import StudentFormDialog from '../components/student-form-dialog.vue';

const { t } = useI18n();
const store = useStudentsStore();

const statusFilters = ['all', 'active', 'unassigned', 'review', 'inactive'];

const showDetailDialog = ref(false);
const showFormDialog = ref(false);
const editingStudent = ref(null);
const viewingStudent = ref(null);

const kpis = computed(() => {
  const s = store.dashboard.summary;
  return [
    { icon: 'school',         label: 'studentsPage.kpis.totalStudents',      value: s.totalStudents,               helper: 'studentsPage.kpis.totalStudentsHelper',      tone: 'blue' },
    { icon: 'verified_user',  label: 'studentsPage.kpis.activeStudents',     value: s.activeStudents,              helper: 'studentsPage.kpis.activeStudentsHelper',     tone: 'green' },
    { icon: 'route',          label: 'studentsPage.kpis.assignedStudents',   value: s.assignedStudents,            helper: 'studentsPage.kpis.assignedStudentsHelper',   tone: 'blue' },
    { icon: 'warning',        label: 'studentsPage.kpis.unassignedStudents', value: s.unassignedStudents,          helper: 'studentsPage.kpis.unassignedStudentsHelper', tone: 'amber' },
    { icon: 'family_restroom',label: 'studentsPage.kpis.guardianVerified',   value: `${s.guardianVerified}%`,      helper: 'studentsPage.kpis.guardianVerifiedHelper',   tone: 'blue' }
  ];
});

const showAttentionBanner = computed(() => store.dashboard.summary.unassignedStudents > 0);

function openRegister() {
  editingStudent.value = null;
  showFormDialog.value = true;
}

function openDetails(student) {
  viewingStudent.value = student;
  showDetailDialog.value = true;
}

async function onSave(student) {
  if (!student.id) {
    student.id = `student-${Date.now()}`;
    student.code = `ST-${String(Math.floor(Math.random() * 900) + 100)}`;
    student.authorizationStatus = 'pending';
    student.attendanceRate = student.routeName ? 85 : 0;
    student.lastAttendanceStatus = 'pending';
    student.dropOffPoint = null;
    await store.createStudent(student);
  } else {
    await store.updateStudent(student);
  }
}

onMounted(() => {
  store.fetchDashboard();
});
</script>

<template>
  <main class="student-page">
    <!-- Hero -->
    <section class="hero-card">
      <div>
        <p>{{ t('studentsPage.eyebrow') }}</p>
        <h1>{{ t('studentsPage.title') }}</h1>
        <span>{{ t('studentsPage.subtitle') }}</span>
      </div>
      <aside>
        <small>{{ t('studentsPage.heroBadge') }}</small>
        <strong>{{ store.dashboard.summary.attendanceReliability }}%</strong>
      </aside>
    </section>

    <!-- KPIs -->
    <section class="kpi-grid">
      <student-kpi-card
          v-for="kpi in kpis"
          :key="kpi.label"
          :icon="kpi.icon"
          :label="t(kpi.label)"
          :value="kpi.value"
          :helper="t(kpi.helper)"
          :tone="kpi.tone"
      />
    </section>

    <!-- Attention banner -->
    <section v-if="showAttentionBanner" class="attention-banner">
      <span><i class="material-symbols-outlined">warning</i></span>
      <div>
        <strong>{{ t('studentsPage.bannerTitle') }}</strong>
        <p>{{ t('studentsPage.bannerText') }}</p>
      </div>
      <button type="button" @click="store.setStatus('unassigned')">
        {{ t('studentsPage.actions.reviewUnassigned') }}
      </button>
    </section>

    <!-- Content grid -->
    <section class="content-grid">
      <div class="main-column">
        <section class="students-panel">
          <header>
            <div>
              <p>{{ t('studentsPage.inventoryEyebrow') }}</p>
              <h2>{{ t('studentsPage.operationalStatus') }}</h2>
            </div>
            <pv-button class="primary-action" @click="openRegister">
              <i class="material-symbols-outlined">add</i>
              {{ t('studentsPage.actions.registerStudent') }}
            </pv-button>
          </header>

          <div class="toolbar">
            <label class="search-box">
              <i class="material-symbols-outlined">search</i>
              <input
                  type="search"
                  :placeholder="t('studentsPage.searchPlaceholder')"
                  :value="store.searchTerm"
                  @input="store.setSearchTerm($event.target.value)"
              />
            </label>

            <div class="filter-group">
              <button
                  v-for="status in statusFilters"
                  :key="status"
                  type="button"
                  :class="{ active: store.selectedStatus === status }"
                  @click="store.setStatus(status)"
              >
                <i class="material-symbols-outlined">{{ store.statusIcon(status) }}</i>
                {{ t('studentsPage.filters.' + status) }}
              </button>
            </div>
          </div>

          <div class="student-cards-grid">
            <student-status-card
                v-for="student in store.filteredStudents"
                :key="student.id"
                :student="student"
                @view="openDetails"
            />

            <div v-if="store.filteredStudents.length === 0" class="empty-state">
              <i class="material-symbols-outlined">school</i>
              <h3>{{ t('studentsPage.empty.title') }}</h3>
              <p>{{ t('studentsPage.empty.message') }}</p>
            </div>
          </div>
        </section>
      </div>

      <aside class="side-column">
        <student-readiness-panel
            :attendance-reliability="store.dashboard.summary.attendanceReliability"
            :guardian-verified="store.dashboard.summary.guardianVerified"
            :reviews="store.dashboard.reviews"
        />
      </aside>
    </section>

    <!-- Bottom grid -->
    <section class="bottom-grid">
      <section class="table-card">
        <header>
          <div>
            <p>{{ t('studentsPage.recordsEyebrow') }}</p>
            <h2>{{ t('studentsPage.registryTitle') }}</h2>
          </div>
          <pv-button outlined @click="store.exportCsv(store.dashboard.students)">
            <i class="material-symbols-outlined">download</i>
            {{ t('studentsPage.actions.exportList') }}
          </pv-button>
        </header>

        <div class="table-wrapper">
          <table>
            <thead>
            <tr>
              <th>{{ t('studentsPage.table.student') }}</th>
              <th>{{ t('studentsPage.table.guardian') }}</th>
              <th>{{ t('studentsPage.table.school') }}</th>
              <th>{{ t('studentsPage.table.route') }}</th>
              <th>{{ t('studentsPage.table.attendance') }}</th>
              <th>{{ t('studentsPage.table.status') }}</th>
              <th>{{ t('studentsPage.table.actions') }}</th>
            </tr>
            </thead>
            <tbody>
            <tr v-for="student in store.dashboard.students" :key="student.id">
              <td>
                <strong>{{ student.fullName }}</strong>
                <span>{{ student.code }} · {{ student.grade }}</span>
              </td>
              <td>
                <strong>{{ student.guardianName }}</strong>
                <span>{{ student.guardianPhone }}</span>
              </td>
              <td>{{ student.school }}</td>
              <td>{{ student.routeName ?? t('studentsPage.unassignedRoute') }}</td>
              <td>
                <div class="mini-progress">
                  <strong>{{ student.attendanceRate }}%</strong>
                  <span><i :style="{ width: student.attendanceRate + '%' }"></i></span>
                </div>
              </td>
              <td>
                  <span class="table-status" :class="student.status">
                    {{ t('studentsPage.status.' + student.status) }}
                  </span>
              </td>
              <td>
                <button type="button" class="row-action" @click="openDetails(student)">
                  <i class="material-symbols-outlined">arrow_forward</i>
                </button>
              </td>
            </tr>
            </tbody>
          </table>
        </div>
      </section>

      <section class="timeline-card">
        <header>
          <div>
            <p>{{ t('studentsPage.timelineEyebrow') }}</p>
            <h2>{{ t('studentsPage.timelineTitle') }}</h2>
          </div>
          <span>{{ t('studentsPage.today') }}</span>
        </header>

        <div class="timeline-list">
          <article
              v-for="activity in store.dashboard.activities"
              :key="activity.id"
              :class="activity.status"
          >
            <span class="dot"></span>
            <div>
              <strong>{{ activity.time }} · {{ activity.studentName }}</strong>
              <h3>{{ activity.title }}</h3>
              <p>{{ activity.description }}</p>
            </div>
          </article>
        </div>
      </section>
    </section>

    <!-- Dialogs -->
    <student-detail-dialog
        v-model:visible="showDetailDialog"
        :student="viewingStudent"
    />

    <student-form-dialog
        v-model:visible="showFormDialog"
        :data="editingStudent"
        @save="onSave"
    />
  </main>
</template>

<style scoped>
.student-page {
  display: grid;
  gap: 26px;
  padding: 34px;
  color: #10233f;
}

.hero-card {
  display: flex;
  justify-content: space-between;
  gap: 26px;
  align-items: center;
  min-height: 170px;
  overflow: hidden;
  border: 1px solid #d7e8f4;
  border-radius: 24px;
  padding: 34px 36px;
  background:
      radial-gradient(circle at 94% 28%, rgba(255, 183, 45, 0.24), transparent 27%),
      radial-gradient(circle at 72% 105%, rgba(31, 132, 199, 0.13), transparent 32%),
      linear-gradient(135deg, #ffffff 0%, #edf8ff 56%, #fff8df 100%);
  box-shadow: 0 18px 45px rgba(17, 65, 104, 0.08);
}
.hero-card p, .students-panel > header p, .table-card > header p, .timeline-card > header p {
  margin: 0 0 7px;
  color: #1682c6;
  font-size: 0.78rem;
  font-weight: 900;
  letter-spacing: 0.14em;
  text-transform: uppercase;
}
.hero-card h1 {
  margin: 0;
  color: #0f172a;
  font-size: clamp(2.25rem, 4vw, 4.2rem);
  line-height: 0.95;
  letter-spacing: -0.07em;
}
.hero-card span, .attention-banner p {
  display: block;
  max-width: 700px;
  margin-top: 14px;
  color: #65768c;
  font-size: 1rem;
  line-height: 1.45;
}
.hero-card aside {
  display: grid;
  place-items: center;
  min-width: 138px;
  border-radius: 20px;
  background: rgba(255, 255, 255, 0.86);
  box-shadow: 0 14px 28px rgba(17, 65, 104, 0.09);
  padding: 20px 22px;
}
.hero-card aside small { color: #66778d; font-size: 0.74rem; font-weight: 900; }
.hero-card aside strong { color: #2186c8; font-size: 2.1rem; line-height: 1; letter-spacing: -0.05em; }

.kpi-grid { display: grid; grid-template-columns: repeat(5, minmax(160px, 1fr)); gap: 18px; }

.attention-banner {
  display: grid;
  grid-template-columns: auto 1fr auto;
  gap: 16px;
  align-items: center;
  border: 1px solid #f5d48a;
  border-radius: 18px;
  background: linear-gradient(135deg, #fffaf0, #fff7dc);
  box-shadow: 0 12px 24px rgba(180, 110, 12, 0.07);
  padding: 18px 20px;
}
.attention-banner > span {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  border-radius: 14px;
  color: #c27803;
  background: #fef3c7;
}
.attention-banner strong { color: #7c3f00; font-weight: 900; }
.attention-banner p { margin: 4px 0 0; font-size: 0.9rem; }
.attention-banner button {
  border: none;
  border-radius: 12px;
  padding: 10px 14px;
  color: #9a4d00;
  background: #fef3c7;
  font-weight: 900;
  cursor: pointer;
}

.content-grid {
  display: grid;
  grid-template-columns: minmax(0, 1fr) 330px;
  gap: 22px;
  align-items: start;
}
.main-column, .side-column { min-width: 0; }
.students-panel, .table-card, .timeline-card {
  border: 1px solid #dfeaf5;
  border-radius: 22px;
  background: #ffffff;
  box-shadow: 0 18px 40px rgba(17, 55, 88, 0.08);
  padding: 24px;
}
.students-panel > header, .table-card > header, .timeline-card > header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 16px;
  margin-bottom: 18px;
}
.students-panel h2, .table-card h2, .timeline-card h2 {
  margin: 0;
  color: #0f172a;
  font-size: 1.75rem;
  letter-spacing: -0.05em;
}
.primary-action { display: inline-flex; align-items: center; gap: 8px; }
.primary-action .material-symbols-outlined { font-size: 18px; }

.toolbar { display: grid; grid-template-columns: minmax(240px, 1fr) auto; gap: 12px; margin-bottom: 18px; }
.search-box {
  display: flex;
  align-items: center;
  gap: 10px;
  min-height: 48px;
  padding: 0 16px;
  border: 1px solid #dfeaf5;
  border-radius: 16px;
  background: #ffffff;
  color: #1b83c9;
}
.search-box input { width: 100%; border: none; outline: none; color: #10233f; font: inherit; font-size: 0.92rem; }
.search-box input::placeholder { color: #8b98aa; }
.filter-group { display: flex; flex-wrap: wrap; gap: 8px; justify-content: flex-end; }
.filter-group button {
  display: inline-flex;
  align-items: center;
  gap: 7px;
  min-height: 40px;
  border: 1px solid #d9e8f5;
  border-radius: 999px;
  padding: 0 13px;
  color: #557087;
  background: #f7fbff;
  font-size: 0.82rem;
  font-weight: 900;
  cursor: pointer;
}
.filter-group button.active {
  color: #ffffff;
  border-color: #1b83c9;
  background: linear-gradient(135deg, #2187ca, #11659b);
  box-shadow: 0 10px 20px rgba(33, 135, 202, 0.18);
}
.filter-group .material-symbols-outlined { font-size: 17px; }

.student-cards-grid { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 16px; }

.bottom-grid {
  display: grid;
  grid-template-columns: minmax(0, 1fr) 330px;
  gap: 22px;
  align-items: start;
}
.table-wrapper { overflow-x: auto; }
table { width: 100%; border-collapse: collapse; min-width: 860px; }
th {
  color: #718197;
  background: #f1f6fb;
  font-size: 0.75rem;
  font-weight: 900;
  letter-spacing: 0.08em;
  padding: 14px 16px;
  text-align: left;
  text-transform: uppercase;
}
td { border-bottom: 1px solid #e8eef5; padding: 16px; color: #30445f; font-size: 0.88rem; }
td strong { display: block; color: #0e3761; font-weight: 900; }
td span { display: block; margin-top: 3px; color: #74849a; font-size: 0.78rem; }
.mini-progress { display: grid; gap: 6px; min-width: 150px; }
.mini-progress strong { color: #0f5f98; }
.mini-progress span { overflow: hidden; height: 7px; border-radius: 999px; background: #e7f0f8; }
.mini-progress i { display: block; height: 100%; border-radius: inherit; background: linear-gradient(90deg, #2187ca, #28c4b7); }
.table-status {
  display: inline-flex;
  justify-content: center;
  min-width: 110px;
  border-radius: 999px;
  padding: 7px 12px;
  font-size: 0.78rem;
  font-weight: 900;
  text-transform: capitalize;
}
.table-status.active { color: #067647; background: #dcfce7; }
.table-status.unassigned { color: #a16207; background: #fef3c7; }
.table-status.review { color: #b45309; background: #fff7ed; }
.table-status.inactive { color: #475569; background: #e2e8f0; }
.row-action {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 34px;
  height: 34px;
  border: 0;
  border-radius: 12px;
  color: #1782c6;
  background: #e4f3ff;
  cursor: pointer;
}

.timeline-card header > span {
  border-radius: 999px;
  padding: 7px 12px;
  color: #1682c6;
  background: #e4f3ff;
  font-size: 0.78rem;
  font-weight: 900;
}
.timeline-list { display: grid; gap: 12px; }
.timeline-list article {
  position: relative;
  display: grid;
  grid-template-columns: auto 1fr;
  gap: 12px;
  border: 1px solid #e8eef5;
  border-radius: 16px;
  padding: 16px;
  background: #ffffff;
}
.timeline-list .dot {
  width: 11px;
  height: 11px;
  border-radius: 50%;
  margin-top: 4px;
  background: #2ed47a;
  box-shadow: 0 0 0 6px #e8fff2;
}
.timeline-list article.active .dot { background: #2088cc; box-shadow: 0 0 0 6px #e3f3ff; }
.timeline-list article.pending .dot { background: #f5b22d; box-shadow: 0 0 0 6px #fff7df; }
.timeline-list strong { color: #1682c6; font-size: 0.78rem; }
.timeline-list h3 { margin: 4px 0; color: #10233f; font-size: 0.96rem; }
.timeline-list p { margin: 0; color: #65768c; line-height: 1.42; }

.empty-state {
  grid-column: 1 / -1;
  display: grid;
  place-items: center;
  gap: 8px;
  padding: 40px;
  color: var(--kw-muted);
  text-align: center;
  border: 1px dashed #cbd5e1;
  border-radius: 20px;
}
.empty-state .material-symbols-outlined { font-size: 42px; color: #1b83c9; }

@media (max-width: 1320px) {
  .kpi-grid { grid-template-columns: repeat(3, minmax(160px, 1fr)); }
  .content-grid, .bottom-grid { grid-template-columns: 1fr; }
}
@media (max-width: 900px) {
  .student-page { padding: 22px; }
  .hero-card, .students-panel > header, .table-card > header, .timeline-card > header, .attention-banner {
    align-items: flex-start;
    grid-template-columns: 1fr;
    flex-direction: column;
  }
  .hero-card { display: grid; }
  .kpi-grid, .student-cards-grid { grid-template-columns: 1fr; }
  .toolbar { grid-template-columns: 1fr; }
  .filter-group { justify-content: flex-start; }
}
</style>