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
  static ASSOCIATED_TO_REQ_IDENTIFICATIONS_CONFLICT =
    "ASSOCIATED_TO_REQ_IDENTIFICATIONS_CONFLICT";
  static REQ_IDENTIFICATION_JOBS_CONFLICT = "REQ_IDENTIFICATION_JOBS_CONFLICT";
  static MULTIPLE_ASSOCIATED_TO_REQ_IDENTIFICATIONS_CONFLICT =
    "MULTIPLE_ASSOCIATED_TO_REQ_IDENTIFICATIONS_CONFLICT";
  static MULTIPLE_REQ_IDENTIFICATION_JOBS_CONFLICT =
    "MULTIPLE_REQ_IDENTIFICATION_JOBS_CONFLICT";
  static SEND_LEGAL_BASIS_JOBS_CONFLICT = "SEND_LEGAL_BASIS_JOBS_CONFLICT";
  static MULTIPLE_SEND_LEGAL_BASIS_JOBS_CONFLICT =
    "MULTIPLE_SEND_LEGAL_BASIS_JOBS_CONFLICT";
  static LEGAL_BASIS_NOT_FOUND = "LEGAL_BASIS_NOT_FOUND";
  static CONFLICT = "CONFLICT";
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
      message:
        "Hubo un problema de red. Verifique su conexión a internet e intente nuevamente.",
    },
    [ArticleErrors.VALIDATION_ERROR]: {
      title: "Error de validación",
      message:
        "Revisa los datos introducidos. Uno o más campos no son válidos.",
    },
    [ArticleErrors.UNAUTHORIZED]: {
      title: "Acceso no autorizado",
      message:
        "No tiene permisos para realizar esta acción. Verifique su sesión.",
    },
    [ArticleErrors.NOT_FOUND]: {
      title: "Artículo no encontrado",
      message:
        "El artículo no fue encontrado. Verifique su existencia recargando la app e intente de nuevo.",
    },
    [ArticleErrors.MULTIPLE_NOT_FOUND]: {
      title: "Artículos no encontrados",
      message:
        "Uno o más artículos no fueron encontrados. Verifique su existencia recargando la app e intente de nuevo.",
    },
    [ArticleErrors.ASSOCIATED_TO_REQ_IDENTIFICATIONS_CONFLICT]: {
      title: "Artículo vinculado a una identificación de requerimientos",
      message:
        "El artículo está vinculado a una o más identificación de requerimientos y no puede ser eliminado.",
    },
    [ArticleErrors.REQ_IDENTIFICATION_JOBS_CONFLICT]: {
      title: "Conflicto con trabajos de identificación de requerimientos",
      message:
        "El artículo no puede ser eliminado porque se esta utilizando en una identificación de requerimientos.",
    },
    [ArticleErrors.MULTIPLE_ASSOCIATED_TO_REQ_IDENTIFICATIONS_CONFLICT]: {
      title: "Artículos vinculados a identificaciones de requerimientos",
      message: ({ items }) =>
        items.length === 1
          ? `El artículo ${items[0]} está vinculado a una o más identificación de requerimientos y no puede ser eliminado.`
          : `Los artículos ${items.join(
              ", "
            )} están vinculados a una o más identificación de requerimientos y no pueden ser eliminados.`,
    },
    [ArticleErrors.MULTIPLE_REQ_IDENTIFICATION_JOBS_CONFLICT]: {
      title: "Conflicto con trabajos de identificación de requerimientos",
      message: ({ items }) =>
        items.length === 1
          ? `El artículo ${items[0]} no puede ser eliminado porque se esta utilizando en una identificación de requerimientos.`
          : `Los artículos ${items.join(
              ", "
            )} no pueden ser eliminados porque se están utilizando en una identificación de requerimientos.`,
    },
    [ArticleErrors.SEND_LEGAL_BASIS_JOBS_CONFLICT]: {
      title: "Conflicto con trabajos de envío",
      message:
        "El artículo no puede ser eliminado porque en este momento se esta enviando a ACM Suite.",
    },
    [ArticleErrors.MULTIPLE_SEND_LEGAL_BASIS_JOBS_CONFLICT]: {
      title: "Conflicto con trabajos de envío",
      message: ({ items }) =>
        items.length === 1
          ? `El artículo ${items[0]} no puede ser eliminado porque en este momento se esta enviando a ACM Suite.`
          : `Los artículos ${items.join(
              ", "
            )} no pueden ser eliminados porque en este momento se estan enviando a ACM Suite.`,
    },
    [ArticleErrors.LEGAL_BASIS_NOT_FOUND]: {
      title: "Fundamento legal no encontrado",
      message:
        "El fundamento legal seleccionado no fue encontrado. Verifique su existencia recargando la app e intente de nuevo.",
    },
    [ArticleErrors.CONFLICT]: {
      title: "Conflicto detectado",
      message:
        "Ocurrió un conflicto con la operación. Verifique la información e intente nuevamente.",
    },
    [ArticleErrors.SERVER_ERROR]: {
      title: "Error interno del servidor",
      message:
        "Hubo un error en el servidor. Espere un momento e intente nuevamente.",
    },
    [ArticleErrors.UNEXPECTED_ERROR]: {
      title: "Error inesperado",
      message:
        "Ocurrió un error inesperado. Por favor, intente nuevamente más tarde.",
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
    Unauthorized: ArticleErrors.UNAUTHORIZED,
    "LegalBasis not found": ArticleErrors.LEGAL_BASIS_NOT_FOUND,
    "The Article is associated with one or more requirement identifications":
      ArticleErrors.ASSOCIATED_TO_REQ_IDENTIFICATIONS_CONFLICT,
    "Cannot delete Article with pending Requirement Identification jobs":
      ArticleErrors.REQ_IDENTIFICATION_JOBS_CONFLICT,
    "Some Articles are associated with requirement identifications":
      ArticleErrors.MULTIPLE_ASSOCIATED_TO_REQ_IDENTIFICATIONS_CONFLICT,
    "Cannot delete Articles with pending Requirement Identification jobs":
      ArticleErrors.MULTIPLE_REQ_IDENTIFICATION_JOBS_CONFLICT,
    "Cannot delete Article with pending Send Legal Basis jobs":
      ArticleErrors.SEND_LEGAL_BASIS_JOBS_CONFLICT,
    "Cannot delete Articles with pending Send Legal Basis jobs":
      ArticleErrors.MULTIPLE_SEND_LEGAL_BASIS_JOBS_CONFLICT,
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
      const errorConfig = ArticleErrors.errorMap[key];
      if (
        [
          ArticleErrors.MULTIPLE_SEND_LEGAL_BASIS_JOBS_CONFLICT,
          ArticleErrors.MULTIPLE_ASSOCIATED_TO_REQ_IDENTIFICATIONS_CONFLICT,
          ArticleErrors.MULTIPLE_REQ_IDENTIFICATION_JOBS_CONFLICT,
        ].includes(key) &&
        items &&
        items.length > 0
      ) {
        return {
          title: errorConfig.title,
          message: errorConfig.message({ items }),
        };
      }
      return errorConfig;
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
      case 409:
        return ArticleErrors.errorMap[ArticleErrors.CONFLICT];
      case 500:
      default:
        return ArticleErrors.errorMap[ArticleErrors.UNEXPECTED_ERROR];
    }
  }
}

export default ArticleErrors;
