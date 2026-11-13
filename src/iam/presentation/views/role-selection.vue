<script setup>
import { useRouter } from 'vue-router';
import { useI18n } from 'vue-i18n';
import LanguageSwitcher from '@/shared/presentation/components/language-switcher.vue';

const { t } = useI18n();
const router = useRouter();

const roles = [
  { key: 'parent',  icon: 'pi pi-users'    },
  { key: 'driver',  icon: 'pi pi-car'      },
  { key: 'company', icon: 'pi pi-building' }
];

function selectRole(role) {
  router.push({ name: 'iam-sign-in', query: { role: role.key } });
}
</script>

<template>
  <div class="auth-page">
    <div class="lang-corner">
      <LanguageSwitcher />
    </div>

    <section class="auth-card">
      <h1>{{ t('iam.roleSelection.title') }}</h1>
      <p>{{ t('iam.roleSelection.subtitle') }}</p>

      <div class="roles">
        <button
            v-for="role in roles"
            :key="role.key"
            type="button"
            class="role-btn"
            @click="selectRole(role)"
        >
          <i :class="role.icon" />
          <span>{{ t(`iam.roleSelection.${role.key}`) }}</span>
        </button>
      </div>
    </section>
  </div>
</template>

<style scoped>
.auth-page {
  position: relative;
  min-height: 100vh;
  padding: 8vh 20px 40px;
  background: linear-gradient(135deg, #eaf4ff 0%, #f6f9fd 50%, #e0f0ff 100%);
  font-family: system-ui, -apple-system, "Segoe UI", sans-serif;
  color: #0f172a;
}
.lang-corner {
  position: absolute;
  top: 20px;
  right: 24px;
}
.auth-card {
  max-width: 520px;
  margin: 0 auto;
  padding: 40px;
  border: 1px solid #e2e8f0;
  border-radius: 28px;
  background: #ffffff;
  box-shadow: 0 18px 40px rgba(16, 52, 89, .12);
  text-align: center;
}
h1 { margin: 0 0 6px; font-size: 2rem; }
p  { color: #64748b; margin-bottom: 28px; }
.roles { display: grid; gap: 14px; }
.role-btn {
  display: flex;
  align-items: center;
  gap: 14px;
  padding: 18px 22px;
  border: 1px solid #e2e8f0;
  border-radius: 16px;
  background: #ffffff;
  font-size: 1.05rem;
  font-weight: 700;
  cursor: pointer;
  color: #0f172a;
  transition: all .15s ease;
}
.role-btn:hover {
  border-color: #136fa8;
  transform: translateY(-2px);
  box-shadow: 0 12px 22px rgba(19, 111, 168, .18);
}
.role-btn i { font-size: 1.4rem; color: #136fa8; }
</style>