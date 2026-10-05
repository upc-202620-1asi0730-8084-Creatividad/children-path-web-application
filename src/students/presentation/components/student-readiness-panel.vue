<script setup>
import { useI18n } from 'vue-i18n';

defineProps({
  attendanceReliability: { type: Number, required: true },
  guardianVerified: { type: Number, required: true },
  reviews: { type: Array, required: true }
});

const { t } = useI18n();

function donutStyle(value) {
  const safe = Math.max(0, Math.min(100, value));
  return `conic-gradient(#2088cc ${safe}%, #edf4fb 0)`;
}
</script>

<template>
  <section class="readiness-card">
    <header>
      <div>
        <p>{{ t('studentsPage.readinessEyebrow') }}</p>
        <h2>{{ t('studentsPage.readinessTitle') }}</h2>
      </div>
      <span>{{ attendanceReliability }}%</span>
    </header>

    <div class="donut" :style="{ background: donutStyle(attendanceReliability) }">
      <div class="donut-content">
        <strong>{{ attendanceReliability }}%</strong>
        <small>{{ t('studentsPage.readinessLabel') }}</small>
      </div>
    </div>

    <div class="legend">
      <span><i class="green"></i>{{ t('studentsPage.readiness.assigned') }}</span>
      <span><i class="blue"></i>{{ t('studentsPage.readiness.verified') }}</span>
      <span><i class="amber"></i>{{ t('studentsPage.readiness.review') }}</span>
    </div>
  </section>

  <section class="review-card">
    <header>
      <div>
        <p>{{ t('studentsPage.reviewEyebrow') }}</p>
        <h2>{{ t('studentsPage.reviewTitle') }}</h2>
      </div>
      <span>{{ reviews.length }} {{ t('studentsPage.items') }}</span>
    </header>

    <div class="review-list">
      <article v-for="review in reviews" :key="review.id">
        <span class="review-icon" :class="review.priority">
          <i class="material-symbols-outlined">
            {{ review.priority === 'high' ? 'priority_high' : 'fact_check' }}
          </i>
        </span>
        <div>
          <h3>{{ review.title }}</h3>
          <p>{{ review.description }}</p>
          <strong>{{ review.studentCode }} · {{ review.studentName }} · {{ review.dueDate }}</strong>
        </div>
        <em :class="review.priority">{{ review.priority }}</em>
      </article>
    </div>
  </section>
</template>

<style scoped>
.readiness-card, .review-card {
  border: 1px solid #dfeaf5;
  border-radius: 20px;
  background: #ffffff;
  box-shadow: 0 16px 34px rgba(18, 65, 105, 0.08);
  padding: 22px;
}
.review-card { margin-top: 20px; }
header {
  display: flex;
  justify-content: space-between;
  gap: 12px;
  align-items: flex-start;
  margin-bottom: 18px;
}
header p {
  margin: 0 0 4px;
  color: #1682c6;
  font-size: 0.75rem;
  font-weight: 900;
  letter-spacing: 0.12em;
  text-transform: uppercase;
}
h2 { margin: 0; color: #0f172a; font-size: 1.55rem; letter-spacing: -0.04em; }
header > span {
  border-radius: 999px;
  padding: 7px 12px;
  color: #1682c6;
  background: #e4f3ff;
  font-size: 0.78rem;
  font-weight: 900;
  white-space: nowrap;
}
.donut {
  display: grid;
  place-items: center;
  width: 190px;
  height: 190px;
  margin: 14px auto 18px;
  border-radius: 50%;
  position: relative;
}
.donut::after {
  content: '';
  position: absolute;
  z-index: 0;
  inset: 42px;
  border-radius: 50%;
  background: #ffffff;
}
.donut-content {
  position: relative;
  z-index: 1;
  display: grid;
  place-items: center;
  gap: 3px;
  width: 92px;
  min-height: 76px;
  text-align: center;
}
.donut strong, .donut small { text-align: center; }
.donut strong {
  display: block;
  color: #0f5f98;
  font-size: 2rem;
  line-height: 0.95;
  letter-spacing: -0.07em;
}
.donut small {
  display: block;
  max-width: 82px;
  color: #64748b;
  font-size: 0.66rem;
  font-weight: 900;
  line-height: 1.1;
}
.legend { display: flex; flex-wrap: wrap; gap: 12px; justify-content: center; }
.legend span {
  display: inline-flex;
  align-items: center;
  gap: 7px;
  color: #5f7086;
  font-size: 0.82rem;
  font-weight: 800;
}
.legend i { width: 9px; height: 9px; border-radius: 50%; }
.green { background: #18be7c; }
.blue { background: #2088cc; }
.amber { background: #f5b22d; }
.review-list { display: grid; gap: 12px; }
.review-list article {
  display: grid;
  grid-template-columns: auto 1fr auto;
  gap: 12px;
  border: 1px solid #e8eef5;
  border-radius: 16px;
  padding: 16px;
  background: #ffffff;
}
.review-icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 38px;
  height: 38px;
  border-radius: 14px;
  color: #b45309;
  background: #fff7ed;
}
.review-icon.high { color: #dc2626; background: #fee2e2; }
.review-icon.medium { color: #c27803; background: #fef3c7; }
h3 { margin: 0; color: #10233f; font-size: 0.94rem; font-weight: 900; }
.review-list p { margin: 4px 0 8px; color: #65768c; font-size: 0.84rem; line-height: 1.45; }
.review-list strong { color: #0f4f83; font-size: 0.78rem; }
em {
  align-self: start;
  border-radius: 999px;
  padding: 5px 9px;
  font-size: 0.72rem;
  font-style: normal;
  font-weight: 900;
  text-transform: capitalize;
}
em.high { color: #dc2626; background: #fee2e2; }
em.medium { color: #b45309; background: #fef3c7; }
em.low { color: #0f766e; background: #dcfce7; }
.review-icon .material-symbols-outlined { font-size: 17px; }
@media (max-width: 760px) {
  .review-list article { grid-template-columns: 1fr; }
}
</style>