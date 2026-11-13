import { defineStore } from 'pinia';
import { computed, ref } from 'vue';
import { RoutesApi } from '../infrastructure/routes-api.js';
import { fallbackRoutes } from '../domain/models/route-dashboard.model.js';
import { SchoolRoute } from '../domain/entities/school-route.entity.js';

const routesApi = new RoutesApi();

const useRoutesStore = defineStore('routes', () => {
    // ---- State ----
    const dashboard = ref(fallbackRoutes());
    const loading = ref(false);
    const errors = ref([]);

    // Filters
    const searchTerm = ref('');
    const selectedStatus = ref('all');

    // ---- Computed ----
    const routes = computed(() => dashboard.value.routes);
    const summary = computed(() => dashboard.value.summary);
    const reviews = computed(() => dashboard.value.reviews);
    const activities = computed(() => dashboard.value.activities);

    const filteredRoutes = computed(() => {
        const query = searchTerm.value.trim().toLowerCase();
        const status = selectedStatus.value;

        return routes.value.filter((route) => {
            const matchesStatus = status === 'all' || route.status === status;
            const matchesSearch =
                !query ||
                [
                    route.code, route.name, route.district, route.school,
                    route.assignedDriver, route.assignedVehicle, route.scheduleLabel
                ].join(' ').toLowerCase().includes(query);
            return matchesStatus && matchesSearch;
        });
    });

    // ---- Actions ----
    async function fetchDashboard() {
        loading.value = true;
        try {
            const [summaryRes, routesRes, reviewsRes, activitiesRes] = await Promise.all([
                routesApi.getSummary(),
                routesApi.getRoutes(),
                routesApi.getReviews(),
                routesApi.getActivities()
            ]);

            dashboard.value = {
                summary: summaryRes.data,
                routes: routesRes.data.map((r) => new SchoolRoute({ ...r })),
                reviews: reviewsRes.data,
                activities: activitiesRes.data
            };
            errors.value = [];
        } catch (error) {
            dashboard.value = fallbackRoutes();
            errors.value.push(error);
        } finally {
            loading.value = false;
        }
    }

    function setSearchTerm(value) {
        searchTerm.value = value;
    }

    function setStatus(status) {
        selectedStatus.value = status;
    }

    async function createRoute(entity) {
        try {
            const response = await routesApi.createRoute(entity);
            const created = new SchoolRoute({ ...response.data });
            setRoutes([created, ...routes.value]);
            return created;
        } catch (error) {
            setRoutes([entity, ...routes.value]);
            errors.value.push(error);
            return entity;
        }
    }

    async function updateRoute(entity) {
        try {
            const response = await routesApi.updateRoute(entity.id, entity);
            const updated = new SchoolRoute({ ...response.data });
            setRoutes(routes.value.map((r) => (r.id === entity.id ? updated : r)));
            return updated;
        } catch (error) {
            setRoutes(routes.value.map((r) => (r.id === entity.id ? entity : r)));
            errors.value.push(error);
            return entity;
        }
    }

    async function deleteRoute(id) {
        try {
            await routesApi.deleteRoute(id);
        } catch (error) {
            // Ignore
        }
        setRoutes(routes.value.filter((r) => r.id !== id));
    }

    function setRoutes(list) {
        dashboard.value = {
            ...dashboard.value,
            summary: calculateSummary(list),
            routes: list
        };
    }

    function calculateSummary(list) {
        const totalRoutes = list.length;
        const activeRoutes = list.filter((r) => r.status === 'active').length;
        const scheduledStops = list.reduce((sum, r) => sum + r.stops, 0);
        const districtsCovered = new Set(list.map((r) => r.district)).size;
        const routeCoverage = totalRoutes
            ? Math.round(list.reduce((sum, r) => sum + r.coveragePercentage, 0) / totalRoutes)
            : 0;
        const optimizationScore = totalRoutes
            ? Math.round(list.reduce((sum, r) => sum + r.optimizationScore, 0) / totalRoutes)
            : 0;

        return {
            totalRoutes,
            activeRoutes,
            scheduledStops,
            districtsCovered,
            routeCoverage,
            optimizationScore
        };
    }

    function exportCsv() {
        const header = ['Code', 'Route', 'District', 'School', 'Driver', 'Vehicle', 'Students', 'Stops', 'Status'];
        const rows = filteredRoutes.value.map((route) => [
            route.code, route.name, route.district, route.school,
            route.assignedDriver, route.assignedVehicle,
            `${route.assignedStudents}/${route.vehicleCapacity}`,
            route.stops, route.status
        ]);
        const csv = [header, ...rows]
            .map((row) => row.map((cell) => `"${String(cell).replace(/"/g, '""')}"`).join(','))
            .join('\n');
        const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const anchor = document.createElement('a');
        anchor.href = url;
        anchor.download = 'children-path-route-registry.csv';
        anchor.click();
        URL.revokeObjectURL(url);
    }

    function statusIcon(status) {
        const icons = {
            all: 'account_tree',
            active: 'play_circle',
            scheduled: 'event_available',
            review: 'manage_search',
            inactive: 'block'
        };
        return icons[status] ?? 'account_tree';
    }

    function readinessGradient(score) {
        const safe = Math.max(0, Math.min(score, 100));
        return `conic-gradient(var(--kw-blue-700) ${safe}%, #e9eff7 0)`;
    }

    return {
        // state
        dashboard,
        loading,
        errors,
        searchTerm,
        selectedStatus,
        // computed
        routes,
        summary,
        reviews,
        activities,
        filteredRoutes,
        // actions
        fetchDashboard,
        setSearchTerm,
        setStatus,
        createRoute,
        updateRoute,
        deleteRoute,
        exportCsv,
        statusIcon,
        readinessGradient
    };
});

export default useRoutesStore;