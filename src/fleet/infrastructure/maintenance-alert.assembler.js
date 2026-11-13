/**
 * Maps maintenance alert resources from the API into plain model objects.
 *
 * @class MaintenanceAlertAssembler
 */
export class MaintenanceAlertAssembler {
    static toEntityFromResource(resource) {
        return { ...resource };
    }

    static toEntitiesFromResponse(response) {
        if (response.status !== 200) {
            console.error(`${response.status}, ${response.statusText}`);
            return [];
        }
        const resources = response.data instanceof Array ? response.data : response.data['fleetMaintenanceAlerts'] ?? [];
        return resources.map((resource) => this.toEntityFromResource(resource));
    }
}