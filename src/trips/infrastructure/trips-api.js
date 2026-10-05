import { BaseApi } from '../../shared/infrastructure/base-api.js';

const dashboardPath = import.meta.env.VITE_TRIPS_DASHBOARD_ENDPOINT_PATH;
const recordsPath   = import.meta.env.VITE_TRIPS_RECORDS_ENDPOINT_PATH;

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
        return this.http.get(recordsPath);
    }

    createTrip(resource) {
        return this.http.post(recordsPath, resource);
    }

    updateTrip(id, resource) {
        return this.http.put(`${recordsPath}/${id}`, resource);
    }

    deleteTrip(id) {
        return this.http.delete(`${recordsPath}/${id}`);
    }
}