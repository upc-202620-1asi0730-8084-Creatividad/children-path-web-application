import { defineStore } from 'pinia';
import { computed, ref } from 'vue';
import { DriversApi } from '../infrastructure/drivers-api.js';
import { DriverAssembler } from '../infrastructure/driver.assembler.js';
import { fallbackDriverDashboard } from '../domain/models/driver-dashboard.model.js';
import { Driver } from '../domain/entities/driver.entity.js';

const driversApi = new DriversApi();

const useDriversStore = defineStore('drivers', () => {
    // ---- State ----
    const dashboard = ref(fallbackDriverDashboard());
    const loading = ref(false);
    const errors = ref([]);

    // Filters
    const searchTerm = ref('');
    const selectedStatus = ref('all');

    // ---- Computed ----
    const drivers = computed(() => dashboard.value.drivers);

    const filteredDrivers = computed(() => {
        const query = searchTerm.value.trim().toLowerCase();
        const status = selectedStatus.value;

        return drivers.value.filter((driver) => {
            const matchesStatus = status === 'all' || driver.status === status;
            const matchesSearch =
                !query ||
                driver.fullName.toLowerCase().includes(query) ||
                driver.code.toLowerCase().includes(query) ||
                driver.licenseNumber.toLowerCase().includes(query) ||
                driver.assignedVehicle.toLowerCase().includes(query) ||
                driver.assignedRoute.toLowerCase().includes(query) ||
                driver.email.toLowerCase().includes(query);
            return matchesStatus && matchesSearch;
        });
    });

    // ---- Actions ----
    async function fetchDashboard() {
        loading.value = true;
        try {
            const [summaryRes, driversRes, reviewsRes, shiftsRes] = await Promise.all([
                driversApi.getSummary(),
                driversApi.getDrivers(),
                driversApi.getReviews(),
                driversApi.getShifts()
            ]);

            dashboard.value = {
                summary: summaryRes.data,
                drivers: DriverAssembler.toEntitiesFromResponse(driversRes),
                reviews: reviewsRes.data,
                shifts: shiftsRes.data
            };
            errors.value = [];
        } catch (error) {
            dashboard.value = fallbackDriverDashboard();
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

    async function createDriver(entity) {
        try {
            const resource = DriverAssembler.toResourceFromEntity(entity);
            const response = await driversApi.createDriver(resource);
            const created = DriverAssembler.toEntityFromResource(response.data);
            setDrivers([created, ...drivers.value]);
            return created;
        } catch (error) {
            setDrivers([entity, ...drivers.value]);
            errors.value.push(error);
            return entity;
        }
    }

    async function updateDriver(entity) {
        try {
            const resource = DriverAssembler.toResourceFromEntity(entity);
            const response = await driversApi.updateDriver(entity.id, resource);
            const updated = DriverAssembler.toEntityFromResource(response.data);
            setDrivers(drivers.value.map((d) => (d.id === entity.id ? updated : d)));
            return updated;
        } catch (error) {
            setDrivers(drivers.value.map((d) => (d.id === entity.id ? entity : d)));
            errors.value.push(error);
            return entity;
        }
    }

    async function deleteDriver(id) {
        try {
            await driversApi.deleteDriver(id);
        } catch (error) {
            // Ignore
        }
        setDrivers(drivers.value.filter((d) => d.id !== id));
    }

    function setDrivers(list) {
        dashboard.value = {
            ...dashboard.value,
            summary: calculateSummary(list),
            drivers: list
        };
    }

    function calculateSummary(list) {
        const totalDrivers = list.length;
        const availableDrivers = list.filter((d) => d.status === 'available').length;
        const onRouteDrivers = list.filter((d) => d.status === 'onRoute').length;
        const pendingReviews = list.filter((d) => d.status === 'review').length;
        const licenseCompliance = totalDrivers
            ? Math.round((list.filter((d) => d.documentsValid).length / totalDrivers) * 100)
            : 0;
        const averageSafetyScore = totalDrivers
            ? Math.round(list.reduce((sum, d) => sum + d.safetyScore, 0) / totalDrivers)
            : 0;

        return {
            totalDrivers,
            availableDrivers,
            onRouteDrivers,
            pendingReviews,
            licenseCompliance,
            averageSafetyScore
        };
    }

    function exportCsv() {
        const header = ['Code', 'Driver', 'License', 'Vehicle', 'Route', 'Status', 'Safety', 'Punctuality'];
        const rows = filteredDrivers.value.map((d) => [
            d.code, d.fullName, d.licenseNumber, d.assignedVehicle,
            d.assignedRoute, d.status, `${d.safetyScore}%`, `${d.punctualityScore}%`
        ]);
        const csv = [header, ...rows]
            .map((row) => row.map((v) => `"${String(v).replace(/"/g, '""')}"`).join(','))
            .join('\n');
        const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = 'children-path-driver-registry.csv';
        link.click();
        URL.revokeObjectURL(url);
    }

    function readinessGradient(value) {
        const safe = Math.max(0, Math.min(value, 100));
        return `conic-gradient(var(--kw-blue-700) ${safe}%, #e9eff7 0)`;
    }

    function statusIcon(status) {
        const icons = {
            all: 'groups',
            available: 'check_circle',
            onRoute: 'route',
            review: 'manage_search',
            offDuty: 'bedtime'
        };
        return icons[status] ?? 'badge';
    }

    return {
        // state
        dashboard,
        loading,
        errors,
        searchTerm,
        selectedStatus,
        // computed
        drivers,
        filteredDrivers,
        // actions
        fetchDashboard,
        setSearchTerm,
        setStatus,
        createDriver,
        updateDriver,
        deleteDriver,
        exportCsv,
        readinessGradient,
        statusIcon
    };
});

export default useDriversStore;