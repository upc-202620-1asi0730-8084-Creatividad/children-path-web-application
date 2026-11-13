/**
 * Domain models for the Dashboard bounded context.
 *
 * @typedef {'operator'|'company'|'admin'} DashboardRole
 * @typedef {'on-route'|'delayed'|'stopped'|'emergency'|'available'} VehicleStatus
 * @typedef {'delay'|'deviation'|'incident'|'emergency'|'attendance'|'system'} AlertType
 * @typedef {'low'|'medium'|'high'|'critical'} AlertPriority
 * @typedef {'up'|'down'|'stable'} TrendDirection
 *
 * @typedef {Object} DashboardMetric
 * @property {string} id
 * @property {string} icon
 * @property {string} value
 * @property {string} labelKey
 * @property {string} helperKey
 * @property {string} [trend]
 * @property {TrendDirection} [trendDirection]
 *
 * @typedef {Object} Vehicle
 * @property {string} id
 * @property {string} plate
 * @property {string} driverName
 * @property {number} lat
 * @property {number} lng
 * @property {VehicleStatus} status
 * @property {string} route
 * @property {number} students
 * @property {number} etaMinutes
 * @property {string} lastUpdate
 *
 * @typedef {Object} DashboardAlert
 * @property {number} id
 * @property {AlertType} type
 * @property {AlertPriority} priority
 * @property {string} title
 * @property {string} message
 * @property {string} timestamp
 * @property {boolean} read
 * @property {string} [relatedVehicle]
 *
 * @typedef {Object} OperationItem
 * @property {string} id
 * @property {string} label
 * @property {string} value
 * @property {string} helper
 * @property {number} progress
 * @property {string} icon
 *
 * @typedef {Object} DashboardActivity
 * @property {string} id
 * @property {string} time
 * @property {string} title
 * @property {string} description
 * @property {'completed'|'in-progress'|'warning'} status
 *
 * @typedef {Object} DashboardOverview
 * @property {DashboardRole} role
 * @property {string} titleKey
 * @property {string} subtitleKey
 * @property {string} heroValue
 * @property {string} heroLabelKey
 * @property {DashboardMetric[]} metrics
 * @property {Vehicle[]} vehicles
 * @property {DashboardAlert[]} alerts
 * @property {OperationItem[]} operationItems
 * @property {DashboardActivity[]} activities
 */

export const DashboardRole = Object.freeze({
    OPERATOR: 'operator',
    COMPANY: 'company',
    ADMIN: 'admin'
});

// ---- Base data ----

const baseVehicles = [
    {
        id: 'kw-204', plate: 'KW-204', driverName: 'Carlos Pérez',
        lat: -12.0464, lng: -77.0428, status: 'on-route',
        route: 'Miraflores School Route', students: 18, etaMinutes: 7, lastUpdate: '2 min ago'
    },
    {
        id: 'kw-118', plate: 'KW-118', driverName: 'María Gómez',
        lat: -12.0931, lng: -77.0465, status: 'delayed',
        route: 'San Isidro Morning Route', students: 21, etaMinutes: 12, lastUpdate: '1 min ago'
    },
    {
        id: 'kw-076', plate: 'KW-076', driverName: 'Luis Torres',
        lat: -12.0712, lng: -77.0308, status: 'stopped',
        route: 'Surco Pickup Route', students: 14, etaMinutes: 4, lastUpdate: '4 min ago'
    }
];

const baseAlerts = [
    {
        id: 1, type: 'delay', priority: 'high',
        title: 'Route delay detected',
        message: 'Vehicle KW-118 is 8 minutes behind schedule on San Isidro Morning Route.',
        timestamp: 'Today, 7:45 AM', read: false, relatedVehicle: 'KW-118'
    },
    {
        id: 2, type: 'attendance', priority: 'medium',
        title: 'Attendance confirmation pending',
        message: 'Three students still require boarding confirmation before route closure.',
        timestamp: 'Today, 7:39 AM', read: false
    },
    {
        id: 3, type: 'incident', priority: 'critical',
        title: 'Minor incident follow-up',
        message: 'An incident report from KW-204 requires company admin review.',
        timestamp: 'Today, 7:26 AM', read: true, relatedVehicle: 'KW-204'
    }
];

const operationItems = [
    { id: 'attendance', label: 'Attendance reliability', value: '96.8%', helper: '184 students already confirmed', progress: 96.8, icon: 'fact_check' },
    { id: 'fleet',      label: 'Fleet availability',     value: '88%',   helper: '22 of 25 vehicles ready',        progress: 88,   icon: 'directions_bus' },
    { id: 'coverage',   label: 'Route coverage',         value: '92%',   helper: 'Most planned stops covered',     progress: 92,   icon: 'alt_route' }
];

/**
 * Fallback views per role, used when the API is unavailable.
 * @type {Record<DashboardRole, DashboardOverview>}
 */
export const fallbackViews = {
    operator: {
        role: 'operator',
        titleKey: 'dashboardPage.roles.operator.title',
        subtitleKey: 'dashboardPage.roles.operator.subtitle',
        heroValue: '1',
        heroLabelKey: 'dashboardPage.hero.operator',
        metrics: [
            { id: 'trips',      icon: 'route',               value: '1',   labelKey: 'dashboardPage.metrics.activeTrips',    helperKey: 'dashboardPage.helpers.operatorTrips', trend: '+1',   trendDirection: 'up' },
            { id: 'students',   icon: 'school',              value: '18',  labelKey: 'dashboardPage.metrics.studentsOnBoard', helperKey: 'dashboardPage.helpers.students',      trend: 'stable', trendDirection: 'stable' },
            { id: 'alerts',     icon: 'notifications_active', value: '1',   labelKey: 'dashboardPage.metrics.openAlerts',     helperKey: 'dashboardPage.helpers.alerts',        trend: '-1',   trendDirection: 'down' },
            { id: 'attendance', icon: 'fact_check',          value: '98%', labelKey: 'dashboardPage.metrics.attendanceRate', helperKey: 'dashboardPage.helpers.attendance',    trend: '+2%',  trendDirection: 'up' }
        ],
        vehicles: [baseVehicles[0]],
        alerts: [baseAlerts[1]],
        operationItems: operationItems.slice(0, 2),
        activities: [
            { id: 'a1', time: '7:18 AM', title: 'Route started', description: 'Miraflores School Route started on time.', status: 'completed' },
            { id: 'a2', time: '7:34 AM', title: 'Boarding updated', description: '18 students marked as boarded.', status: 'completed' },
            { id: 'a3', time: '7:42 AM', title: 'Next stop approaching', description: 'Estimated arrival in 7 minutes.', status: 'in-progress' }
        ]
    },
    company: {
        role: 'company',
        titleKey: 'dashboardPage.roles.company.title',
        subtitleKey: 'dashboardPage.roles.company.subtitle',
        heroValue: '96.8%',
        heroLabelKey: 'dashboardPage.hero.company',
        metrics: [
            { id: 'trips',      icon: 'route',                value: '12',    labelKey: 'dashboardPage.metrics.activeTrips',     helperKey: 'dashboardPage.helpers.activeTrips',  trend: '+3',    trendDirection: 'up' },
            { id: 'students',   icon: 'school',               value: '184',   labelKey: 'dashboardPage.metrics.studentsOnBoard', helperKey: 'dashboardPage.helpers.students',     trend: '+24',   trendDirection: 'up' },
            { id: 'alerts',     icon: 'notifications_active', value: '4',     labelKey: 'dashboardPage.metrics.openAlerts',      helperKey: 'dashboardPage.helpers.alerts',       trend: '-2',    trendDirection: 'down' },
            { id: 'attendance', icon: 'fact_check',           value: '96.8%', labelKey: 'dashboardPage.metrics.attendanceRate',  helperKey: 'dashboardPage.helpers.attendance',   trend: '+1.4%', trendDirection: 'up' },
            { id: 'fleet',      icon: 'directions_bus',       value: '88%',   labelKey: 'dashboardPage.metrics.fleetAvailability', helperKey: 'dashboardPage.helpers.fleet',      trend: 'stable', trendDirection: 'stable' },
            { id: 'coverage',   icon: 'alt_route',            value: '92%',   labelKey: 'dashboardPage.metrics.routeCoverage',   helperKey: 'dashboardPage.helpers.coverage',     trend: '+4%',   trendDirection: 'up' }
        ],
        vehicles: baseVehicles,
        alerts: baseAlerts,
        operationItems,
        activities: [
            { id: 'a1', time: '7:10 AM', title: 'Morning dispatch completed', description: '12 routes started with assigned drivers and vehicles.', status: 'completed' },
            { id: 'a2', time: '7:31 AM', title: 'Attendance updated', description: '184 students confirmed on board across active trips.', status: 'completed' },
            { id: 'a3', time: '7:45 AM', title: 'Delay requires attention', description: 'KW-118 is behind schedule and needs follow-up.', status: 'warning' }
        ]
    },
    admin: {
        role: 'admin',
        titleKey: 'dashboardPage.roles.admin.title',
        subtitleKey: 'dashboardPage.roles.admin.subtitle',
        heroValue: '24',
        heroLabelKey: 'dashboardPage.hero.admin',
        metrics: [
            { id: 'companies', icon: 'business',             value: '24',    labelKey: 'dashboardPage.metrics.activeCompanies', helperKey: 'dashboardPage.helpers.companies',     trend: '+2',    trendDirection: 'up' },
            { id: 'trips',     icon: 'route',                value: '138',   labelKey: 'dashboardPage.metrics.platformTrips',   helperKey: 'dashboardPage.helpers.platformTrips', trend: '+18',   trendDirection: 'up' },
            { id: 'alerts',    icon: 'notifications_active', value: '17',    labelKey: 'dashboardPage.metrics.openAlerts',      helperKey: 'dashboardPage.helpers.alerts',        trend: '-5',    trendDirection: 'down' },
            { id: 'service',   icon: 'verified',             value: '97.2%', labelKey: 'dashboardPage.metrics.serviceHealth',   helperKey: 'dashboardPage.helpers.serviceHealth', trend: '+0.8%', trendDirection: 'up' }
        ],
        vehicles: [
            ...baseVehicles,
            { ...baseVehicles[0], id: 'kw-401', plate: 'KW-401', driverName: 'External Operator', lat: -12.11, lng: -77.02, route: 'Platform Route Review', students: 16, etaMinutes: 9 }
        ],
        alerts: [
            ...baseAlerts,
            { id: 4, type: 'system', priority: 'medium', title: 'Company subscription review', message: 'One company is close to its plan vehicle limit.', timestamp: 'Today, 7:12 AM', read: false }
        ],
        operationItems: [
            { id: 'health',    label: 'Service health',             value: '97.2%', helper: 'Platform services operating normally',    progress: 97.2, icon: 'verified' },
            { id: 'companies', label: 'Active companies',           value: '24',    helper: '2 new companies this month',              progress: 86,   icon: 'business' },
            { id: 'incidents', label: 'Critical incident follow-up', value: '91%',  helper: 'Most incidents reviewed within SLA',       progress: 91,   icon: 'report' }
        ],
        activities: [
            { id: 'a1', time: '7:05 AM', title: 'Platform synchronization completed', description: 'Latest operational summaries were updated.', status: 'completed' },
            { id: 'a2', time: '7:22 AM', title: 'Company review pending', description: 'MoviSafe Transport has one open incident follow-up.', status: 'warning' },
            { id: 'a3', time: '7:40 AM', title: 'Global KPI refreshed', description: 'Dashboard metrics recalculated for active companies.', status: 'completed' }
        ]
    }
};

/**
 * Returns the fallback dashboard for the given role.
 * @param {DashboardRole} role
 * @returns {DashboardOverview}
 */
export function getFallbackOverview(role) {
    return fallbackViews[role] ?? fallbackViews.company;
}