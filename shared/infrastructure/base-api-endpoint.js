import axios from "axios";
import {errorInterceptor} from "@/shared/infrastructure/error.interceptor.js";
import "@/shared/infrastructure/base-entity.js";
import "@/shared/infrastructure/base-response.js";
import "@/shared/infrastructure/base-assembler.js";

/**
 * Provides generic CRUD operations for a single REST endpoint.
 *
 * @template TEntity
 * @template TResource
 * @template TResponse
 * @template TAssembler
 */
export class BaseApiEndpoint {
    /**
     * Axios instance shared by all endpoint operations.
     *
     * @type {import('axios').AxiosInstance}
     */
    #http;

    /**
     * Full URL of the endpoint this instance operates on.
     *
     * @type {string}
     */
    #endpointUrl;

    /**
     * Assembler used to map between resources and entities.
     *
     * @type {TAssembler}
     */
    #assembler;

    /**
     * Creates a new BaseApiEndpoint.
     *
     * @param {string} endpointUrl - Full URL of the endpoint.
     * @param {TAssembler} assembler - Assembler instance for entity/resource mapping.
     * @param {import('axios').AxiosInstance} [httpClient=axios] - Optional custom Axios instance.
     */
    constructor(endpointUrl, assembler, httpClient = axios) {
        this.#http = httpClient;
        this.#endpointUrl = endpointUrl;
        this.#assembler = assembler;
        this.#http.interceptors.response.use(
            errorInterceptor.onResponse,
            errorInterceptor.onError
        );
    }

    /**
     * Fetches all entities from the configured endpoint.
     *
     * @returns {Promise<TEntity[]>}
     */
    getAll = async () => {
        const response = await this.#http.get(this.#endpointUrl);
        if (Array.isArray(response.data)) {
            return response.data.map(resource => this.#assembler.toEntityFromResource(resource));
        }
        return this.#assembler.toEntitiesFromResponse(response);
    };

    /**
     * Fetches a single entity by identifier.
     *
     * @param {number|string} id - Entity identifier.
     * @returns {Promise<TEntity>}
     */
    getById = async (id) => {
        const response = await this.#http.get(`${this.#endpointUrl}/${id}`);
        return this.#assembler.toEntityFromResource(response.data);
    };

    /**
     * Creates a new entity in the remote endpoint.
     *
     * @param {TEntity} entity - Entity to persist.
     * @returns {Promise<TEntity>}
     */
    create = async (entity) => {
        const resource = this.#assembler.toResourceFromEntity(entity);
        const response = await this.#http.post(this.#endpointUrl, resource);
        return this.#assembler.toEntityFromResource(response.data);
    };

    /**
     * Updates an existing entity.
     *
     * @param {TEntity} entity - Entity state to persist.
     * @param {number|string} id - Identifier of the target entity.
     * @returns {Promise<TEntity>}
     */
    update = async (entity, id) => {
        const resource = this.#assembler.toResourceFromEntity(entity);
        const response = await this.#http.put(`${this.#endpointUrl}/${id}`, resource);
        return this.#assembler.toEntityFromResource(response.data);
    };

    /**
     * Deletes an entity by identifier.
     *
     * @param {number|string} id - Identifier of the entity to remove.
     * @returns {Promise<void>}
     */
    delete = async (id) => {
        await this.#http.delete(`${this.#endpointUrl}/${id}`);
    };
}