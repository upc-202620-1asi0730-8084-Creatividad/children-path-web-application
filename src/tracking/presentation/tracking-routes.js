const realTimeTracking = () => import('./views/real-time-tracking.vue');

const trackingRoutes = [
    {
        path: 'tracking',
        name: 'tracking',
        component: realTimeTracking,
        meta: { title: 'Live Tracking' }
    }
];

export default trackingRoutes;