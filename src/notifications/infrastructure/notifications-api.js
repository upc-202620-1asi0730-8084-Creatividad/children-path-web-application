import { BaseApi } from '../../shared/infrastructure/base-api.js';

const dashboardPath = import.meta.env.VITE_NOTIFICATIONS_DASHBOARD_ENDPOINT_PATH;

/**
 * Infrastructure gateway for Notifications bounded-context endpoints.
 *
 * @class NotificationsApi
 * @extends BaseApi
 */
export class NotificationsApi extends BaseApi {
    getDashboard() {
        return this.http.get(dashboardPath);
    }
}
