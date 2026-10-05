/**
 * Enum-like constants for the Students bounded context.
 */

export const StudentStatus = Object.freeze({
    ACTIVE: 'active',
    UNASSIGNED: 'unassigned',
    REVIEW: 'review',
    INACTIVE: 'inactive'
});

export const AuthorizationStatus = Object.freeze({
    VERIFIED: 'verified',
    PENDING: 'pending',
    EXPIRED: 'expired'
});

export const LastAttendanceStatus = Object.freeze({
    BOARDED: 'boarded',
    DROPPED_OFF: 'droppedOff',
    ABSENT: 'absent',
    PENDING: 'pending'
});