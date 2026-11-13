/**
 * Domain models for the Analytics bounded context.
 *
 * @typedef {'healthy'|'attention'|'risk'} MonitoringStatus
 * @typedef {'up'|'down'|'stable'} TrendDirection
 * @typedef {'fleet'|'trip'|'attendance'|'incident'|'route'|'service_quality'} AnalyticsReportType
 *
 * @typedef {Object} AnalyticsSummary
 * @property {number} totalTrips
 * @property {number} transportedStudents
 * @property {number} onTimeRate
 * @property {number} averageDelayMinutes
 * @property {number} attendanceRate
 * @property {number} serviceQualityScore
 * @property {number} fleetUsage
 * @property {number} incidentRate
 *
 * @typedef {Object} MonitoringMetric
 * @property {string} id
 * @property {string} label
 * @property {string} value
 * @property {string} helper
 * @property {string} icon
 * @property {MonitoringStatus} status
 * @property {TrendDirection} trend
 *
 * @typedef {Object} RoutePerformance
 * @property {string} id
 * @property {string} routeName
 * @property {string} district
 * @property {string} driverName
 * @property {string} vehiclePlate
 * @property {number} onTimeRate
 * @property {number} attendanceRate
 * @property {number} delayMinutes
 * @property {number} completedTrips
 * @property {number} incidentCount
 * @property {number} serviceScore
 * @property {MonitoringStatus} status
 *
 * @typedef {Object} AnalyticsInsight
 * @property {string} id
 * @property {string} title
 * @property {string} description
 * @property {'low'|'medium'|'high'} impact
 * @property {string} source
 * @property {string} action
 *
 * @typedef {Object} TrendPoint
 * @property {string} label
 * @property {number} onTimeRate
 * @property {number} attendanceRate
 * @property {number} delayMinutes
 *
 * @typedef {Object} AnalyticsReport
 * @property {string} id
 * @property {AnalyticsReportType} type
 * @property {string} title
 * @property {string} period
 * @property {string} generatedAt
 * @property {string} owner
 * @property {'ready'|'scheduled'|'review'} status
 * @property {number} records
 *
 * @typedef {Object} AnalyticsActivity
 * @property {string} id
 * @property {string} time
 * @property {string} title
 * @property {string} description
 * @property {MonitoringStatus} status
 *
 * @typedef {Object} AnalyticsDashboard
 * @property {AnalyticsSummary} summary
 * @property {MonitoringMetric[]} monitoringMetrics
 * @property {RoutePerformance[]} routes
 * @property {AnalyticsInsight[]} insights
 * @property {TrendPoint[]} trend
 * @property {AnalyticsReport[]} reports
 * @property {AnalyticsActivity[]} activities
 * @property {string} lastUpdated
 */

export const MonitoringStatus = Object.freeze({
    HEALTHY: 'healthy',
    ATTENTION: 'attention',
    RISK: 'risk'
});

export const AnalyticsReportType = Object.freeze({
    FLEET: 'fleet',
    TRIP: 'trip',
    ATTENDANCE: 'attendance',
    INCIDENT: 'incident',
    ROUTE: 'route',
    SERVICE_QUALITY: 'service_quality'
});

export const TrendDirection = Object.freeze({
    UP: 'up',
    DOWN: 'down',
    STABLE: 'stable'
});