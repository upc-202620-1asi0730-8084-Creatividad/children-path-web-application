import { BaseApi } from '../../shared/infrastructure/base-api.js';

const currentPath  = import.meta.env.VITE_SUBSCRIPTIONS_CURRENT_ENDPOINT_PATH;
const plansPath    = import.meta.env.VITE_SUBSCRIPTIONS_PLANS_ENDPOINT_PATH;
const paymentsPath = import.meta.env.VITE_SUBSCRIPTIONS_PAYMENTS_ENDPOINT_PATH;
const billingPath  = import.meta.env.VITE_SUBSCRIPTIONS_BILLING_ENDPOINT_PATH;

/**
 * Infrastructure gateway for Subscriptions bounded-context endpoints.
 *
 * @class SubscriptionsApi
 * @extends BaseApi
 */
export class SubscriptionsApi extends BaseApi {
    getCurrentSubscription() {
        return this.http.get(currentPath);
    }

    getPlans() {
        return this.http.get(plansPath);
    }

    getPaymentMethods() {
        return this.http.get(paymentsPath);
    }

    getBillingHistory() {
        return this.http.get(billingPath);
    }
}