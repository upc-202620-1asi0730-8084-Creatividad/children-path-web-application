import { defineStore } from 'pinia';
import { computed, ref } from 'vue';
import { TripsApi } from '../infrastructure/trips-api.js';
import { fallbackTrips } from '../domain/models/trip-dashboard.model.js';
import { Trip } from '../domain/entities/trip.entity.js';

const tripsApi = new TripsApi();

const useTripsStore = defineStore('trips', () => {
    // ---- State ----
    const dashboard = ref(fallbackTrips());
    const loading = ref(false);
    const errors = ref([]);

    // Filters
    const searchTerm = ref('');
    const selectedStatus = ref('all');
    const selectedShift = ref('all');

    // ---- Computed ----
    const trips = computed(() => dashboard.value.trips);
    const summary = computed(() => dashboard.value.summary);
    const reviews = computed(() => dashboard.value.reviews);
    const activities = computed(() => dashboard.value.activities);

    const filteredTrips = computed(() => {
        const term = searchTerm.value.trim().toLowerCase();
        const status = selectedStatus.value;
        const shift = selectedShift.value;

        return trips.value.filter((trip) => {
            const matchesStatus = status === 'all' || trip.status === status;
            const matchesShift = shift === 'all' || trip.shift === shift;
            const searchable = [
                trip.code, trip.routeName, trip.vehiclePlate, trip.driverName,
                trip.school, trip.district, trip.nextStop, trip.status, trip.shift
            ].join(' ').toLowerCase();
            const matchesQuery = !term || searchable.includes(term);
            return matchesStatus && matchesShift && matchesQuery;
        });
    });

    // ---- Actions ----
    async function fetchDashboard() {
        loading.value = true;
        try {
            const response = await tripsApi.getDashboard();
            dashboard.value = response.data;
            errors.value = [];
        } catch (error) {
            dashboard.value = fallbackTrips();
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

    function setShift(shift) {
        selectedShift.value = shift;
    }

    async function createTrip(entity) {
        try {
            const response = await tripsApi.createTrip(entity);
            const created = new Trip({ ...response.data });
            setTrips([created, ...trips.value]);
            pushActivity('Trip scheduled', `${created.routeName} was added to the daily operation.`, 'pending');
            return created;
        } catch (error) {
            setTrips([entity, ...trips.value]);
            pushActivity('Trip scheduled', `${entity.routeName} was added to the daily operation.`, 'pending');
            errors.value.push(error);
            return entity;
        }
    }

    async function updateTrip(entity, activityTitle = 'Trip updated', activityDescription = null, activityStatus = 'completed') {
        try {
            const response = await tripsApi.updateTrip(entity.id, entity);
            const updated = new Trip({ ...response.data });
            setTrips(trips.value.map((t) => (t.id === updated.id ? updated : t)));
            pushActivity(activityTitle, activityDescription ?? `${updated.routeName} was updated.`, activityStatus);
            return updated;
        } catch (error) {
            setTrips(trips.value.map((t) => (t.id === entity.id ? entity : t)));
            pushActivity(activityTitle, activityDescription ?? `${entity.routeName} was updated.`, activityStatus);
            errors.value.push(error);
            return entity;
        }
    }

    function startTrip(trip) {
        const updated = new Trip({
            ...trip,
            status: 'in_progress',
            progress: Math.max(trip.progress, 8),
            trackingStatus: 'enabled',
            validationMessage: 'Trip started and live tracking enabled.',
            updatedAt: 'Now'
        });
        return updateTrip(updated, 'Trip started', `${trip.routeName} started with vehicle ${trip.vehiclePlate}.`, 'active');
    }

    function completeTrip(trip) {
        const updated = new Trip({
            ...trip,
            status: 'completed',
            progress: 100,
            completedStops: trip.totalStops,
            actualEndTime: trip.estimatedEndTime,
            trackingStatus: 'closed',
            validationMessage: 'Trip completed and operation history stored.',
            updatedAt: 'Now'
        });
        return updateTrip(updated, 'Trip completed', `${trip.routeName} was completed and tracking session was closed.`, 'completed');
    }

    function cancelTrip(trip) {
        const updated = new Trip({
            ...trip,
            status: 'canceled',
            trackingStatus: 'blocked',
            validationMessage: 'Trip canceled and attendance records blocked.',
            updatedAt: 'Now'
        });
        return updateTrip(updated, 'Trip canceled', `${trip.routeName} was canceled before completion.`, 'pending');
    }

    function setTrips(list) {
        dashboard.value = {
            ...dashboard.value,
            trips: list,
            summary: calculateSummary(list)
        };
    }

    function pushActivity(title, description, status) {
        dashboard.value = {
            ...dashboard.value,
            activities: [
                {
                    id: `trip-activity-${Date.now()}`,
                    time: 'Now',
                    title,
                    description,
                    status
                },
                ...dashboard.value.activities
            ]
        };
    }

    function calculateSummary(list) {
        const totalTrips = list.length;
        const activeTrips = list.filter((t) => t.status === 'in_progress' || t.status === 'delayed').length;
        const scheduledTrips = list.filter((t) => t.status === 'scheduled').length;
        const delayedTrips = list.filter((t) => t.status === 'delayed').length;
        const completedTrips = list.filter((t) => t.status === 'completed').length;
        const reliableTrips = list.filter((t) => t.status !== 'delayed' && t.status !== 'canceled').length;
        const serviceReliability = totalTrips ? Math.round((reliableTrips / totalTrips) * 100) : 0;

        return {
            totalTrips,
            activeTrips,
            scheduledTrips,
            delayedTrips,
            completedTrips,
            serviceReliability
        };
    }

    function exportCsv(list) {
        const header = ['Code', 'Route', 'Vehicle', 'Driver', 'Shift', 'Status', 'Students', 'Progress', 'ETA'];
        const rows = list.map((t) => [
            t.code, t.routeName, t.vehiclePlate, t.driverName,
            t.shift, t.status, `${t.students}/${t.capacity}`,
            `${t.progress}%`, t.estimatedEndTime
        ]);
        const csv = [header, ...rows]
            .map((row) => row.map((cell) => `"${String(cell).replace(/"/g, '""')}"`).join(','))
            .join('\n');
        const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const anchor = document.createElement('a');
        anchor.href = url;
        anchor.download = 'children-path-trip-registry.csv';
        anchor.click();
        URL.revokeObjectURL(url);
    }

    function statusIcon(status) {
        const map = {
            all: 'route',
            scheduled: 'event_available',
            in_progress: 'play_circle',
            delayed: 'schedule',
            completed: 'check_circle',
            canceled: 'cancel'
        };
        return map[status] ?? 'route';
    }

    function shiftIcon(shift) {
        const map = {
            all: 'view_day',
            morning: 'wb_sunny',
            afternoon: 'light_mode',
            return: 'keyboard_return'
        };
        return map[shift] ?? 'view_day';
    }

    return {
        // state
        dashboard,
        loading,
        errors,
        searchTerm,
        selectedStatus,
        selectedShift,
        // computed
        trips,
        summary,
        reviews,
        activities,
        filteredTrips,
        // actions
        fetchDashboard,
        setSearchTerm,
        setStatus,
        setShift,
        createTrip,
        updateTrip,
        startTrip,
        completeTrip,
        cancelTrip,
        exportCsv,
        statusIcon,
        shiftIcon
    };
});

export default useTripsStore;