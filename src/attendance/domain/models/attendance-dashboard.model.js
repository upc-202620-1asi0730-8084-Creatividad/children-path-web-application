import { AttendanceRecord } from '../entities/attendance-record.entity.js';

/**
 * @typedef {Object} AttendanceDashboard
 * @property {import('./attendance-summary.model.js').AttendanceSummary} summary
 * @property {AttendanceRecord[]} records
 * @property {import('./attendance-activity.model.js').AttendanceActivity[]} activities
 */

/**
 * Fallback dashboard used when the API is unavailable.
 * @returns {Object}
 */
export function fallbackAttendanceDashboard() {
    return {
        summary: {
            totalAssigned: 12,
            onBoard: 4,
            arrived: 5,
            waiting: 2,
            absent: 1,
            pendingConfirmation: 0,
            attendanceReliability: 91.7
        },
        records: [
            new AttendanceRecord({
                id: 'ATT-001', studentCode: 'ST-001', studentName: 'María Vega', grade: '4th Grade',
                routeName: 'Miraflores School Route', vehiclePlate: 'KW-204', driverName: 'Carlos Pérez',
                pickupPoint: 'Calle Pino 42', school: 'Colegio San Agustín',
                estimatedArrival: '07:15', checkInTime: '06:52', dropOffTime: '07:14',
                status: 'arrived', reliability: 98, lastEvent: 'Drop-off confirmed',
                guardianName: 'María López', notes: 'Student arrived safely at school.'
            }),
            new AttendanceRecord({
                id: 'ATT-002', studentCode: 'ST-002', studentName: 'Diego Ruiz', grade: '5th Grade',
                routeName: 'San Isidro Morning Route', vehiclePlate: 'KW-118', driverName: 'María Gómez',
                pickupPoint: 'Av. Robles 115', school: 'Colegio Reina de los Ángeles',
                estimatedArrival: '07:25', checkInTime: '07:02', dropOffTime: '07:24',
                status: 'arrived', reliability: 95, lastEvent: 'Drop-off confirmed',
                guardianName: 'Juan Ruiz', notes: 'On-time arrival.'
            }),
            new AttendanceRecord({
                id: 'ATT-003', studentCode: 'ST-003', studentName: 'Valeria Cruz', grade: '1st Secondary',
                routeName: 'Surco Pickup Route', vehiclePlate: 'KW-076', driverName: 'Luis Torres',
                pickupPoint: 'Javier Prado checkpoint', school: 'Colegio Markham',
                estimatedArrival: '07:40', checkInTime: '07:10', dropOffTime: null,
                status: 'on_board', reliability: 82, lastEvent: 'Boarding confirmed',
                guardianName: 'Elena Cruz', notes: 'Vehicle en route to school.'
            }),
            new AttendanceRecord({
                id: 'ATT-004', studentCode: 'ST-004', studentName: 'Mateo Lara', grade: '2nd Grade',
                routeName: 'Miraflores School Route', vehiclePlate: 'KW-204', driverName: 'Carlos Pérez',
                pickupPoint: 'Plaza Norte', school: 'Colegio San Agustín',
                estimatedArrival: '07:20', checkInTime: null, dropOffTime: null,
                status: 'waiting', reliability: 90, lastEvent: 'Awaiting pickup',
                guardianName: 'Rosa Lara', notes: 'Guardian confirmed student will board.'
            }),
            new AttendanceRecord({
                id: 'ATT-005', studentCode: 'ST-005', studentName: 'Ana Méndez', grade: '4th Grade',
                routeName: 'San Isidro Morning Route', vehiclePlate: 'KW-118', driverName: 'María Gómez',
                pickupPoint: 'Col. Las Flores', school: 'Colegio Reina de los Ángeles',
                estimatedArrival: '07:25', checkInTime: null, dropOffTime: null,
                status: 'absent', reliability: 0, lastEvent: 'Absence registered',
                guardianName: 'Carlos Méndez', notes: 'Guardian notified about absence.'
            })
        ],
        activities: [
            {
                id: 'AA-001', time: '07:14', title: 'Drop-off confirmed',
                description: 'María Vega arrived at Colegio San Agustín.', status: 'completed'
            },
            {
                id: 'AA-002', time: '07:10', title: 'Boarding confirmed',
                description: 'Valeria Cruz boarded vehicle KW-076.', status: 'completed'
            },
            {
                id: 'AA-003', time: '07:02', title: 'Drop-off confirmed',
                description: 'Diego Ruiz arrived at Colegio Reina de los Ángeles.', status: 'completed'
            }
        ]
    };
}