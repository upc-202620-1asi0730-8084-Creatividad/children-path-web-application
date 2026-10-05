<script setup>
import {computed} from "vue";
import {useI18n} from "vue-i18n";
import {useRouter, useRoute} from "vue-router";
import {navigationStore} from "@/shared/application/services/navigation.service.js";
import {sidebarStateStore} from "@/shared/application/services/sidebar-state.service.js";
import {authStore} from "@/identity-access/application/services/auth.service.js";

/**
 * Sidebar navigation component.
 *
 * @remarks
 * Renders the Children Path menu filtered by the authenticated user's role
 * and manages the collapse / mobile-open visual state.
 */
const { t } = useI18n();
const router = useRouter();
const route = useRoute();

const visibleItems = computed(() => navigationStore.visibleItems());

const navigate = (path) => {
  sidebarStateStore.closeMobile();
  router.push(path);
};

const signOut = () => {
  authStore.logout();
  router.push('/');
};
</script>

<template>
  <aside class="sidebar" :class="{ collapsed: sidebarStateStore.collapsed }" aria-label="Children Path navigation">
    <a class="brand" href="#" @click.prevent="navigate('/app/home')">
      <!-- Si no tienes la imagen, elimina este <img> -->
      <div class="brand-logo">CP</div>
      <span>
        <strong>{{ t('app.name') }}</strong>
        <small>{{ t('app.tagline') }}</small>
      </span>
    </a>

    <p class="section-label">{{ t('layout.coreModules') }}</p>

    <nav class="nav-list">
      <a
          v-for="item in visibleItems"
          :key="item.route"
          href="#"
          :class="{ active: route.path.startsWith(item.route) }"
          @click.prevent="navigate(item.route)"
      >
        <i class="material-symbols-outlined" aria-hidden="true">{{ item.icon }}</i>
        <span>{{ t(item.labelKey) }}</span>
      </a>
    </nav>

    <button class="sign-out-button" type="button" @click="signOut">
      <i class="material-symbols-outlined">logout</i>
      <span>{{ t('layout.signOut') }}</span>
    </button>
  </aside>
</template>

<style scoped>
.sidebar {
  position: fixed; inset: 0 auto 0 0; z-index: 30;
  width: var(--sidebar-width);
  padding: 28px 18px 18px;
  color: #fff;
  background: linear-gradient(180deg, #136fa8 0%, #0e4f83 48%, #0b315d 100%);
  box-shadow: 14px 0 36px rgba(8, 49, 90, .18);
  overflow: hidden;
  transition: width .25s ease, transform .25s ease;
  display: flex; flex-direction: column; min-height: 100vh;
}
.brand {
  display: flex; align-items: center; gap: 14px;
  padding: 0 8px 22px;
  border-bottom: 1px solid rgba(255,255,255,.18);
  color: inherit; text-decoration: none;
}
.brand-logo {
  width: 54px; height: 54px; border-radius: 18px;
  display: grid; place-items: center;
  background: #fff; color: var(--kw-blue-700);
  font-weight: 900; font-size: 1.2rem;
}
.brand strong { display: block; font-size: 1.25rem; }
.brand small { display: block; opacity: .8; max-width: 172px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.section-label {
  margin: 24px 10px 10px; font-weight: 800; font-size: .78rem;
  letter-spacing: .14em; text-transform: uppercase; opacity: .72;
}
.nav-list { display: grid; gap: 6px; overflow-y: auto; min-height: 0; padding-right: 2px; }
.nav-list a {
  display: flex; align-items: center; gap: 14px;
  min-height: 46px; padding: 0 14px;
  border-radius: 18px; color: rgba(255,255,255,.82);
  font-weight: 700; text-decoration: none;
}
.nav-list a:hover, .nav-list a.active { color: #fff; background: rgba(255,255,255,.14); }
.sign-out-button {
  width: 100%; min-height: 50px; margin-top: auto;
  border: 0; border-radius: 18px;
  display: flex; align-items: center; justify-content: center; gap: 10px;
  color: #fff;
  background: linear-gradient(135deg, #ef4444, #dc2626);
  font-weight: 900; cursor: pointer;
  box-shadow: 0 16px 28px rgba(220, 38, 38, .25);
}
.sidebar.collapsed { width: 92px; }
.sidebar.collapsed .brand span,
.sidebar.collapsed .section-label,
.sidebar.collapsed .nav-list a > span:not(.material-symbols-outlined),
.sidebar.collapsed .sign-out-button > span:not(.material-symbols-outlined) { display: none; }
.sidebar.collapsed .brand { justify-content: center; padding-left: 0; padding-right: 0; }
.sidebar.collapsed .nav-list a { justify-content: center; padding: 0; }
.sidebar.collapsed .sign-out-button { width: 54px; margin-inline: auto; }
</style>