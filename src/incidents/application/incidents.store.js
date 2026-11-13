import { defineStore } from 'pinia';
import { computed, ref } from 'vue';
import { IncidentsApi } from '../infrastructure/incidents-api.js';
import { fallbackIncidents } from '../domain/models/incident.model.js';

const incidentsApi = new IncidentsApi();

const useIncidentsStore = defineStore('incidents', () => {
    // ---- State ----
    const dashboard = ref(fallbackIncidents());
    const loading = ref(false);
    const errors = ref([]);

    // ---- Computed ----
    const incidents = computed(() => dashboard.value.incidents);
    const reviews = computed(() => dashboard.value.reviews);
    const activities = computed(() => dashboard.value.activities);

    const summary = computed(() => {
        const list = incidents.value;
        const openStatuses = ['reported', 'in_review', 'escalated'];
        const open = list.filter((i) => openStatuses.includes(i.status)).length;
        const critical = list.filter((i) => i.severity === 'critical').length;
        const escalated = list.filter((i) => i.status === 'escalated').length;
        const resolved = list.filter((i) => i.status === 'resolved' || i.status === 'closed').length;
        const averageResponse = list.length
            ? Math.round(list.reduce((sum, i) => sum + i.responseTimeMinutes, 0) / list.length)
            : 0;
        const safetyScore = list.length
            ? Math.max(68, 100 - open * 4 - critical * 5 - escalated * 3)
            : 100;

        return {
            total: list.length,
            open,
            critical,
            escalated,
            resolved,
            averageResponse,
            safetyScore
        };
    });

    // ---- Actions ----
    async function fetchDashboard() {
        loading.value = true;
        try {
            const response = await incidentsApi.getDashboard();
            const data = response.data;
            dashboard.value = {
                incidents: data.incidents ?? fallbackIncidents().incidents,
                reviews: data.reviews ?? fallbackIncidents().reviews,
                activities: data.activities ?? fallbackIncidents().activities
            };
            errors.value = [];
        } catch (error) {
            dashboard.value = fallbackIncidents();
            errors.value.push(error);
        } finally {
            loading.value = false;
        }
    }

    function createIncident(input) {
        const nextNumber = incidents.value.length + 1;
        const now = new Date();
        const incident = {
            id: `inc-${Date.now()}`,
            code: `INC-${String(nextNumber).padStart(3, '0')}`,
            title: input.title?.trim() || 'New operational incident',
            description: input.description?.trim() || 'Incident registered for operational review.',
            type: input.type ?? 'other',
            severity: input.severity ?? 'medium',
            status: input.status ?? 'reported',
            routeName: input.routeName?.trim() || 'Pending route',
            vehiclePlate: input.vehiclePlate?.trim() || 'Pending vehicle',
            driverName: input.driverName?.trim() || 'Pending driver',
            schoolName: input.schoolName?.trim() || 'Pending school',
            district: input.district?.trim() || 'Pending district',
            reportedBy: input.reportedBy?.trim() || 'Company Admin',
            reportedAt: now.toISOString(),
            studentName: input.studentName,
            evidenceCount: input.evidenceCount ?? 0,
            followUpRequired: input.followUpRequired ?? true,
            resolution: input.resolution,
            responseTimeMinutes: input.responseTimeMinutes ?? 0
        };

        dashboard.value = {
            ...dashboard.value,
            incidents: [incident, ...incidents.value],
            activities: [
                {
                    id: `act-${Date.now()}`,
                    time: now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                    title: 'Incident report created',
                    description: `${incident.code} was registered for ${incident.vehiclePlate}.`,
                    status: 'active'
                },
                ...activities.value
            ]
        };

        return incident;
    }

    function updateStatus(id, status) {
        dashboard.value = {
            ...dashboard.value,
            incidents: incidents.value.map((incident) => {
                if (incident.id !== id) return incident;
                const resolution =
                    status === 'resolved' || status === 'closed'
                        ? incident.resolution ?? 'Operational follow-up completed.'
                        : incident.resolution;
                return { ...incident, status, resolution };
            })
        };
    }

    function updateSeverity(id, severity) {
        dashboard.value = {
            ...dashboard.value,
            incidents: incidents.value.map((incident) =>
                incident.id === id ? { ...incident, severity } : incident
            )
        };
    }

    function removeIncident(id) {
        dashboard.value = {
            ...dashboard.value,
            incidents: incidents.value.filter((incident) => incident.id !== id)
        };
    }

    function iconForType(type) {
        const icons = {
            delay: 'schedule',
            route_deviation: 'alt_route',
            mechanical: 'build',
            medical: 'medical_services',
            behavior: 'supervisor_account',
            safety: 'health_and_safety',
            other: 'report_problem'
        };
        return icons[type] ?? 'report_problem';
    }

    function exportCsv(list) {
        const header = ['code', 'title', 'vehicle', 'route', 'severity', 'status', 'responseMinutes'];
        const rows = list.map((i) => [
            i.code, i.title, i.vehiclePlate, i.routeName,
            i.severity, i.status, String(i.responseTimeMinutes)
        ]);
        const csv = [header, ...rows]
            .map((row) => row.map((cell) => `"${String(cell).replace(/"/g, '""')}"`).join(','))
            .join('\n');
        const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const anchor = document.createElement('a');
        anchor.href = url;
        anchor.download = 'children-path-incident-management.csv';
        anchor.click();
        URL.revokeObjectURL(url);
    }

    return {
        // state
        dashboard,
        loading,
        errors,
        // computed
        incidents,
        reviews,
        activities,
        summary,
        // actions
        fetchDashboard,
        createIncident,
        updateStatus,
        updateSeverity,
        removeIncident,
        iconForType,
        exportCsv
    };
});

export default useIncidentsStore;