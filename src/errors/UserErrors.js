/**
 * Class for managing and mapping errors related to users.
 * Centralizes error handling, mapping error codes and messages to user-friendly messages.
 */
class UserErrors {
    static NETWORK_ERROR = "NETWORK_ERROR";
    static VALIDATION_ERROR = "VALIDATION_ERROR";
    static UNAUTHORIZED = "UNAUTHORIZED";
    static NOT_FOUND = "NOT_FOUND";
    static MULTIPLE_NOT_FOUND = "MULTIPLE_NOT_FOUND";
    static SERVER_ERROR = "SERVER_ERROR";
    static UNEXPECTED_ERROR = "UNEXPECTED_ERROR";
    static DUPLICATED_EMAIL = "DUPLICATED_EMAIL";
  
    /**
     * A map of error constants to user-friendly error objects.
     * Each object contains:
     * - `title`: A short, descriptive title for the error.
     * - `message`: A detailed explanation of the error, which may be static or dynamically generated.
     */
    static errorMap = {
      [UserErrors.NETWORK_ERROR]: {
        title: "Error de conexión",
        message: "Hubo un problema de red. Verifique su conexión a internet e intente nuevamente.",
      },
      [UserErrors.VALIDATION_ERROR]: {
        title: "Error de validación",
        message: "Revisa los datos introducidos. Uno o más campos no son válidos.",
      },
      [UserErrors.UNAUTHORIZED]: {
        title: "Acceso no autorizado",
        message: "No tiene permisos para realizar esta acción. Verifique su sesión.",
      },
      [UserErrors.NOT_FOUND]: {
        title: "Usuario no encontrado",
        message: "El usuario no fue encontrado. Verifique su existencia recargando la app e intente de nuevo.",
      },
      [UserErrors.MULTIPLE_NOT_FOUND]: {
        title: "Usuarios no encontrados",
        message: "Uno o más usuarios no fueron encontrados. Verifique su existencia recargando la app e intente de nuevo.",
      },
      [UserErrors.SERVER_ERROR]: {
        title: "Error interno del servidor",
        message: "Hubo un error en el servidor. Espere un momento e intente nuevamente.",
      },
      [UserErrors.UNEXPECTED_ERROR]: {
        title: "Error inesperado",
        message: "Ocurrió un error inesperado. Por favor, intente nuevamente más tarde.",
      },
      [UserErrors.DUPLICATED_EMAIL]: {
        title: "Correo duplicado",
        message: "El correo ya está en uso. Por favor, utiliza otro.",
      },
    };
  
    /**
     * A map of specific error messages to their corresponding error constants.
     * This map is used to translate error messages from the server or HTTP Errors into standardized error types.
     *
     * @type {Object.<string, UserErrors>}
     */
    static ErrorMessagesMap = {
      "Network Error": UserErrors.NETWORK_ERROR,
    };
  
    /**
     * Handles errors by mapping error codes or messages to a user-friendly error object.
     *
     * @param {Object} params - Parameters for handling the error.
     * @param {number} params.code - The HTTP status code.
     * @param {string} [params.error] - The server error message.
     * @param {string} [params.httpError] - The HTTP error message.
     * @param {Array<string|number>} [params.items] - Optional parameter indicating the related items.
     * @returns {Object} - A user-friendly error object containing a title and message.
     */
    static handleError({ code, error, httpError, items }) {
      const message = error || httpError;
      if (message && UserErrors.ErrorMessagesMap[message]) {
        const key = UserErrors.ErrorMessagesMap[message];
        return UserErrors.errorMap[key];
      }
      switch (code) {
        case 400:
          return UserErrors.errorMap[UserErrors.VALIDATION_ERROR];
        case 401:
        case 403:
          return UserErrors.errorMap[UserErrors.UNAUTHORIZED];
        case 404:
          if (items && items.length > 0) {
            return items.length === 1
              ? UserErrors.errorMap[UserErrors.NOT_FOUND]
              : UserErrors.errorMap[UserErrors.MULTIPLE_NOT_FOUND];
          }
          return UserErrors.errorMap[UserErrors.NOT_FOUND];
        case 500:
          return UserErrors.errorMap[UserErrors.SERVER_ERROR];
        default:
          return UserErrors.errorMap[UserErrors.UNEXPECTED_ERROR];
      }
    }
  }
  
  export default UserErrors;
  