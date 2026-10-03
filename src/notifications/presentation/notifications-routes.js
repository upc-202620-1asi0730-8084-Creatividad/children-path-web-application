const notificationCenter = () => import('./views/notification-center.vue');

const notificationsRoutes = [
    {
        path: 'notifications',
        name: 'notifications',
        component: notificationCenter,
        meta: { title: 'Alerts & Notifications' }
    }
];

export default notificationsRoutes;