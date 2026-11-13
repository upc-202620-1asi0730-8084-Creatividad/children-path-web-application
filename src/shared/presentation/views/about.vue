<script setup>
import { useI18n } from "vue-i18n";
const { t } = useI18n();
</script>

<template>
  <section class="content-card">
    <h1>{{ t('about.title') }}</h1>
    <p>{{ t('about.content') }}</p>
  </section>
</template>

<style scoped>
.content-card {
  max-width: 820px;
  margin: 6vh auto 0;
  padding: 44px;
  border: 1px solid var(--kw-border);
  border-radius: 30px;
  background: var(--kw-card);
  box-shadow: var(--kw-shadow);
}
h1 { font-size: clamp(2rem, 5vw, 3.5rem); margin: 0 0 12px; }
p { color: var(--kw-muted); font-size: 1.08rem; line-height: 1.6; }
</style>