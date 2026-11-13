/**
 * Enum-like type definitions for the Fleet bounded context.
 */

export const FleetStatus = Object.freeze({
    AVAILABLE: 'available',
    ON_ROUTE: 'onRoute',
    MAINTENANCE: 'maintenance',
    INACTIVE: 'inactive'
});

export const FleetEnergyType = Object.freeze({
    GASOLINE: 'gasoline',
    DIESEL: 'diesel',
    HYBRID: 'hybrid',
    ELECTRIC: 'electric'
});

export const FleetOwnershipType = Object.freeze({
    COMPANY: 'company',
    INDEPENDENT: 'independent'
});