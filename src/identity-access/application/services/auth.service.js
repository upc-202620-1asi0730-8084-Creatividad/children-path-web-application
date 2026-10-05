import {reactive} from "vue";

/**
 * Application service that manages authentication state.
 *
 * @remarks
 * Placeholder implementation. Will be replaced when the identity-access
 * bounded context is fully migrated.
 */
export const authStore = reactive({
    currentUser: null,

    /**
     * Checks whether the current user has at least one of the provided roles.
     *
     * @param {string[]} roles - Roles to check against the current user.
     * @returns {boolean}
     */
    hasAnyRole(roles = []) {
        if (!this.currentUser) return false;
        return roles.includes(this.currentUser.role);
    },

    /**
     * Clears the current session.
     *
     * @returns {void}
     */
    logout() {
        this.currentUser = null;
    }
});