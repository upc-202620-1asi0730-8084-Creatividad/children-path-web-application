import { BaseApi } from '../../shared/infrastructure/base-api.js';

const summaryPath    = import.meta.env.VITE_ROUTES_SUMMARY_ENDPOINT_PATH;
const routesPath     = import.meta.env.VITE_ROUTES_SCHOOL_ROUTES_ENDPOINT_PATH;
const reviewsPath    = import.meta.env.VITE_ROUTES_REVIEWS_ENDPOINT_PATH;
const activitiesPath = import.meta.env.VITE_ROUTES_ACTIVITIES_ENDPOINT_PATH;

/**
 * Infrastructure gateway for Routes bounded-context endpoints.
 *
 * @class RoutesApi
 * @extends BaseApi
 */
export class RoutesApi extends BaseApi {
    getSummary() {
        return this.http.get(summaryPath);
    }

    getRoutes() {
        return this.http.get(routesPath);
    }

    getReviews() {
        return this.http.get(reviewsPath);
    }

    getActivities() {
        return this.http.get(activitiesPath);
    }

    createRoute(resource) {
        return this.http.post(routesPath, resource);
    }

    updateRoute(id, resource) {
        return this.http.put(`${routesPath}/${id}`, resource);
    }

    deleteRoute(id) {
        return this.http.delete(`${routesPath}/${id}`);
    }
}