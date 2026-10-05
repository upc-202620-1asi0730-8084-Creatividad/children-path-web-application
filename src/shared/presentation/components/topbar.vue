<script setup>
import {ref} from "vue";
import {useI18n} from "vue-i18n";
import {sidebarStateStore} from "@/shared/application/services/sidebar-state.service.js";
import {languageStore} from "@/shared/application/services/language.service.js";
import {authStore} from "@/identity-access/application/services/auth.service.js";

/**
 * Top navigation bar.
 *
 * @remarks
 * Provides the menu toggle, language switcher, theme toggle, notifications
 * trigger and profile menu.
 */
const { t } = useI18n();

const darkMode = ref(false);

const setLanguage = (language) => languageStore.use(language);

const toggleTheme = () => {
  darkMode.value = !darkMode.value;
  document.body.classList.toggle('dark-theme', darkMode.value);
};
</script>

<template>
  <header class="topbar">
    <button
        type="button"
        class="icon-button"
        @click="sidebarStateStore.toggle()"
        :aria-label="t('actions.toggleMenu')"
    >
      <i class="material-symbols-outlined">menu</i>
    </button>

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

      <button type="button" class="icon-button" :aria-label="t('actions.toggleTheme')" @click="toggleTheme">
        <i class="material-symbols-outlined">{{ darkMode ? 'light_mode' : 'dark_mode' }}</i>
      </button>

      <button class="profile-button" type="button" :aria-label="t('actions.openProfile')">
        <strong>{{ authStore.currentUser?.avatarInitials ?? 'CP' }}</strong>
        <span>
          <b>{{ authStore.currentUser?.displayName ?? 'Children Path User' }}</b>
          <small>{{ authStore.currentUser?.role ?? 'Authenticated user' }}</small>
        </span>
        <i class="material-symbols-outlined">expand_more</i>
      </button>
    </div>
  </header>
</template>

<style scoped>
.topbar {
  position: fixed; top: 0; right: 0;
  left: var(--sidebar-width);
  height: var(--topbar-height); z-index: 25;
  display: flex; align-items: center; justify-content: space-between;
  gap: 18px; padding: 14px 28px;
  backdrop-filter: blur(18px);
  background: rgba(246, 249, 253, .82);
  border-bottom: 1px solid var(--kw-border);
  transition: left .25s ease;
}
.shell.sidebar-collapsed .topbar { left: 92px; }
.icon-button {
  background: var(--kw-card);
  box-shadow: 0 10px 24px rgba(16, 52, 89, .08);
  border: 0; border-radius: 16px; cursor: pointer;
  width: 48px; height: 48px;
  display: grid; place-items: center;
  color: var(--kw-blue-700);
}
.top-actions { margin-left: auto; display: flex; align-items: center; gap: 12px; }
.language-pill {
  display: flex; gap: 4px; padding: 4px;
  border-radius: 999px; background: var(--kw-card);
  box-shadow: 0 10px 24px rgba(16, 52, 89, .08);
}
.language-pill button {
  border: 0; background: transparent; color: var(--kw-muted);
  border-radius: 999px; padding: 8px 13px; font-weight: 900; cursor: pointer;
}
.language-pill button.active { color: #fff; background: var(--kw-blue-700); }
.profile-button {
  min-width: 238px; height: 54px;
  border: 0; display: flex; align-items: center; gap: 12px;
  padding: 8px 12px; border-radius: 20px;
  background: var(--kw-card); color: var(--kw-ink);
  box-shadow: 0 10px 24px rgba(16, 52, 89, .08);
  cursor: pointer; text-align: left;
}
.profile-button strong {
  width: 38px; height: 38px; border-radius: 14px;
  display: grid; place-items: center;
  color: #fff; background: var(--kw-blue-700);
}
.profile-button span { display: grid; line-height: 1.1; }
.profile-button b { font-size: .96rem; }
.profile-button small { color: var(--kw-muted); margin-top: 3px; }

@media (max-width: 900px) {
  .topbar { left: 0; padding: 12px 14px; gap: 10px; }
  .profile-button span, .profile-button > i { display: none; }
  .profile-button { min-width: auto; width: 54px; justify-content: center; padding: 8px; }
}
</style>