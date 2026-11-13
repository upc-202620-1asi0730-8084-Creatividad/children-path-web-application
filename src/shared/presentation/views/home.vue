<script setup>
import {computed} from "vue";
import {useI18n} from "vue-i18n";
import {useRouter} from "vue-router";
import {navigationStore} from "@/shared/application/services/navigation.service.js";
import {authStore} from "@/iam/application/services/auth.service.js";

/**
 * Home page of the Children Path application.
 *
 * @remarks
 * Shows the hero banner, role panel, KPI indicators and quick access to the
 * modules enabled for the current user.
 */
const { t } = useI18n();
const router = useRouter();

const visibleModules = computed(() => navigationStore.visibleItems());

const indicators = computed(() => [
  {icon: 'route',         labelKey: 'home.trips',    value: '12',  helper: 'In progress today'},
  {icon: 'school',        labelKey: 'home.students', value: '184', helper: 'Morning service'},
  {icon: 'notifications', labelKey: 'home.alerts',   value: '4',   helper: 'Requires attention'},
  {icon: 'apps',          labelKey: 'home.modules',  value: String(visibleModules.value.length), helper: 'Enabled for role'}
]);

const goTo = (route) => router.push(route);
</script>

<template>
  <section class="home-page">
    <section class="hero-card">
      <div>
        <p>{{ t('home.eyebrow') }}</p>
        <h1>{{ t('home.title') }}</h1>
        <span>{{ t('home.subtitle') }}</span>
      </div>
      <a href="#" class="primary-action" @click.prevent="goTo('/app/dashboard')">
        {{ t('home.cta') }}
        <i class="material-symbols-outlined">arrow_forward</i>
      </a>
    </section>

    <section class="role-panel">
      <article>
        <span class="avatar">{{ authStore.currentUser?.avatarInitials ?? 'CP' }}</span>
        <div>
          <p>{{ t('home.roleTitle') }}</p>
          <h2>{{ authStore.currentUser?.role ?? 'Guest' }}</h2>
          <small>{{ authStore.currentUser?.displayName ?? 'Children Path User' }}</small>
        </div>
      </article>
      <article>
        <i class="material-symbols-outlined">verified_user</i>
        <div>
          <p>{{ t('home.enabledModules') }}</p>
          <h2>{{ visibleModules.length }}</h2>
          <small>{{ t('home.staticVersion') }}</small>
        </div>
      </article>
    </section>

    <section class="stats-grid">
      <article v-for="item in indicators" :key="item.labelKey">
        <i class="material-symbols-outlined">{{ item.icon }}</i>
        <span>{{ t(item.labelKey) }}</span>
        <strong>{{ item.value }}</strong>
        <small>{{ item.helper }}</small>
      </article>
    </section>

    <section class="panel module-panel">
      <p>{{ t('home.quick') }}</p>
      <h2>{{ t('home.performance') }}</h2>
      <div class="module-grid">
        <a
            v-for="item in visibleModules"
            :key="item.route"
            href="#"
            @click.prevent="goTo(item.route)"
        >
          <i class="material-symbols-outlined">{{ item.icon }}</i>
          <strong>{{ t(item.labelKey) }}</strong>
          <small>{{ t('development.status') }}</small>
        </a>
      </div>
    </section>
  </section>
</template>

<style scoped>
.home-page { display: grid; gap: 24px; }
.hero-card, .panel, .stats-grid article, .role-panel article {
  background: var(--kw-card);
  border: 1px solid var(--kw-border);
  box-shadow: var(--kw-shadow);
  border-radius: 28px;
}
.hero-card {
  min-height: 190px;
  display: flex; align-items: center; justify-content: space-between;
  gap: 24px; padding: 36px;
  background: linear-gradient(120deg, rgba(255,255,255,.94), rgba(227,246,255,.94) 68%, rgba(255,244,216,.95));
}
p { margin: 0 0 10px; color: var(--kw-blue-700); font-weight: 900; letter-spacing: .12em; text-transform: uppercase; }
h1 { margin: 0; max-width: 780px; font-size: clamp(2.3rem, 5vw, 4rem); line-height: .98; letter-spacing: -.06em; }
h2 { margin: 0; font-size: clamp(1.45rem, 2.6vw, 2rem); }
.hero-card span { display: block; max-width: 720px; color: var(--kw-muted); font-size: 1.06rem; }
.primary-action {
  display: inline-flex; align-items: center; gap: 10px;
  padding: 16px 22px; border-radius: 16px;
  color: #fff; background: var(--kw-blue-700);
  font-weight: 900; text-decoration: none;
  box-shadow: 0 16px 28px rgba(34, 131, 198, .26);
  white-space: nowrap;
}
.role-panel { display: grid; grid-template-columns: 1.2fr .8fr; gap: 18px; }
.role-panel article { display: flex; align-items: center; gap: 16px; padding: 22px; }
.avatar, .role-panel .material-symbols-outlined {
  width: 54px; height: 54px;
  display: grid; place-items: center; border-radius: 18px;
  color: #fff; background: var(--kw-blue-700); font-weight: 900;
}
.role-panel .material-symbols-outlined { background: #dcfce7; color: #047857; font-size: 28px; }
.role-panel small { color: var(--kw-muted); font-weight: 700; }
.stats-grid { display: grid; grid-template-columns: repeat(4, minmax(0, 1fr)); gap: 18px; }
.stats-grid article { padding: 22px; display: grid; gap: 8px; }
.stats-grid .material-symbols-outlined { color: var(--kw-blue-700); }
.stats-grid span, .stats-grid small { color: var(--kw-muted); }
.stats-grid strong { font-size: 2rem; }
.panel { padding: 28px; }
.module-grid { display: grid; grid-template-columns: repeat(4, minmax(0, 1fr)); gap: 14px; }
.module-grid a {
  padding: 18px; border: 1px solid var(--kw-border);
  border-radius: 18px; display: grid; gap: 8px;
  background: rgba(255,255,255,.38); color: var(--kw-ink);
  text-decoration: none;
}
.module-grid .material-symbols-outlined { color: var(--kw-blue-700); }
.module-grid small {
  color: #8a6200; background: var(--kw-yellow-100);
  width: fit-content; padding: 4px 9px; border-radius: 999px; font-weight: 800;
}
@media (max-width: 1100px) {
  .stats-grid, .module-grid { grid-template-columns: repeat(2, minmax(0, 1fr)); }
  .role-panel { grid-template-columns: 1fr; }
}
@media (max-width: 640px) {
  .hero-card { align-items: flex-start; flex-direction: column; padding: 24px; }
  .stats-grid, .module-grid { grid-template-columns: 1fr; }
}
</style>