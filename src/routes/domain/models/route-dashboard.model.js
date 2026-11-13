import { SchoolRoute } from '../entities/school-route.entity.js';

/**
 * @typedef {Object} RouteDashboard
 * @property {import('./route-summary.model.js').RouteSummary} summary
 * @property {SchoolRoute[]} routes
 * @property {import('./route-review.model.js').RouteReview[]} reviews
 * @property {import('./route-activity.model.js').RouteActivity[]} activities
 */

/**
 * Fallback dashboard used when the API is unavailable.
 * @returns {RouteDashboard}
 */
export function fallbackRoutes() {
    return {
        summary: {
            totalRoutes: 18,
            activeRoutes: 14,
            scheduledStops: 126,
            districtsCovered: 9,
            routeCoverage: 92,
            optimizationScore: 87
        },
        routes: [
            new SchoolRoute({
                id: 'route-001',
                code: 'RT-001',
                name: 'Miraflores School Route',
                district: 'Miraflores',
                school: 'Lima Norte School',
                scheduleLabel: 'Morning service',
                startTime: '06:45',
                endTime: '07:45',
                assignedDriver: 'Carlos Pérez',
                assignedVehicle: 'KW-204',
                assignedStudents: 16,
                vehicleCapacity: 18,
                stops: 12,
                coveragePercentage: 96,
                optimizationScore: 94,
                estimatedDuration: '58 min',
                status: 'active',
                nextServiceAt: '2026-07-06T06:45:00',
                lastOptimizedAt: '2026-07-04',
                needsOptimization: false,
                color: '#1b83c9',
                coordinates: [
                    { lat: -12.1195, lng: -77.0308 },
                    { lat: -12.1178, lng: -77.0288 },
                    { lat: -12.1156, lng: -77.0265 },
                    { lat: -12.1130, lng: -77.0240 },
                    { lat: -12.1105, lng: -77.0215 },
                    { lat: -12.1080, lng: -77.0190 },
                    { lat: -12.1055, lng: -77.0165 }
                ],
                schoolCoordinates: { lat: -12.1055, lng: -77.0165 },
                checkpoints: [
                    { name: 'Calle Pino 42', lat: -12.1195, lng: -77.0308, type: 'pickup' },
                    { name: 'Av. Pardo', lat: -12.1156, lng: -77.0265, type: 'checkpoint' },
                    { name: 'Óvalo Gutierrez', lat: -12.1105, lng: -77.0215, type: 'checkpoint' },
                    { name: 'Lima Norte School', lat: -12.1055, lng: -77.0165, type: 'school' }
                ]
            }),
            new SchoolRoute({
                id: 'route-002',
                code: 'RT-002',
                name: 'San Isidro Morning Route',
                district: 'San Isidro',
                school: 'Santa María School',
                scheduleLabel: 'Morning service',
                startTime: '06:50',
                endTime: '07:55',
                assignedDriver: 'María Gómez',
                assignedVehicle: 'KW-118',
                assignedStudents: 13,
                vehicleCapacity: 15,
                stops: 10,
                coveragePercentage: 91,
                optimizationScore: 88,
                estimatedDuration: '64 min',
                status: 'scheduled',
                nextServiceAt: '2026-07-06T06:50:00',
                lastOptimizedAt: '2026-07-03',
                needsOptimization: false,
                color: '#7c3aed',
                coordinates: [
                    { lat: -12.0975, lng: -77.0365 },
                    { lat: -12.0940, lng: -77.0335 },
                    { lat: -12.0905, lng: -77.0305 },
                    { lat: -12.0870, lng: -77.0275 },
                    { lat: -12.0835, lng: -77.0245 },
                    { lat: -12.0800, lng: -77.0215 }
                ],
                schoolCoordinates: { lat: -12.0800, lng: -77.0215 },
                checkpoints: [
                    { name: 'Av. Robles 115', lat: -12.0975, lng: -77.0365, type: 'pickup' },
                    { name: 'Javier Prado', lat: -12.0905, lng: -77.0305, type: 'checkpoint' },
                    { name: 'Av. Salaverry', lat: -12.0870, lng: -77.0275, type: 'checkpoint' },
                    { name: 'Santa María School', lat: -12.0800, lng: -77.0215, type: 'school' }
                ]
            }),
            new SchoolRoute({
                id: 'route-003',
                code: 'RT-003',
                name: 'Surco Pickup Route',
                district: 'Santiago de Surco',
                school: 'Cambridge School',
                scheduleLabel: 'Morning service',
                startTime: '06:35',
                endTime: '07:50',
                assignedDriver: 'Luis Torres',
                assignedVehicle: 'KW-076',
                assignedStudents: 20,
                vehicleCapacity: 22,
                stops: 15,
                coveragePercentage: 84,
                optimizationScore: 76,
                estimatedDuration: '75 min',
                status: 'review',
                nextServiceAt: '2026-07-06T06:35:00',
                lastOptimizedAt: '2026-06-28',
                needsOptimization: true,
                color: '#f59e0b',
                coordinates: [
                    { lat: -12.1461, lng: -76.9961 },
                    { lat: -12.1420, lng: -77.0010 },
                    { lat: -12.1378, lng: -77.0060 },
                    { lat: -12.1336, lng: -77.0110 },
                    { lat: -12.1294, lng: -77.0160 },
                    { lat: -12.1252, lng: -77.0210 },
                    { lat: -12.1210, lng: -77.0260 }
                ],
                schoolCoordinates: { lat: -12.1210, lng: -77.0260 },
                checkpoints: [
                    { name: 'Caminos del Inca', lat: -12.1461, lng: -76.9961, type: 'pickup' },
                    { name: 'Benavides', lat: -12.1378, lng: -77.0060, type: 'checkpoint' },
                    { name: 'Cambridge School', lat: -12.1210, lng: -77.0260, type: 'school' }
                ]
            }),
            new SchoolRoute({
                id: 'route-004',
                code: 'RT-004',
                name: 'La Molina Afternoon Route',
                district: 'La Molina',
                school: 'Newton College',
                scheduleLabel: 'Afternoon return',
                startTime: '15:10',
                endTime: '16:15',
                assignedDriver: 'Andrea Rojas',
                assignedVehicle: 'KW-311',
                assignedStudents: 11,
                vehicleCapacity: 17,
                stops: 9,
                coveragePercentage: 94,
                optimizationScore: 91,
                estimatedDuration: '62 min',
                status: 'active',
                nextServiceAt: '2026-07-05T15:10:00',
                lastOptimizedAt: '2026-07-02',
                needsOptimization: false,
                color: '#10b981',
                coordinates: [
                    { lat: -12.0792, lng: -76.9451 },
                    { lat: -12.0760, lng: -76.9520 },
                    { lat: -12.0728, lng: -76.9590 },
                    { lat: -12.0696, lng: -76.9660 },
                    { lat: -12.0664, lng: -76.9730 }
                ],
                schoolCoordinates: { lat: -12.0664, lng: -76.9730 },
                checkpoints: [
                    { name: 'Av. La Molina', lat: -12.0792, lng: -76.9451, type: 'pickup' },
                    { name: 'Molicentro', lat: -12.0728, lng: -76.9590, type: 'checkpoint' },
                    { name: 'Newton College', lat: -12.0664, lng: -76.9730, type: 'school' }
                ]
            })
        ],

        reviews: [
            {
                id: 'route-rev-001', routeCode: 'RT-003', routeName: 'Surco Pickup Route',
                title: 'Route optimization required',
                description: 'The route has exceeded the expected duration during the last three services.',
                dueDate: '2026-07-08', priority: 'high'
            },
            {
                id: 'route-rev-002', routeCode: 'RT-002', routeName: 'San Isidro Morning Route',
                title: 'Stop sequence review',
                description: 'Two stops can be reordered to reduce waiting time and fuel consumption.',
                dueDate: '2026-07-12', priority: 'medium'
            }
        ],
        activities: [
            { id: 'route-act-001', time: '6:45 AM', title: 'Route dispatch confirmed',
                description: 'RT-001 started with 16 assigned students and vehicle KW-204.',
                routeName: 'Miraflores School Route', status: 'completed' },
            { id: 'route-act-002', time: '7:12 AM', title: 'Coverage checkpoint updated',
                description: 'RT-002 confirmed the second checkpoint near Javier Prado.',
                routeName: 'San Isidro Morning Route', status: 'active' },
            { id: 'route-act-003', time: '8:05 AM', title: 'Optimization suggestion generated',
                description: 'RT-003 requires review due to accumulated delays and additional stops.',
                routeName: 'Surco Pickup Route', status: 'pending' }
        ]
    };
}