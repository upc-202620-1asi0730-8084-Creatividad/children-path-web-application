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
  <article class="route-kpi-card" :class="tone">
    <div class="icon-box">
      <i class="material-symbols-outlined">{{ icon }}</i>
    </div>
    <p>{{ label }}</p>
    <strong>{{ value }}</strong>
    <span>{{ helper }}</span>
  </article>
</template>

<style scoped>
.route-kpi-card {
  position: relative;
  overflow: hidden;
  min-height: 132px;
  padding: 22px 24px;
  border: 1px solid rgba(15, 81, 130, 0.09);
  border-radius: 18px;
  background: rgba(255, 255, 255, 0.92);
  box-shadow: 0 18px 38px rgba(7, 47, 80, 0.08);
}
.route-kpi-card::after {
  content: '';
  position: absolute;
  right: -18px;
  bottom: -26px;
  width: 82px;
  height: 82px;
  border-radius: 999px;
  background: rgba(33, 150, 243, 0.12);
}
.icon-box {
  display: inline-flex;
  width: 36px;
  height: 36px;
  align-items: center;
  justify-content: center;
  border-radius: 12px;
  background: #e3f2fd;
  color: #1b83c9;
}
.route-kpi-card.green .icon-box { background: #dcfce7; color: #16a34a; }
.route-kpi-card.amber .icon-box { background: #fef3c7; color: #d97706; }
.route-kpi-card.red .icon-box { background: #fee2e2; color: #dc2626; }
p { margin: 14px 0 2px; color: #627084; font-size: 0.9rem; font-weight: 700; }
strong { display: block; color: #111827; font-size: clamp(1.8rem, 3vw, 2.35rem); line-height: 1; }
span { display: block; margin-top: 10px; color: #7a8798; font-size: 0.82rem; font-weight: 600; }
.icon-box .material-symbols-outlined { font-size: 20px; }
</style>