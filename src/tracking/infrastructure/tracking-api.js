import { BaseApi } from '../../shared/infrastructure/base-api.js';

const dashboardPath = import.meta.env.VITE_TRACKING_DASHBOARD_ENDPOINT_PATH;

/**
 * Infrastructure gateway for Tracking bounded-context endpoints.
 *
 * @class TrackingApi
 * @extends BaseApi
 */
export class TrackingApi extends BaseApi {
    getDashboard() {
        return this.http.get(dashboardPath);
    }
}