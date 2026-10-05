/**
 * @typedef {Object} CurrentSubscription
 * @property {string} id
 * @property {string} planName
 * @property {'active'|'pending'|'expired'|'cancelled'} status
 * @property {number} price
 * @property {string} currency
 * @property {string} interval
 * @property {string} renewsOn
 * @property {number} vehicleLimit
 * @property {number} studentLimit
 * @property {number|null} userLimit
 * @property {number} vehiclesUsed
 * @property {number} studentsUsed
 * @property {number} usersUsed
 * @property {string} [startedOn]
 * @property {string} [contractOwner]
 * @property {string} [billingEmail]
 * @property {'automatic'|'manual'|'assisted'} [renewalMode]
 * @property {string} [supportContact]
 * @property {string} [planScope]
 */
export {};