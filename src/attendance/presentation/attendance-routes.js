const attendanceManagement = () => import('./views/attendance-management.vue');

const attendanceRoutes = [
    {
        path: 'attendance',
        name: 'attendance',
        component: attendanceManagement,
        meta: { title: 'Attendance Tracking' }
    }
];

export default attendanceRoutes;