import { BaseApi } from '../../shared/infrastructure/base-api.js';

const dashboardPath = import.meta.env.VITE_ASSIGNMENT_DASHBOARD_ENDPOINT_PATH;
const recordsPath   = import.meta.env.VITE_ASSIGNMENT_RECORDS_ENDPOINT_PATH;

/**
 * Infrastructure gateway for Assignments bounded-context endpoints.
 *
 * @class AssignmentApi
 * @extends BaseApi
 */
export class AssignmentApi extends BaseApi {
    getDashboard() {
        return this.http.get(dashboardPath);
    }

    getRecords() {
        return this.http.get(recordsPath);
    }

    createAssignment(resource) {
        return this.http.post(recordsPath, resource);
    }

    updateAssignment(id, resource) {
        return this.http.put(`${recordsPath}/${id}`, resource);
    }

    deleteAssignment(id) {
        return this.http.delete(`${recordsPath}/${id}`);
    }
}