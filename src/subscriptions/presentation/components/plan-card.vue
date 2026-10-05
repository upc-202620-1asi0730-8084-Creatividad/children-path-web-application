<script setup>
import { computed } from 'vue';
import { useI18n } from 'vue-i18n';

const props = defineProps({
  plan: { type: Object, required: true }
});

const emit = defineEmits(['select']);

const { t } = useI18n();

const formattedPrice = computed(() => {
  if (props.plan.price === null) return null;
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: props.plan.currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(props.plan.price);
});

function onSelect() {
  emit('select', props.plan.id);
}
</script>

<template>
  <article class="plan-card" :class="{ featured: plan.featured }">
    <span v-if="plan.featured" class="plan-ribbon">
      {{ t('subscriptions.currentPlan') }}
    </span>

    <p class="plan-label">{{ t('subscriptions.plans.' + plan.label) }}</p>

    <div v-if="plan.price !== null" class="price">
      <span>{{ formattedPrice }}</span>
      <small>/{{ t('subscriptions.month') }}</small>
    </div>
    <div v-else class="price custom-price">
      <span>{{ t('subscriptions.customPrice') }}</span>
    </div>

    <p class="target">{{ t('subscriptions.targets.' + plan.target) }}</p>

    <ul class="features" aria-label="Subscription features">
      <li v-for="feature in plan.features" :key="feature.text" :class="{ disabled: !feature.included }">
        <i class="material-symbols-outlined">
          {{ feature.included ? 'check' : 'remove' }}
        </i>
        <span>{{ t('subscriptions.features.' + feature.text) }}</span>
      </li>
    </ul>

    <button
        class="plan-action"
        :class="{ contact: plan.actionType === 'contact' }"
        type="button"
        @click="onSelect"
    >
      {{ t('subscriptions.actions.' + plan.actionType) }}
    </button>
  </article>
</template>

<style scoped>
.plan-card {
  position: relative;
  min-height: 318px;
  padding: 24px 24px 20px;
  border: 1px solid var(--kw-border);
  border-radius: 18px;
  background: var(--kw-card);
  box-shadow: var(--kw-shadow);
  display: flex;
  flex-direction: column;
  transition: transform .2s ease, border-color .2s ease;
}
.plan-card:hover { transform: translateY(-3px); }
.plan-card.featured {
  border-color: var(--kw-blue-700);
  box-shadow: 0 20px 48px rgba(34, 131, 198, .18);
}
.plan-ribbon {
  position: absolute;
  top: -13px;
  left: 50%;
  transform: translateX(-50%);
  padding: 6px 18px;
  border-radius: 999px;
  background: var(--kw-blue-700);
  color: white;
  font-size: 12px;
  font-weight: 800;
}
.plan-label {
  margin: 0 0 8px;
  color: #5f7695;
  font-weight: 800;
  letter-spacing: .08em;
  text-transform: uppercase;
}
.price { display: flex; align-items: baseline; gap: 4px; color: var(--kw-blue-900); }
.price span { font-size: clamp(2rem, 4vw, 2.7rem); font-weight: 900; line-height: 1; }
.price small { color: var(--kw-muted); font-weight: 700; }
.custom-price span { font-size: clamp(1.45rem, 3vw, 2rem); }
.target { min-height: 38px; margin: 10px 0 16px; color: var(--kw-muted); line-height: 1.45; }
.features { list-style: none; padding: 0; margin: 0 0 18px; display: grid; gap: 9px; }
.features li {
  display: flex;
  align-items: center;
  gap: 8px;
  color: #1f3b5b;
  border-bottom: 1px solid rgba(15, 43, 87, .06);
  padding-bottom: 8px;
}
.features li.disabled { color: #a9b4c2; }
.features .material-symbols-outlined { font-size: 16px; color: var(--kw-blue-700); }
.features li.disabled .material-symbols-outlined { color: #b7c2cf; }
.plan-action {
  margin-top: auto;
  width: 100%;
  border: 0;
  border-radius: 9px;
  padding: 12px 16px;
  background: #eaf4fc;
  color: var(--kw-blue-900);
  font-weight: 800;
  cursor: pointer;
}
.featured .plan-action { background: var(--kw-blue-700); color: white; }
.plan-action.contact { background: var(--kw-yellow-500); color: #382a05; }
body.dark-theme .features li { color: #dceaff; border-bottom-color: rgba(255, 255, 255, .08); }
body.dark-theme .price { color: #eaf4ff; }
@media (max-width: 720px) { .plan-card { min-height: auto; } }
</style>