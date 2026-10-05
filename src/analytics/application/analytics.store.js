import { defineStore } from 'pinia';
import { computed, ref } from 'vue';
import { AnalyticsApi } from '../infrastructure/analytics-api.js';

const analyticsApi = new AnalyticsApi();

/**
 * Provides a baseline dashboard used as fallback when the API is unavailable.
 * Mirrors the defaultDashboard() method from the Angular version.
 */
function defaultDashboard() {
    const summary = {
        totalTrips: 184,
        transportedStudents: 2450,
        onTimeRate: 91,
        averageDelayMinutes: 7,
        attendanceRate: 96.8,
        serviceQualityScore: 93,
        fleetUsage: 88,
        incidentRate: 1.8
    };

    const monitoringMetrics = [
        { id: 'm1', label: 'Active monitored routes', value: '14', helper: 'Routes sending operational data', icon: 'route', status: 'healthy', trend: 'up' },
        { id: 'm2', label: 'Live tracking sessions', value: '12', helper: 'Vehicles currently reporting GPS', icon: 'gps_fixed', status: 'healthy', trend: 'stable' },
        { id: 'm3', label: 'Attention signals', value: '3', helper: 'Delays, incidents or attendance gaps', icon: 'notification_important', status: 'attention', trend: 'down' },
        { id: 'm4', label: 'Service quality score', value: '93%', helper: 'Combined punctuality and safety score', icon: 'verified', status: 'healthy', trend: 'up' },
        { id: 'm5', label: 'Average delay', value: '7 min', helper: 'Current school transport day', icon: 'schedule', status: 'attention', trend: 'down' }
    ];

    const routes = [
        { id: 'rt-001', routeName: 'Miraflores School Route', district: 'Miraflores', driverName: 'Carlos Pérez', vehiclePlate: 'KW-204', onTimeRate: 96, attendanceRate: 98, delayMinutes: 4, completedTrips: 42, incidentCount: 0, serviceScore: 97, status: 'healthy' },
        { id: 'rt-002', routeName: 'San Isidro Morning Route', district: 'San Isidro', driverName: 'María Gómez', vehiclePlate: 'KW-118', onTimeRate: 87, attendanceRate: 95, delayMinutes: 12, completedTrips: 39, incidentCount: 1, serviceScore: 89, status: 'attention' },
        { id: 'rt-003', routeName: 'Surco Pickup Route', district: 'Santiago de Surco', driverName: 'Luis Torres', vehiclePlate: 'KW-076', onTimeRate: 78, attendanceRate: 92, delayMinutes: 18, completedTrips: 36, incidentCount: 2, serviceScore: 82, status: 'risk' },
        { id: 'rt-004', routeName: 'La Molina Afternoon Route', district: 'La Molina', driverName: 'Andrea Rojas', vehiclePlate: 'KW-311', onTimeRate: 94, attendanceRate: 97, delayMinutes: 6, completedTrips: 41, incidentCount: 0, serviceScore: 95, status: 'healthy' }
    ];

    const insights = [
        { id: 'i1', title: 'Surco route requires optimization', description: 'Delay minutes increased during the last three service days.', impact: 'high', source: 'Route and trip analytics', action: 'Review stop sequence' },
        { id: 'i2', title: 'Attendance confirmation is stable', description: 'Guardian notification confirmations improved after morning dispatch.', impact: 'medium', source: 'Attendance tracking', action: 'Keep current notification timing' },
        { id: 'i3', title: 'Fleet usage remains healthy', description: 'Most vehicles are operating below the configured capacity limit.', impact: 'low', source: 'Fleet monitoring', action: 'Continue monitoring capacity' }
    ];

    const trend = [
        { label: 'Mon', onTimeRate: 89, attendanceRate: 96, delayMinutes: 10 },
        { label: 'Tue', onTimeRate: 91, attendanceRate: 95, delayMinutes: 8 },
        { label: 'Wed', onTimeRate: 87, attendanceRate: 94, delayMinutes: 12 },
        { label: 'Thu', onTimeRate: 93, attendanceRate: 97, delayMinutes: 6 },
        { label: 'Fri', onTimeRate: 95, attendanceRate: 98, delayMinutes: 5 }
    ];

    const reports = [
        { id: 'r1', type: 'fleet', title: 'Fleet usage report', period: 'Current week', generatedAt: '2026-07-05T16:20:00.000Z', owner: 'Company Admin', status: 'ready', records: 25 },
        { id: 'r2', type: 'trip', title: 'Trip performance report', period: 'Current week', generatedAt: '2026-07-05T15:45:00.000Z', owner: 'Operations', status: 'ready', records: 184 },
        { id: 'r3', type: 'attendance', title: 'Attendance reliability report', period: 'Current month', generatedAt: '2026-07-04T18:10:00.000Z', owner: 'Company Admin', status: 'review', records: 2450 },
        { id: 'r4', type: 'incident', title: 'Incident follow-up report', period: 'Current month', generatedAt: '2026-07-04T17:00:00.000Z', owner: 'Safety coordinator', status: 'scheduled', records: 5 }
    ];

    const activities = [
        { id: 'a1', time: '2026-07-05T07:45:00.000Z', title: 'Monitoring snapshot updated', description: 'Live indicators were refreshed from tracking, trips and attendance.', status: 'healthy' },
        { id: 'a2', time: '2026-07-05T07:38:00.000Z', title: 'Delay trend detected', description: 'Surco Pickup Route exceeded the normal delay threshold.', status: 'attention' },
        { id: 'a3', time: '2026-07-05T07:25:00.000Z', title: 'Incident rate reviewed', description: 'Incident count remains under the configured operational risk limit.', status: 'healthy' }
    ];

    return {
        summary,
        monitoringMetrics,
        routes,
        insights,
        trend,
        reports,
        activities,
        lastUpdated: '2026-07-05T07:45:00.000Z'
    };
}

const useAnalyticsStore = defineStore('analytics', () => {
    // ---- State ----
    const dashboard = ref(defaultDashboard());
    const query = ref('');
    const reportType = ref('all');
    const routeStatus = ref('all');
    const selectedRouteId = ref('rt-001');
    const errors = ref([]);

    // ---- Computed ----
    const summary = computed(() => dashboard.value.summary);

    const selectedRoute = computed(() => {
        const routes = dashboard.value.routes;
        return routes.find((route) => route.id === selectedRouteId.value) ?? routes[0];
    });

    const filteredRoutes = computed(() => {
        const normalizedQuery = query.value.trim().toLowerCase();
        const status = routeStatus.value;

        return dashboard.value.routes.filter((route) => {
            const matchesStatus = status === 'all' || route.status === status;
            const matchesQuery =
                !normalizedQuery ||
                [
                    route.routeName,
                    route.district,
                    route.driverName,
                    route.vehiclePlate
                ].some((value) => value.toLowerCase().includes(normalizedQuery));

            return matchesStatus && matchesQuery;
        });
    });

    const filteredReports = computed(() => {
        const type = reportType.value;
        return dashboard.value.reports.filter((report) => type === 'all' || report.type === type);
    });

    // ---- Actions ----
    async function refreshDashboard() {
        try {
            const response = await analyticsApi.getDashboard();
            const data = response.data;
            dashboard.value = { ...data, lastUpdated: new Date().toISOString() };
            if (!data.routes.some((r) => r.id === selectedRouteId.value)) {
                selectedRouteId.value = data.routes[0]?.id ?? '';
            }
            errors.value = [];
        } catch (error) {
            dashboard.value = { ...defaultDashboard(), lastUpdated: new Date().toISOString() };
        }
    }

    function selectRoute(routeId) {
        selectedRouteId.value = routeId;
    }

    function setReportType(type) {
        reportType.value = type;
    }

    function setRouteStatus(status) {
        routeStatus.value = status;
        const firstRoute = filteredRoutes.value[0];
        if (firstRoute) selectRoute(firstRoute.id);
    }

    function generateReport() {
        const nextReport = {
            id: `rep-${Date.now()}`,
            type: 'service_quality',
            title: 'Service quality snapshot',
            period: 'Current operational day',
            generatedAt: new Date().toISOString(),
            owner: 'Company Admin',
            status: 'ready',
            records: dashboard.value.routes.length
        };

        const nextActivity = {
            id: `act-${Date.now()}`,
            time: new Date().toISOString(),
            title: 'Analytics report generated',
            description: 'A service quality report was generated from current monitoring indicators.',
            status: 'healthy'
        };

        dashboard.value = {
            ...dashboard.value,
            reports: [nextReport, ...dashboard.value.reports],
            activities: [nextActivity, ...dashboard.value.activities],
            lastUpdated: new Date().toISOString()
        };
    }

    function exportCsv() {
        const headers = ['Route', 'District', 'Driver', 'Vehicle', 'On-time %', 'Attendance %', 'Delay minutes', 'Incidents', 'Score'];
        const rows = filteredRoutes.value.map((route) => [
            route.routeName,
            route.district,
            route.driverName,
            route.vehiclePlate,
            String(route.onTimeRate),
            String(route.attendanceRate),
            String(route.delayMinutes),
            String(route.incidentCount),
            String(route.serviceScore)
        ]);

        const csv = [headers, ...rows]
            .map((row) => row.map((value) => `"${String(value).replace(/"/g, '""')}"`).join(','))
            .join('\n');

        const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `children-path-analytics-${new Date().toISOString().slice(0, 10)}.csv`;
        link.click();
        URL.revokeObjectURL(url);
    }

    function statusIcon(status) {
        const iconMap = {
            healthy: 'check_circle',
            attention: 'pending_actions',
            risk: 'warning'
        };
        return iconMap[status] ?? 'help';
    }

    function trendIcon(direction) {
        const iconMap = {
            up: 'trending_up',
            down: 'trending_down',
            stable: 'trending_flat'
        };
        return iconMap[direction] ?? 'trending_flat';
    }

    return {
        dashboard,
        query,
        reportType,
        routeStatus,
        selectedRouteId,
        errors,
        summary,
        selectedRoute,
        filteredRoutes,
        filteredReports,
        refreshDashboard,
        selectRoute,
        setReportType,
        setRouteStatus,
        generateReport,
        exportCsv,
        statusIcon,
        trendIcon
    };
});

export default useAnalyticsStore;