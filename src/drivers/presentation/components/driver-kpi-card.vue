<script setup>
defineProps({
  icon: { type: String, required: true },
  label: { type: String, required: true },
  value: { type: [String, Number], required: true },
  helper: { type: String, default: '' },
  tone: { type: String, default: 'blue' }
});
</script>

<template>
  <article class="driver-kpi-card" :class="tone">
    <span class="icon-wrap">
      <i class="material-symbols-outlined">{{ icon }}</i>
    </span>
    <p>{{ label }}</p>
    <strong>{{ value }}</strong>
    <small>{{ helper }}</small>
  </article>
</template>

<style scoped>
.driver-kpi-card {
  position: relative;
  min-height: 150px;
  padding: 24px;
  border: 1px solid var(--kw-border);
  border-radius: 20px;
  background: var(--kw-card);
  box-shadow: var(--kw-shadow);
  overflow: hidden;
}
.driver-kpi-card::after {
  content: '';
  position: absolute;
  right: -26px;
  bottom: -34px;
  width: 92px;
  height: 92px;
  border-radius: 50%;
  background: rgba(34, 131, 198, .12);
}
.icon-wrap {
  display: inline-grid;
  place-items: center;
  width: 38px;
  height: 38px;
  border-radius: 12px;
  color: var(--kw-blue-700);
  background: #e3f4ff;
}
.green .icon-wrap { color: #15803d; background: #dcfce7; }
.amber .icon-wrap { color: #b26a00; background: #fff4d8; }
.red .icon-wrap { color: #b91c1c; background: #fee2e2; }
p { margin: 16px 0 2px; color: var(--kw-muted); font-weight: 700; }
strong { display: block; color: var(--kw-ink); font-size: 2rem; line-height: 1; }
small { display: block; margin-top: 9px; color: var(--kw-muted); font-weight: 700; }
.icon-wrap .material-symbols-outlined { font-size: 21px; }
</style>