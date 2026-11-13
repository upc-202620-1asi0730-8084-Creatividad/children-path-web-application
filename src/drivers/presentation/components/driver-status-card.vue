<script setup>
import { useI18n } from 'vue-i18n';

const props = defineProps({
  driver: { type: Object, required: true }
});

const { t } = useI18n();

function scoreGradient(value) {
  const safe = Math.max(0, Math.min(value, 100));
  return `linear-gradient(90deg, var(--kw-blue-700), #25c4b7 ${safe}%, #e8f0f8 ${safe}%)`;
}

function formatShortTime(iso) {
  if (!iso) return '';
  const d = new Date(iso);
  return d.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
}
</script>

<template>
  <article class="driver-card">
    <div class="driver-topline">
      <div class="driver-identity">
        <span class="avatar">{{ driver.initials }}</span>
        <div>
          <h3>{{ driver.fullName }}</h3>
          <p>{{ driver.code }} · {{ driver.licenseClass }} · {{ driver.yearsOfExperience }} {{ t('drivers.card.years') }}</p>
        </div>
      </div>
      <span class="status" :class="driver.status">{{ t('drivers.status.' + driver.status) }}</span>
    </div>

    <div class="driver-meta">
      <span><i class="material-symbols-outlined">directions_bus</i>{{ driver.assignedVehicle }}</span>
      <span><i class="material-symbols-outlined">route</i>{{ driver.assignedRoute }}</span>
      <span><i class="material-symbols-outlined">groups</i>{{ driver.studentsAssigned }} {{ t('drivers.card.students') }}</span>
    </div>

    <div class="score-row">
      <div>
        <span>{{ t('drivers.card.safetyScore') }}</span>
        <strong>{{ driver.safetyScore }}%</strong>
      </div>
      <i :style="{ background: scoreGradient(driver.safetyScore) }"></i>
    </div>

    <div class="card-footer">
      <span>
        <i class="material-symbols-outlined">schedule</i>
        {{ formatShortTime(driver.lastCheckIn) }} · {{ driver.availabilityLabel }}
      </span>
      <span :class="{ invalid: !driver.documentsValid }">
        <i class="material-symbols-outlined">{{ driver.documentsValid ? 'verified' : 'warning' }}</i>
        {{ driver.documentsValid ? t('drivers.card.documentsValid') : t('drivers.card.documentsPending') }}
      </span>
    </div>
  </article>
</template>

<style scoped>
.driver-card {
  display: grid;
  gap: 18px;
  padding: 20px;
  border: 1px solid var(--kw-border);
  border-radius: 18px;
  background: rgba(255,255,255,.86);
  box-shadow: 0 14px 30px rgba(15, 43, 87, .06);
}
.driver-topline, .driver-identity, .driver-meta, .card-footer, .score-row > div {
  display: flex;
  align-items: center;
}
.driver-topline { justify-content: space-between; gap: 12px; }
.driver-identity { gap: 12px; min-width: 0; }
.avatar {
  display: inline-grid;
  place-items: center;
  width: 46px;
  height: 46px;
  flex: 0 0 auto;
  border-radius: 16px;
  color: white;
  background: linear-gradient(135deg, var(--kw-blue-700), var(--kw-blue-900));
  font-weight: 950;
}
h3 { margin: 0; color: var(--kw-blue-900); font-size: 1.05rem; }
p { margin: 4px 0 0; color: var(--kw-muted); font-size: .86rem; font-weight: 700; }
.status {
  padding: 7px 12px;
  border-radius: 999px;
  font-size: .75rem;
  font-weight: 950;
  white-space: nowrap;
}
.status.available { color: #0f7a46; background: #dcfce7; }
.status.onRoute { color: #0f5f9a; background: #e3f4ff; }
.status.offDuty { color: #52616f; background: #edf2f7; }
.status.review { color: #9a6000; background: #fff4d8; }
.driver-meta { flex-wrap: wrap; gap: 10px 14px; color: #58708a; font-size: .84rem; font-weight: 800; }
.driver-meta span, .card-footer span { display: inline-flex; align-items: center; gap: 6px; }
.driver-meta .material-symbols-outlined,
.card-footer .material-symbols-outlined { font-size: 16px; }
.score-row { display: grid; gap: 8px; }
.score-row > div { justify-content: space-between; color: var(--kw-muted); font-size: .85rem; font-weight: 800; }
.score-row strong { color: var(--kw-blue-900); font-size: 1rem; }
.score-row i { display: block; height: 9px; border-radius: 999px; }
.card-footer { justify-content: space-between; gap: 14px; padding-top: 4px; color: var(--kw-muted); font-size: .78rem; font-weight: 800; }
.card-footer .invalid { color: #c2410c; }
body.dark-theme .driver-card { background: rgba(255,255,255,.045); }
body.dark-theme h3, body.dark-theme .score-row strong { color: #eaf4ff; }
@media (max-width: 620px) {
  .driver-topline, .card-footer { align-items: flex-start; flex-direction: column; }
}
</style>