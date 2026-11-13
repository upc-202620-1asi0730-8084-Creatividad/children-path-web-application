const fleetManagement = () => import('./views/fleet-management.vue');

const fleetRoutes = [
    {
        path: 'fleet',
        name: 'fleet',
        component: fleetManagement,
        meta: { title: 'Fleet Management' }
    }
];

export default fleetRoutes;