import { defineStore } from 'pinia';
import { computed, ref } from 'vue';
import { SubscriptionsApi } from '../infrastructure/subscriptions-api.js';
import { fallbackSubscriptions } from '../domain/models/subscription-dashboard.model.js';

const subscriptionsApi = new SubscriptionsApi();

const useSubscriptionsStore = defineStore('subscriptions', () => {
    // ---- State ----
    const dashboard = ref(fallbackSubscriptions());
    const loading = ref(false);
    const errors = ref([]);

    const selectedPlanId = ref('pro');

    // ---- Computed ----
    const currentSubscription = computed(() => dashboard.value.currentSubscription);
    const plans = computed(() => dashboard.value.plans);
    const paymentMethods = computed(() => dashboard.value.paymentMethods);
    const billingHistory = computed(() => dashboard.value.billingHistory);

    const selectedPlan = computed(() =>
        plans.value.find((p) => p.id === selectedPlanId.value) ?? plans.value[0]
    );

    const lastPayment = computed(() =>
        billingHistory.value.length > 0 ? billingHistory.value[0] : null
    );

    const serviceDays = computed(() => {
        const start = new Date(currentSubscription.value.startedOn ?? '2026-01-15');
        const today = new Date();
        return Math.max(Math.ceil((today.getTime() - start.getTime()) / 86_400_000), 1);
    });

    const daysUntilRenewal = computed(() => {
        const today = new Date();
        const renewal = new Date(currentSubscription.value.renewsOn);
        return Math.max(Math.ceil((renewal.getTime() - today.getTime()) / 86_400_000), 0);
    });

    // ---- Actions ----
    async function fetchDashboard() {
        loading.value = true;
        try {
            const [currentRes, plansRes, paymentsRes, billingRes] = await Promise.all([
                subscriptionsApi.getCurrentSubscription(),
                subscriptionsApi.getPlans(),
                subscriptionsApi.getPaymentMethods(),
                subscriptionsApi.getBillingHistory()
            ]);

            dashboard.value = {
                currentSubscription: currentRes.data,
                plans: plansRes.data,
                paymentMethods: paymentsRes.data,
                billingHistory: billingRes.data
            };
            errors.value = [];
        } catch (error) {
            dashboard.value = fallbackSubscriptions();
            errors.value.push(error);
        } finally {
            loading.value = false;
        }
    }

    function selectPlan(planId) {
        selectedPlanId.value = planId;
    }

    function percentage(used, limit) {
        if (!limit) return 100;
        return Math.min(Math.round((used / limit) * 100), 100);
    }

    function exportCsv() {
        const header = ['Date', 'Description', 'Amount', 'Method', 'Status'];
        const rows = billingHistory.value.map((r) => [
            r.date, r.description, `${r.amount} ${r.currency}`, r.method, r.status
        ]);
        const csv = [header, ...rows]
            .map((row) => row.map((cell) => `"${String(cell).replace(/"/g, '""')}"`).join(','))
            .join('\n');
        const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const anchor = document.createElement('a');
        anchor.href = url;
        anchor.download = 'children-path-billing-history.csv';
        anchor.click();
        URL.revokeObjectURL(url);
    }

    return {
        // state
        dashboard,
        loading,
        errors,
        selectedPlanId,
        // computed
        currentSubscription,
        plans,
        paymentMethods,
        billingHistory,
        selectedPlan,
        lastPayment,
        serviceDays,
        daysUntilRenewal,
        // actions
        fetchDashboard,
        selectPlan,
        percentage,
        exportCsv
    };
});

export default useSubscriptionsStore;