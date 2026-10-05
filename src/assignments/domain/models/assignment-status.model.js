/**
 * Enum-like constants for the Assignments bounded context.
 */

export const AssignmentStatus = Object.freeze({
    VALIDATED: 'validated',
    PENDING: 'pending',
    CONFLICT: 'conflict',
    INACTIVE: 'inactive'
});

export const AssignmentShift = Object.freeze({
    MORNING: 'morning',
    AFTERNOON: 'afternoon'
});

export const AssignmentValidation = Object.freeze({
    READY: 'ready',
    CAPACITY_RISK: 'capacity-risk',
    SCHEDULE_CONFLICT: 'schedule-conflict',
    MISSING_ROUTE: 'missing-route',
    INACTIVE: 'inactive'
});