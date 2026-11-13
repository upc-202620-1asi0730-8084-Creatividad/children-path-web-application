import { Driver } from '../entities/driver.entity.js';

/**
 * Aggregate representing the full Drivers dashboard view.
 *
 * @typedef {Object} DriverDashboard
 * @property {import('./driver-summary.model.js').DriverSummary} summary
 * @property {Driver[]} drivers
 * @property {import('./driver-review.model.js').DriverReview[]} reviews
 * @property {import('./driver-shift.model.js').DriverShift[]} shifts
 */

/**
 * Baseline dashboard used as fallback when the API is unavailable.
 * @returns {Object}
 */
export function fallbackDriverDashboard() {
    return {
        summary: {
            totalDrivers: 18,
            availableDrivers: 14,
            onRouteDrivers: 9,
            pendingReviews: 3,
            licenseCompliance: 94,
            averageSafetyScore: 91
        },
        drivers: [
            new Driver({
                id: 'drv-001', code: 'DRV-001', fullName: 'Carlos Pérez', photoInitials: 'CP',
                licenseNumber: 'AIIb-458721', licenseClass: 'A-IIb', licenseExpiresAt: '2027-04-15',
                phone: '+51 987 221 104', email: 'carlos.perez@childrenpath.pe',
                assignedVehicle: 'KW-204', assignedRoute: 'Miraflores School Route',
                status: 'onRoute', availabilityLabel: 'Morning route active',
                tripsToday: 2, studentsAssigned: 16, safetyScore: 96, punctualityScore: 92,
                lastCheckIn: '2026-07-05T07:10:00', documentsValid: true, yearsOfExperience: 8
            }),
            new Driver({
                id: 'drv-002', code: 'DRV-002', fullName: 'María Gómez', photoInitials: 'MG',
                licenseNumber: 'AIIb-884213', licenseClass: 'A-IIb', licenseExpiresAt: '2026-12-02',
                phone: '+51 955 420 771', email: 'maria.gomez@childrenpath.pe',
                assignedVehicle: 'KW-118', assignedRoute: 'San Isidro Morning Route',
                status: 'available', availabilityLabel: 'Ready for next assignment',
                tripsToday: 1, studentsAssigned: 13, safetyScore: 94, punctualityScore: 89,
                lastCheckIn: '2026-07-05T07:32:00', documentsValid: true, yearsOfExperience: 6
            }),
            new Driver({
                id: 'drv-003', code: 'DRV-003', fullName: 'Luis Torres', photoInitials: 'LT',
                licenseNumber: 'AIIIc-321908', licenseClass: 'A-IIIc', licenseExpiresAt: '2026-08-18',
                phone: '+51 940 118 300', email: 'luis.torres@childrenpath.pe',
                assignedVehicle: 'KW-076', assignedRoute: 'Surco Pickup Route',
                status: 'review', availabilityLabel: 'Document review pending',
                tripsToday: 0, studentsAssigned: 20, safetyScore: 78, punctualityScore: 84,
                lastCheckIn: '2026-07-04T18:20:00', documentsValid: false, yearsOfExperience: 10
            }),
            new Driver({
                id: 'drv-004', code: 'DRV-004', fullName: 'Andrea Rojas', photoInitials: 'AR',
                licenseNumber: 'AIIb-675410', licenseClass: 'A-IIb', licenseExpiresAt: '2028-02-27',
                phone: '+51 922 540 961', email: 'andrea.rojas@childrenpath.pe',
                assignedVehicle: 'KW-311', assignedRoute: 'La Molina Afternoon Route',
                status: 'available', availabilityLabel: 'Afternoon route available',
                tripsToday: 1, studentsAssigned: 11, safetyScore: 98, punctualityScore: 95,
                lastCheckIn: '2026-07-05T08:05:00', documentsValid: true, yearsOfExperience: 5
            })
        ],
        reviews: [
            {
                id: 'rev-001', driverCode: 'DRV-003', driverName: 'Luis Torres',
                title: 'License document review',
                description: 'Administrative validation is required before assigning new routes.',
                dueDate: '2026-07-09', priority: 'high'
            },
            {
                id: 'rev-002', driverCode: 'DRV-002', driverName: 'María Gómez',
                title: 'Annual safety refresh',
                description: 'Schedule the annual safety training checkpoint for the driver profile.',
                dueDate: '2026-07-16', priority: 'medium'
            }
        ],
        shifts: [
            {
                id: 'shift-001', time: '7:10 AM', title: 'Morning dispatch confirmed',
                description: 'Carlos Pérez started the Miraflores School Route with vehicle KW-204.',
                driverName: 'Carlos Pérez', status: 'completed'
            },
            {
                id: 'shift-002', time: '7:32 AM', title: 'Driver availability updated',
                description: 'María Gómez is available for the next route assignment.',
                driverName: 'María Gómez', status: 'active'
            },
            {
                id: 'shift-003', time: '8:05 AM', title: 'Afternoon route prepared',
                description: 'Andrea Rojas confirmed route readiness for La Molina Afternoon Route.',
                driverName: 'Andrea Rojas', status: 'pending'
            }
        ]
    };
}