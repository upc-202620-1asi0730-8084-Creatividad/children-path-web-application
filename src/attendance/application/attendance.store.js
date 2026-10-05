import { defineStore } from 'pinia';
import { computed, ref } from 'vue';
import { AttendanceApi } from '../infrastructure/attendance-api.js';
import { AttendanceRecordAssembler } from '../infrastructure/attendance-record.assembler.js';
import { fallbackAttendanceDashboard } from '../domain/models/attendance-dashboard.model.js';
import { AttendanceRecord } from '../domain/entities/attendance-record.entity.js';

const attendanceApi = new AttendanceApi();

const useAttendanceStore = defineStore('attendance', () => {
    // ---- State ----
    const dashboard = ref(fallbackAttendanceDashboard());
    const loading = ref(false);
    const errors = ref([]);

    // Filters
    const selectedStatus = ref('all');
    const selectedRoute = ref('all');
    const searchTerm = ref('');

    // ---- Computed ----
    const records = computed(() => dashboard.value.records);
    const summary = computed(() => dashboard.value.summary);

    const availableRoutes = computed(() => {
        const routes = new Set(records.value.map((r) => r.routeName));
        return ['all', ...Array.from(routes)];
    });

    const filteredRecords = computed(() => {
        const status = selectedStatus.value;
        const route = selectedRoute.value;
        const search = searchTerm.value.trim().toLowerCase();

        return records.value.filter((r) => {
            const matchesStatus = status === 'all' || r.status === status;
            const matchesRoute = route === 'all' || r.routeName === route;
            const matchesSearch =
                !search ||
                [
                    r.studentCode, r.studentName, r.grade,
                    r.routeName, r.vehiclePlate, r.driverName,
                    r.pickupPoint, r.guardianName
                ].join(' ').toLowerCase().includes(search);

            return matchesStatus && matchesRoute && matchesSearch;
        });
    });

    // ---- Actions ----
    async function fetchDashboard() {
        loading.value = true;
        try {
            const response = await attendanceApi.getDashboard();
            const data = response.data;
            const records = (data.records ?? []).map((r) => AttendanceRecordAssembler.toEntityFromResource(r));
            dashboard.value = { ...data, records };
            errors.value = [];
        } catch (error) {
            dashboard.value = fallbackAttendanceDashboard();
        } finally {
            loading.value = false;
        }
    }

    function setStatus(status) {
        selectedStatus.value = status;
    }

    function setRoute(route) {
        selectedRoute.value = route;
    }

    function setSearchTerm(value) {
        searchTerm.value = value;
    }

    async function changeStatus(record, newStatus) {
        const now = new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });

        const updates = {
            status: newStatus,
            checkInTime:
                newStatus === 'on_board' || newStatus === 'arrived'
                    ? record.checkInTime ?? now
                    : record.checkInTime,
            dropOffTime:
                newStatus === 'arrived'
                    ? now
                    : newStatus === 'on_board'
                        ? null
                        : record.dropOffTime,
            reliability:
                newStatus === 'arrived'
                    ? 100
                    : newStatus === 'on_board'
                        ? Math.max(record.reliability, 80)
                        : newStatus === 'absent'
                            ? 0
                            : record.reliability,
            lastEvent: statusActivityTitle(newStatus),
            notes: statusActivityDescription(record, newStatus)
        };

        const updated = new AttendanceRecord({ ...record, ...updates });

        try {
            await attendanceApi.updateRecord(updated.id, AttendanceRecordAssembler.toResourceFromEntity(updated));
        } catch (e) {
            // Fallback silencioso
        }

        updateRecord(
            updated,
            statusActivityTitle(newStatus),
            statusActivityDescription(record, newStatus),
            newStatus === 'absent' || newStatus === 'pending_confirmation' ? 'pending' : 'completed'
        );
    }

    function updateRecord(record, title, description, status) {
        const list = records.value.map((item) => (item.id === record.id ? record : item));
        dashboard.value = {
            ...dashboard.value,
            records: list,
            summary: summaryFrom(list),
            activities: [
                {
                    id: `attendance-activity-${Date.now()}`,
                    time: 'Now',
                    title,
                    description,
                    status
                },
                ...dashboard.value.activities
            ]
        };
    }

    function summaryFrom(list) {
        const totalAssigned = list.length;
        const onBoard = list.filter((r) => r.status === 'on_board').length;
        const arrived = list.filter((r) => r.status === 'arrived').length;
        const waiting = list.filter((r) => r.status === 'waiting').length;
        const absent = list.filter((r) => r.status === 'absent').length;
        const pendingConfirmation = list.filter((r) => r.status === 'pending_confirmation').length;
        const attended = onBoard + arrived;

        return {
            totalAssigned,
            onBoard,
            arrived,
            waiting,
            absent,
            pendingConfirmation,
            attendanceReliability:
                Math.round((attended / Math.max(totalAssigned - pendingConfirmation, 1)) * 1000) / 10
        };
    }

    function statusActivityTitle(status) {
        const titles = {
            waiting: 'Student marked as waiting',
            on_board: 'Boarding confirmed',
            arrived: 'Drop-off confirmed',
            absent: 'Absence registered',
            pending_confirmation: 'Attendance review requested'
        };
        return titles[status] ?? '';
    }

    function statusActivityDescription(record, status) {
        const descriptions = {
            waiting: `${record.studentName} is waiting at ${record.pickupPoint}.`,
            on_board: `${record.studentName} boarded vehicle ${record.vehiclePlate}.`,
            arrived: `${record.studentName} arrived at ${record.school}.`,
            absent: `${record.studentName} was marked as absent and requires guardian awareness.`,
            pending_confirmation: `${record.studentName} needs attendance confirmation before route closure.`
        };
        return descriptions[status] ?? '';
    }

    function exportCsv() {
        const header = ['Student', 'Code', 'Route', 'Vehicle', 'Driver', 'Status', 'Check-in', 'Drop-off', 'ETA'];
        const rows = filteredRecords.value.map((r) => [
            r.studentName, r.studentCode, r.routeName, r.vehiclePlate, r.driverName,
            r.status, r.checkInTime ?? '', r.dropOffTime ?? '', r.estimatedArrival
        ]);
        const csv = [header, ...rows]
            .map((row) => row.map((cell) => `"${String(cell).replace(/"/g, '""')}"`).join(','))
            .join('\n');
        const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const anchor = document.createElement('a');
        anchor.href = url;
        anchor.download = 'children-path-attendance-registry.csv';
        anchor.click();
        URL.revokeObjectURL(url);
    }

    return {
        dashboard,
        loading,
        errors,
        selectedStatus,
        selectedRoute,
        searchTerm,
        records,
        summary,
        availableRoutes,
        filteredRecords,
        fetchDashboard,
        setStatus,
        setRoute,
        setSearchTerm,
        changeStatus,
        exportCsv
    };
});

export default useAttendanceStore;