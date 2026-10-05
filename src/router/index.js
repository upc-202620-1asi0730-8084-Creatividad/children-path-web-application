import {createRouter, createWebHistory} from 'vue-router'
import AppShell from '@/shared/presentation/layouts/appShell.vue'
import HomePage from '@/shared/presentation/pages/home/HomePage.vue'
import ProfilePage from '@/shared/presentation/pages/profile/ProfilePage.vue'
import UnderDevelopmentPage from '@/shared/presentation/pages/under-development/UnderDevelopmentPage.vue'

const routes = [
    { path: '/', redirect: '/app/home' },
    {
        path: '/app',
        component: AppShell,
        children: [
            { path: 'home', name: 'home', component: HomePage },
            { path: 'profile', name: 'profile', component: ProfilePage },
            { path: 'dashboard', name: 'dashboard', component: UnderDevelopmentPage, meta: { titleKey: 'nav.dashboard', boundedContext: 'Dashboard' } },
            { path: 'fleet', name: 'fleet', component: UnderDevelopmentPage, meta: { titleKey: 'nav.fleet', boundedContext: 'Fleet Management' } },
            { path: 'drivers', name: 'drivers', component: UnderDevelopmentPage, meta: { titleKey: 'nav.drivers', boundedContext: 'Driver Management' } },
            { path: 'routes', name: 'routes', component: UnderDevelopmentPage, meta: { titleKey: 'nav.routes', boundedContext: 'Route Management' } },
            { path: 'students', name: 'students', component: UnderDevelopmentPage, meta: { titleKey: 'nav.students', boundedContext: 'Student Management' } },
            { path: 'assignments', name: 'assignments', component: UnderDevelopmentPage, meta: { titleKey: 'nav.assignments', boundedContext: 'Assignment Management' } },
            { path: 'tracking', name: 'tracking', component: UnderDevelopmentPage, meta: { titleKey: 'nav.tracking', boundedContext: 'Real-Time Tracking' } },
            { path: 'trips', name: 'trips', component: UnderDevelopmentPage, meta: { titleKey: 'nav.trips', boundedContext: 'Trip Management' } },
            { path: 'attendance', name: 'attendance', component: UnderDevelopmentPage, meta: { titleKey: 'nav.attendance', boundedContext: 'Attendance Tracking' } },
            { path: 'notifications', name: 'notifications', component: UnderDevelopmentPage, meta: { titleKey: 'nav.notifications', boundedContext: 'Alerts & Notifications' } },
            { path: 'incidents', name: 'incidents', component: UnderDevelopmentPage, meta: { titleKey: 'nav.incidents', boundedContext: 'Incident Management' } },
            { path: 'analytics', name: 'analytics', component: UnderDevelopmentPage, meta: { titleKey: 'nav.analytics', boundedContext: 'Analytics & Reports' } },
            { path: 'companies', name: 'companies', component: UnderDevelopmentPage, meta: { titleKey: 'nav.companies', boundedContext: 'Company Management' } }
        ]
    }
]

export default createRouter({
    history: createWebHistory(),
    routes
})