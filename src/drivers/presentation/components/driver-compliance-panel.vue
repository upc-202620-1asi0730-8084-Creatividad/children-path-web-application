<script setup>
import { useI18n } from 'vue-i18n';

defineProps({
  reviews: { type: Array, required: true }
});

const { t } = useI18n();

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
  <article class="driver-panel compliance-panel">
    <div class="panel-header compact">
      <div>
        <p class="eyebrow">{{ t('drivers.compliance.eyebrow') }}</p>
        <h2>{{ t('drivers.compliance.title') }}</h2>
      </div>
      <span>{{ reviews.length }} {{ t('drivers.compliance.items') }}</span>
    </div>

    <div class="review-list">
      <article
          v-for="review in reviews"
          :key="review.id"
          class="review-item"
          :class="review.priority"
      >
        <i class="material-symbols-outlined">
          {{ review.priority === 'high' ? 'priority_high' : 'task_alt' }}
        </i>
        <div>
          <div class="review-title">
            <strong>{{ review.title }}</strong>
            <span>{{ t('drivers.priority.' + review.priority) }}</span>
          </div>
          <p>{{ review.description }}</p>
          <small>{{ review.driverCode }} · {{ review.driverName }} · {{ formatDate(review.dueDate) }}</small>
        </div>
      </article>
    </div>
  </article>
</template>

<style scoped>
.driver-panel {
  padding: 22px;
  border: 1px solid var(--kw-border);
  border-radius: 22px;
  background: var(--kw-card);
  box-shadow: var(--kw-shadow);
}
.panel-header { display: flex; align-items: center; justify-content: space-between; gap: 16px; margin-bottom: 18px; }
.panel-header.compact { align-items: flex-start; }
.eyebrow {
  margin: 0 0 8px;
  color: var(--kw-blue-700);
  font-size: .78rem;
  font-weight: 950;
  letter-spacing: .12em;
  text-transform: uppercase;
}
h2 { margin: 0; color: var(--kw-ink); font-size: 1.55rem; line-height: 1.05; }
.panel-header > span {
  padding: 7px 12px;
  border-radius: 999px;
  color: #0f5f9a;
  background: #e3f4ff;
  font-size: .82rem;
  font-weight: 900;
}
.review-list { display: grid; gap: 12px; }
.review-item {
  display: grid;
  grid-template-columns: auto 1fr;
  gap: 13px;
  padding: 16px;
  border: 1px solid var(--kw-border);
  border-radius: 16px;
  background: rgba(255,255,255,.66);
}
.review-item .material-symbols-outlined {
  display: inline-grid;
  place-items: center;
  width: 34px;
  height: 34px;
  border-radius: 12px;
  color: #b26a00;
  background: #fff4d8;
  font-size: 20px;
}
.review-item.high .material-symbols-outlined { color: #b91c1c; background: #fee2e2; }
.review-title { display: flex; align-items: center; justify-content: space-between; gap: 10px; }
.review-title strong { color: var(--kw-blue-900); }
.review-title span {
  color: #9a6000;
  background: #fff4d8;
  border-radius: 999px;
  padding: 4px 10px;
  font-size: .72rem;
  font-weight: 900;
  text-transform: capitalize;
}
.review-item.high .review-title span { color: #b91c1c; background: #fee2e2; }
p { margin: 6px 0 8px; color: var(--kw-muted); font-size: .88rem; line-height: 1.35; }
small { color: #49637d; font-weight: 850; }
body.dark-theme .review-item { background: rgba(255,255,255,.045); }
body.dark-theme .review-title strong { color: #eaf4ff; }
</style>