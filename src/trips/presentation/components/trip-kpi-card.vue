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
  <article class="trip-kpi-card">
    <span class="trip-kpi-icon" :class="tone">
      <i class="material-symbols-outlined">{{ icon }}</i>
    </span>
    <p>{{ label }}</p>
    <strong>{{ value }}</strong>
    <small>{{ helper }}</small>
  </article>
</template>

<style scoped>
.trip-kpi-card {
  position: relative;
  min-height: 120px;
  padding: 22px;
  border: 1px solid rgba(21, 94, 149, 0.08);
  border-radius: 20px;
  background: rgba(255, 255, 255, 0.92);
  box-shadow: 0 18px 40px rgba(15, 73, 116, 0.08);
  overflow: hidden;
}
.trip-kpi-card::after {
  content: '';
  position: absolute;
  right: -24px;
  bottom: -24px;
  width: 72px;
  height: 72px;
  border-radius: 50%;
  background: rgba(30, 144, 210, 0.12);
}
.trip-kpi-icon {
  width: 34px;
  height: 34px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border-radius: 12px;
  background: #e5f4ff;
  color: #1985c7;
  margin-bottom: 12px;
}
.trip-kpi-icon.green { background: #dcfce7; color: #16a34a; }
.trip-kpi-icon.amber { background: #fef3c7; color: #d97706; }
.trip-kpi-icon.red { background: #ffe4e6; color: #e11d48; }
.trip-kpi-card p { margin: 0 0 4px; color: #64748b; font-weight: 800; font-size: 0.8rem; }
.trip-kpi-card strong { display: block; color: #0f172a; font-size: clamp(1.6rem, 2vw, 2.15rem); line-height: 1; }
.trip-kpi-card small { display: block; color: #718096; font-weight: 700; margin-top: 10px; }
.trip-kpi-icon .material-symbols-outlined { font-size: 20px; }
</style>
