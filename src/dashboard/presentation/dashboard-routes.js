const dashboardView = () => import('./views/dashboard-view.vue');

const dashboardRoutes = [
    {
        path: 'dashboard',
        name: 'dashboard',
        component: dashboardView,
        meta: { title: 'Dashboard' }
    }
];

export default dashboardRoutes;