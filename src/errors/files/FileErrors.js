/**
 * Class for managing and mapping errors related to file operations.
 * Centralizes error handling, mapping error codes and messages to user-friendly messages.
 */
class FileErrors {
    static NETWORK_ERROR = "NETWORK_ERROR";
    static BAD_REQUEST = "BAD_REQUEST";
    static FORBIDDEN = "FORBIDDEN";
    static NOT_FOUND = "NOT_FOUND";
    static REQUEST_TIMEOUT = "REQUEST_TIMEOUT";
    static PAYLOAD_TOO_LARGE = "PAYLOAD_TOO_LARGE";
    static SERVER_ERROR = "SERVER_ERROR";
    static UNEXPECTED_ERROR = "UNEXPECTED_ERROR";

    /**
     * A map of error constants to user-friendly error objects.
     * Each object contains:
     * - `title`: A short, descriptive title for the error.
     * - `message`: A detailed explanation of the error.
     */
    static errorMap = {
        [FileErrors.NETWORK_ERROR]: {
            title: "Error de conexión",
            message: "Error de conexión durante la descarga. Verifique su conexión a internet.",
        },
        [FileErrors.BAD_REQUEST]: {
            title: "Solicitud incorrecta",
            message: "El enlace de descarga es incorrecto. Recargue la página e intente de nuevo.",
        },
        [FileErrors.FORBIDDEN]: {
            title: "Acceso denegado",
            message: "El enlace ha expirado o no tienes permisos para descargar el documento. Intente de nuevo.",
        },
        [FileErrors.NOT_FOUND]: {
            title: "Documento no encontrado",
            message: "El documento solicitado no existe. Recargue la página e intente de nuevo.",
        },
        [FileErrors.REQUEST_TIMEOUT]: {
            title: "Tiempo de espera excedido",
            message: "La descarga tardó demasiado en completarse. Intente nuevamente.",
        },
        [FileErrors.PAYLOAD_TOO_LARGE]: {
            title: "Documento demasiado grande",
            message: "El documento excede el tamaño permitido. Contacte a los administradores del sistema.",
        },
        [FileErrors.SERVER_ERROR]: {
            title: "Error en el servidor",
            message: "Hubo un problema en el servidor. Intente más tarde nuevamente.",
        },
        [FileErrors.UNEXPECTED_ERROR]: {
            title: "Error inesperado",
            message: "Ocurrió un error inesperado. Intente nuevamente.",
        },
    };
    /**
     * A map of specific error messages to their corresponding error constants.
     * This map is used to translate error messages from the server or HTTP errors into standardized error types.
     *
     * @type {Object.<string, FileErrors>}
     */
    static ErrorMessagesMap = {
        "Network Error": FileErrors.NETWORK_ERROR,
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
        if (message && FileErrors.ErrorMessagesMap[message]) {
            return FileErrors.errorMap[FileErrors.ErrorMessagesMap[message]];
        }
        switch (code) {
            case 400:
                return FileErrors.errorMap[FileErrors.BAD_REQUEST];
            case 403:
                return FileErrors.errorMap[FileErrors.FORBIDDEN];
            case 404:
                return FileErrors.errorMap[FileErrors.NOT_FOUND];
            case 408:
                return FileErrors.errorMap[FileErrors.REQUEST_TIMEOUT];
            case 413:
                return FileErrors.errorMap[FileErrors.PAYLOAD_TOO_LARGE];
            case 500:
                return FileErrors.errorMap[FileErrors.SERVER_ERROR];
            default:
                return FileErrors.errorMap[FileErrors.UNEXPECTED_ERROR];
        }
    }
}

export default FileErrors;
