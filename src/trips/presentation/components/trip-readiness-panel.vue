<script setup>
import { computed } from 'vue';
import { useI18n } from 'vue-i18n';

const props = defineProps({
  score: { type: Number, default: 0 },
  reviews: { type: Array, default: () => [] }
});

const { t } = useI18n();

const donutStyle = computed(() => {
  const safe = Math.max(0, Math.min(100, props.score));
  return `conic-gradient(#1b8bd1 ${safe}%, #e8f2f9 0)`;
});
</script>

<template>
  <section class="panel readiness-panel">
    <header>
      <span>Readiness</span>
      <small>{{ score }}%</small>
    </header>
    <h2>Trip readiness</h2>
    <div class="donut" :style="{ background: donutStyle }">
      <div class="donut-center">
        <strong>{{ score }}%</strong>
        <span>Safe trips</span>
      </div>
    </div>
    <div class="legend">
      <span><i class="ok"></i>Ready</span>
      <span><i class="warn"></i>Delayed</span>
      <span><i class="bad"></i>Review</span>
    </div>
  </section>

  <section class="panel reviews-panel">
    <header>
      <span>Trip control</span>
      <small>{{ reviews.length }} items</small>
    </header>
    <h2>Pending reviews</h2>
    <article
        v-for="review in reviews"
        :key="review.id"
        class="review-card"
        :class="{ high: review.severity === 'high' }"
    >
      <div class="review-icon">!</div>
      <div>
        <strong>{{ review.title }}</strong>
        <p>{{ review.description }}</p>
        <small>{{ review.tripCode }} · {{ review.dueDate }}</small>
      </div>
      <b>{{ review.severity }}</b>
    </article>
  </section>
</template>

<style scoped>
.panel {
  border-radius: 22px;
  border: 1px solid rgba(15, 73, 116, 0.08);
  background: rgba(255, 255, 255, 0.96);
  box-shadow: 0 18px 40px rgba(15, 73, 116, 0.08);
  padding: 24px;
}
.panel + .panel { margin-top: 20px; }
header { display: flex; justify-content: space-between; align-items: center; }
header span {
  color: #1985c7; font-weight: 1000; text-transform: uppercase;
  letter-spacing: 0.14em; font-size: 0.72rem;
}
header small {
  background: #e5f4ff; color: #1985c7;
  padding: 8px 12px; border-radius: 999px; font-weight: 1000;
}
h2 { margin: 8px 0 20px; color: #0f172a; font-size: 1.55rem; line-height: 1; }
.donut {
  width: 210px; height: 210px;
  margin: 0 auto; border-radius: 50%;
  display: grid; place-items: center;
  position: relative;
}
.donut::before {
  content: '';
  width: 122px; height: 122px;
  border-radius: 50%; background: #fff;
  position: absolute;
}
.donut-center {
  position: relative; z-index: 1;
  width: 112px; height: 112px;
  display: flex; flex-direction: column;
  justify-content: center; align-items: center;
  text-align: center;
}
.donut-center strong { color: #0f5f99; font-size: 2.05rem; line-height: 1; }
.donut-center span { margin-top: 8px; color: #64748b; font-weight: 900; font-size: 0.72rem; }
.legend {
  display: flex; gap: 12px; justify-content: center; flex-wrap: wrap;
  margin-top: 18px; color: #475569; font-weight: 900; font-size: 0.8rem;
}
.legend span { display: inline-flex; align-items: center; gap: 6px; }
i { width: 9px; height: 9px; border-radius: 50%; display: inline-block; }
i.ok { background: #22c55e; }
i.warn { background: #f59e0b; }
i.bad { background: #ef4444; }
.review-card {
  display: grid;
  grid-template-columns: auto 1fr auto;
  gap: 14px;
  padding: 16px;
  border-radius: 16px;
  background: #fff;
  border: 1px solid #e7eef6;
  margin-top: 12px;
}
.review-card.high { border-left: 4px solid #ef4444; }
.review-icon {
  width: 34px; height: 34px; border-radius: 12px;
  display: grid; place-items: center;
  background: #fee2e2; color: #dc2626; font-weight: 1000;
}
.review-card strong { color: #0f172a; }
.review-card p { color: #64748b; margin: 6px 0; font-weight: 700; }
.review-card small { color: #0f5f99; font-weight: 1000; }
.review-card b {
  text-transform: capitalize; color: #d97706; background: #fef3c7;
  padding: 6px 10px; border-radius: 999px; height: fit-content;
  font-weight: 900;
}
@media (max-width: 900px) { .donut { width: 180px; height: 180px; } }
</style>
