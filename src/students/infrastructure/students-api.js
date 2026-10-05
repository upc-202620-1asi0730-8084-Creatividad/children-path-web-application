import { Student } from '../domain/entities/student.entity.js';

/**
 * Maps student resources from the API into Student domain entities.
 *
 * @class StudentAssembler
 */
export class StudentAssembler {
    static toEntityFromResource(resource) {
        return new Student({ ...resource });
    }

    static toEntitiesFromResponse(response) {
        if (response.status !== 200) {
            console.error(`${response.status},${response.statusText}`);
            return [];
        }
        const data = response.data;
        const resources = Array.isArray(data) ? data : (data['students'] ?? []);
        return resources.map((resource) => this.toEntityFromResource(resource));
    }

    static toResourceFromEntity(entity) {
        return { ...entity };
    }
}
