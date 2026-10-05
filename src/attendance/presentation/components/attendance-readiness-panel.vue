<script setup>
import { useI18n } from 'vue-i18n';

defineProps({
  summary: { type: Object, required: true }
});

const { t } = useI18n();
</script>

<template>
  <article class="readiness-panel">
    <div class="section-heading compact">
      <div>
        <small>{{ t('attendance.readiness.eyebrow') }}</small>
        <h2>{{ t('attendance.readiness.title') }}</h2>
      </div>
      <span>{{ summary.attendanceReliability }}%</span>
    </div>

    <div
        class="donut"
        :style="{
        background: `radial-gradient(circle at center, #fff 0 48%, transparent 49%), conic-gradient(#1683d5 ${summary.attendanceReliability}%, #e2eef8 0)`
      }"
    >
      <strong>{{ summary.attendanceReliability }}%</strong>
      <span>{{ t('attendance.readiness.caption') }}</span>
    </div>

    <div class="legend-row">
      <span><i class="on-board"></i>{{ t('attendance.status.on_board') }} · {{ summary.onBoard }}</span>
      <span><i class="arrived"></i>{{ t('attendance.status.arrived') }} · {{ summary.arrived }}</span>
      <span><i class="waiting"></i>{{ t('attendance.status.waiting') }} · {{ summary.waiting }}</span>
      <span><i class="absent"></i>{{ t('attendance.status.absent') }} · {{ summary.absent }}</span>
    </div>
  </article>
</template>

<style scoped>
.readiness-panel {
  border: 1px solid var(--kw-border);
  border-radius: 24px;
  background: var(--kw-card);
  box-shadow: var(--kw-shadow);
  padding: 22px;
  text-align: center;
}
.section-heading {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 16px;
  text-align: left;
}
.section-heading small {
  color: #1683d5;
  font-weight: 950;
  letter-spacing: .14em;
  text-transform: uppercase;
}
.section-heading h2 {
  margin: 4px 0 0;
  font-size: 1.55rem;
  letter-spacing: -.055em;
}
.section-heading > span {
  padding: 8px 12px;
  border-radius: 999px;
  background: #e6f4ff;
  color: #1683d5;
  font-weight: 900;
  font-size: .8rem;
}
.donut {
  width: 178px;
  height: 178px;
  margin: 18px auto 12px;
  border-radius: 50%;
  display: grid;
  place-items: center;
  text-align: center;
}
.donut strong {
  color: #0f5f9f;
  font-size: 2.35rem;
  letter-spacing: -.06em;
  line-height: 1;
}
.donut span {
  color: var(--kw-muted);
  font-weight: 900;
  font-size: .72rem;
}
.legend-row {
  display: flex;
  justify-content: center;
  gap: 12px;
  flex-wrap: wrap;
  color: var(--kw-muted);
  font-size: .78rem;
  font-weight: 800;
}
.legend-row span { display: inline-flex; align-items: center; gap: 6px; }
.legend-row i { width: 9px; height: 9px; border-radius: 50%; }
.legend-row .on-board { background: #1683d5; }
.legend-row .arrived { background: #22c55e; }
.legend-row .waiting { background: #94a3b8; }
.legend-row .absent { background: #ef4444; }
</style>