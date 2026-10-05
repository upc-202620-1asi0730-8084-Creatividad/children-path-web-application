const subscriptionPayments = () => import('./views/subscription-payments.vue');

const subscriptionsRoutes = [
    {
        path: 'subscriptions',
        name: 'subscriptions',
        component: subscriptionPayments,
        meta: { title: 'Billing & Plan' }
    }
];

export default subscriptionsRoutes;