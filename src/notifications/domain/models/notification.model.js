/**
 * Domain models for the Notifications bounded context.
 *
 * @typedef {'alert'|'notification'} NotificationCategory
 * @typedef {'delay'|'attendance'|'incident'|'route'|'payment'|'system'|'safety'|'maintenance'} NotificationType
 * @typedef {'critical'|'high'|'medium'|'low'} NotificationPriority
 * @typedef {'new'|'read'|'acknowledged'} NotificationStatus
 *
 * @typedef {Object} NotificationItem
 * @property {string} id
 * @property {NotificationCategory} category
 * @property {NotificationType} type
 * @property {NotificationPriority} priority
 * @property {NotificationStatus} status
 * @property {string} title
 * @property {string} message
 * @property {string} time
 * @property {string} date
 * @property {string} sourceBc
 * @property {string} recipientRole
 * @property {string} [routeName]
 * @property {string} [vehiclePlate]
 * @property {string} [studentName]
 * @property {string} [actionLabel]
 *
 * @typedef {Object} NotificationActivity
 * @property {string} id
 * @property {string} time
 * @property {string} title
 * @property {string} description
 * @property {'completed'|'active'|'pending'} status
 *
 * @typedef {Object} NotificationSummary
 * @property {number} total
 * @property {number} unread
 * @property {number} criticalAlerts
 * @property {number} deliveryRate
 * @property {number} acknowledged
 *
 * @typedef {Object} NotificationCenterDashboard
 * @property {NotificationSummary} summary
 * @property {NotificationItem[]} items
 * @property {NotificationActivity[]} activities
 */

export const NotificationCategory = Object.freeze({
    ALERT: 'alert',
    NOTIFICATION: 'notification'
});

export const NotificationType = Object.freeze({
    DELAY: 'delay',
    ATTENDANCE: 'attendance',
    INCIDENT: 'incident',
    ROUTE: 'route',
    PAYMENT: 'payment',
    SYSTEM: 'system',
    SAFETY: 'safety',
    MAINTENANCE: 'maintenance'
});

export const NotificationPriority = Object.freeze({
    CRITICAL: 'critical',
    HIGH: 'high',
    MEDIUM: 'medium',
    LOW: 'low'
});

export const NotificationStatus = Object.freeze({
    NEW: 'new',
    READ: 'read',
    ACKNOWLEDGED: 'acknowledged'
});

/**
 * Fallback dashboard used when the API is unavailable.
 * @returns {NotificationCenterDashboard}
 */
export function fallbackNotifications() {
    const items = [
        {
            id: 'al-001', category: 'alert', type: 'delay', priority: 'high', status: 'new',
            title: 'Route delay detected',
            message: 'Vehicle KW-118 is 8 minutes behind schedule on San Isidro Morning Route.',
            time: '7:45 AM', date: 'Today', sourceBc: 'Trip Management',
            recipientRole: 'Company Admin', routeName: 'San Isidro Morning Route',
            vehiclePlate: 'KW-118', actionLabel: 'Review delay'
        },
        {
            id: 'nt-001', category: 'notification', type: 'attendance', priority: 'medium', status: 'new',
            title: 'Boarding summary ready',
            message: 'Morning attendance was updated for all active routes.',
            time: '7:39 AM', date: 'Today', sourceBc: 'Attendance Tracking',
            recipientRole: 'Company Admin', routeName: 'All morning routes',
            actionLabel: 'Open summary'
        },
        {
            id: 'al-002', category: 'alert', type: 'incident', priority: 'critical', status: 'read',
            title: 'Minor incident follow-up',
            message: 'A minor incident report from KW-204 requires company admin review.',
            time: '7:26 AM', date: 'Today', sourceBc: 'Incident Management',
            recipientRole: 'Company Admin', routeName: 'Miraflores School Route',
            vehiclePlate: 'KW-204', actionLabel: 'Review incident'
        },
        {
            id: 'nt-002', category: 'notification', type: 'route', priority: 'low', status: 'acknowledged',
            title: 'Route checkpoint updated',
            message: 'San Isidro Morning Route confirmed the second checkpoint near Javier Prado.',
            time: '7:12 AM', date: 'Today', sourceBc: 'Route Management',
            recipientRole: 'Company Admin', routeName: 'San Isidro Morning Route',
            vehiclePlate: 'KW-118', actionLabel: 'View route'
        },
        {
            id: 'al-003', category: 'alert', type: 'safety', priority: 'medium', status: 'new',
            title: 'Speed threshold warning',
            message: 'KW-076 reported a short speed deviation near a school zone.',
            time: '7:04 AM', date: 'Today', sourceBc: 'Real-Time Tracking',
            recipientRole: 'Company Admin', routeName: 'Surco Pickup Route',
            vehiclePlate: 'KW-076', actionLabel: 'Check tracking'
        },
        {
            id: 'nt-003', category: 'notification', type: 'payment', priority: 'low', status: 'read',
            title: 'Invoice generated',
            message: 'The July subscription invoice is available in Billing & Plans.',
            time: '6:50 AM', date: 'Today', sourceBc: 'Subscription & Payments',
            recipientRole: 'Company Admin', actionLabel: 'Open invoice'
        }
    ];

    return {
        summary: summaryFrom(items),
        items,
        activities: [
            { id: 'act-001', time: '7:45 AM', title: 'Delay alert generated', description: 'KW-118 was marked as delayed after ETA recalculation.', status: 'active' },
            { id: 'act-002', time: '7:39 AM', title: 'Attendance notification sent', description: 'Boarding summary was sent to company administrators.', status: 'completed' },
            { id: 'act-003', time: '7:26 AM', title: 'Incident follow-up requested', description: 'KW-204 incident was escalated for operational review.', status: 'pending' }
        ]
    };
}

/**
 * Builds a summary from a list of notification items.
 * @param {NotificationItem[]} items
 * @returns {NotificationSummary}
 */
export function summaryFrom(items) {
    const unread = items.filter((i) => i.status === 'new').length;
    const criticalAlerts = items.filter((i) => i.category === 'alert' && i.priority === 'critical').length;
    const acknowledged = items.filter((i) => i.status === 'acknowledged').length;

    return {
        total: items.length,
        unread,
        criticalAlerts,
        deliveryRate: 98.4,
        acknowledged
    };
}
