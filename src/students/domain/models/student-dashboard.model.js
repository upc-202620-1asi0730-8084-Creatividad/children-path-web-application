import { Student } from '../entities/student.entity.js';

/**
 * @typedef {Object} StudentDashboard
 * @property {import('./student-summary.model.js').StudentSummary} summary
 * @property {Student[]} students
 * @property {import('./student-review.model.js').StudentReview[]} reviews
 * @property {import('./student-activity.model.js').StudentActivity[]} activities
 */

/**
 * Fallback dashboard used when the API is unavailable.
 * @returns {StudentDashboard}
 */
export function fallbackStudents() {
    return {
        summary: {
            totalStudents: 248,
            activeStudents: 236,
            assignedStudents: 226,
            unassignedStudents: 22,
            guardianVerified: 94,
            attendanceReliability: 96.8
        },
        students: [
            new Student({
                id: 'student-001', code: 'ST-001', firstName: 'María', lastName: 'Vega',
                grade: '4th Grade', school: 'Lima Norte School',
                guardianName: 'María López', guardianPhone: '+51 951 111 222', guardianEmail: 'maria.lopez@example.com',
                emergencyContact: '+51 999 111 222',
                routeName: 'Miraflores School Route', routeCode: 'RT-001',
                assignedVehicle: 'KW-204', assignedDriver: 'Carlos Pérez',
                pickupPoint: 'Calle Pino 42', dropOffPoint: 'Lima Norte School gate A',
                pickupWindow: '06:45 - 06:55',
                authorizationStatus: 'verified', attendanceRate: 98,
                lastAttendanceStatus: 'boarded', status: 'active',
                notes: 'Guardian prefers SMS confirmation before pickup.'
            }),
            new Student({
                id: 'student-002', code: 'ST-002', firstName: 'Diego', lastName: 'Ruiz',
                grade: '5th Grade', school: 'Santa María School',
                guardianName: 'Juan Ruiz', guardianPhone: '+51 953 333 444', guardianEmail: 'juan.ruiz@example.com',
                emergencyContact: '+51 999 333 444',
                routeName: 'San Isidro Morning Route', routeCode: 'RT-002',
                assignedVehicle: 'KW-118', assignedDriver: 'María Gómez',
                pickupPoint: 'Av. Robles 115', dropOffPoint: 'Santa María School main entrance',
                pickupWindow: '06:50 - 07:00',
                authorizationStatus: 'verified', attendanceRate: 95,
                lastAttendanceStatus: 'droppedOff', status: 'active',
                notes: 'Student requires drop-off confirmation to guardian.'
            }),
            new Student({
                id: 'student-003', code: 'ST-003', firstName: 'Valeria', lastName: 'Cruz',
                grade: '1st Secondary', school: 'Cambridge School',
                guardianName: 'Elena Cruz', guardianPhone: '+51 955 555 666', guardianEmail: 'elena.cruz@example.com',
                emergencyContact: '+51 999 555 666',
                routeName: null, routeCode: null, assignedVehicle: null, assignedDriver: null,
                pickupPoint: null, dropOffPoint: 'Cambridge School entrance', pickupWindow: null,
                authorizationStatus: 'pending', attendanceRate: 0,
                lastAttendanceStatus: 'pending', status: 'unassigned',
                notes: 'Pickup point is pending validation before assigning a route.'
            }),
            new Student({
                id: 'student-004', code: 'ST-004', firstName: 'Mateo', lastName: 'Lara',
                grade: '2nd Grade', school: 'Lima Norte School',
                guardianName: 'Rosa Lara', guardianPhone: '+51 957 778 888', guardianEmail: 'rosa.lara@example.com',
                emergencyContact: '+51 999 778 888',
                routeName: 'Miraflores School Route', routeCode: 'RT-001',
                assignedVehicle: 'KW-204', assignedDriver: 'Carlos Pérez',
                pickupPoint: 'Plaza Norte', dropOffPoint: 'Lima Norte School gate A',
                pickupWindow: '06:35 - 06:45',
                authorizationStatus: 'verified', attendanceRate: 92,
                lastAttendanceStatus: 'boarded', status: 'active',
                notes: 'Sibling travels in the same route.'
            }),
            new Student({
                id: 'student-005', code: 'ST-005', firstName: 'Ana', lastName: 'Méndez',
                grade: '4th Grade', school: 'Santa María School',
                guardianName: 'Carlos Méndez', guardianPhone: '+51 959 999 000', guardianEmail: 'carlos.mendez@example.com',
                emergencyContact: '+51 999 999 000',
                routeName: 'San Isidro Morning Route', routeCode: 'RT-002',
                assignedVehicle: 'KW-118', assignedDriver: 'María Gómez',
                pickupPoint: 'Col. Las Flores', dropOffPoint: 'Santa María School main entrance',
                pickupWindow: '06:55 - 07:05',
                authorizationStatus: 'verified', attendanceRate: 97,
                lastAttendanceStatus: 'boarded', status: 'active',
                notes: 'Guardian requested proximity notifications.'
            })
        ],
        reviews: [
            {
                id: 'student-review-001', studentCode: 'ST-003', studentName: 'Valeria Cruz',
                title: 'Pickup point validation pending',
                description: 'The student has no confirmed pickup point and cannot be assigned to a route yet.',
                dueDate: '2026-07-08', priority: 'high'
            }
        ],
        activities: [
            {
                id: 'student-act-001', time: '7:08 AM', title: 'Boarding confirmed',
                description: 'María Vega boarded vehicle KW-204 at Calle Pino 42.',
                studentName: 'María Vega', status: 'completed'
            },
            {
                id: 'student-act-002', time: '7:18 AM', title: 'Guardian notification sent',
                description: 'A boarding confirmation was sent to Juan Ruiz.',
                studentName: 'Diego Ruiz', status: 'active'
            },
            {
                id: 'student-act-003', time: '8:02 AM', title: 'Assignment review required',
                description: 'Valeria Cruz is still pending route assignment.',
                studentName: 'Valeria Cruz', status: 'pending'
            }
        ]
    };
}
