import { TrackingVehicle } from '../entities/tracking-vehicle.entity.js';

/**
 * @typedef {Object} TrackingDashboard
 * @property {import('./tracking-summary.model.js').TrackingSummary} summary
 * @property {TrackingVehicle[]} vehicles
 * @property {import('./tracking-alert.model.js').TrackingAlert[]} alerts
 * @property {import('./tracking-activity.model.js').TrackingActivity[]} activities
 */

/**
 * Fallback dashboard used when the API is unavailable.
 * @returns {TrackingDashboard}
 */
export function fallbackTracking() {
    return {
        summary: {
            activeUnits: 12,
            delayedUnits: 2,
            averageSpeed: 32.8,
            routeProgress: 76,
            gpsSignal: 98,
            activeAlerts: 3
        },
        vehicles: [
            new TrackingVehicle({
                id: 'trk-001', vehicleId: 'KW-204', plate: 'B7K-204', driverName: 'Carlos Pérez',
                routeName: 'Miraflores School Route', schoolName: 'Lima Norte School',
                district: 'Miraflores', status: 'on-route',
                latitude: -12.1195, longitude: -77.0308,
                speedKmh: 31.4, etaMinutes: 7, progressPercent: 84, signalStrength: 99,
                studentCount: 16, nextStop: 'Calle Pino 42', deviationMeters: 0,
                lastUpdate: 'Today, 7:45 AM'
            }),
            new TrackingVehicle({
                id: 'trk-002', vehicleId: 'KW-118', plate: 'D4M-118', driverName: 'María Gómez',
                routeName: 'San Isidro Morning Route', schoolName: 'Santa Maria School',
                district: 'San Isidro', status: 'delayed',
                latitude: -12.0968, longitude: -77.0312,
                speedKmh: 18.6, etaMinutes: 12, progressPercent: 61, signalStrength: 96,
                studentCount: 13, nextStop: 'Av. Robles 115', deviationMeters: 180,
                lastUpdate: 'Today, 7:43 AM'
            }),
            new TrackingVehicle({
                id: 'trk-003', vehicleId: 'KW-076', plate: 'F1P-076', driverName: 'Luis Torres',
                routeName: 'Surco Pickup Route', schoolName: 'Cambridge School',
                district: 'Santiago de Surco', status: 'stopped',
                latitude: -12.1358, longitude: -76.9932,
                speedKmh: 0, etaMinutes: 4, progressPercent: 72, signalStrength: 92,
                studentCount: 20, nextStop: 'Javier Prado checkpoint', deviationMeters: 45,
                lastUpdate: 'Today, 7:42 AM'
            }),
            new TrackingVehicle({
                id: 'trk-004', vehicleId: 'KW-311', plate: 'H8R-311', driverName: 'Andrea Rojas',
                routeName: 'La Molina Afternoon Route', schoolName: 'Newton College',
                district: 'La Molina', status: 'on-route',
                latitude: -12.0812, longitude: -76.9469,
                speedKmh: 34.1, etaMinutes: 9, progressPercent: 48, signalStrength: 97,
                studentCount: 11, nextStop: 'Plaza Norte', deviationMeters: 0,
                lastUpdate: 'Today, 7:40 AM'
            })
        ],
        alerts: [
            { id: 'ta-001', type: 'delay', title: 'Route delay detected',
                description: 'KW-118 is 8 minutes behind schedule near San Isidro.',
                severity: 'high', vehicleId: 'KW-118', time: '7:45 AM' },
            { id: 'ta-002', type: 'deviation', title: 'Possible route deviation',
                description: 'KW-076 reported a short stop outside the expected path.',
                severity: 'medium', vehicleId: 'KW-076', time: '7:41 AM' },
            { id: 'ta-003', type: 'arrival', title: 'Next stop approaching',
                description: 'KW-204 will arrive at Calle Pino 42 in approximately 7 minutes.',
                severity: 'low', vehicleId: 'KW-204', time: '7:39 AM' }
        ],
        activities: [
            { id: 'tac-001', time: '7:45 AM', title: 'Live position synchronized',
                description: '12 active units reported valid GPS coordinates.', status: 'active' },
            { id: 'tac-002', time: '7:43 AM', title: 'Delay alert generated',
                description: 'The system flagged KW-118 as delayed after ETA recalculation.', status: 'pending' },
            { id: 'tac-003', time: '7:40 AM', title: 'Route progress updated',
                description: 'Average trip progress reached 76% across active morning routes.', status: 'completed' }
        ]
    };
}