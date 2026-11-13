import { defineStore } from 'pinia';
import { computed, ref } from 'vue';
import { FleetApi } from '../infrastructure/fleet-api.js';
import { VehicleAssembler } from '../infrastructure/vehicle.assembler.js';
import { MaintenanceAlertAssembler } from '../infrastructure/maintenance-alert.assembler.js';
import { FleetSummaryAssembler } from '../infrastructure/fleet-summary.assembler.js';

const fleetApi = new FleetApi();

const useFleetStore = defineStore('fleet', () => {
    // ---- State ----
    const summary = ref({
        totalVehicles: 0,
        availableVehicles: 0,
        onRouteVehicles: 0,
        maintenanceVehicles: 0,
        averageAvailability: 0,
        averageCapacityUsage: 0
    });
    const vehicles = ref([]);
    const maintenanceAlerts = ref([]);
    const errors = ref([]);
    const loaded = ref(false);

    // Filters
    const searchTerm = ref('');
    const selectedStatus = ref('all');

    // ---- Computed ----
    const filteredVehicles = computed(() => {
        const query = searchTerm.value.trim().toLowerCase();
        const status = selectedStatus.value;

        return vehicles.value.filter((vehicle) => {
            const matchesStatus = status === 'all' || vehicle.status === status;
            const matchesSearch =
                !query ||
                vehicle.plate.toLowerCase().includes(query) ||
                vehicle.code.toLowerCase().includes(query) ||
                vehicle.driverName.toLowerCase().includes(query) ||
                vehicle.routeName.toLowerCase().includes(query) ||
                vehicle.brand.toLowerCase().includes(query) ||
                vehicle.model.toLowerCase().includes(query);
            return matchesStatus && matchesSearch;
        });
    });

    const dashboard = computed(() => ({
        summary: summary.value,
        vehicles: vehicles.value,
        maintenanceAlerts: maintenanceAlerts.value
    }));

    // ---- Actions ----
    async function fetchDashboard() {
        try {
            const [summaryRes, vehiclesRes, alertsRes] = await Promise.all([
                fleetApi.getSummary(),
                fleetApi.getVehicles(),
                fleetApi.getMaintenanceAlerts()
            ]);

            const newSummary = FleetSummaryAssembler.toEntityFromResponse(summaryRes);
            if (newSummary) summary.value = newSummary;

            vehicles.value = VehicleAssembler.toEntitiesFromResponse(vehiclesRes);
            maintenanceAlerts.value = MaintenanceAlertAssembler.toEntitiesFromResponse(alertsRes);
            loaded.value = true;
            errors.value = [];
        } catch (error) {
            console.error('Fleet dashboard fetch error:', error);
            errors.value.push(error);
        }
    }

    async function createVehicle(vehicleEntity) {
        try {
            const resource = VehicleAssembler.toResourceFromEntity(vehicleEntity);
            const response = await fleetApi.createVehicle(resource);
            const created = VehicleAssembler.toEntityFromResource(response.data);
            vehicles.value = [created, ...vehicles.value];
            return created;
        } catch (error) {
            // Fallback: agrega localmente si el API falla
            vehicles.value = [vehicleEntity, ...vehicles.value];
            errors.value.push(error);
            return vehicleEntity;
        }
    }

    async function updateVehicle(vehicleEntity) {
        try {
            const resource = VehicleAssembler.toResourceFromEntity(vehicleEntity);
            const response = await fleetApi.updateVehicle(vehicleEntity.id, resource);
            const updated = VehicleAssembler.toEntityFromResource(response.data);
            const index = vehicles.value.findIndex((v) => v.id === updated.id);
            if (index !== -1) vehicles.value[index] = updated;
            return updated;
        } catch (error) {
            errors.value.push(error);
            return vehicleEntity;
        }
    }

    async function deleteVehicle(id) {
        try {
            await fleetApi.deleteVehicle(id);
            vehicles.value = vehicles.value.filter((v) => v.id !== id);
        } catch (error) {
            errors.value.push(error);
        }
    }

    function setSearchTerm(value) {
        searchTerm.value = value;
    }

    function setStatus(value) {
        selectedStatus.value = value;
    }

    return {
        // state
        summary,
        vehicles,
        maintenanceAlerts,
        errors,
        loaded,
        searchTerm,
        selectedStatus,
        // computed
        filteredVehicles,
        dashboard,
        // actions
        fetchDashboard,
        createVehicle,
        updateVehicle,
        deleteVehicle,
        setSearchTerm,
        setStatus
    };
});

export default useFleetStore;