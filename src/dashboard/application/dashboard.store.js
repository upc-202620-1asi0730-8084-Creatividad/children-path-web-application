import { defineStore } from 'pinia';
import { computed, ref } from 'vue';
import { DashboardApi } from '../infrastructure/dashboard-api.js';
import { getFallbackOverview } from '../domain/models/dashboard.model.js';

const dashboardApi = new DashboardApi();
const STORAGE_KEY = 'children-path.currentRole';
const VALID_ROLES = ['operator', 'company', 'admin'];

const useDashboardStore = defineStore('dashboard', () => {
    // ---- State ----
    const currentRole = ref(resolveCurrentRole());
    const overview = ref(getFallbackOverview(currentRole.value));
    const loading = ref(false);
    const errors = ref([]);

    // ---- Computed ----
    const metrics = computed(() => overview.value.metrics);
    const vehicles = computed(() => overview.value.vehicles);
    const alerts = computed(() => overview.value.alerts);
    const operationItems = computed(() => overview.value.operationItems);
    const activities = computed(() => overview.value.activities);

    // ---- Actions ----
    function resolveCurrentRole() {
        const stored = localStorage.getItem(STORAGE_KEY);
        return stored && VALID_ROLES.includes(stored) ? stored : 'company';
    }

    async function fetchDashboard(role = currentRole.value) {
        loading.value = true;
        try {
            const response = await dashboardApi.getOverview(role);
            const views = response.data;
            overview.value = views?.[0] ?? getFallbackOverview(role);
            errors.value = [];
        } catch (error) {
            overview.value = getFallbackOverview(role);
            errors.value.push(error);
        } finally {
            loading.value = false;
        }
    }

    function setRole(role) {
        if (!VALID_ROLES.includes(role)) return;
        currentRole.value = role;
        localStorage.setItem(STORAGE_KEY, role);
        fetchDashboard(role);
    }

    return {
        // state
        currentRole,
        overview,
        loading,
        errors,
        // computed
        metrics,
        vehicles,
        alerts,
        operationItems,
        activities,
        // actions
        fetchDashboard,
        setRole
    };
});

export default useDashboardStore;