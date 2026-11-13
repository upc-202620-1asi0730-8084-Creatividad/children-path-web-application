import "@/shared/infrastructure/base-response.js";
import "@/shared/infrastructure/base-entity.js";

/**
 * Defines conversions between domain entities and API representations.
 *
 * @template TEntity
 * @template TResource
 * @template TResponse
 *
 * @typedef {Object} BaseAssembler
 * @property {(resource: TResource) => TEntity} toEntityFromResource - Converts a resource to an entity.
 * @property {(entity: TEntity) => TResource} toResourceFromEntity - Converts an entity to a resource.
 * @property {(response: TResponse) => TEntity[]} toEntitiesFromResponse - Converts a response envelope to a collection of entities.
 */

export {};