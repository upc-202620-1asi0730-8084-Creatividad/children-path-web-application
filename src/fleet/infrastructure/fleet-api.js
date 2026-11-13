import { BaseApi } from '../../shared/infrastructure/base-api.js';

const summaryPath  = import.meta.env.VITE_FLEET_SUMMARY_ENDPOINT_PATH;
const vehiclesPath = import.meta.env.VITE_FLEET_VEHICLES_ENDPOINT_PATH;
const alertsPath   = import.meta.env.VITE_FLEET_MAINTENANCE_ALERTS_ENDPOINT_PATH;

/**
 * Infrastructure gateway for Fleet bounded-context endpoints.
 *
 * @class FleetApi
 * @extends BaseApi
 */
export class FleetApi extends BaseApi {
    getSummary() {
        return this.http.get(summaryPath);
    }

    getVehicles() {
        return this.http.get(vehiclesPath);
    }

    getMaintenanceAlerts() {
        return this.http.get(alertsPath);
    }

    createVehicle(resource) {
        return this.http.post(vehiclesPath, resource);
    }

    updateVehicle(id, resource) {
        return this.http.put(`${vehiclesPath}/${id}`, resource);
    }

    deleteVehicle(id) {
        return this.http.delete(`${vehiclesPath}/${id}`);
    }
}