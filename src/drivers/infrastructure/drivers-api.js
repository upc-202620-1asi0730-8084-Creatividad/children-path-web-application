import { BaseApi } from '../../shared/infrastructure/base-api.js';

const summaryPath  = import.meta.env.VITE_DRIVERS_SUMMARY_ENDPOINT_PATH;
const driversPath  = import.meta.env.VITE_DRIVERS_ENDPOINT_PATH;
const reviewsPath  = import.meta.env.VITE_DRIVERS_REVIEWS_ENDPOINT_PATH;
const shiftsPath   = import.meta.env.VITE_DRIVERS_SHIFTS_ENDPOINT_PATH;

/**
 * Infrastructure gateway for Drivers bounded-context endpoints.
 *
 * @class DriversApi
 * @extends BaseApi
 */
export class DriversApi extends BaseApi {
    getSummary() {
        return this.http.get(summaryPath);
    }

    getDrivers() {
        return this.http.get(driversPath);
    }

    getReviews() {
        return this.http.get(reviewsPath);
    }

    getShifts() {
        return this.http.get(shiftsPath);
    }

    createDriver(resource) {
        return this.http.post(driversPath, resource);
    }

    updateDriver(id, resource) {
        return this.http.put(`${driversPath}/${id}`, resource);
    }

    deleteDriver(id) {
        return this.http.delete(`${driversPath}/${id}`);
    }
}