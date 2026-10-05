<script setup>
import {useRoute} from "vue-router";
import {useI18n} from "vue-i18n";

/**
 * Fallback page for bounded contexts not yet implemented.
 *
 * @remarks
 * Reads its title and bounded context from the route metadata so the same
 * component can be reused across multiple placeholder routes.
 */
const { t } = useI18n();
const route = useRoute();

const titleKey = route.meta.titleKey ?? 'development.status';
const boundedContext = route.meta.boundedContext ?? 'Children Path Module';
</script>

<template>
  <section class="development-card">
    <div class="emoji" aria-hidden="true">🚧</div>
    <p>{{ boundedContext }}</p>
    <h1>{{ t(titleKey) }}</h1>
    <span class="status">{{ t('development.status') }}</span>
    <p class="message">{{ t('development.message') }}</p>
    <p class="hint">{{ t('development.hint') }}</p>
  </section>
</template>

<style scoped>
.development-card {
  max-width: 820px; margin: min(10vh, 96px) auto 0;
  padding: 54px 32px; text-align: center;
  border: 1px solid var(--kw-border); border-radius: 30px;
  background: var(--kw-card); box-shadow: var(--kw-shadow);
}
.emoji { font-size: 4rem; animation: float 1.8s ease-in-out infinite; }
p:first-of-type {
  margin: 16px 0 8px; color: var(--kw-blue-700);
  font-weight: 900; letter-spacing: .12em; text-transform: uppercase;
}
h1 { margin: 0; font-size: clamp(2.1rem, 5vw, 3.6rem); letter-spacing: -.04em; }
.status {
  display: inline-flex; margin: 18px 0; padding: 8px 18px;
  border-radius: 999px; color: #805600; background: var(--kw-yellow-100); font-weight: 900;
}
.message, .hint { color: var(--kw-muted); font-size: 1.05rem; margin: 10px auto; max-width: 680px; }
@keyframes float {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-12px); }
}
</style>