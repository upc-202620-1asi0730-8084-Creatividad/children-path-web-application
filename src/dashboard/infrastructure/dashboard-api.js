import { BaseApi } from '../../shared/infrastructure/base-api.js';

const dashboardViewsPath = import.meta.env.VITE_DASHBOARD_VIEWS_ENDPOINT_PATH;

/**
 * Infrastructure gateway for Dashboard bounded-context endpoints.
 *
 * @class DashboardApi
 * @extends BaseApi
 */
export class DashboardApi extends BaseApi {
    /**
     * Fetches the dashboard overview for a specific role.
     * @param {string} role
     * @returns {Promise<import('axios').AxiosResponse>}
     */
    getOverview(role) {
        return this.http.get(`${dashboardViewsPath}?role=${role}`);
    }
}