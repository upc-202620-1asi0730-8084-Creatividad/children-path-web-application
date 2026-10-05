<script setup>
import {useI18n} from "vue-i18n";

/**
 * Profile page for the authenticated user.
 *
 * @remarks
 * Placeholder view showing profile status. Will be extended with real profile
 * data once the user-profiles bounded context is migrated.
 */
const { t } = useI18n();
</script>

<template>
  <section class="profile-card">
    <div class="avatar">CP</div>
    <p>{{ t('profile.status') }}</p>
    <h1>{{ t('profile.title') }}</h1>
    <span>{{ t('profile.subtitle') }}</span>
  </section>
</template>

<style scoped>
.profile-card {
  max-width: 760px; margin: 8vh auto 0; padding: 44px;
  text-align: center; border: 1px solid var(--kw-border);
  border-radius: 30px; background: var(--kw-card);
  box-shadow: var(--kw-shadow);
}
.avatar {
  width: 84px; height: 84px; margin: 0 auto 18px;
  border-radius: 28px; display: grid; place-items: center;
  background: var(--kw-blue-700); color: #fff;
  font-weight: 900; font-size: 1.8rem;
}
p {
  color: #8a6200; background: var(--kw-yellow-100);
  display: inline-flex; padding: 8px 16px; border-radius: 999px; font-weight: 900;
}
h1 { font-size: clamp(2rem, 5vw, 3.5rem); margin: 12px 0; }
span { color: var(--kw-muted); font-size: 1.08rem; }
</style>