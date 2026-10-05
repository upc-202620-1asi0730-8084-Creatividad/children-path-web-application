import { BaseApi } from '../../shared/infrastructure/base-api.js';

const dashboardPath = import.meta.env.VITE_ATTENDANCE_DASHBOARD_ENDPOINT_PATH;
const recordsPath   = import.meta.env.VITE_ATTENDANCE_RECORDS_ENDPOINT_PATH;

/**
 * Infrastructure gateway for Attendance bounded-context endpoints.
 *
 * @class AttendanceApi
 * @extends BaseApi
 */
export class AttendanceApi extends BaseApi {
    getDashboard() {
        return this.http.get(dashboardPath);
    }

    getRecords() {
        return this.http.get(recordsPath);
    }

    updateRecord(id, resource) {
        return this.http.put(`${recordsPath}/${id}`, resource);
    }
}