const tripManagement = () => import('./views/trip-management.vue');

const tripsRoutes = [
    {
        path: 'trips',
        name: 'trips',
        component: tripManagement,
        meta: { title: 'Trip Management' }
    }
];

export default tripsRoutes;