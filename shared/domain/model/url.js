
/**
 * Value object representing a URL within the domain.
 *
 * @remarks
 * This value object ensures that URL values are well-formed according to
 * RFC standards and provides a consistent way to handle URLs. It is immutable.
 */
export class Url {
    /** @type {string} */
    #value;

    /**
     * Validates if a string is a well-formed URL.
     *
     * @param {string} url - The URL string to validate.
     * @returns {boolean} True if the URL is valid, false otherwise.
     */
    static isValidUrl(url) {
        if (typeof url !== 'string' && !(url instanceof String)) return false;
        if (URL.canParse) {
            return URL.canParse(url);
        }
        try {
            new URL(url);
            return true;
        } catch (_) {
            return false;
        }
    }

    /**
     * Creates a new Url instance.
     *
     * @param {string} value - The URL string.
     */
    constructor(value) {
        this.#value = Url.isValidUrl(value) ? value : '';
        Object.freeze(this);
    }

    /**
     * Returns the string representation of the URL.
     * @returns {string}
     */
    toString() {
        return this.#value;
    }

    /**
     * Checks if the URL is empty.
     * @returns {boolean}
     */
    isEmpty() {
        return this.#value === '';
    }

    /**
     * Returns the primitive value of the Url.
     * @returns {string}
     */
    valueOf() {
        return this.#value;
    }

    /**
     * Checks for equality with another Url instance.
     * @param {Url} other - The other Url to compare.
     * @returns {boolean}
     */
    equals(other) {
        return other instanceof Url && this.#value === other.toString();
    }
}