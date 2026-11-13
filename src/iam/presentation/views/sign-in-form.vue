<script setup>
import { ref } from "vue";
import { useRouter, useRoute } from "vue-router";
import { useI18n } from "vue-i18n";
import LanguageSwitcher from '@/shared/presentation/components/language-switcher.vue';

const { t } = useI18n();
const router = useRouter();
const route = useRoute();

const username = ref('');
const password = ref('');
const role = route.query.role || 'parent';

function handleSignIn() {
  // TODO: reemplazar con auth real cuando exista backend
  sessionStorage.setItem('fake-auth', 'true');
  router.push({ name: 'dashboard' }); // verifica el name real en dashboard-routes.js
}
</script>

<template>
  <div class="auth-page">
    <div class="lang-corner">
      <LanguageSwitcher />
    </div>

    <section class="auth-card">
      <h1>{{ t('iam.signIn.title') }}</h1>
      <i18n-t keypath="iam.signIn.signingInAs" tag="p" class="subtitle">
        <template #role>
          <strong>{{ t(`iam.roles.${role}`) }}</strong>
        </template>
      </i18n-t>

      <form @submit.prevent="handleSignIn">
        <label>
          <span>{{ t('iam.signIn.username') }}</span>
          <input
              v-model="username"
              type="text"
              :placeholder="t('iam.signIn.usernamePlaceholder')"
              required
          />
        </label>

        <label>
          <span>{{ t('iam.signIn.password') }}</span>
          <input
              v-model="password"
              type="password"
              :placeholder="t('iam.signIn.passwordPlaceholder')"
              required
          />
        </label>

        <button type="submit" class="submit-btn">{{ t('iam.signIn.submit') }}</button>
      </form>

      <p class="foot">
        {{ t('iam.signIn.noAccount') }}
        <router-link :to="{ name: 'iam-sign-up', query: { role } }">
          {{ t('iam.signIn.register') }}
        </router-link>
      </p>
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
  max-width: 460px;
  margin: 0 auto;
  padding: 40px;
  border: 1px solid #e2e8f0;
  border-radius: 28px;
  background: #ffffff;
  box-shadow: 0 18px 40px rgba(16, 52, 89, .12);
}
h1 { margin: 0 0 6px; font-size: 2rem; }
.subtitle { color: #64748b; margin: 0 0 24px; }
.subtitle strong { color: #0f172a; }
form { display: grid; gap: 16px; }
label { display: grid; gap: 6px; }
label span { font-weight: 700; font-size: .9rem; }
input {
  padding: 12px 14px;
  border: 1px solid #e2e8f0;
  border-radius: 12px;
  font-size: 1rem;
  background: #fff;
  color: #0f172a;
}
input:focus { outline: 2px solid #136fa8; border-color: transparent; }
.submit-btn {
  margin-top: 6px;
  padding: 14px 18px;
  border: 0;
  border-radius: 14px;
  background: linear-gradient(135deg, #136fa8, #0e4f83);
  color: #fff;
  font-size: 1rem;
  font-weight: 800;
  cursor: pointer;
  box-shadow: 0 12px 22px rgba(19, 111, 168, .28);
  transition: transform .14s ease;
}
.submit-btn:hover { transform: translateY(-1px); }
.foot { text-align: center; margin-top: 20px; color: #64748b; }
.foot a { color: #136fa8; font-weight: 700; text-decoration: none; }
.foot a:hover { text-decoration: underline; }
</style>