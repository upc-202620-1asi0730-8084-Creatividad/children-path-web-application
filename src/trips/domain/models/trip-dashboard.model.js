import { Trip } from '../entities/trip.entity.js';

/**
 * @typedef {Object} TripDashboard
 * @property {import('./trip-summary.model.js').TripSummary} summary
 * @property {Trip[]} trips
 * @property {import('./trip-review.model.js').TripReview[]} reviews
 * @property {import('./trip-activity.model.js').TripActivity[]} activities
 */

/**
 * Fallback dashboard used when the API is unavailable.
 * @returns {TripDashboard}
 */
export function fallbackTrips() {
    return {
        summary: {
            totalTrips: 18,
            activeTrips: 5,
            scheduledTrips: 7,
            delayedTrips: 2,
            completedTrips: 11,
            serviceReliability: 93
        },
        trips: [
            new Trip({
                id: 'trip-001', code: 'TP-001',
                routeName: 'Miraflores School Route', vehiclePlate: 'KW-204', driverName: 'Carlos Pérez',
                school: 'Lima Norte School', district: 'Miraflores',
                shift: 'morning', status: 'in_progress',
                students: 16, capacity: 18,
                startTime: '06:45', estimatedEndTime: '07:45',
                nextStop: 'Calle Pino 42', completedStops: 5, totalStops: 8,
                progress: 62, averageSpeed: 31, attendanceRate: 98, incidents: 0,
                trackingStatus: 'enabled', validationMessage: 'Trip started and live tracking enabled.',
                updatedAt: 'Today, 7:45 AM'
            }),
            new Trip({
                id: 'trip-002', code: 'TP-002',
                routeName: 'San Isidro Morning Route', vehiclePlate: 'KW-118', driverName: 'María Gómez',
                school: 'Santa María School', district: 'San Isidro',
                shift: 'morning', status: 'delayed',
                students: 13, capacity: 15,
                startTime: '06:50', estimatedEndTime: '08:00',
                nextStop: 'Av. Robles 115', completedStops: 4, totalStops: 9,
                progress: 45, averageSpeed: 18, attendanceRate: 95, incidents: 1,
                trackingStatus: 'enabled', validationMessage: 'Delay of 8 minutes detected; guardian notified.',
                updatedAt: 'Today, 7:43 AM'
            }),
            new Trip({
                id: 'trip-003', code: 'TP-003',
                routeName: 'Surco Pickup Route', vehiclePlate: 'KW-076', driverName: 'Luis Torres',
                school: 'Cambridge School', district: 'Santiago de Surco',
                shift: 'morning', status: 'completed',
                students: 20, capacity: 22,
                startTime: '06:30', estimatedEndTime: '07:30', actualEndTime: '07:28',
                nextStop: '—', completedStops: 10, totalStops: 10,
                progress: 100, averageSpeed: 32, attendanceRate: 96, incidents: 0,
                trackingStatus: 'closed', validationMessage: 'Trip completed and operation history stored.',
                updatedAt: 'Today, 7:28 AM'
            }),
            new Trip({
                id: 'trip-004', code: 'TP-004',
                routeName: 'La Molina Afternoon Route', vehiclePlate: 'KW-311', driverName: 'Andrea Rojas',
                school: 'Newton College', district: 'La Molina',
                shift: 'afternoon', status: 'scheduled',
                students: 11, capacity: 17,
                startTime: '15:00', estimatedEndTime: '16:15',
                nextStop: 'Plaza Norte', completedStops: 0, totalStops: 8,
                progress: 0, averageSpeed: 0, attendanceRate: 0, incidents: 0,
                trackingStatus: 'ready', validationMessage: 'Trip ready for operational validation.',
                updatedAt: 'Today, 7:40 AM'
            })
        ],
        reviews: [
            {
                id: 'review-001', title: 'Delay follow-up required',
                description: 'San Isidro Morning Route exceeded the accepted delay threshold.',
                severity: 'high', tripCode: 'TP-002', dueDate: '2026-07-08'
            },
            {
                id: 'review-002', title: 'Attendance confirmation pending',
                description: 'Three students need boarding confirmation before trip closure.',
                severity: 'medium', tripCode: 'TP-001', dueDate: '2026-07-08'
            }
        ],
        activities: [
            { id: 'act-001', time: '7:45 AM', title: 'Live position synchronized',
                description: '5 active units reported valid GPS coordinates.', status: 'active' },
            { id: 'act-002', time: '7:43 AM', title: 'Delay detected',
                description: 'San Isidro Morning Route exceeded the expected ETA.', status: 'pending' },
            { id: 'act-003', time: '7:28 AM', title: 'Trip completed',
                description: 'Surco Pickup Route was completed with 100% of stops covered.', status: 'completed' }
        ]
    };
}