import { defineStore } from 'pinia';
import { computed, ref } from 'vue';
import { StudentsApi } from '../infrastructure/students-api.js';
import { StudentAssembler } from '../infrastructure/student.assembler.js';
import { fallbackStudents } from '../domain/models/student-dashboard.model.js';
import { Student } from '../domain/entities/student.entity.js';

const studentsApi = new StudentsApi();

const useStudentsStore = defineStore('students', () => {
    // ---- State ----
    const dashboard = ref(fallbackStudents());
    const loading = ref(false);
    const errors = ref([]);

    // Filters
    const searchTerm = ref('');
    const selectedStatus = ref('all');

    // ---- Computed ----
    const students = computed(() => dashboard.value.students);

    const filteredStudents = computed(() => {
        const query = searchTerm.value.trim().toLowerCase();
        const status = selectedStatus.value;

        return students.value.filter((student) => {
            const matchesStatus = status === 'all' || student.status === status;
            const matchesSearch =
                !query ||
                [
                    student.code,
                    student.firstName,
                    student.lastName,
                    student.grade,
                    student.school,
                    student.guardianName,
                    student.routeName ?? '',
                    student.assignedVehicle ?? '',
                    student.assignedDriver ?? '',
                    student.pickupPoint ?? ''
                ].join(' ').toLowerCase().includes(query);
            return matchesStatus && matchesSearch;
        });
    });

    // ---- Actions ----
    async function fetchDashboard() {
        loading.value = true;
        try {
            const [summaryRes, studentsRes, reviewsRes, activitiesRes] = await Promise.all([
                studentsApi.getSummary(),
                studentsApi.getStudents(),
                studentsApi.getReviews(),
                studentsApi.getActivities()
            ]);

            dashboard.value = {
                summary: summaryRes.data,
                students: StudentAssembler.toEntitiesFromResponse(studentsRes),
                reviews: reviewsRes.data,
                activities: activitiesRes.data
            };
            errors.value = [];
        } catch (error) {
            dashboard.value = fallbackStudents();
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

    async function createStudent(entity) {
        try {
            const resource = StudentAssembler.toResourceFromEntity(entity);
            const response = await studentsApi.createStudent(resource);
            const created = StudentAssembler.toEntityFromResource(response.data);
            setStudents([created, ...students.value]);
            return created;
        } catch (error) {
            setStudents([entity, ...students.value]);
            errors.value.push(error);
            return entity;
        }
    }

    async function updateStudent(entity) {
        try {
            const resource = StudentAssembler.toResourceFromEntity(entity);
            const response = await studentsApi.updateStudent(entity.id, resource);
            const updated = StudentAssembler.toEntityFromResource(response.data);
            setStudents(students.value.map((s) => (s.id === entity.id ? updated : s)));
            return updated;
        } catch (error) {
            setStudents(students.value.map((s) => (s.id === entity.id ? entity : s)));
            errors.value.push(error);
            return entity;
        }
    }

    async function deleteStudent(id) {
        try {
            await studentsApi.deleteStudent(id);
        } catch (error) {
            // Ignore
        }
        setStudents(students.value.filter((s) => s.id !== id));
    }

    function setStudents(list) {
        dashboard.value = {
            ...dashboard.value,
            summary: calculateSummary(list),
            students: list
        };
    }

    function calculateSummary(list) {
        const totalStudents = list.length;
        const activeStudents = list.filter((s) => s.status === 'active').length;
        const assignedStudents = list.filter((s) => Boolean(s.routeName)).length;
        const unassignedStudents = list.filter((s) => !s.routeName || s.status === 'unassigned').length;
        const guardianVerified = totalStudents
            ? Math.round((list.filter((s) => s.authorizationStatus === 'verified').length / totalStudents) * 100)
            : 0;
        const attendanceReliability = totalStudents
            ? Math.round(list.reduce((sum, s) => sum + s.attendanceRate, 0) / totalStudents)
            : 0;

        return {
            totalStudents,
            activeStudents,
            assignedStudents,
            unassignedStudents,
            guardianVerified,
            attendanceReliability
        };
    }

    function exportCsv(list) {
        const header = ['Code', 'Student', 'Grade', 'Guardian', 'School', 'Route', 'Status', 'Attendance'];
        const rows = list.map((s) => [
            s.code,
            `${s.firstName} ${s.lastName}`,
            s.grade,
            s.guardianName,
            s.school,
            s.routeName ?? 'Unassigned',
            s.status,
            `${s.attendanceRate}%`
        ]);
        const csv = [header, ...rows]
            .map((row) => row.map((cell) => `"${String(cell).replace(/"/g, '""')}"`).join(','))
            .join('\n');
        const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const anchor = document.createElement('a');
        anchor.href = url;
        anchor.download = 'children-path-student-registry.csv';
        anchor.click();
        URL.revokeObjectURL(url);
    }

    function statusIcon(status) {
        const icons = {
            all: 'groups',
            active: 'verified_user',
            unassigned: 'route',
            review: 'manage_search',
            inactive: 'block'
        };
        return icons[status] ?? 'school';
    }

    return {
        // state
        dashboard,
        loading,
        errors,
        searchTerm,
        selectedStatus,
        // computed
        students,
        filteredStudents,
        // actions
        fetchDashboard,
        setSearchTerm,
        setStatus,
        createStudent,
        updateStudent,
        deleteStudent,
        exportCsv,
        statusIcon
    };
});

export default useStudentsStore;