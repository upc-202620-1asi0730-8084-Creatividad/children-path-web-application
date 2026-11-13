const routeManagement = () => import('./views/route-management.vue');

const routesRoutes = [
    {
        path: 'routes',
        name: 'routes',
        component: routeManagement,
        meta: { title: 'Route Management' }
    }
];

export default routesRoutes;