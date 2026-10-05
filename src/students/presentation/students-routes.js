const studentManagement = () => import('./views/student-management.vue');

const studentsRoutes = [
    {
        path: 'students',
        name: 'students',
        component: studentManagement,
        meta: { title: 'Student Management' }
    }
];

export default studentsRoutes;