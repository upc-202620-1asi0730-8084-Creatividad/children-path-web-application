<script setup>
import {onMounted} from "vue";
import Sidebar from "./sidebar.vue";
import Topbar from "./topbar.vue";
import Appshell from "./appshell.vue";
import {sidebarStateStore} from "@/shared/application/services/sidebar-state.service.js";
import {languageStore} from "@/shared/application/services/language.service.js";

/**
 * Root presentation layout for Children Path.
 *
 * @remarks
 * Composes the Appshell, Sidebar and Topbar. Initializes application-level
 * services such as the language preference on first mount.
 */
onMounted(() => {
  languageStore.initialize();
});
</script>

<template>
  <appshell>
    <template #sidebar>
      <sidebar/>
    </template>
    <template #topbar>
      <topbar/>
    </template>
  </appshell>
</template>

<style scoped>
</style>