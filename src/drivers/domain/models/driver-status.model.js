/**
 * Enum-like constants for the Drivers bounded context.
 */

export const DriverStatus = Object.freeze({
    AVAILABLE: 'available',
    ON_ROUTE: 'onRoute',
    OFF_DUTY: 'offDuty',
    REVIEW: 'review'
});

export const DriverReviewPriority = Object.freeze({
    HIGH: 'high',
    MEDIUM: 'medium',
    LOW: 'low'
});

export const DriverShiftStatus = Object.freeze({
    COMPLETED: 'completed',
    ACTIVE: 'active',
    PENDING: 'pending'
});