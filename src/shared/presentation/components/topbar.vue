<script setup>
import { computed, ref } from 'vue';
import { useI18n } from 'vue-i18n';
import { useRoute } from 'vue-router';
import { sidebarStateStore } from '@/shared/application/services/sidebar-state.service.js';
import { languageStore } from '@/shared/application/services/language.service.js';
import { navigationStore } from '@/shared/application/services/navigation.service.js';

const { t } = useI18n();
const route = useRoute();

const darkMode = ref(false);

const setLanguage = (language) => languageStore.use(language);

function toggleTheme() {
  darkMode.value = !darkMode.value;
  document.body.classList.toggle('dark-theme', darkMode.value);
}

function toggleSidebar() {
  sidebarStateStore.toggle();
}

/**
 * Módulo actual para el breadcrumb.
 */
const currentModule = computed(() => {
  const items = navigationStore.visibleItems();
  const active = items.find((item) =>
      route.path === item.route || route.path.startsWith(item.route + '/')
  );
  return active ? { label: t(active.labelKey), icon: active.icon } : { label: t('app.name'), icon: 'dashboard' };
});
// Datos de usuario temporales — reemplazar cuando exista IAM real
const currentUser = ref({
  displayName: 'Children Path User',
  role: 'Authenticated user',
  avatarInitials: 'CP'
});
</script>

<template>
  <header class="topbar">
    <!-- Left: hamburger + breadcrumb -->
    <div class="topbar-left">
      <button
          type="button"
          class="icon-button"
          :class="{ 'is-collapsed': sidebarStateStore.collapsed }"
          :aria-label="t('actions.toggleMenu')"
          :title="t('actions.toggleMenu')"
          @click="toggleSidebar"
      >
        <i class="material-symbols-outlined">menu</i>
      </button>

      <nav class="breadcrumb" aria-label="Breadcrumb">
        <span class="breadcrumb-icon">
          <i class="material-symbols-outlined">{{ currentModule.icon }}</i>
        </span>
        <span class="breadcrumb-root">Children Path</span>
        <i class="material-symbols-outlined breadcrumb-sep">chevron_right</i>
        <strong>{{ currentModule.label }}</strong>
      </nav>
    </div>

    <!-- Right: language, theme, profile -->
    <div class="top-actions">
      <div class="language-pill" role="group" :aria-label="t('topbar.language')">
        <button
            type="button"
            :class="{ active: languageStore.current === 'en' }"
            @click="setLanguage('en')"
        >EN</button>
        <button
            type="button"
            :class="{ active: languageStore.current === 'es' }"
            @click="setLanguage('es')"
        >ES</button>
      </div>

      <button
          type="button"
          class="icon-button"
          :aria-label="t('actions.toggleTheme')"
          :title="t('actions.toggleTheme')"
          @click="toggleTheme"
      >
        <i class="material-symbols-outlined">{{ darkMode ? 'light_mode' : 'dark_mode' }}</i>
      </button>

      <button class="profile-button" type="button" :aria-label="t('actions.openProfile')">
        <strong>{{ currentUser.avatarInitials }}</strong>
        <span>
      <b>{{ currentUser.displayName }}</b>
      <small>{{ currentUser.role }}</small>
    </span>
        <i class="material-symbols-outlined">expand_more</i>
      </button>
    </div>
  </header>
</template>

<style scoped>
.topbar {
  position: fixed;
  top: 0;
  right: 0;
  left: var(--sidebar-width);
  height: var(--topbar-height);
  z-index: 25;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 18px;
  padding: 12px 24px;
  backdrop-filter: blur(18px);
  background: rgba(246, 249, 253, .82);
  border-bottom: 1px solid var(--kw-border);
  transition: left .25s ease;
}
.shell.sidebar-collapsed .topbar { left: 84px; }

/* Left side */
.topbar-left {
  display: flex;
  align-items: center;
  gap: 14px;
  min-width: 0;
}

.icon-button {
  background: var(--kw-card);
  box-shadow: 0 8px 20px rgba(16, 52, 89, .08);
  border: 0;
  border-radius: 14px;
  cursor: pointer;
  width: 46px;
  height: 46px;
  display: grid;
  place-items: center;
  color: var(--kw-blue-700);
  transition: transform .14s ease, background .14s ease;
  flex-shrink: 0;
}
.icon-button:hover {
  transform: translateY(-1px);
  background: #eaf4ff;
}
.icon-button .material-symbols-outlined { font-size: 22px; }

/* Breadcrumb */
.breadcrumb {
  display: flex;
  align-items: center;
  gap: 8px;
  min-width: 0;
  font-size: .9rem;
  color: var(--kw-muted);
}
.breadcrumb-icon {
  width: 30px;
  height: 30px;
  border-radius: 10px;
  display: grid;
  place-items: center;
  background: rgba(34, 131, 198, .12);
  color: var(--kw-blue-700);
  flex-shrink: 0;
}
.breadcrumb-icon .material-symbols-outlined { font-size: 17px; }
.breadcrumb-root {
  font-weight: 700;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.breadcrumb-sep {
  font-size: 18px !important;
  color: #94a3b8;
  flex-shrink: 0;
}
.breadcrumb strong {
  color: var(--kw-ink);
  font-weight: 800;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

/* Right side */
.top-actions {
  margin-left: auto;
  display: flex;
  align-items: center;
  gap: 12px;
}

.language-pill {
  display: flex;
  gap: 4px;
  padding: 4px;
  border-radius: 999px;
  background: var(--kw-card);
  box-shadow: 0 8px 20px rgba(16, 52, 89, .08);
}
.language-pill button {
  border: 0;
  background: transparent;
  color: var(--kw-muted);
  border-radius: 999px;
  padding: 8px 13px;
  font-weight: 900;
  font-size: .78rem;
  cursor: pointer;
  transition: background .14s ease, color .14s ease;
}
.language-pill button.active {
  color: #fff;
  background: var(--kw-blue-700);
}

.profile-button {
  min-width: 220px;
  height: 52px;
  border: 0;
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 8px 12px;
  border-radius: 18px;
  background: var(--kw-card);
  color: var(--kw-ink);
  box-shadow: 0 8px 20px rgba(16, 52, 89, .08);
  cursor: pointer;
  text-align: left;
  transition: transform .14s ease;
}
.profile-button:hover { transform: translateY(-1px); }
.profile-button strong {
  width: 38px;
  height: 38px;
  border-radius: 14px;
  display: grid;
  place-items: center;
  color: #fff;
  background: var(--kw-blue-700);
  font-weight: 900;
  font-size: .9rem;
  flex-shrink: 0;
}
.profile-button span { display: grid; line-height: 1.1; min-width: 0; }
.profile-button b {
  font-size: .92rem;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.profile-button small {
  color: var(--kw-muted);
  margin-top: 3px;
  font-size: .76rem;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.profile-button .material-symbols-outlined { font-size: 20px; color: var(--kw-muted); }

/* Responsive */
@media (max-width: 900px) {
  .topbar { left: 0; padding: 10px 14px; gap: 10px; }
  .breadcrumb-root, .breadcrumb-sep { display: none; }
  .profile-button { min-width: auto; width: 52px; justify-content: center; padding: 8px; }
  .profile-button span, .profile-button > i { display: none; }
  .language-pill button { padding: 6px 10px; }
}
</style>