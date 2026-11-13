import { defineStore } from 'pinia';
import { computed, ref } from 'vue';
import { TrackingApi } from '../infrastructure/tracking-api.js';
import { fallbackTracking } from '../domain/models/tracking-dashboard.model.js';

const trackingApi = new TrackingApi();

const useTrackingStore = defineStore('tracking', () => {
    // ---- State ----
    const dashboard = ref(fallbackTracking());
    const loading = ref(false);
    const isRefreshing = ref(false);
    const errors = ref([]);

    // Filters
    const query = ref('');
    const status = ref('all');

    // Selection
    const selectedVehicle = ref(null);

    // ---- Computed ----
    const vehicles = computed(() => dashboard.value.vehicles);
    const summary = computed(() => dashboard.value.summary);
    const alerts = computed(() => dashboard.value.alerts);
    const activities = computed(() => dashboard.value.activities);

    const filteredVehicles = computed(() => {
        const q = query.value.trim().toLowerCase();
        const s = status.value;

        return vehicles.value.filter((v) => {
            const matchesStatus = s === 'all' || v.status === s;
            const searchable = [
                v.vehicleId, v.plate, v.driverName, v.routeName,
                v.schoolName, v.district, v.nextStop
            ].join(' ').toLowerCase();
            const matchesQuery = !q || searchable.includes(q);
            return matchesStatus && matchesQuery;
        });
    });

    // ---- Actions ----
    async function fetchDashboard() {
        loading.value = true;
        isRefreshing.value = true;
        try {
            const response = await trackingApi.getDashboard();
            dashboard.value = response.data;
            // Auto-select first vehicle
            if (!selectedVehicle.value && vehicles.value.length > 0) {
                selectedVehicle.value = vehicles.value[0];
            }
            errors.value = [];
        } catch (error) {
            dashboard.value = fallbackTracking();
            selectedVehicle.value = vehicles.value[0] ?? null;
            errors.value.push(error);
        } finally {
            loading.value = false;
            setTimeout(() => (isRefreshing.value = false), 400);
        }
    }

    function selectVehicle(vehicle) {
        selectedVehicle.value = vehicle;
    }

    function setQuery(value) {
        query.value = value;
    }

    function setStatus(value) {
        status.value = value;
    }

    function statusBadgeClass(s) {
        const map = {
            'on-route': 'status-on-route',
            delayed: 'status-delayed',
            stopped: 'status-stopped',
            offline: 'status-offline'
        };
        return map[s] ?? 'status-offline';
    }

    function statusText(s) {
        const map = {
            'on-route': 'trackingBc.status.onRoute',
            delayed: 'trackingBc.status.delayed',
            stopped: 'trackingBc.status.stopped',
            offline: 'trackingBc.status.offline'
        };
        return map[s] ?? 'trackingBc.status.offline';
    }

    function alertIcon(type) {
        const map = {
            delay: 'schedule',
            deviation: 'wrong_location',
            signal: 'signal_wifi_bad',
            arrival: 'notifications_active'
        };
        return map[type] ?? 'notifications_active';
    }

    function exportCsv() {
        const headers = ['Vehicle', 'Driver', 'Route', 'District', 'Status', 'Speed', 'ETA', 'Progress', 'Last update'];
        const rows = filteredVehicles.value.map((v) => [
            v.vehicleId, v.driverName, v.routeName, v.district,
            statusText(v.status), `${v.speedKmh} km/h`, `${v.etaMinutes} min`,
            `${v.progressPercent}%`, v.lastUpdate
        ]);
        const csv = [headers, ...rows]
            .map((row) => row.map((cell) => `"${String(cell).replace(/"/g, '""')}"`).join(','))
            .join('\n');
        const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = 'children-path-tracking-snapshot.csv';
        link.click();
        URL.revokeObjectURL(url);
    }

    return {
        // state
        dashboard,
        loading,
        isRefreshing,
        errors,
        query,
        status,
        selectedVehicle,
        // computed
        vehicles,
        summary,
        alerts,
        activities,
        filteredVehicles,
        // actions
        fetchDashboard,
        selectVehicle,
        setQuery,
        setStatus,
        statusBadgeClass,
        statusText,
        alertIcon,
        exportCsv
    };
});

export default useTrackingStore;