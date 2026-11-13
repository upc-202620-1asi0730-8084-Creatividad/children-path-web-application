const incidentView = () => import('./views/incident-view.vue');

const incidentsRoutes = [
    {
        path: 'incidents',
        name: 'incidents',
        component: incidentView,
        meta: { title: 'Incident Management' }
    }
];

export default incidentsRoutes;