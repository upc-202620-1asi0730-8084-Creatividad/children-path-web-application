<script setup>
import { computed } from 'vue';
import { useI18n } from 'vue-i18n';
import { useRouter, useRoute } from 'vue-router';
import { navigationStore } from '@/shared/application/services/navigation.service.js';
import { sidebarStateStore } from '@/shared/application/services/sidebar-state.service.js';
import logoChildrenPath from '@/assets/images/logo-children-path.png';

const { t } = useI18n();
const router = useRouter();
const route = useRoute();

const visibleItems = computed(() => navigationStore.visibleItems());

/**
 * Determina si una ruta del menú está activa.
 */
function isActive(itemRoute) {
  return route.path === itemRoute || route.path.startsWith(itemRoute + '/');
}

function navigate(path) {
  sidebarStateStore.closeMobile();
  router.push(path);
}

function signOut() {
  // TODO: reemplazar por authStore.logout() cuando exista IAM real
  sessionStorage.removeItem('fake-auth');
  router.push({ name: 'iam-role-selection' });
}

/**
 * Nombre del módulo activo para mostrar en el breadcrumb.
 */
const currentModuleLabel = computed(() => {
  const active = visibleItems.value.find((item) => isActive(item.route));
  return active ? t(active.labelKey) : t('app.name');
});

const currentModuleIcon = computed(() => {
  const active = visibleItems.value.find((item) => isActive(item.route));
  return active?.icon ?? 'dashboard';
});
</script>

<template>
  <aside
      class="sidebar"
      :class="{ collapsed: sidebarStateStore.collapsed }"
      aria-label="Children Path navigation"
  >
    <!-- Brand -->
    <a class="brand" href="#" @click.prevent="navigate('/app/dashboard')">
      <img
          :src="logoChildrenPath"
          alt="Children Path"
          class="brand-logo"
      />
        <span class="brand-text">
        <strong>{{ t('app.name') }}</strong>
        <small>{{ t('app.tagline') }}</small>
      </span>
    </a>

    <!-- Current module indicator -->
    <div class="current-module">
      <span class="current-module-icon">
        <i class="material-symbols-outlined">{{ currentModuleIcon }}</i>
      </span>
      <span class="current-module-text">
        <small>{{ t('layout.currentModule') }}</small>
        <strong>{{ currentModuleLabel }}</strong>
      </span>
    </div>

    <p class="section-label">{{ t('layout.coreModules') }}</p>

    <!-- Navigation list -->
    <nav class="nav-list">
      <a
          v-for="item in visibleItems"
          :key="item.route"
          href="#"
          class="nav-item"
          :class="{ active: isActive(item.route) }"
          :title="sidebarStateStore.collapsed ? t(item.labelKey) : ''"
          @click.prevent="navigate(item.route)"
      >
        <span class="nav-icon">
          <i class="material-symbols-outlined">{{ item.icon }}</i>
        </span>
        <span class="nav-label">{{ t(item.labelKey) }}</span>
        <span v-if="isActive(item.route)" class="nav-active-dot"></span>
      </a>
    </nav>

    <!-- Sign out -->
    <button class="sign-out-button" type="button" @click="signOut">
      <i class="material-symbols-outlined">logout</i>
      <span>{{ t('layout.signOut') }}</span>
    </button>
  </aside>
</template>

<style scoped>
.sidebar {
  position: fixed;
  inset: 0 auto 0 0;
  z-index: 30;
  width: var(--sidebar-width);
  padding: 20px 14px 16px;
  color: #fff;
  background: linear-gradient(180deg, #136fa8 0%, #0e4f83 48%, #0b315d 100%);
  box-shadow: 14px 0 36px rgba(8, 49, 90, .18);
  overflow: hidden;
  transition: width .25s ease, transform .25s ease;
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}

/* Brand */
.brand {
  display: flex;
  align-items: center;
  gap: 14px;
  padding: 0 8px 18px;
  border-bottom: 1px solid rgba(255,255,255,.18);
  color: inherit;
  text-decoration: none;
}
.brand-logo {
  width: 50px;
  height: 50px;
  border-radius: 16px;
  display: grid;
  place-items: center;
  background: #fff;
  color: var(--kw-blue-700);
  font-weight: 900;
  font-size: 1.1rem;
  flex-shrink: 0;
}
.brand-text { min-width: 0; overflow: hidden; }
.brand strong { display: block; font-size: 1.15rem; white-space: nowrap; }
.brand small {
  display: block;
  opacity: .8;
  font-size: .78rem;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

/* Current module indicator */
.current-module {
  display: flex;
  align-items: center;
  gap: 10px;
  margin: 14px 6px 6px;
  padding: 10px 12px;
  border-radius: 14px;
  background: rgba(255,255,255,.1);
  border: 1px solid rgba(255,255,255,.14);
  overflow: hidden;
}
.current-module-icon {
  width: 32px;
  height: 32px;
  border-radius: 10px;
  display: grid;
  place-items: center;
  background: rgba(255,255,255,.16);
  flex-shrink: 0;
}
.current-module-icon .material-symbols-outlined { font-size: 18px; }
.current-module-text { min-width: 0; overflow: hidden; }
.current-module-text small {
  display: block;
  font-size: .66rem;
  font-weight: 800;
  letter-spacing: .1em;
  text-transform: uppercase;
  opacity: .72;
}
.current-module-text strong {
  display: block;
  font-size: .9rem;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

/* Section label */
.section-label {
  margin: 18px 12px 8px;
  font-weight: 800;
  font-size: .72rem;
  letter-spacing: .14em;
  text-transform: uppercase;
  opacity: .6;
}

/* Navigation */
.nav-list {
  display: grid;
  gap: 4px;
  overflow-y: auto;
  min-height: 0;
  padding-right: 2px;
  flex: 1;
}
.nav-list::-webkit-scrollbar { width: 4px; }
.nav-list::-webkit-scrollbar-thumb {
  background: rgba(255,255,255,.2);
  border-radius: 4px;
}

.nav-item {
  position: relative;
  display: flex;
  align-items: center;
  gap: 12px;
  min-height: 44px;
  padding: 0 12px;
  border-radius: 14px;
  color: rgba(255,255,255,.78);
  font-weight: 700;
  font-size: .9rem;
  text-decoration: none;
  transition: background .16s ease, color .16s ease;
}
.nav-item:hover {
  color: #fff;
  background: rgba(255,255,255,.1);
}
.nav-item.active {
  color: #fff;
  background: rgba(255,255,255,.18);
  box-shadow: inset 3px 0 0 #fff;
}

.nav-icon {
  display: grid;
  place-items: center;
  flex-shrink: 0;
}
.nav-icon .material-symbols-outlined { font-size: 20px; }

.nav-label {
  flex: 1;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.nav-active-dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: #fbbf24;
  box-shadow: 0 0 0 3px rgba(251,191,36,.2);
  flex-shrink: 0;
}

/* Sign out */
.sign-out-button {
  width: 100%;
  min-height: 46px;
  margin-top: 12px;
  border: 0;
  border-radius: 14px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  color: #fff;
  background: linear-gradient(135deg, #ef4444, #dc2626);
  font-weight: 800;
  cursor: pointer;
  box-shadow: 0 12px 22px rgba(220, 38, 38, .22);
  transition: transform .14s ease;
}
.brand-logo {
  width: 50px;
  height: 50px;
  border-radius: 16px;
  object-fit: contain;
  background: #ffffff;
  padding: 4px;
  flex-shrink: 0;
}
.sign-out-button:hover { transform: translateY(-1px); }
.sign-out-button .material-symbols-outlined { font-size: 20px; }

/* ---- Collapsed state ---- */
.sidebar.collapsed { width: 84px; padding: 20px 12px 16px; }
.sidebar.collapsed .brand-text,
.sidebar.collapsed .current-module-text,
.sidebar.collapsed .section-label,
.sidebar.collapsed .nav-label,
.sidebar.collapsed .sign-out-button span {
  display: none;
}
.sidebar.collapsed .brand { justify-content: center; padding: 0 0 18px; }
.sidebar.collapsed .current-module { justify-content: center; padding: 10px 6px; }
.sidebar.collapsed .nav-item { justify-content: center; padding: 0; }
.sidebar.collapsed .nav-item.active { box-shadow: none; }
.sidebar.collapsed .nav-active-dot { display: none; }
.sidebar.collapsed .sign-out-button { width: 52px; margin-inline: auto; }

/* Mobile drawer */
@media (max-width: 900px) {
  .sidebar {
    transform: translateX(-100%);
    width: var(--sidebar-width);
  }
  :global(.shell.mobile-open) .sidebar,
  .shell.mobile-open .sidebar {
    transform: translateX(0);
  }
}
</style>