<script setup>
import { useI18n } from 'vue-i18n';

defineProps({
  visible: { type: Boolean, default: false },
  route: { type: Object, default: null }
});

const emit = defineEmits(['update:visible']);

const { t } = useI18n();

function close() {
  emit('update:visible', false);
}
</script>

<template>
  <pv-dialog
      :visible="visible"
      @update:visible="emit('update:visible', $event)"
      :header="route?.name ?? ''"
      modal
      :style="{ width: '820px' }"
  >
    <div v-if="route" class="detail-grid">
      <article><small>{{ t('routesPage.dialog.code') }}</small><strong>{{ route.code }}</strong></article>
      <article><small>{{ t('routesPage.dialog.district') }}</small><strong>{{ route.district }}</strong></article>
      <article><small>{{ t('routesPage.dialog.school') }}</small><strong>{{ route.school }}</strong></article>
      <article><small>{{ t('routesPage.dialog.driver') }}</small><strong>{{ route.assignedDriver }}</strong></article>
      <article><small>{{ t('routesPage.dialog.vehicle') }}</small><strong>{{ route.assignedVehicle }}</strong></article>
      <article><small>{{ t('routesPage.dialog.schedule') }}</small><strong>{{ route.scheduleLabel }} · {{ route.startTime }} - {{ route.endTime }}</strong></article>
      <article><small>{{ t('routesPage.dialog.coverage') }}</small><strong>{{ route.coveragePercentage }}%</strong></article>
      <article><small>{{ t('routesPage.dialog.optimization') }}</small><strong>{{ route.optimizationScore }}%</strong></article>
    </div>
    <template #footer>
      <pv-button :label="t('shared.close')" @click="close" />
    </template>
  </pv-dialog>
</template>

<style scoped>
.detail-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 14px; }
.detail-grid article {
  padding: 14px;
  border: 1px solid var(--kw-border);
  border-radius: 14px;
  background: #f8fbfe;
}
.detail-grid small {
  display: block;
  color: var(--kw-muted);
  font-weight: 700;
  font-size: .78rem;
  text-transform: uppercase;
  letter-spacing: .06em;
  margin-bottom: 4px;
}
.detail-grid strong { display: block; color: var(--kw-ink); }
@media (max-width: 640px) { .detail-grid { grid-template-columns: 1fr; } }
</style>