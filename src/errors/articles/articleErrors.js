/**
 * Class for managing and mapping errors related to articles.
 * Centralizes error handling, mapping error codes and messages to user-friendly messages.
 */
class ArticleErrors {
    static NETWORK_ERROR = "NETWORK_ERROR";
    static VALIDATION_ERROR = "VALIDATION_ERROR";
    static UNAUTHORIZED = "UNAUTHORIZED";
    static NOT_FOUND = "NOT_FOUND";
    static MULTIPLE_NOT_FOUND = "MULTIPLE_NOT_FOUND";
    static LEGAL_BASIS_NOT_FOUND = "LEGAL_BASIS_NOT_FOUND";
    static SERVER_ERROR = "SERVER_ERROR";
    static UNEXPECTED_ERROR = "UNEXPECTED_ERROR";
  
    /**
     * A map of error constants to user-friendly error objects.
     * Each object contains:
     * - `title`: A short, descriptive title for the error.
     * - `message`: A detailed explanation of the error, which may be static or dynamically generated.
     */
    static errorMap = {
      [ArticleErrors.NETWORK_ERROR]: {
        title: "Error de conexión",
        message: "Hubo un problema de red. Verifique su conexión a internet e intente nuevamente.",
      },
      [ArticleErrors.VALIDATION_ERROR]: {
        title: "Error de validación",
        message: "Revisa los datos introducidos. Uno o más campos no son válidos.",
      },
      [ArticleErrors.UNAUTHORIZED]: {
        title: "Acceso no autorizado",
        message: "No tiene permisos para realizar esta acción. Verifique su sesión.",
      },
      [ArticleErrors.NOT_FOUND]: {
        title: "Artículo no encontrado",
        message: "El artículo no fue encontrado. Verifique su existencia recargando la app e intente de nuevo.",
      },
      [ArticleErrors.MULTIPLE_NOT_FOUND]: {
        title: "Artículos no encontrados",
        message: "Uno o más artículos no fueron encontrados. Verifique su existencia recargando la app e intente de nuevo.",
      },
      [ArticleErrors.LEGAL_BASIS_NOT_FOUND]: {
        title: "Fundamento legal no encontrado",
        message: "El fundamento legal seleccionado no fue encontrado. Verifique su existencia recargando la app e intente de nuevo.",
      },
      [ArticleErrors.SERVER_ERROR]: {
        title: "Error interno del servidor",
        message: "Hubo un error en el servidor. Espere un momento e intente nuevamente.",
      },
      [ArticleErrors.UNEXPECTED_ERROR]: {
        title: "Error inesperado",
        message: "Ocurrió un error inesperado. Por favor, intente nuevamente más tarde.",
      },
    };
  
    /**
     * A map of specific error messages to their corresponding error constants.
     * This map is used to translate error messages from the server or HTTP Errors into standardized error types.
     *
     * @type {Object.<string, ArticleErrors>}
     */
    static ErrorMessagesMap = {
      "Network Error": ArticleErrors.NETWORK_ERROR,
      "Validation failed": ArticleErrors.VALIDATION_ERROR,
      "Unauthorized": ArticleErrors.UNAUTHORIZED,
      "LegalBasis not found": ArticleErrors.LEGAL_BASIS_NOT_FOUND,
    };
  
    /**
     * Handles errors by mapping error codes or messages to a user-friendly error object.
     *
     * @param {Object} params - Parameters for handling the error.
     * @param {number} params.code - The HTTP status code.
     * @param {string} [params.error] - The server error message.
     * @param {string} [params.httpError] - The HTTP error 
     * @param {Array<string|number>} [params.items] - Optional parameter indicating the related items.
     * @returns {Object} - A user-friendly error object containing a title and message.
     */
    static handleError({ code, error, httpError, items }) {
      const message = error || httpError;
      if (message && ArticleErrors.ErrorMessagesMap[message]) {
        const key = ArticleErrors.ErrorMessagesMap[message];
        return ArticleErrors.errorMap[key];
      }
      switch (code) {
        case 400:
          return ArticleErrors.errorMap[ArticleErrors.VALIDATION_ERROR];
        case 401:
        case 403:
          return ArticleErrors.errorMap[ArticleErrors.UNAUTHORIZED];
          case 404:
            if (items && items.length > 0) {
                return items.length === 1
                    ? ArticleErrors.errorMap[ArticleErrors.NOT_FOUND]
                    : ArticleErrors.errorMap[ArticleErrors.MULTIPLE_NOT_FOUND];
            }
            return ArticleErrors.errorMap[ArticleErrors.NOT_FOUND];
        case 500:
          return ArticleErrors.errorMap[ArticleErrors.SERVER_ERROR];
        default:
          return ArticleErrors.errorMap[ArticleErrors.UNEXPECTED_ERROR];
      }
    }
  }
  
  export default ArticleErrors;
  