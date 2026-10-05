import {reactive} from "vue";
import {authStore} from "@/identity-access/application/services/auth.service.js";

/**
 * Application service that exposes the navigation menu for the authenticated user.
 *
 * @remarks
 * Filters the static menu definition against the roles assigned to the
 * current user, ensuring each role only sees the modules they can access.
 *
 * @typedef {Object} NavigationStore
 * @property {import('@/shared/domain/model/navigation-item.model.js').NavigationItem[]} items - Full navigation catalog.
 * @property {() => import('@/shared/domain/model/navigation-item.model.js').NavigationItem[]} visibleItems - Items allowed for the current user.
 */

/**
 * Static navigation catalog mapped to Children Path bounded contexts.
 *
 * @type {import('@/shared/domain/model/navigation-item.model.js').NavigationItem[]}
 */
const navigationItems = [
    {labelKey: 'nav.dashboard',     route: '/app/dashboard',     icon: 'dashboard',      featureKey: 'dashboard',     roles: ['Parent / Guardian', 'Company Driver', 'Independent Operator', 'Company Admin', 'Children Path Administrator']},
    {labelKey: 'nav.fleet',         route: '/app/fleet',         icon: 'directions_bus', featureKey: 'fleet',         roles: ['Independent Operator', 'Company Admin', 'Children Path Administrator']},
    {labelKey: 'nav.drivers',       route: '/app/drivers',       icon: 'badge',          featureKey: 'drivers',       roles: ['Company Admin', 'Children Path Administrator']},
    {labelKey: 'nav.routes',        route: '/app/routes',        icon: 'alt_route',      featureKey: 'routes',        roles: ['Independent Operator', 'Company Admin', 'Children Path Administrator']},
    {labelKey: 'nav.students',      route: '/app/students',      icon: 'school',         featureKey: 'students',      roles: ['Independent Operator', 'Company Admin', 'Children Path Administrator']},
    {labelKey: 'nav.assignments',   route: '/app/assignments',   icon: 'rule',           featureKey: 'assignments',   roles: ['Independent Operator', 'Company Admin', 'Children Path Administrator']},
    {labelKey: 'nav.tracking',      route: '/app/tracking',      icon: 'location_on',    featureKey: 'tracking',      roles: ['Parent / Guardian', 'Company Driver', 'Independent Operator', 'Company Admin', 'Children Path Administrator']},
    {labelKey: 'nav.trips',         route: '/app/trips',         icon: 'route',          featureKey: 'trips',         roles: ['Company Driver', 'Independent Operator', 'Company Admin', 'Children Path Administrator']},
    {labelKey: 'nav.attendance',    route: '/app/attendance',    icon: 'fact_check',     featureKey: 'attendance',    roles: ['Parent / Guardian', 'Company Driver', 'Independent Operator', 'Company Admin', 'Children Path Administrator']},
    {labelKey: 'nav.notifications', route: '/app/notifications', icon: 'campaign',       featureKey: 'notifications', roles: ['Parent / Guardian', 'Company Driver', 'Independent Operator', 'Company Admin', 'Children Path Administrator']},
    {labelKey: 'nav.incidents',     route: '/app/incidents',     icon: 'report_problem', featureKey: 'incidents',     roles: ['Independent Operator', 'Company Admin', 'Children Path Administrator']},
    {labelKey: 'nav.analytics',     route: '/app/analytics',     icon: 'bar_chart',      featureKey: 'analytics',     roles: ['Company Admin', 'Children Path Administrator']},
    {labelKey: 'nav.companies',     route: '/app/companies',     icon: 'business',       featureKey: 'companies',     roles: ['Company Admin', 'Children Path Administrator']}
];

/**
 * Reactive navigation store.
 *
 * @type {NavigationStore}
 */
export const navigationStore = reactive({
    items: navigationItems,

    /**
     * Returns the navigation items that the current user is allowed to see.
     *
     * @returns {import('@/shared/domain/model/navigation-item.model.js').NavigationItem[]}
     */
    visibleItems() {
        return this.items.filter(item => authStore.hasAnyRole(item.roles));
    }
});