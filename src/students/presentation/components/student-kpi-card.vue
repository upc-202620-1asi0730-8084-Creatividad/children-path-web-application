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
  <article class="kpi-card" :class="tone">
    <span class="icon-wrap">
      <i class="material-symbols-outlined">{{ icon }}</i>
    </span>
    <small>{{ label }}</small>
    <strong>{{ value }}</strong>
    <p>{{ helper }}</p>
  </article>
</template>

<style scoped>
.kpi-card {
  position: relative;
  min-height: 126px;
  overflow: hidden;
  border: 1px solid #dfeaf5;
  border-radius: 18px;
  background: #ffffff;
  box-shadow: 0 16px 34px rgba(18, 65, 105, 0.08);
  padding: 22px;
}
.kpi-card::after {
  content: '';
  position: absolute;
  right: -26px;
  bottom: -28px;
  width: 86px;
  height: 86px;
  border-radius: 50%;
  background: rgba(33, 150, 220, 0.13);
}
.icon-wrap {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 34px;
  height: 34px;
  border-radius: 12px;
  color: #1b83c9;
  background: #e4f3ff;
  margin-bottom: 14px;
}
.kpi-card.green .icon-wrap { color: #0e9f6e; background: #dcfce7; }
.kpi-card.amber .icon-wrap { color: #c27803; background: #fef3c7; }
.kpi-card.red .icon-wrap { color: #dc2626; background: #fee2e2; }
small { display: block; color: #5f7086; font-size: 0.85rem; font-weight: 700; }
strong { display: block; margin-top: 4px; color: #0f172a; font-size: 2rem; line-height: 1; letter-spacing: -0.04em; }
p { margin: 9px 0 0; color: #708197; font-size: 0.82rem; }
.icon-wrap .material-symbols-outlined { font-size: 18px; }
</style>