<script setup>
import { computed, onMounted, ref, watch } from 'vue';
import { useI18n } from 'vue-i18n';
import useNotificationsStore from '@/notifications/application/notifications.store.js';

const { t } = useI18n();
const store = useNotificationsStore();

// ---- Filters ----
const query = ref('');
const category = ref('all');
const priority = ref('all');
const status = ref('all');
const selected = ref(null);

const filteredItems = computed(() =>
    store.filteredItems(category.value, priority.value, status.value, query.value)
);

// ---- KPI cards ----
const kpis = computed(() => {
  const s = store.summary;
  return [
    { icon: 'campaign',            label: 'alertsCenter.metrics.total',        value: s.total,         hint: 'alertsCenter.metrics.totalHint',        tone: 'blue' },
    { icon: 'priority_high',       label: 'alertsCenter.metrics.critical',     value: s.criticalAlerts,hint: 'alertsCenter.metrics.criticalHint',      tone: 'red' },
    { icon: 'mark_email_unread',   label: 'alertsCenter.metrics.unread',       value: s.unread,        hint: 'alertsCenter.metrics.unreadHint',        tone: 'amber' },
    { icon: 'verified',            label: 'alertsCenter.metrics.delivery',     value: `${s.deliveryRate}%`, hint: 'alertsCenter.metrics.deliveryHint', tone: 'green' },
    { icon: 'task_alt',            label: 'alertsCenter.metrics.acknowledged', value: s.acknowledged,  hint: 'alertsCenter.metrics.acknowledgedHint',  tone: 'teal' }
  ];
});

// ---- Helpers ----
function priorityLabel(p) {
  return `alertsCenter.priority.${p}`;
}

function statusLabel(s) {
  return `alertsCenter.status.${s}`;
}

function setCategory(value) {
  category.value = value;
}

function setPriority(value) {
  priority.value = value;
}

function setStatus(value) {
  status.value = value;
}

function select(item) {
  selected.value = item;
}

function markRead(item, event) {
  event?.stopPropagation();
  store.markAsRead(item.id);
}

function acknowledge(item, event) {
  event?.stopPropagation();
  store.acknowledge(item.id);
}

function removeItem(item, event) {
  event?.stopPropagation();
  store.remove(item.id);
}

function exportCurrent() {
  store.exportCsv(filteredItems.value);
}

// Auto-select first filtered item
watch(filteredItems, (newList) => {
  const currentId = selected.value?.id;
  if (!currentId || !newList.some((i) => i.id === currentId)) {
    selected.value = newList[0] ?? null;
  }
}, { immediate: true });

onMounted(() => {
  store.fetchDashboard();
});
</script>

<template>
  <section class="notifications-page">
    <!-- Hero -->
    <header class="hero-card">
      <div>
        <span class="eyebrow">{{ t('alertsCenter.hero.eyebrow') }}</span>
        <h1>{{ t('alertsCenter.hero.title') }}</h1>
        <p>{{ t('alertsCenter.hero.subtitle') }}</p>
      </div>
      <aside class="hero-badge">
        <span>{{ t('alertsCenter.hero.unread') }}</span>
        <strong>{{ store.summary.unread }}</strong>
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
      <span><i class="material-symbols-outlined">notification_important</i></span>
      <div>
        <strong>{{ t('alertsCenter.banner.title') }}</strong>
        <p>{{ t('alertsCenter.banner.message') }}</p>
      </div>
      <button type="button" @click="store.markAllAsRead()">
        {{ t('alertsCenter.actions.markAll') }}
      </button>
    </div>

    <!-- Main grid -->
    <section class="main-grid">
      <article class="center-card stream-card">
        <div class="section-head">
          <div>
            <span class="eyebrow">{{ t('alertsCenter.sections.inboxEyebrow') }}</span>
            <h2>{{ t('alertsCenter.sections.inboxTitle') }}</h2>
          </div>
          <pv-button class="primary-action" @click="exportCurrent">
            <i class="material-symbols-outlined">download</i>
            {{ t('alertsCenter.actions.export') }}
          </pv-button>
        </div>

        <div class="filters-row">
          <label class="search-control">
            <i class="material-symbols-outlined">search</i>
            <input
                type="search"
                :placeholder="t('alertsCenter.filters.search')"
                :value="query"
                @input="query = $event.target.value"
            />
          </label>
          <div class="chip-row">
            <button type="button" :class="{ active: category === 'all' }" @click="setCategory('all')">
              <i class="material-symbols-outlined">inbox</i>
              {{ t('alertsCenter.filters.all') }}
            </button>
            <button type="button" :class="{ active: category === 'alert' }" @click="setCategory('alert')">
              <i class="material-symbols-outlined">campaign</i>
              {{ t('alertsCenter.filters.alerts') }}
            </button>
            <button type="button" :class="{ active: category === 'notification' }" @click="setCategory('notification')">
              <i class="material-symbols-outlined">notifications</i>
              {{ t('alertsCenter.filters.notifications') }}
            </button>
          </div>
        </div>

        <div class="filters-row secondary">
          <div class="chip-row">
            <button type="button" :class="{ active: priority === 'all' }" @click="setPriority('all')">{{ t('alertsCenter.filters.allPriority') }}</button>
            <button type="button" :class="{ active: priority === 'critical' }" @click="setPriority('critical')">{{ t('alertsCenter.priority.critical') }}</button>
            <button type="button" :class="{ active: priority === 'high' }" @click="setPriority('high')">{{ t('alertsCenter.priority.high') }}</button>
            <button type="button" :class="{ active: priority === 'medium' }" @click="setPriority('medium')">{{ t('alertsCenter.priority.medium') }}</button>
            <button type="button" :class="{ active: priority === 'low' }" @click="setPriority('low')">{{ t('alertsCenter.priority.low') }}</button>
          </div>
          <div class="chip-row">
            <button type="button" :class="{ active: status === 'all' }" @click="setStatus('all')">{{ t('alertsCenter.filters.allStatus') }}</button>
            <button type="button" :class="{ active: status === 'new' }" @click="setStatus('new')">{{ t('alertsCenter.status.new') }}</button>
            <button type="button" :class="{ active: status === 'read' }" @click="setStatus('read')">{{ t('alertsCenter.status.read') }}</button>
            <button type="button" :class="{ active: status === 'acknowledged' }" @click="setStatus('acknowledged')">{{ t('alertsCenter.status.acknowledged') }}</button>
          </div>
        </div>

        <div class="notification-list">
          <article
              v-for="item in filteredItems"
              :key="item.id"
              class="notification-card"
              :class="[item.category, item.priority, item.status, { selected: selected?.id === item.id }]"
              @click="select(item)"
          >
            <span class="type-icon" :class="[item.category, item.priority]">
              <i class="material-symbols-outlined">{{ store.iconFor(item) }}</i>
            </span>
            <div class="message-body">
              <div class="message-topline">
                <strong>{{ item.title }}</strong>
                <span class="priority-pill" :class="item.priority">{{ t(priorityLabel(item.priority)) }}</span>
              </div>
              <p>{{ item.message }}</p>
              <div class="meta-row">
                <span><i class="material-symbols-outlined">schedule</i>{{ item.time }}</span>
                <span><i class="material-symbols-outlined">apps</i>{{ item.sourceBc }}</span>
                <span v-if="item.vehiclePlate"><i class="material-symbols-outlined">directions_bus</i>{{ item.vehiclePlate }}</span>
                <span v-if="item.routeName"><i class="material-symbols-outlined">alt_route</i>{{ item.routeName }}</span>
              </div>
            </div>
            <div class="row-actions">
              <button
                  v-if="item.status === 'new'"
                  type="button"
                  @click="markRead(item, $event)"
                  :title="t('alertsCenter.actions.markRead')"
              >
                <i class="material-symbols-outlined">drafts</i>
              </button>
              <button type="button" @click="acknowledge(item, $event)" :title="t('alertsCenter.actions.acknowledge')">
                <i class="material-symbols-outlined">check_circle</i>
              </button>
              <button type="button" class="danger-button" @click="removeItem(item, $event)" :title="t('alertsCenter.actions.remove')">
                <i class="material-symbols-outlined">delete</i>
              </button>
            </div>
          </article>

          <div v-if="filteredItems.length === 0" class="empty-state">
            <i class="material-symbols-outlined">notifications_off</i>
            <strong>{{ t('alertsCenter.empty.title') }}</strong>
            <p>{{ t('alertsCenter.empty.message') }}</p>
          </div>
        </div>
      </article>

      <aside class="side-stack">
        <!-- Detail -->
        <article class="center-card detail-panel">
          <div class="section-head compact">
            <div>
              <span class="eyebrow">{{ t('alertsCenter.sections.detailEyebrow') }}</span>
              <h2>{{ t('alertsCenter.sections.detailTitle') }}</h2>
            </div>
            <span class="count-pill">
              {{ selected?.category === 'alert' ? t('alertsCenter.filters.alerts') : t('alertsCenter.filters.notifications') }}
            </span>
          </div>

          <div v-if="selected" class="selected-card" :class="selected.priority">
            <span class="type-icon large" :class="[selected.category, selected.priority]">
              <i class="material-symbols-outlined">{{ store.iconFor(selected) }}</i>
            </span>
            <h3>{{ selected.title }}</h3>
            <p>{{ selected.message }}</p>
            <dl>
              <div><dt>{{ t('alertsCenter.detail.status') }}</dt><dd>{{ t(statusLabel(selected.status)) }}</dd></div>
              <div><dt>{{ t('alertsCenter.detail.priority') }}</dt><dd>{{ t(priorityLabel(selected.priority)) }}</dd></div>
              <div><dt>{{ t('alertsCenter.detail.source') }}</dt><dd>{{ selected.sourceBc }}</dd></div>
              <div v-if="selected.vehiclePlate"><dt>{{ t('alertsCenter.detail.vehicle') }}</dt><dd>{{ selected.vehiclePlate }}</dd></div>
              <div v-if="selected.routeName"><dt>{{ t('alertsCenter.detail.route') }}</dt><dd>{{ selected.routeName }}</dd></div>
              <div><dt>{{ t('alertsCenter.detail.recipient') }}</dt><dd>{{ selected.recipientRole }}</dd></div>
            </dl>
            <div class="detail-actions">
              <button type="button" @click="store.acknowledge(selected.id)">
                {{ selected.actionLabel ?? t('alertsCenter.actions.acknowledge') }}
              </button>
              <button type="button" class="ghost" @click="store.markAsRead(selected.id)">
                {{ t('alertsCenter.actions.markRead') }}
              </button>
            </div>
          </div>
        </article>

        <!-- Timeline -->
        <article class="center-card timeline-panel">
          <div class="section-head compact">
            <div>
              <span class="eyebrow">{{ t('alertsCenter.sections.timelineEyebrow') }}</span>
              <h2>{{ t('alertsCenter.sections.timelineTitle') }}</h2>
            </div>
            <span class="count-pill">{{ t('alertsCenter.sections.today') }}</span>
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
  </section>
</template>

<style scoped>
.notifications-page { display: grid; gap: 22px; }

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
.metric-icon.teal { color: #0f766e; background: #ccfbf1; }
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

.main-grid { display: grid; grid-template-columns: minmax(0, 1fr) 360px; gap: 22px; align-items: start; }

.center-card {
  border: 1px solid var(--kw-border);
  border-radius: 24px;
  background: var(--kw-card);
  box-shadow: var(--kw-shadow);
}
.stream-card { padding: 20px; }
.section-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 18px;
  margin-bottom: 16px;
}
.section-head h2 { font-size: 1.7rem; letter-spacing: -.04em; }
.section-head.compact h2 { font-size: 1.35rem; }
.primary-action { display: inline-flex; align-items: center; gap: 6px; }

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

.notification-list { display: grid; gap: 12px; margin-top: 16px; }
.notification-card {
  display: grid;
  grid-template-columns: auto 1fr auto;
  gap: 14px;
  align-items: center;
  padding: 16px;
  border: 1px solid var(--kw-border);
  border-left: 5px solid transparent;
  border-radius: 18px;
  background: rgba(255,255,255,.9);
  cursor: pointer;
  transition: transform .18s ease, box-shadow .18s ease, border-color .18s ease;
}
.notification-card:hover, .notification-card.selected {
  transform: translateY(-1px);
  box-shadow: 0 16px 30px rgba(15,43,87,.08);
  border-color: rgba(34, 131, 198, .34);
}
.notification-card.alert { border-left-color: #f59e0b; }
.notification-card.notification { border-left-color: var(--kw-blue-700); }
.notification-card.critical { border-left-color: #ef4444; }
.notification-card.acknowledged { opacity: .76; }

.type-icon {
  width: 44px;
  height: 44px;
  border-radius: 15px;
  display: grid;
  place-items: center;
  background: #e0f2fe;
  color: var(--kw-blue-700);
}
.type-icon.large { width: 54px; height: 54px; }
.type-icon.alert { background: #fef3c7; color: #d97706; }
.type-icon.critical { background: #fee2e2; color: #ef4444; }

.message-topline { display: flex; align-items: center; gap: 10px; justify-content: space-between; }
.message-topline strong { color: #0f172a; font-size: .98rem; }
.message-body p { margin-top: 4px; color: #64748b; }
.meta-row {
  display: flex;
  flex-wrap: wrap;
  gap: 10px 16px;
  margin-top: 10px;
  color: #64748b;
  font-size: .82rem;
  font-weight: 700;
}
.meta-row span { display: inline-flex; align-items: center; gap: 5px; }
.meta-row .material-symbols-outlined { font-size: 16px; }

.priority-pill, .count-pill {
  border-radius: 999px;
  padding: 6px 10px;
  font-size: .74rem;
  font-weight: 900;
  background: #e0f2fe;
  color: var(--kw-blue-700);
  white-space: nowrap;
}
.priority-pill.critical, .priority-pill.high { background: #fee2e2; color: #dc2626; }
.priority-pill.medium { background: #fef3c7; color: #b45309; }
.priority-pill.low { background: #dcfce7; color: #047857; }

.row-actions { display: flex; align-items: center; gap: 3px; }
.row-actions button {
  border: 0;
  border-radius: 999px;
  width: 34px;
  height: 34px;
  display: grid;
  place-items: center;
  background: #eaf6ff;
  color: var(--kw-blue-700);
  cursor: pointer;
}
.row-actions .danger-button { background: #fee2e2; color: #dc2626; }
.row-actions .material-symbols-outlined { font-size: 18px; }

.side-stack { display: grid; gap: 18px; }
.detail-panel, .timeline-panel { padding: 18px; }
.selected-card {
  padding: 16px;
  border-radius: 18px;
  background: #f8fbff;
  border: 1px solid var(--kw-border);
}
.selected-card h3 { margin-top: 12px; font-size: 1.15rem; }
.selected-card p { margin-top: 8px; color: #64748b; }
dl { display: grid; gap: 8px; margin: 16px 0 0; }
dl div {
  display: flex;
  justify-content: space-between;
  gap: 12px;
  padding: 10px 0;
  border-bottom: 1px solid #eaf1f8;
}
dt { color: #64748b; font-weight: 800; }
dd { margin: 0; color: #0f172a; font-weight: 900; text-align: right; }
.detail-actions { display: flex; gap: 10px; margin-top: 16px; }
.detail-actions button {
  border: 0;
  border-radius: 14px;
  padding: 11px 14px;
  background: var(--kw-blue-700);
  color: #fff;
  font-weight: 900;
  cursor: pointer;
}
.detail-actions button.ghost { background: #e0f2fe; color: #075985; }

.activity-list { display: grid; gap: 12px; }
.activity-item {
  display: grid;
  grid-template-columns: auto 1fr;
  gap: 10px;
  padding: 14px;
  border-radius: 16px;
  background: #fff;
  border: 1px solid var(--kw-border);
}
.activity-item > span {
  width: 10px;
  height: 10px;
  border-radius: 999px;
  margin-top: 4px;
  background: var(--kw-blue-700);
}
.activity-item.completed > span { background: #10b981; }
.activity-item.pending > span { background: #f59e0b; }
.activity-item strong { color: #0f172a; }
.activity-item p { margin-top: 4px; color: #64748b; font-size: .9rem; }

.empty-state {
  min-height: 220px;
  display: grid;
  place-items: center;
  text-align: center;
  color: #64748b;
}
.empty-state .material-symbols-outlined { font-size: 42px; color: #94a3b8; }

@media (max-width: 1180px) {
  .metric-grid { grid-template-columns: repeat(2, minmax(0, 1fr)); }
  .main-grid { grid-template-columns: 1fr; }
}
@media (max-width: 760px) {
  .hero-card { align-items: flex-start; flex-direction: column; }
  .metric-grid { grid-template-columns: 1fr; }
  .filters-row { align-items: stretch; flex-direction: column; }
  .notification-card { grid-template-columns: auto 1fr; }
  .row-actions { grid-column: 1 / -1; justify-content: flex-end; }
}
</style>
