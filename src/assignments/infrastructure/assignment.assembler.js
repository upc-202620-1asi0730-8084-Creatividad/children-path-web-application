import { Assignment } from '../domain/entities/assignment.entity.js';

/**
 * Maps assignment resources from the API into Assignment domain entities.
 *
 * @class AssignmentAssembler
 */
export class AssignmentAssembler {
    static toEntityFromResource(resource) {
        return new Assignment({ ...resource });
    }

    static toEntitiesFromResponse(response) {
        if (response.status !== 200) {
            console.error(`${response.status}, ${response.statusText}`);
            return [];
        }
        const data = response.data;
        const resources = Array.isArray(data) ? data : (data['assignmentRecords'] ?? []);
        return resources.map((resource) => this.toEntityFromResource(resource));
    }

    static toResourceFromEntity(entity) {
        return { ...entity };
    }
}