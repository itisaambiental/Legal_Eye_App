/**
 * Class for managing and mapping errors related to Copomex services.
 * Centralizes error handling, mapping error codes and messages to user-friendly messages.
 */
class CopomexErrors {
    static NETWORK_ERROR = "NETWORK_ERROR";
    static SERVER_ERROR = "SERVER_ERROR";
    static UNEXPECTED_ERROR = "UNEXPECTED_ERROR";
    static FETCH_STATES_ERROR = "FETCH_STATES_ERROR";
    static FETCH_MUNICIPALITIES_ERROR = "FETCH_MUNICIPALITIES_ERROR";
    static GENERIC_ERROR = "GENERIC_ERROR";

    /**
     * A map of error constants to user-friendly error objects.
     * Each object contains:
     * - `title`: A short, descriptive title for the error.
     * - `message`: A detailed explanation of the error.
     */
    static errorMap = {
        [CopomexErrors.NETWORK_ERROR]: {
            title: "Error de conexión",
            message: "Hubo un problema de red. Verifique su conexión a internet e intente nuevamente.",
        },
        [CopomexErrors.SERVER_ERROR]: {
            title: "Error en el servidor",
            message: "Hubo un error en el servidor. Espere un momento e intente nuevamente.",
        },
        [CopomexErrors.UNEXPECTED_ERROR]: {
            title: "Error inesperado",
            message: "Ocurrió un error inesperado. Por favor, intente nuevamente más tarde.",
        },
        [CopomexErrors.FETCH_STATES_ERROR]: {
            title: "Error obteniendo estados",
            message: "Hubo un error al obtener los estados. Por favor, comuníquese con los administradores del sistema.",
        },
        [CopomexErrors.FETCH_MUNICIPALITIES_ERROR]: {
            title: "Error obteniendo municipios",
            message: "Hubo un error al obtener los municipios del estado. Por favor, comuníquese con los administradores del sistema.",
        },
        [CopomexErrors.GENERIC_ERROR]: {
            title: "Error",
            message: "Hubo un error al obtener los estados y municipios. Por favor, comuníquese con los administradores del sistema.",
        },
    };

    /**
     * A map of specific error messages to their corresponding error constants.
     * This map is used to translate error messages from the server or HTTP errors into standardized error types.
     *
     * @type {Object.<string, CopomexErrors>}
     */
    static ErrorMessagesMap = {
        "Network Error": CopomexErrors.NETWORK_ERROR,
    };

    /**
     * Handles errors by mapping error codes or messages to a user-friendly error object.
     *
     * @param {Object} params - Parameters for handling the error.
     * @param {number} params.code - The HTTP status code.
     * @param {string} [params.error] - The server error message.
     * @param {string} [params.httpError] - The HTTP error message.
     * @returns {Object} - A user-friendly error object containing a title and message.
     */
    static handleError({ code, error, httpError }) {
        const message = error || httpError;
        if (message && CopomexErrors.ErrorMessagesMap[message]) {
            return CopomexErrors.errorMap[CopomexErrors.ErrorMessagesMap[message]];
        }
        switch (code) {
            case 400:
                return CopomexErrors.errorMap[CopomexErrors.GENERIC_ERROR];
            case 500:
            case 503:
                return CopomexErrors.errorMap[CopomexErrors.SERVER_ERROR];
            default:
                return CopomexErrors.errorMap[CopomexErrors.UNEXPECTED_ERROR];
        }
    }
}

export default CopomexErrors;
