import { defineStore } from 'pinia';
import { computed, ref } from 'vue';
import { TripsApi } from '../infrastructure/trips-api.js';
import { emptyTripsDashboard } from '../domain/models/trip-dashboard.model.js';
import { Trip } from '../domain/entities/trip.entity.js';

const tripsApi = new TripsApi();

function mapBackendStatus(status) {
    const normalized = String(status || 'scheduled').toLowerCase();
    if (normalized === 'inprogress' || normalized === 'in_progress') return 'in_progress';
    if (normalized === 'cancelled' || normalized === 'canceled') return 'canceled';
    return normalized;
}

function toTripEntity(item) {
    const status = mapBackendStatus(item.status);
    const stops = Array.isArray(item.stops) ? item.stops : [];
    const totalStops = item.totalStops ?? (stops.length || 8);
    const completedStops = item.completedStops ?? (status === 'completed' ? totalStops : stops.filter(s => s.status === 'reached').length);
    const progress = item.progress ?? (status === 'completed' ? 100 : status === 'in_progress' ? 45 : status === 'delayed' ? 35 : 0);

    return new Trip({
        id: item.id,
        code: item.code || `TP-${String(item.id ?? 1).padStart(3, '0')}`,
        routeName: item.routeName,
        vehiclePlate: item.vehiclePlate,
        driverName: item.driverName,
        school: item.school,
        district: item.district,
        shift: String(item.shift || 'morning').toLowerCase(),
        status,
        students: item.students ?? 0,
        capacity: item.capacity ?? 18,
        startTime: item.startTime,
        estimatedEndTime: item.estimatedEndTime,
        actualEndTime: status === 'completed' ? item.estimatedEndTime : null,
        nextStop: item.nextStop || (stops[0]?.name ?? 'Main Station'),
        completedStops,
        totalStops,
        progress,
        averageSpeed: item.averageSpeed ?? (status === 'scheduled' ? 0 : 30),
        attendanceRate: item.attendanceRate ?? (status === 'scheduled' ? 0 : 96),
        incidents: item.incidents ?? (status === 'delayed' ? 1 : 0),
        trackingStatus: status === 'completed' ? 'closed' : status === 'canceled' ? 'blocked' : status === 'scheduled' ? 'ready' : 'enabled',
        validationMessage: status === 'completed'
            ? 'Trip completed and operation history stored.'
            : status === 'in_progress'
                ? 'Trip started and live tracking enabled.'
                : 'Trip registered in backend.',
        updatedAt: 'Today'
    });
}

const useTripsStore = defineStore('trips', () => {
    // ---- State ----
    const dashboard = ref(emptyTripsDashboard());
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
            const response = await tripsApi.getRecords();
            const rawTrips = Array.isArray(response.data)
                ? response.data
                : (response.data?.trips ?? []);

            const mappedTrips = rawTrips.map(toTripEntity);
            setTrips(mappedTrips);

            if (mappedTrips.length > 0 && dashboard.value.activities.length === 0) {
                pushActivity('Backend synchronized', `${mappedTrips.length} trips loaded from backend API.`, 'completed');
            }
            errors.value = [];
        } catch (error) {
            console.error('Error fetching trips from backend:', error);
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
            const generatedCode = entity.code && entity.code.trim() !== ''
                ? entity.code
                : `TP-${String(trips.value.length + 1).padStart(3, '0')}`;

            const payload = {
                code: generatedCode,
                routeName: entity.routeName,
                vehiclePlate: entity.vehiclePlate,
                driverName: entity.driverName,
                school: entity.school,
                district: entity.district,
                shift: entity.shift || 'morning',
                startTime: entity.startTime || '06:45',
                estimatedEndTime: entity.estimatedEndTime || '07:45',
                capacity: Number(entity.capacity) || 18
            };

            const response = await tripsApi.createTrip(payload);
            const created = toTripEntity({
                ...entity,
                ...response.data
            });

            setTrips([created, ...trips.value]);
            pushActivity('Trip scheduled', `${created.routeName} was saved in backend.`, 'pending');
            return created;
        } catch (error) {
            console.error('Error creating trip in backend:', error);
            errors.value.push(error);
            throw error;
        }
    }

    async function updateTrip(entity, activityTitle = 'Trip updated', activityDescription = null, activityStatus = 'completed') {
        const updated = new Trip({ ...entity, updatedAt: 'Now' });
        setTrips(trips.value.map((t) => (t.id === updated.id ? updated : t)));
        pushActivity(activityTitle, activityDescription ?? `${updated.routeName} was updated.`, activityStatus);
        return updated;
    }

    async function startTrip(trip) {
        try {
            const response = await tripsApi.startTrip(trip.id);
            const updated = toTripEntity({
                ...trip,
                ...response.data,
                progress: Math.max(trip.progress, 20)
            });
            setTrips(trips.value.map((t) => (t.id === trip.id ? updated : t)));
            pushActivity('Trip started', `${trip.routeName} started with vehicle ${trip.vehiclePlate}.`, 'active');
            return updated;
        } catch (error) {
            console.error('Error starting trip in backend:', error);
            errors.value.push(error);
        }
    }

    async function completeTrip(trip) {
        try {
            const response = await tripsApi.completeTrip(trip.id);
            const updated = toTripEntity({
                ...trip,
                ...response.data,
                progress: 100,
                completedStops: trip.totalStops
            });
            setTrips(trips.value.map((t) => (t.id === trip.id ? updated : t)));
            pushActivity('Trip completed', `${trip.routeName} was completed in backend.`, 'completed');
            return updated;
        } catch (error) {
            console.error('Error completing trip in backend:', error);
            errors.value.push(error);
        }
    }

    async function cancelTrip(trip) {
        try {
            const response = await tripsApi.cancelTrip(trip.id);
            const updated = toTripEntity({
                ...trip,
                ...response.data
            });
            setTrips(trips.value.map((t) => (t.id === trip.id ? updated : t)));
            pushActivity('Trip canceled', `${trip.routeName} was canceled in backend.`, 'pending');
            return updated;
        } catch (error) {
            console.error('Error canceling trip in backend:', error);
            errors.value.push(error);
        }
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
        const serviceReliability = totalTrips ? Math.round((reliableTrips / totalTrips) * 100) : 100;

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
        dashboard,
        loading,
        errors,
        searchTerm,
        selectedStatus,
        selectedShift,
        trips,
        summary,
        reviews,
        activities,
        filteredTrips,
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