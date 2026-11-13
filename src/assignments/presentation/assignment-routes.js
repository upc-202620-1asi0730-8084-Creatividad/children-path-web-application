const assignmentManagement = () => import('./views/assignment-management.vue');
const parentAssignmentList = () => import('./views/parent-assignment-list.vue');

const assignmentRoutes = [
    {
        path: 'assignments',
        name: 'assignments',
        component: assignmentManagement,
        meta: { title: 'Assignment Management' }
    },
    {
        path: 'assignments/tracking',
        name: 'parent-assignments',
        component: parentAssignmentList,
        meta: { title: 'My Kids Assignments' }
    }
];

export default assignmentRoutes;