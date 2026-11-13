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
    <span class="kpi-icon" aria-hidden="true">
      <i class="material-symbols-outlined">{{ icon }}</i>
    </span>
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
  min-height: 140px;
  padding: 22px;
  border: 1px solid var(--kw-border);
  border-radius: 20px;
  background: var(--kw-card);
  box-shadow: var(--kw-shadow);
  overflow: hidden;
}
.kpi-card::after {
  content: '';
  position: absolute;
  right: -28px;
  bottom: -30px;
  width: 92px;
  height: 92px;
  border-radius: 999px;
  background: rgba(34, 131, 198, .13);
}
.kpi-icon {
  display: inline-grid;
  place-items: center;
  width: 38px;
  height: 38px;
  margin-bottom: 14px;
  border-radius: 13px;
  color: var(--kw-blue-700);
  background: #e3f4ff;
}
p { margin: 0 0 4px; color: var(--kw-muted); font-weight: 700; }
strong { display: block; color: var(--kw-ink); font-size: clamp(1.75rem, 3vw, 2.25rem); line-height: 1; }
small { display: block; margin-top: 9px; color: var(--kw-muted); font-size: .85rem; }
.kpi-card.green .kpi-icon { color: #13824f; background: #dcfce7; }
.kpi-card.amber .kpi-icon { color: #b77900; background: #fff4d8; }
.kpi-card.red .kpi-icon { color: #df3b3b; background: #ffe4e6; }
body.dark-theme .kpi-icon { background: rgba(125, 205, 255, .12); }
</style>