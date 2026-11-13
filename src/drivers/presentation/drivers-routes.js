const driverManagement = () => import('./views/driver-management.vue');

const driversRoutes = [
    {
        path: 'drivers',
        name: 'drivers',
        component: driverManagement,
        meta: { title: 'Driver Management' }
    }
];

export default driversRoutes;