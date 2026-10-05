import { SubscriptionPlan } from '../entities/subscription-plan.entity.js';

/**
 * @typedef {Object} SubscriptionDashboard
 * @property {import('./current-subscription.model.js').CurrentSubscription} currentSubscription
 * @property {SubscriptionPlan[]} plans
 * @property {import('./payment-method.model.js').PaymentMethod[]} paymentMethods
 * @property {import('./billing-record.model.js').BillingRecord[]} billingHistory
 */

/**
 * Fallback dashboard used when the API is unavailable.
 * @returns {SubscriptionDashboard}
 */
export function fallbackSubscriptions() {
    return {
        currentSubscription: {
            id: 'sub-pro-2026',
            planName: 'Plan Pro',
            status: 'active',
            price: 799,
            currency: 'USD',
            interval: 'month',
            renewsOn: '2026-08-15',
            startedOn: '2026-01-15',
            contractOwner: 'MoviSafe Transport',
            billingEmail: 'operations@movisafe.pe',
            renewalMode: 'assisted',
            supportContact: 'billing@childrenpath.pe',
            planScope: 'Company fleet contract assigned by Children Path sales team',
            vehicleLimit: 10,
            studentLimit: 300,
            userLimit: null,
            vehiclesUsed: 8,
            studentsUsed: 248,
            usersUsed: 5
        },
        plans: [
            new SubscriptionPlan({
                id: 'starter',
                name: 'Starter',
                label: 'starter',
                price: 299,
                currency: 'USD',
                interval: 'month',
                target: 'starter',
                featured: false,
                actionType: 'upgrade',
                features: [
                    { text: 'vehicles5', included: true },
                    { text: 'students100', included: true },
                    { text: 'realtimeTracking', included: true },
                    { text: 'attendanceTracking', included: true },
                    { text: 'analyticsBasic', included: false },
                    { text: 'prioritySupport', included: false }
                ]
            }),
            new SubscriptionPlan({
                id: 'pro',
                name: 'Plan Pro',
                label: 'pro',
                price: 799,
                currency: 'USD',
                interval: 'month',
                target: 'pro',
                featured: true,
                actionType: 'current',
                features: [
                    { text: 'vehicles10', included: true },
                    { text: 'students300', included: true },
                    { text: 'realtimeTracking', included: true },
                    { text: 'attendanceTracking', included: true },
                    { text: 'analyticsBasic', included: true },
                    { text: 'prioritySupport', included: true }
                ]
            }),
            new SubscriptionPlan({
                id: 'enterprise',
                name: 'Enterprise',
                label: 'enterprise',
                price: null,
                currency: 'USD',
                interval: 'month',
                target: 'enterprise',
                featured: false,
                actionType: 'contact',
                features: [
                    { text: 'unlimitedVehicles', included: true },
                    { text: 'unlimitedStudents', included: true },
                    { text: 'realtimeTracking', included: true },
                    { text: 'attendanceTracking', included: true },
                    { text: 'analyticsAdvanced', included: true },
                    { text: 'dedicatedSupport', included: true }
                ]
            })
        ],
        paymentMethods: [
            { id: 'pm-visa', brand: 'visa', last4: '4521', holder: 'Ana Torres', expiresOn: '08/2027', primary: true },
            { id: 'pm-mastercard', brand: 'mastercard', last4: '8834', holder: 'Empresa ABC', expiresOn: '03/2026', primary: false }
        ],
        billingHistory: [
            { id: 'inv-001', date: '2026-07-15', description: 'Plan Pro — July 2026', amount: 799, currency: 'USD', method: 'Visa ••4521', status: 'paid', invoiceUrl: '#' },
            { id: 'inv-002', date: '2026-06-15', description: 'Plan Pro — June 2026', amount: 799, currency: 'USD', method: 'Visa ••4521', status: 'paid', invoiceUrl: '#' },
            { id: 'inv-003', date: '2026-05-15', description: 'Plan Pro — May 2026', amount: 799, currency: 'USD', method: 'Visa ••4521', status: 'paid', invoiceUrl: '#' },
            { id: 'inv-004', date: '2026-04-15', description: 'Plan Pro — April 2026', amount: 799, currency: 'USD', method: 'MC ••8834', status: 'paid', invoiceUrl: '#' }
        ]
    };
}