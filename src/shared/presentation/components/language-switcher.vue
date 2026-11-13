<script setup>
import { useI18n } from 'vue-i18n';
const { locale, availableLocales } = useI18n();
</script>

<template>
  <div class="lang-switch" role="group">
    <button
        v-for="lang in availableLocales"
        :key="lang"
        type="button"
        :class="{ active: locale === lang }"
        @click="locale = lang"
    >
      {{ lang.toUpperCase() }}
    </button>
  </div>
</template>

<style scoped>
.lang-switch {
  display: inline-flex;
  gap: 4px;
  padding: 4px;
  border-radius: 999px;
  background: #ffffff;
  box-shadow: 0 8px 20px rgba(16, 52, 89, .08);
}
.lang-switch button {
  border: 0;
  background: transparent;
  color: #64748b;
  border-radius: 999px;
  padding: 8px 13px;
  font-weight: 900;
  font-size: .78rem;
  cursor: pointer;
  transition: background .14s ease, color .14s ease;
}
.lang-switch button.active {
  color: #fff;
  background: #136fa8;
}
</style>