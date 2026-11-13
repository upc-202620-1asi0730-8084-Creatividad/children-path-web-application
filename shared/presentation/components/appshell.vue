<script setup>
import {useSlots} from "vue";
import {sidebarStateStore} from "@/shared/application/services/sidebar-state.service.js";

/**
 * Structural shell that arranges the sidebar, topbar and routed content.
 *
 * @remarks
 * Reads sidebar collapse/mobile-open state from the shared store and applies
 * layout classes accordingly.
 */
const slots = useSlots();
</script>

<template>
  <div
      class="shell"
      :class="{
        'sidebar-collapsed': sidebarStateStore.collapsed,
        'mobile-open': sidebarStateStore.mobileOpen
      }"
  >
    <slot name="sidebar"/>
    <div class="backdrop" @click="sidebarStateStore.closeMobile()" aria-hidden="true"/>
    <section class="workspace">
      <slot name="topbar"/>
      <main class="content" id="main-content">
        <router-view/>
      </main>
    </section>
  </div>
</template>

<style scoped>
.shell { min-height: 100vh; display: flex; }
.workspace {
  flex: 1; min-width: 0;
  padding-left: var(--sidebar-width);
  transition: padding-left .25s ease;
}
.content {
  padding: calc(var(--topbar-height) + 28px) 32px 42px;
  min-height: 100vh;
}
.shell.sidebar-collapsed .workspace { padding-left: 92px; }
.backdrop { display: none; }

@media (max-width: 900px) {
  .workspace { padding-left: 0; }
  .content { padding: calc(var(--topbar-height) + 18px) 16px 28px; }
  .backdrop {
    display: none;
    position: fixed; inset: 0;
    background: rgba(4, 14, 29, .48);
    z-index: 20;
  }
  .shell.mobile-open .backdrop { display: block; }
}
</style>