const analyticsView = () => import('./views/analytics-view.vue');

const analyticsRoutes = [
    {
        path: 'analytics',
        name: 'analytics',
        component: analyticsView,
        meta: { title: 'Monitoring & Analytics' }
    }
];

export default analyticsRoutes;