/**
 * Maps fleet summary resources from the API into plain model objects.
 *
 * @class FleetSummaryAssembler
 */
export class FleetSummaryAssembler {
    static toEntityFromResource(resource) {
        return { ...resource };
    }

    static toEntityFromResponse(response) {
        if (response.status !== 200) {
            console.error(`${response.status}, ${response.statusText}`);
            return null;
        }
        return this.toEntityFromResource(response.data);
    }
}