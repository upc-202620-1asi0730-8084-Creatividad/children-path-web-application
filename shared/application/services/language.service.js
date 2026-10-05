import {reactive} from "vue";
import i18n from "@/i18n.js";

/**
 * Application service that orchestrates language selection and persistence.
 *
 * @remarks
 * In DDD terms, this serves as an Application Service coordinating between
 * the i18n infrastructure and the presentation layer.
 *
 * @typedef {Object} LanguageStore
 * @property {readonly string[]} supportedLanguages - Languages enabled in the application.
 * @property {string} current - Currently active ISO language code.
 * @property {() => void} initialize - Restores the persisted language or falls back to English.
 * @property {(language: string) => void} use - Activates and persists the given language.
 */

const STORAGE_KEY = 'children-path-language';

/**
 * Reactive application store that coordinates language state.
 *
 * @type {LanguageStore}
 */
export const languageStore = reactive({
    supportedLanguages: ['en', 'es'],
    current: 'en',

    /**
     * Restores the previously persisted language or defaults to English.
     *
     * @returns {void}
     */
    initialize() {
        const saved = localStorage.getItem(STORAGE_KEY) ?? 'en';
        this.use(saved === 'es' ? 'es' : 'en');
    },

    /**
     * Activates the provided language across the application and persists it.
     *
     * @param {'en'|'es'} language - Target language code.
     * @returns {void}
     */
    use(language) {
        if (!this.supportedLanguages.includes(language)) return;
        localStorage.setItem(STORAGE_KEY, language);
        document.documentElement.lang = language;
        i18n.global.locale.value = language;
        this.current = language;
    }
});