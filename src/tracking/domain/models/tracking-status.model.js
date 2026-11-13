/**
 * Enum-like constants for the Tracking bounded context.
 */

export const TrackingStatus = Object.freeze({
    ON_ROUTE: 'on-route',
    DELAYED: 'delayed',
    STOPPED: 'stopped',
    OFFLINE: 'offline'
});

export const TrackingAlertType = Object.freeze({
    DELAY: 'delay',
    DEVIATION: 'deviation',
    SIGNAL: 'signal',
    ARRIVAL: 'arrival'
});

export const TrackingAlertSeverity = Object.freeze({
    HIGH: 'high',
    MEDIUM: 'medium',
    LOW: 'low'
});