import { Vehicle } from '../domain/entities/vehicle.entity.js';

/**
 * Maps vehicle resources from the API into Vehicle domain entities.
 *
 * @class VehicleAssembler
 */
export class VehicleAssembler {
    static toEntityFromResource(resource) {
        return new Vehicle({ ...resource });
    }

    static toEntitiesFromResponse(response) {
        if (response.status !== 200) {
            console.error(`${response.status}, ${response.statusText}`);
            return [];
        }
        const resources = response.data instanceof Array ? response.data : response.data['fleetVehicles'] ?? [];
        return resources.map((resource) => this.toEntityFromResource(resource));
    }

    static toResourceFromEntity(entity) {
        return { ...entity };
    }
}