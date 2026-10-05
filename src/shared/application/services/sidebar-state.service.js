import {reactive} from "vue";

/**
 * Application service that manages the sidebar's visual state.
 *
 * @typedef {Object} SidebarStateStore
 * @property {boolean} collapsed - Whether the desktop sidebar is collapsed.
 * @property {boolean} mobileOpen - Whether the mobile drawer is open.
 * @property {() => void} toggle - Toggles the sidebar based on viewport width.
 * @property {() => void} closeMobile - Closes the mobile drawer.
 */

/**
 * Reactive store that coordinates sidebar collapse/expand behavior.
 *
 * @type {SidebarStateStore}
 */
export const sidebarStateStore = reactive({
    collapsed: false,
    mobileOpen: false,

    /**
     * Toggles the sidebar. Uses the mobile drawer on narrow screens and
     * collapses the desktop sidebar otherwise.
     *
     * @returns {void}
     */
    toggle() {
        if (window.innerWidth <= 900) {
            this.mobileOpen = !this.mobileOpen;
            return;
        }
        this.collapsed = !this.collapsed;
    },

    /**
     * Closes the mobile drawer.
     *
     * @returns {void}
     */
    closeMobile() {
        this.mobileOpen = false;
    }
});