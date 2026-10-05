import { defineStore } from 'pinia';
import { computed, ref } from 'vue';
import { AssignmentApi } from '../infrastructure/assignment-api.js';
import { AssignmentAssembler } from '../infrastructure/assignment.assembler.js';
import { fallbackAssignmentDashboard } from '../domain/models/assignment-dashboard.model.js';
import { Assignment } from '../domain/entities/assignment.entity.js';

const assignmentApi = new AssignmentApi();

const useAssignmentStore = defineStore('assignment', () => {
    // ---- State ----
    const dashboard = ref(fallbackAssignmentDashboard());
    const loading = ref(true);
    const errors = ref([]);

    // Filters
    const selectedStatus = ref('all');
    const selectedShift = ref('all');
    const searchTerm = ref('');

    // ---- Computed ----
    const assignments = computed(() => dashboard.value.assignments);

    const filteredAssignments = computed(() => {
        const status = selectedStatus.value;
        const shift = selectedShift.value;
        const search = searchTerm.value.trim().toLowerCase();

        return assignments.value.filter((a) => {
            const matchesStatus = status === 'all' || a.status === status;
            const matchesShift = shift === 'all' || a.shift === shift;
            const matchesSearch =
                !search ||
                [
                    a.id, a.studentCode, a.studentName, a.guardianName, a.grade,
                    a.routeCode, a.routeName, a.vehiclePlate, a.driverName, a.pickupPoint
                ].join(' ').toLowerCase().includes(search);

            return matchesStatus && matchesShift && matchesSearch;
        });
    });

    // ---- Actions ----
    async function fetchDashboard() {
        loading.value = true;
        try {
            const response = await assignmentApi.getDashboard();
            const data = response.data;

            // Normalize assignments to entities
            const assignments = (data.assignments ?? []).map((r) => AssignmentAssembler.toEntityFromResource(r));

            dashboard.value = {
                ...data,
                assignments
            };
            errors.value = [];
        } catch (error) {
            // Fallback silencioso
            dashboard.value = fallbackAssignmentDashboard();
        } finally {
            loading.value = false;
        }
    }

    function updateSearch(value) {
        searchTerm.value = value;
    }

    function selectStatus(status) {
        selectedStatus.value = status;
    }

    function selectShift(shift) {
        selectedShift.value = shift;
    }

    async function createAssignment(entity) {
        try {
            const resource = AssignmentAssembler.toResourceFromEntity(entity);
            const response = await assignmentApi.createAssignment(resource);
            const created = AssignmentAssembler.toEntityFromResource(response.data);
            setAssignments([created, ...assignments.value]);
            return created;
        } catch (error) {
            // Fallback local
            setAssignments([entity, ...assignments.value]);
            return entity;
        }
    }

    async function updateAssignment(entity) {
        try {
            const resource = AssignmentAssembler.toResourceFromEntity(entity);
            const response = await assignmentApi.updateAssignment(entity.id, resource);
            const saved = AssignmentAssembler.toEntityFromResource(response.data);
            setAssignments(assignments.value.map((a) => (a.id === entity.id ? saved : a)));
            return saved;
        } catch (error) {
            setAssignments(assignments.value.map((a) => (a.id === entity.id ? entity : a)));
            return entity;
        }
    }

    async function deleteAssignment(id) {
        try {
            await assignmentApi.deleteAssignment(id);
        } catch (error) {
            // Ignore error, remove locally anyway
        }
        setAssignments(assignments.value.filter((a) => a.id !== id));
    }

    function markValidated(entity) {
        const updated = new Assignment({
            ...entity,
            status: 'validated',
            validation: 'ready',
            validationScore: Math.max(entity.validationScore, 91),
            lastUpdated: 'Just now'
        });
        return updateAssignment(updated);
    }

    function setAssignments(list) {
        dashboard.value = {
            ...dashboard.value,
            summary: calculateSummary(list),
            assignments: list
        };
    }

    function calculateSummary(list) {
        const totalAssignments = list.length;
        const validatedAssignments = list.filter((a) => a.status === 'validated').length;
        const pendingAssignments = list.filter((a) => a.status === 'pending').length;
        const conflictsDetected = list.filter((a) => a.status === 'conflict').length;
        const averageCapacity = totalAssignments
            ? Math.round(list.reduce((sum, a) => sum + a.capacityUsage, 0) / totalAssignments)
            : 0;
        const assignmentReadiness = totalAssignments
            ? Math.round((validatedAssignments / totalAssignments) * 100)
            : 0;

        return {
            totalAssignments,
            validatedAssignments,
            pendingAssignments,
            conflictsDetected,
            averageCapacity,
            assignmentReadiness
        };
    }

    function exportCsv() {
        const header = ['ID', 'Student', 'Route', 'Vehicle', 'Driver', 'Shift', 'Status', 'Validation Score'];
        const rows = filteredAssignments.value.map((a) => [
            a.id, a.studentName, a.routeName, a.vehiclePlate, a.driverName,
            a.shift, a.status, `${a.validationScore}%`
        ]);
        const csv = [header, ...rows]
            .map((row) => row.map((v) => `"${String(v).replace(/"/g, '""')}"`).join(','))
            .join('\n');
        const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = 'children-path-assignment-registry.csv';
        link.click();
        URL.revokeObjectURL(url);
    }

    return {
        // state
        dashboard,
        loading,
        errors,
        selectedStatus,
        selectedShift,
        searchTerm,
        // computed
        assignments,
        filteredAssignments,
        // actions
        fetchDashboard,
        updateSearch,
        selectStatus,
        selectShift,
        createAssignment,
        updateAssignment,
        deleteAssignment,
        markValidated,
        exportCsv
    };
});

export default useAssignmentStore;