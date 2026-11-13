<script setup>
import { computed } from 'vue';
import { useI18n } from 'vue-i18n';

const props = defineProps({
  optimizationScore: { type: Number, default: 0 },
  reviews: { type: Array, default: () => [] }
});

const { t } = useI18n();

const readinessGradient = computed(() => {
  const safe = Math.max(0, Math.min(props.optimizationScore, 100));
  return `conic-gradient(var(--kw-blue-700) ${safe}%, #e9eff7 0)`;
});

function formatDate(iso) {
  if (!iso) return '';
  const d = new Date(iso);
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}
</script>

<template>
  <section class="side-card readiness-card">
    <header>
      <div>
        <p>READINESS</p>
        <h2>Route readiness</h2>
      </div>
      <span>{{ optimizationScore }}%</span>
    </header>

    <div class="donut" :style="{ background: readinessGradient }">
      <div>
        <strong>{{ optimizationScore }}%</strong>
        <small>Optimized flow</small>
      </div>
    </div>

    <div class="legend">
      <span><i class="available"></i> Active</span>
      <span><i class="scheduled"></i> Scheduled</span>
      <span><i class="review"></i> Review</span>
    </div>
  </section>

  <section class="side-card review-card">
    <header>
      <div>
        <p>OPTIMIZATION CONTROL</p>
        <h2>Route reviews</h2>
      </div>
      <span>{{ reviews.length }} items</span>
    </header>

    <div class="review-list">
      <article v-for="review in reviews" :key="review.id">
        <div class="review-icon" :class="review.priority">
          <i class="material-symbols-outlined">
            {{ review.priority === 'high' ? 'priority_high' : 'tune' }}
          </i>
        </div>
        <div>
          <h3>{{ review.title }}</h3>
          <p>{{ review.description }}</p>
          <strong>{{ review.routeCode }} · {{ formatDate(review.dueDate) }}</strong>
        </div>
        <span :class="review.priority">{{ review.priority }}</span>
      </article>
    </div>
  </section>
</template>

<style scoped>
.side-card {
  padding: 24px;
  border: 1px solid #e3edf7;
  border-radius: 20px;
  background: rgba(255, 255, 255, 0.94);
  box-shadow: 0 18px 38px rgba(7, 47, 80, 0.08);
}
.side-card + .side-card { margin-top: 18px; }
header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 12px;
  margin-bottom: 22px;
}
p {
  margin: 0 0 4px;
  color: #1b83c9;
  font-size: 0.72rem;
  font-weight: 950;
  letter-spacing: 0.12em;
}
h2 { margin: 0; color: #10192d; font-size: clamp(1.35rem, 2vw, 1.8rem); font-weight: 950; }
header > span {
  padding: 8px 12px;
  border-radius: 999px;
  background: #e3f2fd;
  color: #1b83c9;
  font-size: 0.8rem;
  font-weight: 950;
}
.donut {
  display: grid;
  width: min(220px, 70vw);
  height: min(220px, 70vw);
  place-items: center;
  margin: 20px auto;
  border-radius: 50%;
}
.donut > div {
  display: grid;
  width: 112px;
  height: 112px;
  place-items: center;
  border-radius: inherit;
  background: #eef7fc;
  text-align: center;
}
.donut strong { color: #0f5284; font-size: 2.2rem; font-weight: 950; line-height: 1; }
.donut small { color: #657488; font-size: 0.78rem; font-weight: 800; }
.legend {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 14px;
  color: #657488;
  font-size: 0.8rem;
  font-weight: 800;
}
.legend span { display: inline-flex; align-items: center; gap: 7px; }
.legend i { width: 9px; height: 9px; border-radius: 50%; }
.available { background: #22c55e; }
.scheduled { background: #1b83c9; }
.review { background: #f59e0b; }
.review-list { display: grid; gap: 14px; }
.review-list article {
  display: grid;
  grid-template-columns: auto 1fr auto;
  gap: 12px;
  padding: 16px;
  border: 1px solid #e8eff7;
  border-radius: 16px;
  background: #ffffff;
}
.review-icon {
  display: inline-flex;
  width: 40px;
  height: 40px;
  align-items: center;
  justify-content: center;
  border-radius: 14px;
  background: #fef3c7;
  color: #d97706;
}
.review-icon.high { background: #fee2e2; color: #dc2626; }
.review-list h3 { margin: 0 0 5px; color: #10233f; font-size: 0.95rem; font-weight: 950; }
.review-list p {
  margin: 0 0 10px;
  color: #6b7890;
  font-size: 0.82rem;
  font-weight: 650;
  letter-spacing: 0;
}
.review-list strong { color: #11365b; font-size: 0.78rem; font-weight: 950; }
.review-list article > span {
  align-self: start;
  padding: 6px 10px;
  border-radius: 999px;
  background: #fef3c7;
  color: #b45309;
  font-size: 0.72rem;
  font-weight: 950;
  text-transform: capitalize;
}
.review-list article > span.high { background: #fee2e2; color: #dc2626; }
@media (max-width: 680px) { .review-list article { grid-template-columns: 1fr; } }
</style>