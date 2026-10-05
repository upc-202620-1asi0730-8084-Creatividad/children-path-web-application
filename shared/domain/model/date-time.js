/**
 * Value object representing a date and time within the domain.
 *
 * @remarks
 * This value object ensures that date-time values are valid and provides
 * consistent formatting and comparison logic. It is immutable.
 */
export class DateTime {
    /** @type {Date} */
    #date;

    /**
     * Creates a new DateTime instance.
     *
     * @param {string|Date|number} value - The value to initialize the date with.
     * @throws {Error} If the provided value results in an invalid date.
     */
    constructor(value) {
        const date = new Date(value);
        if (isNaN(date.getTime())) {
            throw new Error('Invalid date-time value');
        }
        this.#date = date;
        Object.freeze(this);
    }

    /**
     * Checks if this date-time is in the future relative to the current time.
     *
     * @returns {boolean} True if the date-time is in the future.
     */
    isFuture() {
        return this.#date > new Date();
    }

    /**
     * Formats the date-time for display.
     *
     * @param {string} [locale='en-US'] - The locale to use for formatting.
     * @param {Intl.DateTimeFormatOptions} [options] - Formatting options.
     * @returns {string} The formatted date-time string.
     */
    format(locale = 'en-US', options = {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit'
    }) {
        return this.#date.toLocaleDateString(locale, options);
    }

    /**
     * Returns the underlying Date object.
     * @returns {Date}
     */
    toDate() {
        return new Date(this.#date.getTime());
    }

    /**
     * Returns the ISO string representation of the date-time.
     * @returns {string}
     */
    toISOString() {
        return this.#date.toISOString();
    }

    /**
     * Returns the primitive value of the DateTime (the timestamp).
     * @returns {number}
     */
    valueOf() {
        return this.#date.getTime();
    }

    /**
     * Static factory method to create a DateTime from the current time.
     * @returns {DateTime}
     */
    static now() {
        return new DateTime(new Date());
    }
}