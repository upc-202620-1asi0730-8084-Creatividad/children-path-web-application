import { BaseApi } from '../../shared/infrastructure/base-api.js';

const summaryPath    = import.meta.env.VITE_STUDENTS_SUMMARY_ENDPOINT_PATH;
const recordsPath    = import.meta.env.VITE_STUDENTS_RECORDS_ENDPOINT_PATH;
const reviewsPath    = import.meta.env.VITE_STUDENTS_REVIEWS_ENDPOINT_PATH;
const activitiesPath = import.meta.env.VITE_STUDENTS_ACTIVITIES_ENDPOINT_PATH;

/**
 * Infrastructure gateway for Students bounded-context endpoints.
 *
 * @class StudentsApi
 * @extends BaseApi
 */
export class StudentsApi extends BaseApi {
    getSummary() {
        return this.http.get(summaryPath);
    }

    getStudents() {
        return this.http.get(recordsPath);
    }

    getReviews() {
        return this.http.get(reviewsPath);
    }

    getActivities() {
        return this.http.get(activitiesPath);
    }

    createStudent(resource) {
        return this.http.post(recordsPath, resource);
    }

    updateStudent(id, resource) {
        return this.http.put(`${recordsPath}/${id}`, resource);
    }

    deleteStudent(id) {
        return this.http.delete(`${recordsPath}/${id}`);
    }
}