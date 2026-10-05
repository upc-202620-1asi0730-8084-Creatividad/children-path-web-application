import { reactive } from "vue";

const STORAGE_KEY = 'children-path-sidebar-collapsed';

/**
 * Application service that manages the sidebar's visual state.
 */
export const sidebarStateStore = reactive({
    collapsed: localStorage.getItem(STORAGE_KEY) === 'true',
    mobileOpen: false,

    toggle() {
        if (window.innerWidth <= 900) {
            this.mobileOpen = !this.mobileOpen;
            return;
        }
        this.collapsed = !this.collapsed;
        localStorage.setItem(STORAGE_KEY, String(this.collapsed));
    },

    closeMobile() {
        this.mobileOpen = false;
    }
});