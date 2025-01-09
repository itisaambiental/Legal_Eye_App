class AuthErrors {
    static NETWORK_ERROR = "NETWORK_ERROR";
    static INVALID_EMAIL = "INVALID_EMAIL";
    static INVALID_CODE = "INVALID_CODE";
    static USER_CANCELLED = "USER_CANCELLED";
    static INTERACTION_IN_PROGRESS = "INTERACTION_IN_PROGRESS";
    static SEND_ERROR = "SEND_ERROR";
    static UNEXPECTED_ERROR = "UNEXPECTED_ERROR";

    /**
     * A map of error constants to user-friendly error objects.
     */
    static errorMap = {
        [AuthErrors.NETWORK_ERROR]: {
            title: "Error de conexión",
            message: "Hubo un problema de red. Verifique su conexión a internet e intente nuevamente.",
        },
        [AuthErrors.INVALID_EMAIL]: {
            title: "Correo no válido",
            message: "Dirección de correo no válida",
        },
        [AuthErrors.INVALID_CODE]: {
            title: "Código inválido",
            message: "Código inválido. Intente nuevamente.",
        },
        [AuthErrors.USER_CANCELLED]: {
            title: "Operación cancelada",
            message: null,
        },
        [AuthErrors.INTERACTION_IN_PROGRESS]: {
            title: "Interacción en progreso",
            message: "Ya hay una interacción de inicio de sesión en progreso. Espere un momento.",
        },
        [AuthErrors.SEND_ERROR]: {
            title: "Error al enviar",
            message: ({ isResend }) =>
                isResend
                    ? "Error al reenviar el código de verificación. Intente nuevamente."
                    : "Error al enviar el código de verificación. Intente nuevamente.",
        },
        [AuthErrors.UNEXPECTED_ERROR]: {
            title: "Error inesperado",
            message: "Ocurrió un error inesperado. Por favor, intente nuevamente más tarde.",
          },
    };

    /**
     * A map of specific error messages to their corresponding error constants.
     */
    static ErrorMessagesMap = {
        "Network Error": AuthErrors.NETWORK_ERROR,
        "Invalid or expired code": AuthErrors.INVALID_CODE,
        "user_cancelled": AuthErrors.USER_CANCELLED,
        "interaction_in_progress": AuthErrors.INTERACTION_IN_PROGRESS,
        "Invalid email": AuthErrors.INVALID_EMAIL,
        "Failed to send verification code": AuthErrors.SEND_ERROR,
    };

  /**
 * Handles errors by mapping error codes or messages to a user-friendly error object.
 *
 * @param {Object} params - Parameters for handling the error.
 * @param {number} params.code - The HTTP status code.
 * @param {string} [params.error] - The server error message.
 * @param {string} [params.httpError] - The HTTP error message.
 * @param {boolean} [params.isResend] - Whether this is a resend request.
 * @returns {Object} - A user-friendly error object containing a title and message.
 */
static handleError({ code, error, httpError, isResend }) {
    const message = error || httpError;
    if (message && AuthErrors.ErrorMessagesMap[message]) {
        const key = AuthErrors.ErrorMessagesMap[message];
        const errorConfig = AuthErrors.errorMap[key];
        if (key === AuthErrors.SEND_ERROR) {
            return {
                title: errorConfig.title,
                message: errorConfig.message({ isResend }),
            };
        }
        return errorConfig;
    }
    switch (code) {
        case 400:
            return AuthErrors.errorMap[AuthErrors.INVALID_CODE];
        case 401:
            return AuthErrors.errorMap[AuthErrors.INVALID_EMAIL];
        case 403:
            return AuthErrors.errorMap[AuthErrors.INVALID_EMAIL];
        default:
            AuthErrors.errorMap[AuthErrors.UNEXPECTED_ERROR];
    }
}

}

export default AuthErrors;
