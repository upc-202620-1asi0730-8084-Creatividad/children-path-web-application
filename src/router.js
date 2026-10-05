import { createRouter, createWebHistory } from "vue-router";
import AppShell from "./shared/presentation/layouts/appShell.vue";
import iamRoutes from "./iam/presentation/iam.routes.js";
import dashboardRoutes from "./dashboard/presentation/dashboard-routes.js";
import fleetRoutes from "./fleet/presentation/fleet-routes.js";
import analyticsRoutes from "./analytics/presentation/analytics-routes.js";
import assignmentRoutes from "./assignments/presentation/assignment-routes.js";
import attendanceRoutes from "./attendance/presentation/attendance-routes.js";
import companiesRoutes from "./companies/presentation/companies-routes.js";
import driversRoutes from "./drivers/presentation/drivers-routes.js";
import incidentsRoutes from "./incidents/presentation/incidents-routes.js";
import notificationsRoutes from "./notifications/presentation/notifications-routes.js";
import studentsRoutes from "./students/presentation/students-routes.js";
import subscriptionsRoutes from "./subscriptions/presentation/subscriptions-routes.js";
import trackingRoutes from "./tracking/presentation/tracking-routes.js";
import tripsRoutes from "./trips/presentation/trips-routes.js";
import routesRoutes from "./routes/presentation/routes-routes.js";

// Lazy-loaded
const about = () => import('./shared/presentation/views/about.vue');
const profile = () => import('./shared/presentation/views/profile.vue');
const pageNotFound = () => import('./shared/presentation/views/page-not-found.vue');

const routes = [
    // Redirigir
    { path: '/home', redirect: '/iam' },
    { path: '/',     redirect: '/iam' },

    // Vistas públicas
    { path: '/about',   name: 'about',   component: about,   meta: { title: 'About' } },
    { path: '/profile', name: 'profile', component: profile, meta: { title: 'Profile' } },

    // IAM
    { path: '/iam', name: 'iam', children: iamRoutes },

    {
        path: '/app',
        component: AppShell,
        children: [
            ...dashboardRoutes,
            ...fleetRoutes,
            ...analyticsRoutes,
            ...assignmentRoutes,
            ...attendanceRoutes,
            ...companiesRoutes,
            ...driversRoutes,
            ...incidentsRoutes,
            ...notificationsRoutes,
            ...studentsRoutes,
            ...subscriptionsRoutes,
            ...trackingRoutes,
            ...tripsRoutes,
            ...routesRoutes,
        ]
    },

    { path: '/:pathMatch(.*)*', name: 'not-found', component: pageNotFound, meta: { title: 'Page Not Found' } }
];

const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes
});

router.beforeEach((to) => {
    const baseTitle = 'Children Path';
    document.title = `${baseTitle} - ${to.meta['title'] ?? 'Home'}`;
    return true;
});

export default router;