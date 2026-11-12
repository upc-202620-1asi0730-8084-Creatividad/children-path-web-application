import { BaseApi } from '../../shared/infrastructure/base-api.js';

const tripsPath = import.meta.env.VITE_TRIPS_ENDPOINT_PATH || '/Trips';
const dashboardPath = import.meta.env.VITE_TRIPS_DASHBOARD_ENDPOINT_PATH || '/tripDashboard';

/**
 * Infrastructure gateway for Trips bounded-context endpoints.
 *
 * @class TripsApi
 * @extends BaseApi
 */
export class TripsApi extends BaseApi {
    getDashboard() {
        return this.http.get(dashboardPath);
    }

    getRecords() {
        return this.http.get(tripsPath);
    }

    createTrip(resource) {
        return this.http.post(tripsPath, resource);
    }

    startTrip(id) {
        const numericId = typeof id === 'string' ? parseInt(id.replace(/\D/g, ''), 10) : id;
        return this.http.patch(`${tripsPath}/${numericId}/start`, {});
    }

    completeTrip(id) {
        const numericId = typeof id === 'string' ? parseInt(id.replace(/\D/g, ''), 10) : id;
        return this.http.patch(`${tripsPath}/${numericId}/complete`, {});
    }

    cancelTrip(id) {
        const numericId = typeof id === 'string' ? parseInt(id.replace(/\D/g, ''), 10) : id;
        return this.http.patch(`${tripsPath}/${numericId}/cancel`, {});
    }
}