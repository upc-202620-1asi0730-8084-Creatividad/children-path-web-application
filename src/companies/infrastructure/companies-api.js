import { BaseApi } from '../../shared/infrastructure/base-api.js';

const dashboardPath = import.meta.env.VITE_COMPANIES_DASHBOARD_ENDPOINT_PATH;

/**
 * Infrastructure gateway for Companies bounded-context endpoints.
 *
 * @class CompaniesApi
 * @extends BaseApi
 */
export class CompaniesApi extends BaseApi {
    getDashboard() {
        return this.http.get(dashboardPath);
    }
}