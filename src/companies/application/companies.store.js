import { defineStore } from 'pinia';
import { computed, ref } from 'vue';
import { CompaniesApi } from '../infrastructure/companies-api.js';
import { fallbackCompanyManagement } from '../domain/models/company-management.model.js';

const companiesApi = new CompaniesApi();

const useCompaniesStore = defineStore('companies', () => {
    // ---- State ----
    const dashboard = ref(fallbackCompanyManagement());
    const loading = ref(false);
    const errors = ref([]);

    const query = ref('');
    const contractStatus = ref('all');
    const memberStatus = ref('all');
    const complianceStatus = ref('all');

    const selectedContractId = ref(fallbackCompanyManagement().contracts[0].id);
    const selectedMemberId = ref(fallbackCompanyManagement().members[0].id);

    // ---- Computed ----
    const profile = computed(() => dashboard.value.profile);
    const summary = computed(() => dashboard.value.summary);

    const filteredContracts = computed(() => {
        const q = query.value.trim().toLowerCase();
        const status = contractStatus.value;
        return dashboard.value.contracts.filter((c) => {
            const matchesStatus = status === 'all' || c.status === status;
            const matchesQuery =
                !q ||
                [c.schoolName, c.district, c.contactName, c.status, c.notes]
                    .some((v) => String(v).toLowerCase().includes(q));
            return matchesStatus && matchesQuery;
        });
    });

    const selectedContract = computed(() => {
        return (
            dashboard.value.contracts.find((c) => c.id === selectedContractId.value) ??
            dashboard.value.contracts[0]
        );
    });

    const filteredMembers = computed(() => {
        const status = memberStatus.value;
        return dashboard.value.members.filter((m) => status === 'all' || m.status === status);
    });

    const selectedMember = computed(() => {
        return (
            dashboard.value.members.find((m) => m.id === selectedMemberId.value) ??
            dashboard.value.members[0]
        );
    });

    const filteredCompliance = computed(() => {
        const status = complianceStatus.value;
        return dashboard.value.complianceItems.filter((i) => status === 'all' || i.status === status);
    });

    // ---- Actions ----
    async function fetchDashboard() {
        loading.value = true;
        try {
            const response = await companiesApi.getDashboard();
            const data = response.data;
            dashboard.value = data;
            selectedContractId.value = data.contracts?.[0]?.id ?? '';
            selectedMemberId.value = data.members?.[0]?.id ?? '';
            errors.value = [];
        } catch (error) {
            dashboard.value = fallbackCompanyManagement();
            errors.value.push(error);
        } finally {
            loading.value = false;
        }
    }

    function selectContract(id) {
        selectedContractId.value = id;
    }

    function selectMember(id) {
        selectedMemberId.value = id;
    }

    function setContractStatus(status) {
        contractStatus.value = status;
    }

    function setMemberStatus(status) {
        memberStatus.value = status;
    }

    function setComplianceStatus(status) {
        complianceStatus.value = status;
    }

    function markComplianceCompleted(itemId) {
        const now = new Date();
        const nextActivity = {
            id: `act-${Date.now()}`,
            time: now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            title: 'Compliance item completed',
            description: 'A company management review was marked as completed.',
            status: 'completed'
        };

        dashboard.value = {
            ...dashboard.value,
            summary: {
                ...dashboard.value.summary,
                pendingReviews: Math.max(0, dashboard.value.summary.pendingReviews - 1),
                complianceScore: Math.min(100, dashboard.value.summary.complianceScore + 1)
            },
            complianceItems: dashboard.value.complianceItems.map((item) =>
                item.id === itemId ? { ...item, status: 'completed', severity: 'low' } : item
            ),
            activities: [nextActivity, ...dashboard.value.activities]
        };
    }

    function exportCsv() {
        const headers = ['School', 'District', 'Routes', 'Students', 'Status', 'Renewal date', 'Score'];
        const rows = dashboard.value.contracts.map((c) => [
            c.schoolName, c.district, String(c.routeCount), String(c.studentCount),
            c.status, c.renewalDate, `${c.score}%`
        ]);
        const csv = [headers, ...rows]
            .map((row) => row.map((cell) => `"${String(cell).replace(/"/g, '""')}"`).join(','))
            .join('\n');
        const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = 'children-path-company-contracts.csv';
        link.click();
        URL.revokeObjectURL(url);
    }

    function contractStatusLabel(status) {
        return `companiesBc.status.contract.${status}`;
    }

    function memberStatusLabel(status) {
        return `companiesBc.status.member.${status}`;
    }

    function complianceStatusLabel(status) {
        return `companiesBc.status.compliance.${status}`;
    }

    function contractIcon(status) {
        const icons = {
            active: 'verified',
            renewal: 'event_repeat',
            review: 'manage_search',
            paused: 'pause_circle'
        };
        return icons[status] ?? 'help';
    }

    function initials(name) {
        return name
            .split(' ')
            .map((part) => part[0])
            .join('')
            .slice(0, 2)
            .toUpperCase();
    }

    return {
        // state
        dashboard,
        loading,
        errors,
        query,
        contractStatus,
        memberStatus,
        complianceStatus,
        selectedContractId,
        selectedMemberId,
        // computed
        profile,
        summary,
        filteredContracts,
        selectedContract,
        filteredMembers,
        selectedMember,
        filteredCompliance,
        // actions
        fetchDashboard,
        selectContract,
        selectMember,
        setContractStatus,
        setMemberStatus,
        setComplianceStatus,
        markComplianceCompleted,
        exportCsv,
        contractStatusLabel,
        memberStatusLabel,
        complianceStatusLabel,
        contractIcon,
        initials
    };
});

export default useCompaniesStore;