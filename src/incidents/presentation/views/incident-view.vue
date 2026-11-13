<script setup>
import { computed, onMounted, ref } from 'vue';
import { useI18n } from 'vue-i18n';
import useIncidentsStore from '@/incidents/application/incidents.store.js';

const { t } = useI18n();
const store = useIncidentsStore();

// ---- Filters ----
const query = ref('');
const typeFilter = ref('all');
const severityFilter = ref('all');
const statusFilter = ref('all');
const selected = ref(null);
const showForm = ref(false);
const draft = ref({
  title: '',
  description: '',
  type: 'delay',
  severity: 'medium',
  vehiclePlate: 'KW-204',
  routeName: 'Miraflores School Route',
  driverName: 'Carlos Pérez'
});

const typeOptions = [
  { value: 'all',             labelKey: 'incidents.types.all',            icon: 'apps' },
  { value: 'delay',           labelKey: 'incidents.types.delay',          icon: 'schedule' },
  { value: 'route_deviation', labelKey: 'incidents.types.routeDeviation', icon: 'alt_route' },
  { value: 'mechanical',      labelKey: 'incidents.types.mechanical',     icon: 'build' },
  { value: 'medical',         labelKey: 'incidents.types.medical',        icon: 'medical_services' },
  { value: 'safety',          labelKey: 'incidents.types.safety',         icon: 'health_and_safety' }
];

const typeOptionsWithoutAll = typeOptions.filter((o) => o.value !== 'all');

const severityOptions = [
  { value: 'all',      labelKey: 'incidents.severity.all' },
  { value: 'critical', labelKey: 'incidents.severity.critical' },
  { value: 'high',     labelKey: 'incidents.severity.high' },
  { value: 'medium',   labelKey: 'incidents.severity.medium' },
  { value: 'low',      labelKey: 'incidents.severity.low' }
];

const severityOptionsWithoutAll = severityOptions.filter((o) => o.value !== 'all');

const statusOptions = [
  { value: 'all',       labelKey: 'incidents.status.all' },
  { value: 'reported',  labelKey: 'incidents.status.reported' },
  { value: 'in_review', labelKey: 'incidents.status.inReview' },
  { value: 'escalated', labelKey: 'incidents.status.escalated' },
  { value: 'resolved',  labelKey: 'incidents.status.resolved' },
  { value: 'closed',    labelKey: 'incidents.status.closed' }
];

// ---- Computed ----
const filteredIncidents = computed(() => {
  const term = query.value.trim().toLowerCase();
  return store.incidents.filter((incident) => {
    const matchesType = typeFilter.value === 'all' || incident.type === typeFilter.value;
    const matchesSeverity = severityFilter.value === 'all' || incident.severity === severityFilter.value;
    const matchesStatus = statusFilter.value === 'all' || incident.status === statusFilter.value;
    const haystack = [
      incident.title,
      incident.description,
      incident.code,
      incident.routeName,
      incident.vehiclePlate,
      incident.driverName,
      incident.schoolName,
      incident.district,
      incident.studentName ?? ''
    ].join(' ').toLowerCase();
    return matchesType && matchesSeverity && matchesStatus && (!term || haystack.includes(term));
  });
});

const kpis = computed(() => {
  const s = store.summary;
  return [
    { icon: 'report_problem',  label: 'incidents.metrics.total',     value: s.total,     hint: 'incidents.metrics.totalHint',     tone: 'blue' },
    { icon: 'pending_actions', label: 'incidents.metrics.open',      value: s.open,      hint: 'incidents.metrics.openHint',      tone: 'amber' },
    { icon: 'priority_high',   label: 'incidents.metrics.critical',  value: s.critical,  hint: 'incidents.metrics.criticalHint',  tone: 'red' },
    { icon: 'upgrade',         label: 'incidents.metrics.escalated', value: s.escalated, hint: 'incidents.metrics.escalatedHint', tone: 'violet' },
    { icon: 'task_alt',        label: 'incidents.metrics.resolved',  value: s.resolved,  hint: 'incidents.metrics.resolvedHint',  tone: 'green' }
  ];
});

// ---- Helpers ----
function severityLabel(severity) {
  return `incidents.severity.${severity}`;
}

function statusLabel(status) {
  return `incidents.status.${
      status === 'in_review' ? 'inReview' :
          status === 'reported' ? 'reported' :
              status === 'escalated' ? 'escalated' :
                  status === 'resolved' ? 'resolved' : 'closed'
  }`;
}

function formatTime(iso) {
  if (!iso) return '';
  const d = new Date(iso);
  return d.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
}

function selectFirstFiltered() {
  requestAnimationFrame(() => {
    selected.value = filteredIncidents.value[0] ?? null;
  });
}

function setType(type) {
  typeFilter.value = type;
  selectFirstFiltered();
}

function setSeverity(severity) {
  severityFilter.value = severity;
  selectFirstFiltered();
}

function setStatus(status) {
  statusFilter.value = status;
  selectFirstFiltered();
}

function select(incident) {
  selected.value = incident;
}

function showReportForm() {
  showForm.value = true;
}

function patchDraft(key, value) {
  draft.value = { ...draft.value, [key]: value };
}

function createIncident() {
  const incident = store.createIncident(draft.value);
  selected.value = incident;
  showForm.value = false;
  draft.value = {
    title: '', description: '', type: 'delay', severity: 'medium',
    vehiclePlate: 'KW-204', routeName: 'Miraflores School Route', driverName: 'Carlos Pérez'
  };
}

function escalate(incident, event) {
  event?.stopPropagation();
  store.updateStatus(incident.id, 'escalated');
  store.updateSeverity(incident.id, incident.severity === 'critical' ? 'critical' : 'high');
  selected.value = {
    ...incident,
    status: 'escalated',
    severity: incident.severity === 'critical' ? 'critical' : 'high'
  };
}

function resolveIncident(incident, event) {
  event?.stopPropagation();
  store.updateStatus(incident.id, 'resolved');
  selected.value = {
    ...incident,
    status: 'resolved',
    resolution: incident.resolution ?? 'Operational follow-up completed.'
  };
}

function removeIncident(incident, event) {
  event?.stopPropagation();
  store.removeIncident(incident.id);
  selectFirstFiltered();
}

function exportCsv() {
  store.exportCsv(filteredIncidents.value);
}

onMounted(() => {
  store.fetchDashboard();
  selectFirstFiltered();
});
</script>

<template>
  <section class="incidents-page">
    <!-- Hero -->
    <header class="hero-card">
      <div>
        <span class="eyebrow">{{ t('incidents.hero.eyebrow') }}</span>
        <h1>{{ t('incidents.hero.title') }}</h1>
        <p>{{ t('incidents.hero.subtitle') }}</p>
      </div>
      <aside class="hero-badge">
        <span>{{ t('incidents.hero.safetyScore') }}</span>
        <strong>{{ store.summary.safetyScore }}%</strong>
      </aside>
    </header>

    <!-- Metric grid -->
    <div class="metric-grid">
      <article
          v-for="kpi in kpis"
          :key="kpi.label"
          class="metric-card"
      >
        <span class="metric-icon" :class="kpi.tone">
          <i class="material-symbols-outlined">{{ kpi.icon }}</i>
        </span>
        <small>{{ t(kpi.label) }}</small>
        <strong>{{ kpi.value }}</strong>
        <p>{{ t(kpi.hint) }}</p>
      </article>
    </div>

    <!-- Command banner -->
    <div class="command-banner">
      <span><i class="material-symbols-outlined">health_and_safety</i></span>
      <div>
        <strong>{{ t('incidents.banner.title') }}</strong>
        <p>{{ t('incidents.banner.message') }}</p>
      </div>
      <button type="button" @click="setStatus('escalated')">
        {{ t('incidents.actions.reviewCritical') }}
      </button>
    </div>

    <!-- Report form -->
    <section v-if="showForm" class="center-card report-card">
      <div class="section-head">
        <div>
          <span class="eyebrow">{{ t('incidents.sections.formEyebrow') }}</span>
          <h2>{{ t('incidents.sections.formTitle') }}</h2>
        </div>
        <button type="button" class="icon-action" @click="showForm = false">
          <i class="material-symbols-outlined">close</i>
        </button>
      </div>

      <div class="form-grid">
        <label>
          <span>{{ t('incidents.form.title') }}</span>
          <input :value="draft.title" @input="patchDraft('title', $event.target.value)" />
        </label>
        <label>
          <span>{{ t('incidents.form.type') }}</span>
          <select :value="draft.type" @change="patchDraft('type', $event.target.value)">
            <option v-for="option in typeOptionsWithoutAll" :key="option.value" :value="option.value">
              {{ t(option.labelKey) }}
            </option>
          </select>
        </label>
        <label>
          <span>{{ t('incidents.form.severity') }}</span>
          <select :value="draft.severity" @change="patchDraft('severity', $event.target.value)">
            <option v-for="option in severityOptionsWithoutAll" :key="option.value" :value="option.value">
              {{ t(option.labelKey) }}
            </option>
          </select>
        </label>
        <label>
          <span>{{ t('incidents.form.vehicle') }}</span>
          <input :value="draft.vehiclePlate" @input="patchDraft('vehiclePlate', $event.target.value)" />
        </label>
        <label>
          <span>{{ t('incidents.form.route') }}</span>
          <input :value="draft.routeName" @input="patchDraft('routeName', $event.target.value)" />
        </label>
        <label>
          <span>{{ t('incidents.form.driver') }}</span>
          <input :value="draft.driverName" @input="patchDraft('driverName', $event.target.value)" />
        </label>
        <label class="wide">
          <span>{{ t('incidents.form.description') }}</span>
          <textarea rows="3" :value="draft.description" @input="patchDraft('description', $event.target.value)"></textarea>
        </label>
      </div>

      <div class="form-actions">
        <button type="button" class="ghost" @click="showForm = false">{{ t('actions.cancel') }}</button>
        <button type="button" class="primary-action" @click="createIncident">
          <i class="material-symbols-outlined">add_alert</i>
          {{ t('incidents.actions.saveReport') }}
        </button>
      </div>
    </section>

    <!-- Main grid -->
    <section class="main-grid">
      <article class="center-card stream-card">
        <div class="section-head">
          <div>
            <span class="eyebrow">{{ t('incidents.sections.rosterEyebrow') }}</span>
            <h2>{{ t('incidents.sections.rosterTitle') }}</h2>
          </div>
          <pv-button class="primary-action" @click="showReportForm">
            <i class="material-symbols-outlined">add_alert</i>
            {{ t('incidents.actions.report') }}
          </pv-button>
        </div>

        <div class="filters-row">
          <label class="search-control">
            <i class="material-symbols-outlined">search</i>
            <input
                type="search"
                :placeholder="t('incidents.filters.search')"
                :value="query"
                @input="query = $event.target.value"
            />
          </label>
          <div class="chip-row">
            <button
                v-for="option in typeOptions"
                :key="option.value"
                type="button"
                :class="{ active: typeFilter === option.value }"
                @click="setType(option.value)"
            >
              <i class="material-symbols-outlined">{{ option.icon }}</i>
              {{ t(option.labelKey) }}
            </button>
          </div>
        </div>

        <div class="filters-row secondary">
          <div class="chip-row">
            <button
                v-for="option in severityOptions"
                :key="option.value"
                type="button"
                :class="{ active: severityFilter === option.value }"
                @click="setSeverity(option.value)"
            >
              {{ t(option.labelKey) }}
            </button>
          </div>
          <div class="chip-row">
            <button
                v-for="option in statusOptions"
                :key="option.value"
                type="button"
                :class="{ active: statusFilter === option.value }"
                @click="setStatus(option.value)"
            >
              {{ t(option.labelKey) }}
            </button>
          </div>
        </div>

        <div class="incident-list">
          <article
              v-for="incident in filteredIncidents"
              :key="incident.id"
              class="incident-card"
              :class="[incident.severity, incident.status, { selected: selected?.id === incident.id }]"
              @click="select(incident)"
          >
            <span class="incident-icon" :class="incident.severity">
              <i class="material-symbols-outlined">{{ store.iconForType(incident.type) }}</i>
            </span>
            <div class="incident-body">
              <div class="incident-topline">
                <div>
                  <strong>{{ incident.title }}</strong>
                  <p>{{ incident.description }}</p>
                </div>
                <span class="severity-pill" :class="incident.severity">
                  {{ t(severityLabel(incident.severity)) }}
                </span>
              </div>
              <div class="meta-row">
                <span><i class="material-symbols-outlined">confirmation_number</i>{{ incident.code }}</span>
                <span><i class="material-symbols-outlined">directions_bus</i>{{ incident.vehiclePlate }}</span>
                <span><i class="material-symbols-outlined">alt_route</i>{{ incident.routeName }}</span>
                <span><i class="material-symbols-outlined">person</i>{{ incident.driverName }}</span>
                <span><i class="material-symbols-outlined">schedule</i>{{ formatTime(incident.reportedAt) }}</span>
              </div>
              <div class="progress-row">
                <span>{{ t('incidents.labels.responseTime') }}</span>
                <strong>{{ incident.responseTimeMinutes }} min</strong>
              </div>
            </div>
            <div class="row-actions">
              <button type="button" @click.stop="select(incident)" :title="t('incidents.actions.review')">
                <i class="material-symbols-outlined">visibility</i>
              </button>
              <button type="button" @click="escalate(incident, $event)" :title="t('incidents.actions.escalate')">
                <i class="material-symbols-outlined">upgrade</i>
              </button>
              <button type="button" @click="resolveIncident(incident, $event)" :title="t('incidents.actions.resolve')">
                <i class="material-symbols-outlined">task_alt</i>
              </button>
              <button type="button" class="danger-button" @click="removeIncident(incident, $event)" :title="t('incidents.actions.remove')">
                <i class="material-symbols-outlined">delete</i>
              </button>
            </div>
          </article>

          <div v-if="filteredIncidents.length === 0" class="empty-state">
            <i class="material-symbols-outlined">report_off</i>
            <strong>{{ t('incidents.empty.title') }}</strong>
            <p>{{ t('incidents.empty.message') }}</p>
          </div>
        </div>
      </article>

      <aside class="side-stack">
        <!-- Detail -->
        <article class="center-card detail-panel">
          <div class="section-head compact">
            <div>
              <span class="eyebrow">{{ t('incidents.sections.detailEyebrow') }}</span>
              <h2>{{ t('incidents.sections.detailTitle') }}</h2>
            </div>
            <span v-if="selected" class="status-pill" :class="selected.status">
              {{ t(statusLabel(selected.status)) }}
            </span>
          </div>

          <div v-if="selected" class="selected-card" :class="selected.severity">
            <span class="incident-icon large" :class="selected.severity">
              <i class="material-symbols-outlined">{{ store.iconForType(selected.type) }}</i>
            </span>
            <h3>{{ selected.title }}</h3>
            <p>{{ selected.description }}</p>
            <dl>
              <div><dt>{{ t('incidents.detail.code') }}</dt><dd>{{ selected.code }}</dd></div>
              <div><dt>{{ t('incidents.detail.status') }}</dt><dd>{{ t(statusLabel(selected.status)) }}</dd></div>
              <div><dt>{{ t('incidents.detail.severity') }}</dt><dd>{{ t(severityLabel(selected.severity)) }}</dd></div>
              <div><dt>{{ t('incidents.detail.vehicle') }}</dt><dd>{{ selected.vehiclePlate }}</dd></div>
              <div><dt>{{ t('incidents.detail.route') }}</dt><dd>{{ selected.routeName }}</dd></div>
              <div><dt>{{ t('incidents.detail.driver') }}</dt><dd>{{ selected.driverName }}</dd></div>
              <div><dt>{{ t('incidents.detail.evidence') }}</dt><dd>{{ selected.evidenceCount }}</dd></div>
              <div><dt>{{ t('incidents.detail.reportedBy') }}</dt><dd>{{ selected.reportedBy }}</dd></div>
            </dl>
            <div v-if="selected.resolution" class="resolution-box">
              <strong>{{ t('incidents.detail.resolution') }}</strong>
              <p>{{ selected.resolution }}</p>
            </div>
            <div class="detail-actions">
              <button type="button" @click="store.updateStatus(selected.id, 'in_review')">
                {{ t('incidents.actions.startReview') }}
              </button>
              <button type="button" class="ghost" @click="store.updateStatus(selected.id, 'resolved')">
                {{ t('incidents.actions.resolve') }}
              </button>
            </div>
          </div>
        </article>

        <!-- Reviews -->
        <article class="center-card review-panel">
          <div class="section-head compact">
            <div>
              <span class="eyebrow">{{ t('incidents.sections.reviewEyebrow') }}</span>
              <h2>{{ t('incidents.sections.reviewTitle') }}</h2>
            </div>
            <span class="count-pill">{{ store.reviews.length }} {{ t('incidents.labels.items') }}</span>
          </div>
          <div class="review-list">
            <article
                v-for="review in store.reviews"
                :key="review.id"
                class="review-card"
                :class="review.severity"
            >
              <span><i class="material-symbols-outlined">priority_high</i></span>
              <div>
                <strong>{{ review.title }}</strong>
                <p>{{ review.description }}</p>
                <small>{{ review.incidentCode }} · {{ review.dueDate }}</small>
              </div>
              <em>{{ t(severityLabel(review.severity)) }}</em>
            </article>
          </div>
        </article>

        <!-- Timeline -->
        <article class="center-card timeline-panel">
          <div class="section-head compact">
            <div>
              <span class="eyebrow">{{ t('incidents.sections.timelineEyebrow') }}</span>
              <h2>{{ t('incidents.sections.timelineTitle') }}</h2>
            </div>
            <span class="count-pill">{{ t('incidents.sections.today') }}</span>
          </div>
          <div class="activity-list">
            <div
                v-for="activity in store.activities"
                :key="activity.id"
                class="activity-item"
                :class="activity.status"
            >
              <span></span>
              <div>
                <strong>{{ activity.time }} · {{ activity.title }}</strong>
                <p>{{ activity.description }}</p>
              </div>
            </div>
          </div>
        </article>
      </aside>
    </section>

    <!-- Registry table -->
    <section class="center-card registry-card">
      <div class="section-head">
        <div>
          <span class="eyebrow">{{ t('incidents.sections.registryEyebrow') }}</span>
          <h2>{{ t('incidents.sections.registryTitle') }}</h2>
        </div>
        <button type="button" class="export-button" @click="exportCsv">
          <i class="material-symbols-outlined">download</i>
          {{ t('incidents.actions.export') }}
        </button>
      </div>
      <div class="table-wrap">
        <table>
          <thead>
          <tr>
            <th>{{ t('incidents.table.incident') }}</th>
            <th>{{ t('incidents.table.vehicle') }}</th>
            <th>{{ t('incidents.table.route') }}</th>
            <th>{{ t('incidents.table.severity') }}</th>
            <th>{{ t('incidents.table.status') }}</th>
            <th>{{ t('incidents.table.response') }}</th>
            <th>{{ t('incidents.table.actions') }}</th>
          </tr>
          </thead>
          <tbody>
          <tr v-for="incident in filteredIncidents" :key="incident.id">
            <td>
              <strong>{{ incident.title }}</strong>
              <small>{{ incident.code }} · {{ incident.district }}</small>
            </td>
            <td>{{ incident.vehiclePlate }}</td>
            <td>{{ incident.routeName }}</td>
            <td>
                <span class="severity-pill" :class="incident.severity">
                  {{ t(severityLabel(incident.severity)) }}
                </span>
            </td>
            <td>
                <span class="status-pill" :class="incident.status">
                  {{ t(statusLabel(incident.status)) }}
                </span>
            </td>
            <td>{{ incident.responseTimeMinutes }} min</td>
            <td>
              <button type="button" @click="select(incident)"><i class="material-symbols-outlined">visibility</i></button>
              <button type="button" @click="resolveIncident(incident, $event)"><i class="material-symbols-outlined">task_alt</i></button>
            </td>
          </tr>
          </tbody>
        </table>
      </div>
    </section>
  </section>
</template>

<style scoped>
.incidents-page { display: grid; gap: 22px; }

.hero-card {
  min-height: 150px;
  border: 1px solid rgba(34, 131, 198, .12);
  border-radius: 28px;
  padding: 28px 32px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  background:
      radial-gradient(circle at 64% 12%, rgba(52, 211, 203, .16), transparent 30%),
      linear-gradient(110deg, rgba(255,255,255,.96), rgba(235,248,255,.92) 50%, rgba(255,244,216,.9));
  box-shadow: var(--kw-shadow);
}
.eyebrow {
  display: inline-block;
  color: var(--kw-blue-700);
  font-size: .78rem;
  font-weight: 900;
  letter-spacing: .16em;
  text-transform: uppercase;
}
h1, h2, h3, p { margin: 0; }
h1 {
  margin-top: 8px;
  font-size: clamp(2.1rem, 4vw, 4.1rem);
  line-height: .95;
  letter-spacing: -.07em;
  color: var(--kw-ink);
}
.hero-card p { max-width: 720px; margin-top: 14px; color: var(--kw-muted); font-size: 1rem; }
.hero-badge {
  min-width: 126px;
  padding: 18px 20px;
  border-radius: 18px;
  text-align: center;
  background: rgba(255,255,255,.92);
  box-shadow: 0 18px 38px rgba(15,43,87,.10);
}
.hero-badge span { display: block; color: #64748b; font-size: .78rem; font-weight: 800; }
.hero-badge strong { display: block; margin-top: 4px; font-size: 2rem; color: var(--kw-blue-700); }

.metric-grid { display: grid; grid-template-columns: repeat(5, minmax(160px, 1fr)); gap: 18px; }
.metric-card {
  position: relative;
  min-height: 124px;
  overflow: hidden;
  padding: 18px;
  border: 1px solid var(--kw-border);
  border-radius: 22px;
  background: var(--kw-card);
  box-shadow: 0 14px 35px rgba(15,43,87,.08);
}
.metric-card::after {
  content: '';
  position: absolute;
  right: -18px;
  bottom: -24px;
  width: 78px;
  height: 78px;
  border-radius: 999px;
  background: rgba(34, 131, 198, .12);
}
.metric-icon {
  width: 34px;
  height: 34px;
  border-radius: 12px;
  display: grid;
  place-items: center;
  margin-bottom: 10px;
}
.metric-icon .material-symbols-outlined { font-size: 19px; }
.metric-icon.blue { color: var(--kw-blue-700); background: #e0f2fe; }
.metric-icon.red { color: #ef4444; background: #fee2e2; }
.metric-icon.amber { color: #d97706; background: #fef3c7; }
.metric-icon.green { color: #10b981; background: #dcfce7; }
.metric-icon.violet { color: #7c3aed; background: #ede9fe; }
.metric-card small { color: #64748b; font-weight: 800; }
.metric-card strong { display: block; margin-top: 4px; font-size: 1.9rem; line-height: 1; }
.metric-card p { margin-top: 8px; color: var(--kw-muted); font-size: .84rem; }

.command-banner {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 16px 18px;
  border: 1px solid rgba(245, 158, 11, .32);
  border-radius: 20px;
  background: linear-gradient(90deg, rgba(255, 251, 235, .96), rgba(255, 255, 255, .82));
}
.command-banner > span {
  width: 42px;
  height: 42px;
  border-radius: 15px;
  display: grid;
  place-items: center;
  color: #d97706;
  background: #fef3c7;
}
.command-banner strong { display: block; color: #92400e; }
.command-banner p { color: #64748b; }
.command-banner button {
  margin-left: auto;
  border: 0;
  border-radius: 14px;
  padding: 11px 16px;
  color: #075985;
  background: #e0f2fe;
  font-weight: 900;
  cursor: pointer;
}

.center-card {
  border: 1px solid var(--kw-border);
  border-radius: 24px;
  background: var(--kw-card);
  box-shadow: var(--kw-shadow);
}
.report-card, .stream-card, .registry-card { padding: 20px; }
.main-grid {
  display: grid;
  grid-template-columns: minmax(0, 1fr) 360px;
  gap: 22px;
  align-items: start;
}
.side-stack { display: grid; gap: 18px; }
.section-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 18px;
  margin-bottom: 16px;
}
.section-head h2 { font-size: 1.7rem; letter-spacing: -.04em; }
.section-head.compact h2 { font-size: 1.35rem; }
.primary-action { display: inline-flex; gap: 8px; align-items: center; }
.icon-action {
  border: 0;
  border-radius: 999px;
  width: 38px;
  height: 38px;
  display: grid;
  place-items: center;
  background: #e0f2fe;
  color: var(--kw-blue-700);
  cursor: pointer;
}
.filters-row { display: flex; align-items: center; gap: 12px; margin-bottom: 12px; }
.filters-row.secondary { justify-content: space-between; flex-wrap: wrap; }
.search-control {
  flex: 1;
  min-width: 260px;
  height: 44px;
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 0 14px;
  border: 1px solid var(--kw-border);
  border-radius: 16px;
  background: #fff;
}
.search-control .material-symbols-outlined { color: var(--kw-blue-700); }
.search-control input { width: 100%; border: 0; outline: 0; background: transparent; }
.chip-row { display: flex; gap: 8px; flex-wrap: wrap; }
.chip-row button {
  min-height: 38px;
  border: 1px solid var(--kw-border);
  border-radius: 999px;
  display: inline-flex;
  align-items: center;
  gap: 7px;
  padding: 0 14px;
  color: #334155;
  background: #fff;
  font-weight: 900;
  cursor: pointer;
}
.chip-row button .material-symbols-outlined { font-size: 18px; }
.chip-row button.active {
  color: #fff;
  background: var(--kw-blue-700);
  box-shadow: 0 12px 22px rgba(34, 131, 198, .22);
}

.incident-list { display: grid; gap: 12px; margin-top: 16px; }
.incident-card {
  display: grid;
  grid-template-columns: auto 1fr auto;
  gap: 14px;
  align-items: center;
  padding: 16px;
  border: 1px solid var(--kw-border);
  border-left: 5px solid var(--kw-blue-700);
  border-radius: 18px;
  background: rgba(255,255,255,.92);
  cursor: pointer;
  transition: transform .18s ease, box-shadow .18s ease, border-color .18s ease;
}
.incident-card:hover, .incident-card.selected {
  transform: translateY(-1px);
  box-shadow: 0 16px 30px rgba(15,43,87,.08);
  border-color: rgba(34, 131, 198, .34);
}
.incident-card.critical { border-left-color: #ef4444; }
.incident-card.high { border-left-color: #f59e0b; }
.incident-card.medium { border-left-color: var(--kw-blue-700); }
.incident-card.low { border-left-color: #10b981; }
.incident-card.resolved, .incident-card.closed { opacity: .82; }

.incident-icon {
  width: 44px;
  height: 44px;
  border-radius: 15px;
  display: grid;
  place-items: center;
  background: #e0f2fe;
  color: var(--kw-blue-700);
}
.incident-icon.large { width: 54px; height: 54px; }
.incident-icon.critical { color: #ef4444; background: #fee2e2; }
.incident-icon.high { color: #d97706; background: #fef3c7; }
.incident-icon.low { color: #10b981; background: #dcfce7; }

.incident-topline { display: flex; justify-content: space-between; gap: 12px; }
.incident-topline strong { color: #0f172a; font-size: 1rem; }
.incident-body p { margin-top: 4px; color: #64748b; }
.meta-row {
  display: flex;
  gap: 12px;
  align-items: center;
  flex-wrap: wrap;
  margin-top: 10px;
  color: #475569;
  font-size: .83rem;
  font-weight: 800;
}
.meta-row span { display: inline-flex; align-items: center; gap: 4px; }
.meta-row .material-symbols-outlined { font-size: 16px; color: #64748b; }
.progress-row {
  margin-top: 12px;
  height: 32px;
  border-radius: 12px;
  padding: 0 12px;
  background: #f1f5f9;
  display: flex;
  align-items: center;
  justify-content: space-between;
  color: #64748b;
  font-weight: 900;
}
.row-actions { display: flex; gap: 6px; }
.row-actions button, td button {
  border: 0;
  border-radius: 999px;
  width: 34px;
  height: 34px;
  display: grid;
  place-items: center;
  background: #e0f2fe;
  color: var(--kw-blue-700);
  cursor: pointer;
}
.row-actions .danger-button { background: #fee2e2; color: #ef4444; }
.row-actions .material-symbols-outlined,
td button .material-symbols-outlined { font-size: 18px; }

.severity-pill, .status-pill, .count-pill {
  border-radius: 999px;
  padding: 7px 11px;
  font-size: .78rem;
  font-weight: 900;
  white-space: nowrap;
  display: inline-flex;
}
.severity-pill.critical { color: #dc2626; background: #fee2e2; }
.severity-pill.high { color: #b45309; background: #fef3c7; }
.severity-pill.medium { color: #075985; background: #e0f2fe; }
.severity-pill.low { color: #047857; background: #dcfce7; }
.status-pill.reported { color: #b45309; background: #fef3c7; }
.status-pill.in_review { color: #075985; background: #e0f2fe; }
.status-pill.escalated { color: #7c2d12; background: #ffedd5; }
.status-pill.resolved, .status-pill.closed { color: #047857; background: #dcfce7; }
.count-pill { color: #075985; background: #e0f2fe; }

.detail-panel, .review-panel, .timeline-panel { padding: 18px; }
.selected-card { border-radius: 18px; padding: 18px; background: #f8fafc; }
.selected-card h3 { margin-top: 12px; font-size: 1rem; }
.selected-card p { margin-top: 8px; color: #64748b; }
dl { display: grid; gap: 10px; margin: 16px 0 0; }
dl div {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  border-bottom: 1px solid #e2e8f0;
  padding-bottom: 8px;
}
dt { color: #64748b; font-weight: 900; }
dd { margin: 0; color: #0f172a; font-weight: 900; text-align: right; }
.resolution-box { margin-top: 14px; padding: 12px; border-radius: 14px; background: #ecfdf5; color: #047857; }
.detail-actions, .form-actions { display: flex; justify-content: flex-end; gap: 10px; margin-top: 16px; }
.detail-actions button, .form-actions button, .export-button {
  border: 0;
  border-radius: 14px;
  padding: 10px 14px;
  background: var(--kw-blue-700);
  color: #fff;
  font-weight: 900;
  cursor: pointer;
  display: inline-flex;
  gap: 6px;
  align-items: center;
}
.detail-actions .ghost, .form-actions .ghost { color: #075985; background: #e0f2fe; }

.review-list, .activity-list { display: grid; gap: 12px; }
.review-card {
  display: grid;
  grid-template-columns: auto 1fr auto;
  gap: 12px;
  padding: 14px;
  border: 1px solid var(--kw-border);
  border-left: 4px solid #f59e0b;
  border-radius: 16px;
  background: #fff;
}
.review-card.critical { border-left-color: #ef4444; }
.review-card.low { border-left-color: #10b981; }
.review-card > span {
  width: 34px;
  height: 34px;
  border-radius: 13px;
  display: grid;
  place-items: center;
  color: #ef4444;
  background: #fee2e2;
}
.review-card strong { display: block; }
.review-card p { margin-top: 4px; color: #64748b; }
.review-card small { display: block; margin-top: 8px; color: var(--kw-blue-700); font-weight: 900; }
.review-card em {
  align-self: start;
  border-radius: 999px;
  background: #fef3c7;
  padding: 6px 10px;
  font-style: normal;
  font-weight: 900;
  color: #b45309;
}
.activity-item {
  display: grid;
  grid-template-columns: auto 1fr;
  gap: 12px;
  padding: 12px;
  border: 1px solid var(--kw-border);
  border-radius: 16px;
  background: #fff;
}
.activity-item > span {
  width: 10px;
  height: 10px;
  border-radius: 999px;
  background: var(--kw-blue-700);
  margin-top: 5px;
}
.activity-item.completed > span { background: #10b981; }
.activity-item.pending > span { background: #f59e0b; }
.activity-item p { margin-top: 4px; color: #64748b; }

.form-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 14px; }
.form-grid label { display: grid; gap: 7px; color: #64748b; font-weight: 900; }
.form-grid label.wide { grid-column: 1 / -1; }
.form-grid input, .form-grid select, .form-grid textarea {
  border: 1px solid var(--kw-border);
  border-radius: 14px;
  padding: 11px 12px;
  outline: 0;
  background: #fff;
  color: #0f172a;
  font: inherit;
}
.form-grid input:focus, .form-grid select:focus, .form-grid textarea:focus {
  border-color: var(--kw-blue-700);
  box-shadow: 0 0 0 3px rgba(34, 131, 198, .12);
}

.table-wrap { overflow-x: auto; }
table { width: 100%; border-collapse: collapse; min-width: 900px; }
th {
  text-align: left;
  padding: 14px 12px;
  background: #f1f5f9;
  color: #64748b;
  font-size: .78rem;
  letter-spacing: .08em;
  text-transform: uppercase;
}
td { padding: 14px 12px; border-bottom: 1px solid #e2e8f0; color: #334155; font-weight: 700; }
td small { display: block; margin-top: 4px; color: #64748b; }

.empty-state {
  min-height: 220px;
  display: grid;
  place-items: center;
  text-align: center;
  color: #64748b;
}
.empty-state .material-symbols-outlined { font-size: 42px; color: var(--kw-blue-700); }

@media (max-width: 1180px) {
  .metric-grid { grid-template-columns: repeat(2, minmax(0, 1fr)); }
  .main-grid { grid-template-columns: 1fr; }
  .form-grid { grid-template-columns: 1fr; }
}
@media (max-width: 740px) {
  .hero-card, .command-banner, .filters-row, .incident-card {
    display: flex;
    flex-direction: column;
    align-items: stretch;
  }
  .metric-grid { grid-template-columns: 1fr; }
  .row-actions { justify-content: flex-end; }
}
</style>