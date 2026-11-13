import { Driver } from '../domain/entities/driver.entity.js';

/**
 * Maps driver resources from the API into Driver domain entities.
 *
 * @class DriverAssembler
 */
export class DriverAssembler {
    static toEntityFromResource(resource) {
        return new Driver({ ...resource });
    }

    static toEntitiesFromResponse(response) {
        if (response.status !== 200) {
            console.error(`${response.status}, ${response.statusText}`);
            return [];
        }
        const data = response.data;
        const resources = Array.isArray(data) ? data : (data['drivers'] ?? []);
        return resources.map((resource) => this.toEntityFromResource(resource));
    }

    static toResourceFromEntity(entity) {
        return { ...entity };
    }
}