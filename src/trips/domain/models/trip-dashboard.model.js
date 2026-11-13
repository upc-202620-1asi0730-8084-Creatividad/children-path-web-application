import { Trip } from '../entities/trip.entity.js';

/**
 * @typedef {Object} TripDashboard
 * @property {import('./trip-summary.model.js').TripSummary} summary
 * @property {Trip[]} trips
 * @property {import('./trip-review.model.js').TripReview[]} reviews
 * @property {import('./trip-activity.model.js').TripActivity[]} activities
 */

/**
 * Fallback dashboard used when the API is unavailable.
 * @returns {TripDashboard}
 */
/**
 * Empty initial state before backend fetch completes.
 */
export function emptyTripsDashboard() {
    return {
        summary: {
            totalTrips: 0,
            activeTrips: 0,
            scheduledTrips: 0,
            delayedTrips: 0,
            completedTrips: 0,
            serviceReliability: 100
        },
        trips: [],
        reviews: [],
        activities: []
    };
}

/**
 * Fallback dashboard used when the API is unavailable.
 */
export function fallbackTrips() {
    return emptyTripsDashboard();
}