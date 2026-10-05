import { AttendanceRecord } from '../domain/entities/attendance-record.entity.js';

/**
 * Maps attendance record resources into domain entities.
 *
 * @class AttendanceRecordAssembler
 */
export class AttendanceRecordAssembler {
    static toEntityFromResource(resource) {
        return new AttendanceRecord({ ...resource });
    }

    static toEntitiesFromResponse(response) {
        if (response.status !== 200) {
            console.error(`${response.status}, ${response.statusText}`);
            return [];
        }
        const data = response.data;
        const resources = Array.isArray(data) ? data : (data['attendanceRecords'] ?? []);
        return resources.map((resource) => this.toEntityFromResource(resource));
    }

    static toResourceFromEntity(entity) {
        return { ...entity };
    }
}