/**
 * Enum-like constants for the Routes bounded context.
 */

export const RouteStatus = Object.freeze({
    ACTIVE: 'active',
    SCHEDULED: 'scheduled',
    REVIEW: 'review',
    INACTIVE: 'inactive'
});

export const RouteReviewPriority = Object.freeze({
    HIGH: 'high',
    MEDIUM: 'medium',
    LOW: 'low'
});