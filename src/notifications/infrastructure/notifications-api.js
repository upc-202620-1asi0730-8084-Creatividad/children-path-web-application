import { BaseApi } from '../../shared/infrastructure/base-api.js';

const dashboardPath = import.meta.env.VITE_NOTIFICATIONS_DASHBOARD_ENDPOINT_PATH;

export class NotificationsApi extends BaseApi {
    getDashboard() {
        return this.http.get(dashboardPath);
    }

    resolveAlert(id) {
        const numericId = parseInt(id.replace('al-', ''), 10);
        return this.http.patch(`/Alerts/${numericId}/resolve`, {});
    }

    markAlertAsRead(id) {
        const numericId = parseInt(id.replace('al-', ''), 10);
        return this.http.patch(`/Alerts/${numericId}/read`, {});
    }
}