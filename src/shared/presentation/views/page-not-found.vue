<script setup>
import { useRoute, useRouter } from "vue-router";
import { useI18n } from "vue-i18n";
const { t } = useI18n();
const route = useRoute();
const router = useRouter();
</script>

<template>
  <section class="content-card">
    <div class="emoji">🔍</div>
    <h1>{{ t('pagenotfound.title') }}</h1>
    <p>{{ t('pagenotfound.content', { 'unavailable-route': route.path }) }}</p>
    <pv-button @click="router.push('/home')">
      {{ t('pagenotfound.gohome') }}
    </pv-button>
  </section>
</template>

<style scoped>
.content-card {
  max-width: 700px;
  margin: 10vh auto 0;
  padding: 50px 32px;
  text-align: center;
  border: 1px solid var(--kw-border);
  border-radius: 30px;
  background: var(--kw-card);
  box-shadow: var(--kw-shadow);
}
.emoji { font-size: 4rem; }
h1 { font-size: clamp(2rem, 5vw, 3.5rem); margin: 12px 0; }
p { color: var(--kw-muted); font-size: 1.08rem; margin-bottom: 24px; }
</style>