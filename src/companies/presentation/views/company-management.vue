<script setup>
import { computed, onMounted } from 'vue';
import { useI18n } from 'vue-i18n';
import useCompaniesStore from '@/companies/application/companies.store.js';

const { t } = useI18n();
const store = useCompaniesStore();

const contractStatusOptions = [
  { value: 'all',     labelKey: 'companiesBc.filters.allContracts', icon: 'apps' },
  { value: 'active',  labelKey: 'companiesBc.filters.active',       icon: 'verified' },
  { value: 'renewal', labelKey: 'companiesBc.filters.renewal',      icon: 'event_repeat' },
  { value: 'review',  labelKey: 'companiesBc.filters.review',       icon: 'manage_search' },
  { value: 'paused',  labelKey: 'companiesBc.filters.paused',       icon: 'pause_circle' }
];

const memberStatusOptions = [
  { value: 'all',     labelKey: 'companiesBc.filters.allMembers' },
  { value: 'active',  labelKey: 'companiesBc.filters.active' },
  { value: 'invited', labelKey: 'companiesBc.filters.invited' },
  { value: 'inactive',labelKey: 'companiesBc.filters.inactive' }
];

const complianceStatusOptions = [
  { value: 'all',       labelKey: 'companiesBc.filters.allReviews' },
  { value: 'pending',   labelKey: 'companiesBc.filters.pending' },
  { value: 'review',    labelKey: 'companiesBc.filters.review' },
  { value: 'completed', labelKey: 'companiesBc.filters.completed' }
];

const kpis = computed(() => {
  const s = store.summary;
  return [
    { icon: 'business',          label: 'companiesBc.metrics.company',  value: s.activeCompanies,       helper: 'companiesBc.metrics.companyHint',  tone: 'blue' },
    { icon: 'directions_bus',    label: 'companiesBc.metrics.vehicles', value: s.totalVehicles,         helper: 'companiesBc.metrics.vehiclesHint', tone: 'cyan' },
    { icon: 'badge',             label: 'companiesBc.metrics.drivers',  value: s.activeDrivers,         helper: 'companiesBc.metrics.driversHint',  tone: 'green' },
    { icon: 'school',            label: 'companiesBc.metrics.schools',  value: s.linkedSchools,         helper: 'companiesBc.metrics.schoolsHint',  tone: 'amber' },
    { icon: 'pending_actions',   label: 'companiesBc.metrics.reviews',  value: s.pendingReviews,        helper: 'companiesBc.metrics.reviewsHint',  tone: 'red' }
  ];
});

function donutStyle(value) {
  const safe = Math.max(0, Math.min(100, value));
  return `conic-gradient(#2283c6 ${safe}%, #dff1fb ${safe}% 100%)`;
}

function formatDate(iso) {
  if (!iso) return '';
  const d = new Date(iso);
  return d.toLocaleDateString('en-US', { day: '2-digit', month: 'short', year: 'numeric' });
}

function formatShortDate(iso) {
  if (!iso) return '';
  const d = new Date(iso);
  return d.toLocaleDateString('en-US', { day: '2-digit', month: 'short' });
}

onMounted(() => {
  store.fetchDashboard();
});
</script>

<template>
  <section class="companies-page">
    <!-- Hero -->
    <header class="hero-card">
      <div>
        <span class="eyebrow">{{ t('companiesBc.hero.eyebrow') }}</span>
        <h1>{{ t('companiesBc.hero.title') }}</h1>
        <p>{{ t('companiesBc.hero.subtitle') }}</p>
      </div>
      <aside class="hero-badge">
        <span>{{ t('companiesBc.hero.score') }}</span>
        <strong>{{ store.summary.complianceScore }}%</strong>
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
        <p>{{ t(kpi.helper) }}</p>
      </article>
    </div>

    <!-- Command banner -->
    <div class="command-banner">
      <span><i class="material-symbols-outlined">admin_panel_settings</i></span>
      <div>
        <strong>{{ t('companiesBc.banner.title') }}</strong>
        <p>{{ t('companiesBc.banner.message') }}</p>
      </div>
      <button type="button" @click="store.fetchDashboard()">
        <i class="material-symbols-outlined">sync</i>
        {{ t('companiesBc.actions.refresh') }}
      </button>
    </div>

    <!-- Overview grid -->
    <section class="overview-grid">
      <article class="center-card profile-card">
        <div class="section-head">
          <div>
            <span class="eyebrow">{{ t('companiesBc.sections.profileEyebrow') }}</span>
            <h2>{{ t('companiesBc.sections.profileTitle') }}</h2>
          </div>
          <span class="status-pill" :class="store.profile.status">
            {{ t('companiesBc.status.company.' + store.profile.status) }}
          </span>
        </div>

        <div class="profile-main">
          <span class="company-avatar">
            <i class="material-symbols-outlined">shield</i>
          </span>
          <div>
            <h3>{{ store.profile.commercialName }}</h3>
            <p>{{ store.profile.legalName }} · RUC {{ store.profile.ruc }}</p>
          </div>
        </div>

        <dl class="profile-details">
          <div><dt>{{ t('companiesBc.profile.admin') }}</dt><dd>{{ store.profile.adminName }}</dd></div>
          <div><dt>{{ t('companiesBc.profile.email') }}</dt><dd>{{ store.profile.adminEmail }}</dd></div>
          <div><dt>{{ t('companiesBc.profile.phone') }}</dt><dd>{{ store.profile.phone }}</dd></div>
          <div><dt>{{ t('companiesBc.profile.address') }}</dt><dd>{{ store.profile.address }}</dd></div>
          <div><dt>{{ t('companiesBc.profile.plan') }}</dt><dd>{{ store.profile.plan }}</dd></div>
          <div><dt>{{ t('companiesBc.profile.license') }}</dt><dd>{{ formatDate(store.profile.licenseExpiration) }}</dd></div>
        </dl>

        <div class="district-row">
          <span v-for="district in store.profile.operatingDistricts" :key="district">
            {{ district }}
          </span>
        </div>
      </article>

      <aside class="center-card score-card">
        <div class="section-head compact">
          <div>
            <span class="eyebrow">{{ t('companiesBc.sections.readinessEyebrow') }}</span>
            <h2>{{ t('companiesBc.sections.readinessTitle') }}</h2>
          </div>
          <span class="count-pill">{{ store.summary.serviceQualityScore }}%</span>
        </div>
        <div class="donut" :style="{ background: donutStyle(store.summary.serviceQualityScore) }">
          <div>
            <strong>{{ store.summary.serviceQualityScore }}%</strong>
            <span>{{ t('companiesBc.labels.readyCompany') }}</span>
          </div>
        </div>
        <div class="legend-row">
          <span><i class="green-dot"></i>{{ t('companiesBc.labels.profile') }}</span>
          <span><i class="blue-dot"></i>{{ t('companiesBc.labels.contracts') }}</span>
          <span><i class="amber-dot"></i>{{ t('companiesBc.labels.compliance') }}</span>
        </div>
      </aside>
    </section>

    <!-- Content grid -->
    <section class="content-grid">
      <article class="center-card contracts-card">
        <div class="section-head">
          <div>
            <span class="eyebrow">{{ t('companiesBc.sections.contractsEyebrow') }}</span>
            <h2>{{ t('companiesBc.sections.contractsTitle') }}</h2>
          </div>
          <pv-button @click="store.exportCsv">
            <i class="material-symbols-outlined">download</i>
            {{ t('companiesBc.actions.export') }}
          </pv-button>
        </div>

        <div class="filters-row">
          <label class="search-control">
            <i class="material-symbols-outlined">search</i>
            <input
                type="search"
                :placeholder="t('companiesBc.filters.search')"
                :value="store.query"
                @input="store.query = $event.target.value"
            />
          </label>
          <div class="chip-row">
            <button
                v-for="option in contractStatusOptions"
                :key="option.value"
                type="button"
                :class="{ active: store.contractStatus === option.value }"
                @click="store.setContractStatus(option.value)"
            >
              <i class="material-symbols-outlined">{{ option.icon }}</i>
              {{ t(option.labelKey) }}
            </button>
          </div>
        </div>

        <div class="contract-list">
          <article
              v-for="contract in store.filteredContracts"
              :key="contract.id"
              class="contract-row"
              :class="[contract.status, { selected: store.selectedContract?.id === contract.id }]"
              @click="store.selectContract(contract.id)"
          >
            <span class="contract-icon" :class="contract.status">
              <i class="material-symbols-outlined">{{ store.contractIcon(contract.status) }}</i>
            </span>
            <div class="contract-main">
              <div class="contract-title">
                <div>
                  <strong>{{ contract.schoolName }}</strong>
                  <p>{{ contract.district }} · {{ contract.contactName }}</p>
                </div>
                <span class="status-pill" :class="contract.status">
                  {{ t(store.contractStatusLabel(contract.status)) }}
                </span>
              </div>
              <div class="contract-stats">
                <div><small>{{ t('companiesBc.contract.routes') }}</small><strong>{{ contract.routeCount }}</strong></div>
                <div><small>{{ t('companiesBc.contract.students') }}</small><strong>{{ contract.studentCount }}</strong></div>
                <div><small>{{ t('companiesBc.contract.renewal') }}</small><strong>{{ formatShortDate(contract.renewalDate) }}</strong></div>
              </div>
              <div class="progress-row">
                <span>{{ t('companiesBc.contract.score') }}</span>
                <strong>{{ contract.score }}%</strong>
                <i><em :style="{ width: contract.score + '%' }"></em></i>
              </div>
            </div>
            <button class="icon-action" type="button" @click.stop="store.selectContract(contract.id)">
              <i class="material-symbols-outlined">arrow_forward</i>
            </button>
          </article>

          <div v-if="store.filteredContracts.length === 0" class="empty-state">
            <i class="material-symbols-outlined">business_center</i>
            <strong>{{ t('companiesBc.empty.title') }}</strong>
            <p>{{ t('companiesBc.empty.message') }}</p>
          </div>
        </div>
      </article>

      <aside class="side-stack">
        <article class="center-card detail-card">
          <div class="section-head compact">
            <div>
              <span class="eyebrow">{{ t('companiesBc.sections.selectedEyebrow') }}</span>
              <h2>{{ t('companiesBc.sections.selectedTitle') }}</h2>
            </div>
            <span v-if="store.selectedContract" class="status-pill" :class="store.selectedContract.status">
              {{ t(store.contractStatusLabel(store.selectedContract.status)) }}
            </span>
          </div>
          <div v-if="store.selectedContract" class="selected-contract" :class="store.selectedContract.status">
            <span class="contract-icon large" :class="store.selectedContract.status">
              <i class="material-symbols-outlined">{{ store.contractIcon(store.selectedContract.status) }}</i>
            </span>
            <h3>{{ store.selectedContract.schoolName }}</h3>
            <p>{{ store.selectedContract.notes }}</p>
            <dl>
              <div><dt>{{ t('companiesBc.contract.district') }}</dt><dd>{{ store.selectedContract.district }}</dd></div>
              <div><dt>{{ t('companiesBc.contract.contact') }}</dt><dd>{{ store.selectedContract.contactName }}</dd></div>
              <div><dt>{{ t('companiesBc.contract.routes') }}</dt><dd>{{ store.selectedContract.routeCount }}</dd></div>
              <div><dt>{{ t('companiesBc.contract.students') }}</dt><dd>{{ store.selectedContract.studentCount }}</dd></div>
              <div><dt>{{ t('companiesBc.contract.renewal') }}</dt><dd>{{ formatDate(store.selectedContract.renewalDate) }}</dd></div>
              <div><dt>{{ t('companiesBc.contract.score') }}</dt><dd>{{ store.selectedContract.score }}%</dd></div>
            </dl>
          </div>
        </article>

        <article class="center-card compliance-card">
          <div class="section-head compact">
            <div>
              <span class="eyebrow">{{ t('companiesBc.sections.complianceEyebrow') }}</span>
              <h2>{{ t('companiesBc.sections.complianceTitle') }}</h2>
            </div>
            <span class="count-pill">{{ store.filteredCompliance.length }} {{ t('companiesBc.labels.items') }}</span>
          </div>
          <div class="chip-row stack-filter">
            <button
                v-for="option in complianceStatusOptions"
                :key="option.value"
                type="button"
                :class="{ active: store.complianceStatus === option.value }"
                @click="store.setComplianceStatus(option.value)"
            >
              {{ t(option.labelKey) }}
            </button>
          </div>
          <div class="compliance-list">
            <article
                v-for="item in store.filteredCompliance"
                :key="item.id"
                :class="item.severity"
            >
              <span>
                <i class="material-symbols-outlined">
                  {{ item.status === 'completed' ? 'verified' : 'priority_high' }}
                </i>
              </span>
              <div>
                <strong>{{ item.title }}</strong>
                <p>{{ item.description }}</p>
                <small>{{ item.category }} · {{ formatDate(item.dueDate) }}</small>
              </div>
              <button
                  v-if="item.status !== 'completed'"
                  class="icon-action"
                  type="button"
                  @click="store.markComplianceCompleted(item.id)"
              >
                <i class="material-symbols-outlined">check_circle</i>
              </button>
            </article>
          </div>
        </article>
      </aside>
    </section>

    <!-- Lower grid -->
    <section class="lower-grid">
      <article class="center-card team-card">
        <div class="section-head">
          <div>
            <span class="eyebrow">{{ t('companiesBc.sections.teamEyebrow') }}</span>
            <h2>{{ t('companiesBc.sections.teamTitle') }}</h2>
          </div>
          <div class="chip-row">
            <button
                v-for="option in memberStatusOptions"
                :key="option.value"
                type="button"
                :class="{ active: store.memberStatus === option.value }"
                @click="store.setMemberStatus(option.value)"
            >
              {{ t(option.labelKey) }}
            </button>
          </div>
        </div>
        <div class="member-list">
          <article
              v-for="member in store.filteredMembers"
              :key="member.id"
              :class="[member.status, { selected: store.selectedMember?.id === member.id }]"
              @click="store.selectMember(member.id)"
          >
            <span>{{ store.initials(member.name) }}</span>
            <div>
              <strong>{{ member.name }}</strong>
              <p>{{ member.role }} · {{ member.email }}</p>
              <small>{{ member.scope }}</small>
            </div>
            <em>{{ t(store.memberStatusLabel(member.status)) }}</em>
          </article>
        </div>
      </article>

      <article class="center-card registry-card">
        <div class="section-head">
          <div>
            <span class="eyebrow">{{ t('companiesBc.sections.registryEyebrow') }}</span>
            <h2>{{ t('companiesBc.sections.registryTitle') }}</h2>
          </div>
        </div>
        <div class="registry-table">
          <table>
            <thead>
            <tr>
              <th>{{ t('companiesBc.table.school') }}</th>
              <th>{{ t('companiesBc.table.district') }}</th>
              <th>{{ t('companiesBc.table.routes') }}</th>
              <th>{{ t('companiesBc.table.students') }}</th>
              <th>{{ t('companiesBc.table.status') }}</th>
              <th>{{ t('companiesBc.table.score') }}</th>
            </tr>
            </thead>
            <tbody>
            <tr v-for="contract in store.dashboard.contracts" :key="contract.id">
              <td>
                <strong>{{ contract.schoolName }}</strong>
                <small>{{ contract.contactName }}</small>
              </td>
              <td>{{ contract.district }}</td>
              <td>{{ contract.routeCount }}</td>
              <td>{{ contract.studentCount }}</td>
              <td>
                  <span class="status-pill" :class="contract.status">
                    {{ t(store.contractStatusLabel(contract.status)) }}
                  </span>
              </td>
              <td>
                <div class="table-progress">
                  <span>{{ contract.score }}%</span>
                  <i><em :style="{ width: contract.score + '%' }"></em></i>
                </div>
              </td>
            </tr>
            </tbody>
          </table>
        </div>
      </article>

      <article class="center-card activity-card">
        <div class="section-head compact">
          <div>
            <span class="eyebrow">{{ t('companiesBc.sections.activityEyebrow') }}</span>
            <h2>{{ t('companiesBc.sections.activityTitle') }}</h2>
          </div>
          <span class="count-pill">{{ t('companiesBc.labels.today') }}</span>
        </div>
        <div class="activity-list">
          <article
              v-for="activity in store.dashboard.activities"
              :key="activity.id"
              :class="activity.status"
          >
            <span></span>
            <div>
              <strong>{{ activity.time }} · {{ activity.title }}</strong>
              <p>{{ activity.description }}</p>
            </div>
          </article>
        </div>
      </article>
    </section>
  </section>
</template>

<style scoped>
.companies-page {
  display: grid;
  gap: 1.4rem;
}

.hero-card,
.center-card,
.metric-card,
.command-banner {
  border: 1px solid var(--kw-border);
  border-radius: 26px;
  background: var(--kw-card);
  box-shadow: var(--kw-shadow);
}

.hero-card {
  min-height: 150px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 2rem;
  padding: 2rem;
  background:
      radial-gradient(circle at 58% 8%, rgba(43, 213, 202, .22), transparent 28%),
      radial-gradient(circle at 92% 20%, rgba(255, 181, 46, .26), transparent 30%),
      var(--kw-card);
}

.eyebrow {
  display: inline-flex;
  color: var(--kw-blue-700);
  font-size: .78rem;
  font-weight: 900;
  letter-spacing: .16em;
  text-transform: uppercase;
}

h1, h2, h3, p { margin: 0; }
h1 { margin-top: .4rem; font-size: clamp(2.3rem, 5vw, 4rem); line-height: .95; letter-spacing: -.06em; }
h2 { font-size: clamp(1.45rem, 2vw, 2rem); letter-spacing: -.045em; }
h3 { font-size: 1.16rem; }
.hero-card p { margin-top: .85rem; max-width: 760px; color: var(--kw-muted); font-weight: 600; }

.hero-badge {
  min-width: 148px;
  padding: 1rem 1.2rem;
  border-radius: 18px;
  background: rgba(255, 255, 255, .88);
  text-align: center;
  box-shadow: 0 14px 30px rgba(15, 43, 87, .09);
}
.hero-badge span { display: block; color: var(--kw-muted); font-size: .75rem; font-weight: 900; }
.hero-badge strong { color: var(--kw-blue-700); font-size: 2.2rem; line-height: 1; }

.metric-grid {
  display: grid;
  grid-template-columns: repeat(5, minmax(150px, 1fr));
  gap: 1rem;
}
.metric-card { position: relative; overflow: hidden; padding: 1.2rem; min-height: 138px; }
.metric-card::after {
  content: '';
  position: absolute;
  right: -26px;
  bottom: -32px;
  width: 86px;
  height: 86px;
  border-radius: 50%;
  background: rgba(34, 131, 198, .12);
}
.metric-icon {
  width: 38px;
  height: 38px;
  display: inline-grid;
  place-items: center;
  border-radius: 14px;
  margin-bottom: .85rem;
}
.metric-icon .material-symbols-outlined { font-size: 20px; }
.metric-icon.blue { color: #147dcc; background: #e4f3fb; }
.metric-icon.cyan { color: #128c99; background: #dcfbff; }
.metric-icon.green { color: #0c9b61; background: #dff9ea; }
.metric-icon.amber { color: #c78300; background: #fff1c7; }
.metric-icon.red { color: #d92d20; background: #ffe0e0; }
.metric-card small { display: block; color: var(--kw-muted); font-size: .78rem; font-weight: 900; }
.metric-card strong { display: block; margin-top: .25rem; font-size: 2rem; letter-spacing: -.04em; }
.metric-card p { margin-top: .25rem; color: var(--kw-muted); font-size: .85rem; font-weight: 600; }

.command-banner {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1rem 1.2rem;
  border-color: rgba(255, 181, 46, .55);
  background: linear-gradient(90deg, rgba(255, 244, 216, .96), rgba(255,255,255,.92));
}
.command-banner > span {
  width: 44px;
  height: 44px;
  border-radius: 16px;
  display: grid;
  place-items: center;
  color: #c78300;
  background: #fff0c2;
}
.command-banner p { color: var(--kw-muted); font-weight: 600; }
.command-banner button {
  margin-left: auto;
  border: 0;
  border-radius: 14px;
  background: linear-gradient(135deg, var(--kw-blue-700), #0c77bc);
  color: white;
  min-height: 44px;
  padding: 0 1.1rem;
  display: inline-flex;
  align-items: center;
  gap: .45rem;
  font-weight: 900;
  cursor: pointer;
  box-shadow: 0 12px 26px rgba(34, 131, 198, .25);
}

.overview-grid,
.content-grid {
  display: grid;
  grid-template-columns: minmax(0, 1fr) 330px;
  gap: 1rem;
  align-items: start;
}
.lower-grid {
  display: grid;
  grid-template-columns: minmax(360px, .72fr) minmax(520px, 1fr) 330px;
  gap: 1rem;
  align-items: start;
}
.center-card { padding: 1.25rem; }
.section-head { display: flex; justify-content: space-between; align-items: start; gap: 1rem; margin-bottom: 1rem; }
.section-head.compact { align-items: center; }
.count-pill {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-height: 32px;
  padding: 0 .8rem;
  border-radius: 999px;
  color: var(--kw-blue-700);
  background: #e4f3fb;
  font-weight: 900;
  font-size: .8rem;
  white-space: nowrap;
}

.profile-main {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1rem;
  border-radius: 20px;
  background: #f7fbff;
  border: 1px solid var(--kw-border);
}
.company-avatar {
  width: 58px;
  height: 58px;
  display: grid;
  place-items: center;
  border-radius: 20px;
  color: #147dcc;
  background: #e4f3fb;
}
.company-avatar .material-symbols-outlined { font-size: 28px; }
.profile-main p { color: var(--kw-muted); font-weight: 700; margin-top: .2rem; }
.profile-details { display: grid; grid-template-columns: repeat(3, minmax(160px, 1fr)); gap: .75rem; margin: 1rem 0 0; }
dl { margin: 0; }
.profile-details div,
.selected-contract dl div { padding: .9rem; border-radius: 16px; background: #f5f9fd; }
dt { color: var(--kw-muted); font-size: .75rem; font-weight: 900; text-transform: uppercase; }
dd { margin: .25rem 0 0; font-weight: 900; color: var(--kw-ink); word-break: break-word; }
.district-row { display: flex; flex-wrap: wrap; gap: .5rem; margin-top: 1rem; }
.district-row span { padding: .5rem .75rem; border-radius: 999px; background: #e4f3fb; color: var(--kw-blue-700); font-weight: 900; }

.donut {
  width: 210px;
  height: 210px;
  border-radius: 50%;
  margin: 1rem auto;
  display: grid;
  place-items: center;
}
.donut > div {
  width: 122px;
  height: 122px;
  display: grid;
  place-items: center;
  align-content: center;
  border-radius: 50%;
  background: white;
  color: var(--kw-blue-900);
  text-align: center;
}
.donut strong { display: block; font-size: 2.1rem; }
.donut span { color: var(--kw-muted); font-size: .74rem; font-weight: 900; }
.legend-row { display: flex; justify-content: center; gap: .8rem; flex-wrap: wrap; color: var(--kw-muted); font-size: .82rem; font-weight: 800; }
.legend-row i { display: inline-block; width: 9px; height: 9px; border-radius: 50%; margin-right: .35rem; }
.green-dot { background: #19c37d; }
.blue-dot { background: #2283c6; }
.amber-dot { background: #ffb52e; }

.filters-row { display: flex; gap: .7rem; align-items: center; margin-bottom: 1rem; }
.search-control {
  flex: 1;
  min-height: 44px;
  display: flex;
  align-items: center;
  gap: .55rem;
  padding: 0 1rem;
  border-radius: 16px;
  background: white;
  border: 1px solid var(--kw-border);
}
.search-control .material-symbols-outlined { color: var(--kw-blue-700); }
.search-control input { width: 100%; border: 0; outline: 0; color: var(--kw-ink); background: transparent; }
.chip-row { display: flex; gap: .5rem; flex-wrap: wrap; }
.chip-row button {
  border: 1px solid var(--kw-border);
  background: rgba(255,255,255,.88);
  border-radius: 999px;
  min-height: 38px;
  padding: 0 .85rem;
  display: inline-flex;
  align-items: center;
  gap: .35rem;
  font-weight: 900;
  color: #42526b;
  cursor: pointer;
}
.chip-row button.active {
  border-color: transparent;
  color: white;
  background: linear-gradient(135deg, var(--kw-blue-700), #0c77bc);
  box-shadow: 0 10px 22px rgba(34, 131, 198, .18);
}
.chip-row .material-symbols-outlined { font-size: 18px; }
.stack-filter { margin-bottom: .8rem; }

.contract-list { display: grid; gap: .8rem; }
.contract-row {
  display: grid;
  grid-template-columns: auto minmax(0, 1fr) auto;
  gap: .9rem;
  align-items: center;
  padding: 1rem;
  border: 1px solid var(--kw-border);
  border-radius: 18px;
  background: rgba(255,255,255,.76);
  cursor: pointer;
  transition: transform .18s ease, box-shadow .18s ease, border-color .18s ease;
}
.contract-row:hover, .contract-row.selected {
  transform: translateY(-1px);
  border-color: rgba(34, 131, 198, .35);
  box-shadow: 0 18px 38px rgba(15, 43, 87, .08);
}
.contract-title { display: flex; justify-content: space-between; gap: 1rem; align-items: start; }
.contract-title p { color: var(--kw-muted); font-weight: 700; margin-top: .2rem; }
.status-pill {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-height: 28px;
  padding: 0 .7rem;
  border-radius: 999px;
  font-size: .75rem;
  font-weight: 900;
  white-space: nowrap;
}
.status-pill.active { color: #07834e; background: #dff9ea; }
.status-pill.renewal { color: #9a6700; background: #fff1c7; }
.status-pill.review { color: #c22a1f; background: #ffe0e0; }
.status-pill.paused, .status-pill.pending { color: #64748b; background: #e7edf6; }
.status-pill.suspended, .status-pill.inactive { color: #c22a1f; background: #ffe0e0; }
.status-pill.invited { color: #9a6700; background: #fff1c7; }
.status-pill.completed { color: #07834e; background: #dff9ea; }

.contract-icon {
  width: 44px;
  height: 44px;
  display: grid;
  place-items: center;
  border-radius: 15px;
}
.contract-icon.active { color: #147dcc; background: #e4f3fb; }
.contract-icon.renewal { color: #c78300; background: #fff1c7; }
.contract-icon.review { color: #d92d20; background: #ffe0e0; }
.contract-icon.paused { color: #64748b; background: #e7edf6; }
.contract-icon.large { width: 54px; height: 54px; border-radius: 18px; }
.contract-icon.large .material-symbols-outlined { font-size: 26px; }

.contract-stats { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: .6rem; margin: .9rem 0; }
.contract-stats div { padding: .8rem; border-radius: 14px; background: #f5f9fd; }
.contract-stats small { display: block; color: var(--kw-muted); font-size: .72rem; font-weight: 900; }
.contract-stats strong { display: block; margin-top: .2rem; }
.progress-row {
  display: grid;
  grid-template-columns: auto auto minmax(120px, 1fr);
  gap: .5rem;
  align-items: center;
  color: var(--kw-muted);
  font-weight: 900;
}
.progress-row i, .table-progress i {
  display: block;
  height: 8px;
  border-radius: 999px;
  background: #e5f0f8;
  overflow: hidden;
}
.progress-row em, .table-progress em {
  display: block;
  height: 100%;
  border-radius: inherit;
  background: linear-gradient(90deg, #2283c6, #2bd5ca);
}

.icon-action {
  width: 36px;
  height: 36px;
  display: grid;
  place-items: center;
  border: 0;
  border-radius: 12px;
  color: #147dcc;
  background: #e4f3fb;
  cursor: pointer;
}
.icon-action:hover { background: #cfe8ff; }

.side-stack { display: grid; gap: 1rem; }
.detail-card h3 { margin-top: .7rem; }
.detail-card p { margin: .5rem 0 1rem; color: var(--kw-muted); font-weight: 700; }
.selected-contract dl { display: grid; gap: .55rem; }
.compliance-list { display: grid; gap: .75rem; }
.compliance-list article {
  display: grid;
  grid-template-columns: auto minmax(0, 1fr) auto;
  gap: .75rem;
  align-items: start;
  padding: .9rem;
  border: 1px solid var(--kw-border);
  border-left-width: 4px;
  border-radius: 16px;
  background: white;
}
.compliance-list article.high, .compliance-list article.critical { border-left-color: #ef4444; }
.compliance-list article.medium { border-left-color: #ffb52e; }
.compliance-list article.low { border-left-color: #19c37d; }
.compliance-list span {
  width: 38px;
  height: 38px;
  display: grid;
  place-items: center;
  border-radius: 14px;
  background: #e4f3fb;
  color: #147dcc;
}
.compliance-list p { color: var(--kw-muted); font-weight: 650; margin: .25rem 0; }
.compliance-list small { color: var(--kw-blue-700); font-weight: 900; }

.member-list { display: grid; gap: .75rem; }
.member-list article {
  display: grid;
  grid-template-columns: auto minmax(0, 1fr) auto;
  gap: .8rem;
  align-items: center;
  padding: .9rem;
  border: 1px solid var(--kw-border);
  border-radius: 16px;
  background: white;
  cursor: pointer;
}
.member-list article.selected { border-color: rgba(34, 131, 198, .45); box-shadow: 0 12px 28px rgba(34, 131, 198, .12); }
.member-list article > span {
  width: 42px;
  height: 42px;
  display: grid;
  place-items: center;
  border-radius: 15px;
  color: white;
  background: linear-gradient(135deg, var(--kw-blue-700), #0c77bc);
  font-weight: 900;
}
.member-list p { color: var(--kw-muted); font-weight: 700; margin-top: .15rem; }
.member-list small { color: var(--kw-blue-700); font-weight: 850; }
.member-list em { font-style: normal; font-weight: 900; color: var(--kw-blue-700); }

.registry-table { overflow-x: auto; }
table { width: 100%; border-collapse: collapse; min-width: 720px; }
th {
  text-align: left;
  padding: .9rem;
  color: var(--kw-muted);
  font-size: .74rem;
  text-transform: uppercase;
  letter-spacing: .08em;
  background: #eef5fb;
}
td { padding: .9rem; border-bottom: 1px solid var(--kw-border); font-weight: 700; }
td small { display: block; margin-top: .15rem; color: var(--kw-muted); }
.table-progress { min-width: 140px; display: grid; gap: .35rem; }
.table-progress span { font-weight: 900; color: var(--kw-blue-700); }

.activity-list { display: grid; gap: .75rem; }
.activity-list article {
  display: grid;
  grid-template-columns: auto minmax(0, 1fr);
  gap: .7rem;
  padding: .9rem;
  border: 1px solid var(--kw-border);
  border-radius: 16px;
  background: white;
}
.activity-list article > span {
  width: 12px;
  height: 12px;
  border-radius: 50%;
  margin-top: .2rem;
  background: #2283c6;
  box-shadow: 0 0 0 6px rgba(34, 131, 198, .12);
}
.activity-list article.completed > span { background: #19c37d; box-shadow: 0 0 0 6px rgba(25, 195, 125, .12); }
.activity-list article.pending > span { background: #ffb52e; box-shadow: 0 0 0 6px rgba(255, 181, 46, .14); }
.activity-list p { color: var(--kw-muted); font-weight: 650; margin-top: .25rem; }

.empty-state { display: grid; place-items: center; gap: .5rem; min-height: 180px; color: var(--kw-muted); text-align: center; }
.empty-state .material-symbols-outlined { color: var(--kw-blue-700); font-size: 42px; }

@media (max-width: 1180px) {
  .metric-grid { grid-template-columns: repeat(2, minmax(0, 1fr)); }
  .overview-grid, .content-grid, .lower-grid { grid-template-columns: 1fr; }
}

@media (max-width: 760px) {
  .companies-page { padding: 1rem; }
  .hero-card { flex-direction: column; align-items: flex-start; }
  .metric-grid, .profile-details, .contract-stats { grid-template-columns: 1fr; }
  .filters-row, .section-head, .command-banner { flex-direction: column; align-items: stretch; }
  .command-banner button { margin-left: 0; justify-content: center; }
  .contract-row { grid-template-columns: 1fr; }
  .progress-row { grid-template-columns: 1fr; }
}
</style>