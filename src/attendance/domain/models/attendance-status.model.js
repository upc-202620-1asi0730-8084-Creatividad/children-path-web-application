/**
 * Enum-like constants for the Attendance bounded context.
 */

export const AttendanceStatus = Object.freeze({
    WAITING: 'waiting',
    ON_BOARD: 'on_board',
    ARRIVED: 'arrived',
    ABSENT: 'absent',
    PENDING_CONFIRMATION: 'pending_confirmation'
});

/**
 * @typedef {'all'} AttendanceAllFilter
 * @typedef {AttendanceStatus | 'all'} AttendanceStatusFilter
 */