/**
 * Axios interceptor for centralized error handling.
 *
 * @remarks
 * This object contains the success and error handlers for Axios response interceptors.
 * It simplifies error messages from the server and provides fallback messages for
 * network errors.
 */
export const errorInterceptor = {
    /**
     * Handles successful responses.
     * @param {import('axios').AxiosResponse} response - The Axios response.
     * @returns {import('axios').AxiosResponse} The same response.
     */
    onResponse: (response) => response,

    /**
     * Handles error responses.
     * @param {import('axios').AxiosError} error - The Axios error.
     * @returns {Promise<never>} A rejected promise with a user-friendly error message.
     */
    onError: (error) => {
        let message;

        if (error.response) {
            // The request was made, and the server responded with a status code
            // that falls out of the range of 2xx
            console.error("Data:", error.response.data);
            console.error("Status:", error.response.status);
            console.error("Headers:", error.response.headers);

            message = error.response.data["message"] || `Error ${error.response.status}: ${error.response.statusText}`;
        } else if (error.request) {
            // The request was made but no response was received
            console.error("Request:", error.request);
            message = "No response received from the server. Please check your internet connection.";
        } else {
            // Something happened in setting up the request that triggered an Error
            console.error("Error Message:", error.message);
            message = error.message;
        }

        return Promise.reject(message);
    }
};