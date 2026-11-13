import { BaseApi } from '../../shared/infrastructure/base-api.js';

const dashboardPath = import.meta.env.VITE_INCIDENTS_DASHBOARD_ENDPOINT_PATH;

/**
 * Infrastructure gateway for Incidents bounded-context endpoints.
 *
 * @class IncidentsApi
 * @extends BaseApi
 */
export class IncidentsApi extends BaseApi {
    getDashboard() {
        return this.http.get(dashboardPath);
    }
}