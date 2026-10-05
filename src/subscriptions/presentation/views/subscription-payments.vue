<script setup>
import { computed, onMounted, ref } from 'vue';
import { useI18n } from 'vue-i18n';
import useSubscriptionsStore from '@/subscriptions/application/subscriptions.store.js';
import PlanCard from '../components/plan-card.vue';

const { t } = useI18n();
const store = useSubscriptionsStore();

const showCardForm = ref(false);
const cardSavedMessage = ref(false);
const receiptMessage = ref(null);

const cardForm = ref({
  holder: '',
  brand: 'visa',
  cardNumber: '',
  expiresOn: ''
});

// ---- KPIs ----
const metrics = computed(() => {
  const sub = store.currentSubscription;
  return [
    {
      icon: 'calendar_month',
      label: 'subscriptions.metrics.usingPlan',
      value: `${store.serviceDays}${t('subscriptions.metrics.days')}`,
      helper: `${t('subscriptions.metrics.started')}${formatDate(sub.startedOn ?? '2026-01-15')}`
    },
    {
      icon: 'event_repeat',
      label: 'subscriptions.metrics.nextCharge',
      value: `${store.daysUntilRenewal}${t('subscriptions.metrics.days')}`,
      helper: t('subscriptions.renewal.' + (sub.renewalMode ?? 'assisted'))
    },
    {
      icon: 'receipt_long',
      label: 'subscriptions.metrics.lastPayment',
      value: store.lastPayment ? formatCurrency(store.lastPayment.amount, store.lastPayment.currency) : '—',
      helper: store.lastPayment ? `${formatDate(store.lastPayment.date)} ·${t('subscriptions.status.' + store.lastPayment.status)}` : ''
    },
    {
      icon: 'alternate_email',
      label: 'subscriptions.metrics.receiptEmail',
      value: sub.billingEmail ?? 'operations@movisafe.pe',
      helper: t('subscriptions.metrics.receiptHelper')
    }
  ];
});

const usageRows = computed(() => {
  const sub = store.currentSubscription;
  return [
    { label: 'subscriptions.usage.vehicles', used: sub.vehiclesUsed, limit: sub.vehicleLimit, success: false },
    { label: 'subscriptions.usage.students', used: sub.studentsUsed, limit: sub.studentLimit, success: false },
    { label: 'subscriptions.usage.users',    used: sub.usersUsed,    limit: sub.userLimit,    success: true  }
  ];
});

// ---- Helpers ----
function formatCurrency(amount, currency) {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currency ?? 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(amount);
}

function formatDate(iso) {
  if (!iso) return '';
  const d = new Date(iso);
  return d.toLocaleDateString('en-US', { day: '2-digit', month: 'short', year: 'numeric' });
}

function toggleCardForm() {
  showCardForm.value = !showCardForm.value;
  cardSavedMessage.value = false;
}

function submitCard() {
  if (!cardForm.value.holder || !cardForm.value.cardNumber || !cardForm.value.expiresOn) return;
  cardSavedMessage.value = true;
  showCardForm.value = false;
  cardForm.value = { holder: '', brand: 'visa', cardNumber: '', expiresOn: '' };
  setTimeout(() => (cardSavedMessage.value = false), 2800);
}

function requestReceipt(record) {
  receiptMessage.value = record.id;
  setTimeout(() => (receiptMessage.value = null), 2800);
}

function planAction(planId) {
  store.selectPlan(planId);
  // Aquí podrías abrir un flujo de upgrade o contacto
}

onMounted(() => {
  store.fetchDashboard();
});
</script>

<template>
  <section class="billing-page">
    <!-- Heading -->
    <header class="billing-heading">
      <div>
        <p class="eyebrow">{{ t('subscriptions.eyebrow') }}</p>
        <h1>{{ t('subscriptions.title') }}</h1>
        <p>{{ t('subscriptions.subtitle') }}</p>
      </div>
      <div class="heading-actions">
        <span class="status-chip" :class="store.currentSubscription.status">
          <i class="material-symbols-outlined">verified</i>
          {{ t('subscriptions.status.' + store.currentSubscription.status) }}
        </span>
        <pv-button class="primary-action" @click="toggleCardForm">
          <i class="material-symbols-outlined">add_card</i>
          {{ t('subscriptions.actions.addCard') }}
        </pv-button>
      </div>
    </header>

    <!-- Billing hero -->
    <section class="billing-hero">
      <article class="plan-summary panel-card">
        <div class="plan-main">
          <span class="readonly-pill">{{ t('subscriptions.readonly.badge') }}</span>
          <h2>{{ store.currentSubscription.planName }}</h2>
          <p>{{ store.currentSubscription.planScope || t('subscriptions.readonly.scopeFallback') }}</p>
        </div>
        <div class="price-box">
          <strong>{{ formatCurrency(store.currentSubscription.price, store.currentSubscription.currency) }}</strong>
          <span>/{{ t('subscriptions.month') }}</span>
          <small>
            {{ t('subscriptions.renewsOn') }} {{ formatDate(store.currentSubscription.renewsOn) }}
          </small>
        </div>
      </article>

      <article class="support-note panel-card">
        <span><i class="material-symbols-outlined">support_agent</i></span>
        <div>
          <strong>{{ t('subscriptions.readonly.title') }}</strong>
          <p>{{ t('subscriptions.readonly.message') }}</p>
          <small>
            {{ t('subscriptions.readonly.contact') }}
            {{ store.currentSubscription.supportContact || 'billing@childrenpath.pe' }}
          </small>
        </div>
      </article>
    </section>

    <!-- Metrics grid -->
    <section class="summary-grid">
      <article v-for="metric in metrics" :key="metric.label" class="metric-card">
        <span><i class="material-symbols-outlined">{{ metric.icon }}</i></span>
        <div>
          <small>{{ t(metric.label) }}</small>
          <strong>{{ metric.value }}</strong>
          <p>{{ metric.helper }}</p>
        </div>
      </article>
    </section>

    <!-- Usage + Payment -->
    <section class="details-grid">
      <article class="panel-card usage-panel">
        <header class="panel-header">
          <div>
            <p class="eyebrow">{{ t('subscriptions.usage.eyebrow') }}</p>
            <h2>{{ t('subscriptions.currentUsage') }}</h2>
          </div>
        </header>

        <div v-for="row in usageRows" :key="row.label" class="usage-row">
          <div>
            <span>{{ t(row.label) }}</span>
            <strong>
              {{ row.used }} /
              {{ row.limit === null ? t('subscriptions.unlimited') : row.limit }}
            </strong>
          </div>
          <div class="progress" :class="{ success: row.success }">
            <i :style="{ width: store.percentage(row.used, row.limit) + '%' }"></i>
          </div>
        </div>
      </article>

      <article class="panel-card payment-panel">
        <header class="panel-header">
          <div>
            <p class="eyebrow">{{ t('subscriptions.payment.eyebrow') }}</p>
            <h2>{{ t('subscriptions.paymentMethod') }}</h2>
          </div>
          <button type="button" class="ghost-action" @click="toggleCardForm">
            <i class="material-symbols-outlined">add</i>
            {{ t('subscriptions.add') }}
          </button>
        </header>

        <p v-if="cardSavedMessage" class="success-banner">
          <i class="material-symbols-outlined">check_circle</i>
          {{ t('subscriptions.payment.cardSaved') }}
        </p>

        <form v-if="showCardForm" class="card-form" @submit.prevent="submitCard">
          <label>
            {{ t('subscriptions.payment.form.holder') }}
            <input v-model="cardForm.holder" type="text" autocomplete="cc-name" />
          </label>
          <label>
            {{ t('subscriptions.payment.form.brand') }}
            <select v-model="cardForm.brand">
              <option value="visa">Visa</option>
              <option value="mastercard">Mastercard</option>
              <option value="amex">Amex</option>
            </select>
          </label>
          <label>
            {{ t('subscriptions.payment.form.number') }}
            <input v-model="cardForm.cardNumber" type="text" inputmode="numeric" placeholder="•••• •••• •••• ••••" />
          </label>
          <label>
            {{ t('subscriptions.payment.form.expires') }}
            <input v-model="cardForm.expiresOn" type="text" placeholder="MM/YYYY" autocomplete="cc-exp" />
          </label>
          <div class="form-actions">
            <button type="button" class="secondary-action" @click="toggleCardForm">
              {{ t('subscriptions.payment.form.cancel') }}
            </button>
            <button type="submit" class="primary-action">
              {{ t('subscriptions.payment.form.save') }}
            </button>
          </div>
        </form>

        <div class="payment-list">
          <div
              v-for="method in store.paymentMethods"
              :key="method.id"
              class="payment-method"
              :class="{ primary: method.primary }"
          >
            <span class="brand" :class="method.brand">
              {{ method.brand === 'visa' ? 'VISA' : method.brand === 'mastercard' ? 'MC' : 'AMEX' }}
            </span>
            <div>
              <strong>•••• •••• •••• {{ method.last4 }}</strong>
              <p>{{ t('subscriptions.expires') }} {{ method.expiresOn }} · {{ method.holder }}</p>
            </div>
            <small v-if="method.primary">{{ t('subscriptions.primary') }}</small>
            <button v-else type="button" class="text-button">
              {{ t('subscriptions.payment.setPrimary') }}
            </button>
          </div>
        </div>
      </article>
    </section>

    <!-- Plan cards -->
    <section class="plans-section">
      <header class="section-head">
        <div>
          <p class="eyebrow">{{ t('subscriptions.plansSection.eyebrow') }}</p>
          <h2>{{ t('subscriptions.plansSection.title') }}</h2>
        </div>
      </header>
      <div class="plans-grid">
        <plan-card
            v-for="plan in store.plans"
            :key="plan.id"
            :plan="plan"
            @select="planAction"
        />
      </div>
    </section>

    <!-- Billing history -->
    <article class="panel-card history-panel">
      <header class="panel-header">
        <div>
          <p class="eyebrow">{{ t('subscriptions.history.eyebrow') }}</p>
          <h2>{{ t('subscriptions.billingHistory') }}</h2>
        </div>
        <button type="button" class="ghost-action" @click="store.exportCsv">
          <i class="material-symbols-outlined">download</i>
          {{ t('subscriptions.exportPdf') }}
        </button>
      </header>

      <p v-if="receiptMessage" class="success-banner">
        <i class="material-symbols-outlined">mark_email_read</i>
        {{ t('subscriptions.history.receiptSent') }} {{ receiptMessage }}
      </p>

      <div class="table-wrap">
        <table>
          <thead>
          <tr>
            <th>{{ t('subscriptions.table.date') }}</th>
            <th>{{ t('subscriptions.table.description') }}</th>
            <th>{{ t('subscriptions.table.amount') }}</th>
            <th>{{ t('subscriptions.table.method') }}</th>
            <th>{{ t('subscriptions.table.status') }}</th>
            <th>{{ t('subscriptions.table.invoice') }}</th>
          </tr>
          </thead>
          <tbody>
          <tr v-for="record in store.billingHistory" :key="record.id">
            <td>{{ formatDate(record.date) }}</td>
            <td>
              <strong>{{ record.description }}</strong>
              <small>{{ record.id }}</small>
            </td>
            <td>{{ formatCurrency(record.amount, record.currency) }}</td>
            <td>{{ record.method }}</td>
            <td>
                <span class="status-pill" :class="record.status">
                  {{ t('subscriptions.status.' + record.status) }}
                </span>
            </td>
            <td>
              <button type="button" class="receipt-link" @click="requestReceipt(record)">
                {{ t('subscriptions.history.requestReceipt') }}
              </button>
            </td>
          </tr>
          </tbody>
        </table>
      </div>
    </article>
  </section>
</template>

<style scoped>
.billing-page { display: grid; gap: 24px; }
.billing-heading { display: flex; align-items: flex-start; justify-content: space-between; gap: 20px; }
.billing-heading h1 {
  margin: 0;
  color: var(--kw-blue-900);
  font-size: clamp(2rem, 4vw, 3rem);
  line-height: 1;
  letter-spacing: -.04em;
}
.billing-heading p:last-child {
  max-width: 760px;
  margin: 8px 0 0;
  color: var(--kw-muted);
  line-height: 1.45;
}
.eyebrow {
  margin: 0 0 7px;
  color: var(--kw-blue-700);
  font-size: .78rem;
  font-weight: 950;
  letter-spacing: .13em;
  text-transform: uppercase;
}
.heading-actions { display: flex; align-items: center; justify-content: flex-end; gap: 12px; flex-wrap: wrap; }
.primary-action, .secondary-action, .ghost-action, .receipt-link {
  border: 0;
  border-radius: 13px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  min-height: 42px;
  padding: 10px 15px;
  font-weight: 950;
  cursor: pointer;
}
.primary-action { background: var(--kw-blue-700); color: #fff; box-shadow: 0 14px 24px rgba(34, 131, 198, .24); }
.secondary-action, .ghost-action { border: 1px solid var(--kw-border); background: #f6fbff; color: var(--kw-blue-900); }
.primary-action .material-symbols-outlined,
.secondary-action .material-symbols-outlined,
.ghost-action .material-symbols-outlined { font-size: 20px; }

.status-chip, .status-pill {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  border-radius: 999px;
  padding: 7px 12px;
  font-size: .78rem;
  font-weight: 950;
}
.status-chip.active, .status-pill.active, .status-pill.paid { background: #dcfce7; color: #047857; }
.status-chip.pending, .status-pill.pending { background: #fef3c7; color: #b45309; }
.status-chip.expired, .status-chip.cancelled, .status-pill.failed { background: #fee2e2; color: #b91c1c; }
.status-chip .material-symbols-outlined { font-size: 18px; }

.billing-hero { display: grid; grid-template-columns: minmax(0, 1.45fr) minmax(360px, .55fr); gap: 18px; }
.panel-card, .metric-card {
  border: 1px solid var(--kw-border);
  border-radius: 22px;
  background: var(--kw-card);
  box-shadow: var(--kw-shadow);
}
.plan-summary {
  position: relative;
  overflow: hidden;
  display: grid;
  grid-template-columns: 1fr auto;
  align-items: center;
  gap: 22px;
  min-height: 178px;
  padding: 28px 30px;
  background: linear-gradient(120deg, rgba(34,131,198,.98), rgba(57,161,216,.94));
  color: #fff;
}
.plan-summary::after {
  content: '';
  position: absolute;
  right: -80px;
  bottom: -140px;
  width: 310px;
  height: 310px;
  border-radius: 999px;
  background: rgba(255,255,255,.18);
}
.plan-main, .price-box { position: relative; z-index: 1; }
.readonly-pill {
  display: inline-flex;
  width: fit-content;
  padding: 7px 12px;
  border-radius: 999px;
  background: rgba(255,255,255,.18);
  color: #fff;
  font-size: .75rem;
  font-weight: 950;
  letter-spacing: .04em;
  text-transform: uppercase;
}
.plan-summary h2 { margin: 14px 0 8px; font-size: clamp(2rem, 4vw, 3.2rem); letter-spacing: -.05em; }
.plan-summary p { max-width: 680px; margin: 0; color: rgba(255,255,255,.87); line-height: 1.5; }
.price-box { display: grid; justify-items: end; text-align: right; }
.price-box strong { display: block; font-size: clamp(2.4rem, 6vw, 4.2rem); line-height: .9; }
.price-box span { font-weight: 950; color: rgba(255,255,255,.9); }
.price-box small { margin-top: 10px; color: rgba(255,255,255,.78); font-weight: 800; }

.support-note {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 24px;
  background: linear-gradient(140deg, rgba(255,255,255,.98), rgba(255,249,234,.95));
}
.support-note > span {
  width: 58px;
  height: 58px;
  flex: 0 0 auto;
  border-radius: 20px;
  display: grid;
  place-items: center;
  background: #fef3c7;
  color: #d97706;
}
.support-note .material-symbols-outlined { font-size: 30px; }
.support-note strong { display: block; color: var(--kw-blue-900); font-size: 1.1rem; }
.support-note p { margin: 7px 0; color: var(--kw-muted); line-height: 1.45; }
.support-note small { color: var(--kw-blue-700); font-weight: 900; }

.summary-grid { display: grid; grid-template-columns: repeat(4, minmax(0, 1fr)); gap: 16px; }
.metric-card { min-height: 132px; display: flex; align-items: center; gap: 15px; padding: 20px; }
.metric-card > span {
  width: 48px;
  height: 48px;
  flex: 0 0 auto;
  border-radius: 16px;
  display: grid;
  place-items: center;
  background: #e0f2fe;
  color: var(--kw-blue-700);
}
.metric-card .material-symbols-outlined { font-size: 25px; }
.metric-card small {
  display: block;
  color: var(--kw-muted);
  font-weight: 900;
  font-size: .78rem;
  text-transform: uppercase;
  letter-spacing: .05em;
}
.metric-card strong {
  display: block;
  margin-top: 5px;
  color: var(--kw-blue-900);
  font-size: 1.35rem;
  font-weight: 950;
  word-break: break-word;
}
.metric-card p { margin: 4px 0 0; color: var(--kw-muted); line-height: 1.35; }

.details-grid { display: grid; grid-template-columns: minmax(0, .85fr) minmax(0, 1.15fr); gap: 18px; }
.usage-panel, .payment-panel, .history-panel { padding: 24px; }
.panel-header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 16px;
  margin-bottom: 18px;
}
.panel-header h2 { margin: 0; color: var(--kw-blue-900); font-size: 1.24rem; }
.usage-panel { display: grid; align-content: start; }
.usage-row { display: grid; gap: 9px; padding: 18px 0; border-bottom: 1px solid var(--kw-border); }
.usage-row:last-child { border-bottom: 0; }
.usage-row > div:first-child { display: flex; align-items: center; justify-content: space-between; gap: 12px; }
.usage-row span { color: var(--kw-muted); font-weight: 900; }
.usage-row strong { color: var(--kw-blue-900); }
.progress { height: 10px; overflow: hidden; border-radius: 999px; background: #e8eff7; }
.progress i {
  display: block;
  height: 100%;
  border-radius: inherit;
  background: linear-gradient(90deg, var(--kw-blue-700), #25b7d3);
}
.progress.success i { background: linear-gradient(90deg, #16a34a, #4ade80); }

.success-banner {
  display: flex;
  align-items: center;
  gap: 8px;
  margin: 0 0 16px;
  padding: 11px 13px;
  border-radius: 14px;
  background: #dcfce7;
  color: #047857;
  font-weight: 900;
}
.success-banner .material-symbols-outlined { font-size: 19px; }

.card-form {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 12px;
  margin-bottom: 18px;
  padding: 16px;
  border: 1px dashed rgba(34, 131, 198, .42);
  border-radius: 18px;
  background: rgba(224,242,254,.35);
}
.card-form label { display: grid; gap: 7px; color: var(--kw-muted); font-size: .84rem; font-weight: 900; }
.card-form input, .card-form select {
  width: 100%;
  border: 1px solid var(--kw-border);
  border-radius: 13px;
  outline: 0;
  padding: 12px 13px;
  background: rgba(255,255,255,.9);
  color: var(--kw-ink);
}
.card-form input:focus, .card-form select:focus {
  border-color: var(--kw-blue-700);
  box-shadow: 0 0 0 4px rgba(34, 131, 198, .12);
}
.form-actions { grid-column: 1 / -1; display: flex; justify-content: flex-end; gap: 10px; }

.payment-list { display: grid; gap: 12px; }
.payment-method {
  display: grid;
  grid-template-columns: auto 1fr auto;
  align-items: center;
  gap: 14px;
  padding: 15px;
  border-radius: 16px;
  border: 1px solid var(--kw-border);
  background: rgba(255,255,255,.62);
}
.payment-method.primary {
  border-color: var(--kw-blue-700);
  background: rgba(34, 131, 198, .07);
  box-shadow: 0 10px 24px rgba(34,131,198,.08);
}
.brand {
  min-width: 58px;
  height: 38px;
  border-radius: 9px;
  display: inline-grid;
  place-items: center;
  color: #fff;
  font-size: .75rem;
  font-weight: 950;
  letter-spacing: .05em;
}
.brand.visa { background: #2c43d8; }
.brand.mastercard { background: #e11d2f; }
.brand.amex { background: #0f766e; }
.payment-method strong { display: block; color: var(--kw-blue-900); }
.payment-method p { margin: 4px 0 0; color: var(--kw-muted); }
.payment-method small {
  padding: 6px 10px;
  border-radius: 999px;
  background: #e7f7cb;
  color: #527711;
  font-size: .76rem;
  font-weight: 950;
}
.text-button, .receipt-link { border: 0; background: transparent; color: var(--kw-blue-700); font-weight: 950; cursor: pointer; }

.plans-section { display: grid; gap: 18px; }
.section-head h2 { margin: 0; color: var(--kw-blue-900); font-size: 1.55rem; letter-spacing: -.04em; }
.plans-grid { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 18px; }

.history-panel { display: grid; gap: 0; }
.table-wrap { overflow-x: auto; border: 1px solid var(--kw-border); border-radius: 16px; }
table { width: 100%; min-width: 820px; border-collapse: collapse; }
th, td { padding: 15px 16px; text-align: left; border-bottom: 1px solid var(--kw-border); }
th {
  background: #f3f7fb;
  color: #607795;
  font-size: .76rem;
  text-transform: uppercase;
  letter-spacing: .07em;
}
td { color: #274461; }
td strong { display: block; color: var(--kw-blue-900); }
td small { display: block; margin-top: 3px; color: var(--kw-muted); font-weight: 800; }
tr:last-child td { border-bottom: 0; }

body.dark-theme .billing-heading h1,
body.dark-theme .support-note strong,
body.dark-theme .metric-card strong,
body.dark-theme .panel-header h2,
body.dark-theme .usage-row strong,
body.dark-theme .payment-method strong,
body.dark-theme td strong { color: #eaf4ff; }
body.dark-theme .support-note,
body.dark-theme .card-form,
body.dark-theme .payment-method { background: rgba(255,255,255,.06); }
body.dark-theme th { background: rgba(255,255,255,.06); }
body.dark-theme td { color: #d5e3f4; }
body.dark-theme .card-form input,
body.dark-theme .card-form select { background: rgba(255,255,255,.08); color: #eaf4ff; }

@media (max-width: 1200px) {
  .billing-hero, .details-grid { grid-template-columns: 1fr; }
  .summary-grid { grid-template-columns: repeat(2, minmax(0, 1fr)); }
  .plans-grid { grid-template-columns: 1fr; }
}
@media (max-width: 720px) {
  .billing-heading { flex-direction: column; }
  .heading-actions { justify-content: flex-start; }
  .plan-summary { grid-template-columns: 1fr; }
  .price-box { justify-items: start; text-align: left; }
  .summary-grid, .card-form { grid-template-columns: 1fr; }
  .payment-method { grid-template-columns: auto 1fr; }
  .payment-method small, .payment-method .text-button { grid-column: 2; justify-self: start; }
}
</style>