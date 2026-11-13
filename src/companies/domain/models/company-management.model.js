    /**
 * Domain models for the Companies bounded context.
 *
 * @typedef {'active'|'review'|'pending'|'suspended'} CompanyStatus
 * @typedef {'active'|'renewal'|'review'|'paused'} CompanyContractStatus
 * @typedef {'active'|'invited'|'inactive'} CompanyMemberStatus
 * @typedef {'completed'|'pending'|'review'} ComplianceStatus
 * @typedef {'low'|'medium'|'high'|'critical'} ComplianceSeverity
 * @typedef {'completed'|'active'|'pending'} CompanyActivityStatus
 *
 * @typedef {Object} CompanyProfile
 * @property {string} id
 * @property {string} legalName
 * @property {string} commercialName
 * @property {string} ruc
 * @property {CompanyStatus} status
 * @property {string} plan
 * @property {number} planLimitVehicles
 * @property {number} planLimitStudents
 * @property {string} adminName
 * @property {string} adminEmail
 * @property {string} phone
 * @property {string} address
 * @property {string[]} operatingDistricts
 * @property {boolean} verified
 * @property {string} licenseExpiration
 *
 * @typedef {Object} CompanySummary
 * @property {number} activeCompanies
 * @property {number} totalVehicles
 * @property {number} activeDrivers
 * @property {number} linkedSchools
 * @property {number} managedStudents
 * @property {number} complianceScore
 * @property {number} serviceQualityScore
 * @property {number} pendingReviews
 *
 * @typedef {Object} SchoolContract
 * @property {string} id
 * @property {string} schoolName
 * @property {string} district
 * @property {number} routeCount
 * @property {number} studentCount
 * @property {string} contactName
 * @property {string} renewalDate
 * @property {CompanyContractStatus} status
 * @property {number} score
 * @property {string} notes
 *
 * @typedef {Object} CompanyMember
 * @property {string} id
 * @property {string} name
 * @property {string} email
 * @property {string} role
 * @property {CompanyMemberStatus} status
 * @property {string} lastAccess
 * @property {string} scope
 *
 * @typedef {Object} ComplianceItem
 * @property {string} id
 * @property {string} title
 * @property {string} category
 * @property {string} owner
 * @property {string} dueDate
 * @property {ComplianceStatus} status
 * @property {ComplianceSeverity} severity
 * @property {string} description
 *
 * @typedef {Object} CompanyActivity
 * @property {string} id
 * @property {string} time
 * @property {string} title
 * @property {string} description
 * @property {CompanyActivityStatus} status
 *
 * @typedef {Object} CompanyManagementDashboard
 * @property {CompanyProfile} profile
 * @property {CompanySummary} summary
 * @property {SchoolContract[]} contracts
 * @property {CompanyMember[]} members
 * @property {ComplianceItem[]} complianceItems
 * @property {CompanyActivity[]} activities
 */

export const CompanyStatus = Object.freeze({
    ACTIVE: 'active',
    REVIEW: 'review',
    PENDING: 'pending',
    SUSPENDED: 'suspended'
});

export const CompanyContractStatus = Object.freeze({
    ACTIVE: 'active',
    RENEWAL: 'renewal',
    REVIEW: 'review',
    PAUSED: 'paused'
});

export const CompanyMemberStatus = Object.freeze({
    ACTIVE: 'active',
    INVITED: 'invited',
    INACTIVE: 'inactive'
});

export const ComplianceStatus = Object.freeze({
    COMPLETED: 'completed',
    PENDING: 'pending',
    REVIEW: 'review'
});

/**
 * Baseline dashboard used as fallback when the API is unavailable.
 * @returns {Object}
 */
export function fallbackCompanyManagement() {
    return {
        profile: {
            id: 'cmp-001',
            legalName: 'MoviSafe School Transport S.A.C.',
            commercialName: 'Children Path Lima Norte',
            ruc: '20609876541',
            status: 'active',
            plan: 'Company Pro',
            planLimitVehicles: 30,
            planLimitStudents: 500,
            adminName: 'Dr. Maria Lopez',
            adminEmail: 'maria.lopez@childrenpath.pe',
            phone: '+51 987 654 321',
            address: 'Av. Javier Prado 1245, San Isidro, Lima',
            operatingDistricts: ['Miraflores', 'San Isidro', 'Surco', 'La Molina', 'San Borja'],
            verified: true,
            licenseExpiration: '2026-12-20'
        },
        summary: {
            activeCompanies: 1,
            totalVehicles: 25,
            activeDrivers: 18,
            linkedSchools: 6,
            managedStudents: 248,
            complianceScore: 94,
            serviceQualityScore: 93,
            pendingReviews: 3
        },
        contracts: [
            {
                id: 'school-001', schoolName: 'Lima Norte School', district: 'Miraflores',
                routeCount: 4, studentCount: 86, contactName: 'Rosa Arana',
                renewalDate: '2026-11-30', status: 'active', score: 97,
                notes: 'Priority contract with morning and afternoon coverage.'
            },
            {
                id: 'school-002', schoolName: 'Santa Maria School', district: 'San Isidro',
                routeCount: 3, studentCount: 71, contactName: 'Luis Mendoza',
                renewalDate: '2026-09-18', status: 'renewal', score: 89,
                notes: 'Renewal documents must be confirmed before the next billing cycle.'
            },
            {
                id: 'school-003', schoolName: 'Cambridge School', district: 'Surco',
                routeCount: 2, studentCount: 45, contactName: 'Diana Chávez',
                renewalDate: '2026-07-22', status: 'review', score: 82,
                notes: 'Route capacity needs review due to recurring pickup delays.'
            }
        ],
        members: [
            { id: 'member-001', name: 'Maria Lopez',  email: 'maria.lopez@childrenpath.pe',  role: 'Company Admin',         status: 'active',  lastAccess: 'Today, 8:12 AM',      scope: 'Full company management' },
            { id: 'member-002', name: 'Carlos Perez', email: 'carlos.perez@childrenpath.pe', role: 'Operations Coordinator', status: 'active',  lastAccess: 'Today, 7:50 AM',      scope: 'Routes, drivers and incidents' },
            { id: 'member-003', name: 'Andrea Rojas', email: 'andrea.rojas@childrenpath.pe', role: 'Fleet Supervisor',       status: 'active',  lastAccess: 'Yesterday, 6:40 PM', scope: 'Vehicles and maintenance' },
            { id: 'member-004', name: 'Luis Torres',  email: 'luis.torres@childrenpath.pe',  role: 'Company Driver',         status: 'invited', lastAccess: 'Pending invitation', scope: 'Assigned trips only' }
        ],
        complianceItems: [
            {
                id: 'cmp-review-001', title: 'Transport authorization renewal', category: 'Legal',
                owner: 'Company Admin', dueDate: '2026-07-18', status: 'pending', severity: 'high',
                description: 'Upload the updated municipal authorization for all active routes.'
            },
            {
                id: 'cmp-review-002', title: 'School contract evidence', category: 'Contracts',
                owner: 'Operations Coordinator', dueDate: '2026-07-25', status: 'review', severity: 'medium',
                description: 'Confirm signed contract evidence for Santa Maria School renewal.'
            },
            {
                id: 'cmp-review-003', title: 'Driver access audit', category: 'Security',
                owner: 'Company Admin', dueDate: '2026-08-02', status: 'completed', severity: 'low',
                description: 'Quarterly access validation completed for active drivers.'
            }
        ],
        activities: [
            { id: 'act-001', time: '8:15 AM', title: 'Company profile verified',           description: 'Business data and contact information were confirmed.',                    status: 'completed' },
            { id: 'act-002', time: '7:45 AM', title: 'School contract flagged for renewal', description: 'Santa Maria School requires contract evidence validation.',               status: 'pending' },
            { id: 'act-003', time: '7:20 AM', title: 'Operations team synchronized',       description: 'Fleet and route supervisors confirmed daily operating scope.',            status: 'active' }
        ]
    };
}