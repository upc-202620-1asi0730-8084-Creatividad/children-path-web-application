<script setup>
defineProps({
  icon: { type: String, required: true },
  label: { type: String, required: true },
  value: { type: [String, Number], required: true },
  helper: { type: String, default: '' },
  tone: { type: String, default: 'blue' } // blue | green | amber | red
});
</script>

<template>
  <article class="kpi-card" :class="tone">
    <span class="kpi-icon"><i class="material-symbols-outlined">{{ icon }}</i></span>
    <div>
      <p>{{ label }}</p>
      <strong>{{ value }}</strong>
      <small>{{ helper }}</small>
    </div>
  </article>
</template>

<style scoped>
.kpi-card {
  position: relative;
  padding: 20px;
  border: 1px solid var(--kw-border);
  border-radius: 20px;
  background: var(--kw-card);
  box-shadow: var(--kw-shadow);
  min-height: 118px;
}
.kpi-icon {
  display: inline-grid;
  place-items: center;
  width: 34px;
  height: 34px;
  margin-bottom: 12px;
  border-radius: 12px;
  color: #1683d5;
  background: #e6f4ff;
}
.kpi-card.green .kpi-icon { color: #047857; background: #d1fae5; }
.kpi-card.amber .kpi-icon { color: #b45309; background: #fef3c7; }
.kpi-card.red .kpi-icon { color: #b91c1c; background: #fee2e2; }
p { margin: 0 0 4px; color: var(--kw-muted); font-weight: 850; font-size: .82rem; }
strong { display: block; color: var(--kw-ink); font-size: 2rem; letter-spacing: -.06em; line-height: 1; }
small { display: block; margin-top: 6px; color: var(--kw-muted); font-size: .78rem; }
</style>