/**
 * Enum-like constants for the Trips bounded context.
 */

export const TripStatus = Object.freeze({
    SCHEDULED: 'scheduled',
    IN_PROGRESS: 'in_progress',
    DELAYED: 'delayed',
    COMPLETED: 'completed',
    CANCELED: 'canceled'
});

export const TripShift = Object.freeze({
    MORNING: 'morning',
    AFTERNOON: 'afternoon',
    RETURN: 'return'
});

export const TrackingStatus = Object.freeze({
    READY: 'ready',
    ENABLED: 'enabled',
    CLOSED: 'closed',
    BLOCKED: 'blocked'
});