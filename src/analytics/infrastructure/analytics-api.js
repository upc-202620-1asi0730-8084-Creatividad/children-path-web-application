import { BaseApi } from '../../shared/infrastructure/base-api.js';

const dashboardPath = import.meta.env.VITE_ANALYTICS_DASHBOARD_ENDPOINT_PATH;

/**
 * Infrastructure gateway for Analytics bounded-context endpoints.
 *
 * @class AnalyticsApi
 * @extends BaseApi
 */

export class AnalyticsApi extends BaseApi {
    getDashboard() {
        return this.http.get(dashboardPath);
    }

    createReport(type, period) {
        return this.http.post('/Analytics/reports', { type, period });
    }
}