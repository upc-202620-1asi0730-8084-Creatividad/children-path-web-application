/**
 * SubscriptionPlan entity within the Subscriptions bounded context.
 *
 * @class SubscriptionPlan
 */
export class SubscriptionPlan {
    constructor({
                    id = '',
                    name = '',
                    label = '',
                    price = null,
                    currency = 'USD',
                    interval = 'month',
                    target = '',
                    featured = false,
                    actionType = 'contact',
                    features = []
                } = {}) {
        this.id = id;
        this.name = name;
        this.label = label;
        this.price = price;
        this.currency = currency;
        this.interval = interval;
        this.target = target;
        this.featured = featured;
        this.actionType = actionType; // 'upgrade' | 'current' | 'contact'
        this.features = features;     // [{ text, included }]
    }
}