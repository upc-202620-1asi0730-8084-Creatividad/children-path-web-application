const companyManagement = () => import('./views/company-management.vue');

const companiesRoutes = [
    {
        path: 'companies',
        name: 'companies',
        component: companyManagement,
        meta: { title: 'Company Management' }
    }
];

export default companiesRoutes;