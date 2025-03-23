/**
 * Class for managing and mapping errors related to aspects.
 * Centralizes error handling, mapping error codes and messages to user-friendly messages.
 */
class AspectErrors {
  static NETWORK_ERROR = "NETWORK_ERROR";
  static VALIDATION_ERROR = "VALIDATION_ERROR";
  static UNAUTHORIZED = "UNAUTHORIZED";
  static NOT_FOUND = "NOT_FOUND";
  static MULTIPLE_NOT_FOUND = "MULTIPLE_NOT_FOUND";
  static SUBJECT_NOT_FOUND = "SUBJECT_NOT_FOUND";
  static SERVER_ERROR = "SERVER_ERROR";
  static UNEXPECTED_ERROR = "UNEXPECTED_ERROR";
  static DUPLICATED_NAME = "DUPLICATED_NAME";
  static ASSOCIATED_BASES = "ASSOCIATED_BASES";
  static ASSOCIATED_REQUIREMENTS = "ASSOCIATED_REQUIREMENTS";
  static MULTIPLE_ASSOCIATED_BASES = "MULTIPLE_ASSOCIATED_BASES";
  static MULTIPLE_ASSOCIATED_REQUIREMENTS = "MULTIPLE_ASSOCIATED_REQUIREMENTS";

  /**
   * A map of error constants to user-friendly error objects.
   * Each object contains:
   * - `title`: A short, descriptive title for the error.
   * - `message`: A detailed explanation of the error, which may be static or dynamically generated.
   */
  static errorMap = {
    [AspectErrors.NETWORK_ERROR]: {
      title: "Error de conexión",
      message:
        "Hubo un problema de red. Verifique su conexión a internet e intente nuevamente.",
    },
    [AspectErrors.VALIDATION_ERROR]: {
      title: "Error de validación",
      message:
        "Revisa los datos introducidos. Uno o más campos no son válidos.",
    },
    [AspectErrors.UNAUTHORIZED]: {
      title: "Acceso no autorizado",
      message:
        "No tiene permisos para realizar esta acción. Verifique su sesión.",
    },
    [AspectErrors.NOT_FOUND]: {
      title: "No encontrado",
      message:
        "El aspecto no fue encontrado. Verifique su existencia recargando la app e intente de nuevo.",
    },
    [AspectErrors.MULTIPLE_NOT_FOUND]: {
      title: "No encontrado",
      message:
        "Uno o más aspectos no fueron encontrados. Verifique su existencia recargando la app e intente de nuevo.",
    },
    [AspectErrors.SUBJECT_NOT_FOUND]: {
      title: "Materia no encontrada",
      message:
        "La materia seleccionada no fue encontrada. Verifique su existencia recargando la app e intente de nuevo.",
    },
    [AspectErrors.SERVER_ERROR]: {
      title: "Error interno del servidor",
      message:
        "Hubo un error en el servidor. Espere un momento e intente nuevamente.",
    },
    [AspectErrors.UNEXPECTED_ERROR]: {
      title: "Error inesperado",
      message:
        "Ocurrió un error inesperado. Por favor, intente nuevamente más tarde.",
    },
    [AspectErrors.DUPLICATED_NAME]: {
      title: "Nombre duplicado",
      message: "El nombre ya está en uso. Por favor, utilice otro.",
    },
    [AspectErrors.ASSOCIATED_BASES]: {
      title: "Asociación con Fundamentos legales",
      message:
        "El aspecto está vinculado a uno o más fundamentos legales y no puede ser eliminado. Por favor, verifique e intente de nuevo.",
    },
    [AspectErrors.MULTIPLE_ASSOCIATED_BASES]: {
      title: "Asociación con Fundamentos legales",
      message: ({ items }) =>
        items.length === 1
          ? `El aspecto ${items[0]} está vinculado a uno o más fundamentos legales y no puede ser eliminado. Por favor, verifique e intente de nuevo.`
          : `Los aspectos ${items.join(
              ", "
            )} están vinculados a uno o más fundamentos legales y no pueden ser eliminados. Por favor, verifique e intente de nuevo.`,
    },
    [AspectErrors.ASSOCIATED_REQUIREMENTS]: {
      title: "Asociación con Requerimientos",
      message:
        "El aspecto está vinculado a uno o más requerimientos legales y no puede ser eliminado. Por favor, verifique e intente de nuevo.",
    },
    [AspectErrors.MULTIPLE_ASSOCIATED_REQUIREMENTS]: {
      title: "Asociación con Requerimientos",
      message: ({ items }) =>
        items.length === 1
          ? `El aspecto ${items[0]} está vinculado a uno o más requerimientos legales y no puede ser eliminado. Por favor, verifique e intente de nuevo.`
          : `Los aspectos ${items.join(
              ", "
            )} están vinculados a uno o más requerimientos legales y no pueden ser eliminados. Por favor, verifique e intente de nuevo.`,
    },
  };

  /**
   * A map of specific error messages to their corresponding error constants.
   * This map is used to translate error messages from the server or HTTP Errors into standardized error types.
   *
   * @type {Object.<string, AspectErrors>}
   */
  static ErrorMessagesMap = {
    "Network Error": AspectErrors.NETWORK_ERROR,
    "Aspect already exists": AspectErrors.DUPLICATED_NAME,
    "The aspect is associated with one or more legal bases":
      AspectErrors.ASSOCIATED_BASES,
    "The aspect is associated with one or more requirements":
      AspectErrors.ASSOCIATED_REQUIREMENTS,
    "Aspects are associated with legal bases":
      AspectErrors.MULTIPLE_ASSOCIATED_BASES,
    "Aspects are associated with requirements":
      AspectErrors.MULTIPLE_ASSOCIATED_REQUIREMENTS,
    "Subject not found": AspectErrors.SUBJECT_NOT_FOUND,
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
    if (message && AspectErrors.ErrorMessagesMap[message]) {
      const key = AspectErrors.ErrorMessagesMap[message];
      const errorConfig = AspectErrors.errorMap[key];
      if (
        (key === AspectErrors.MULTIPLE_ASSOCIATED_BASES ||
          key === AspectErrors.MULTIPLE_ASSOCIATED_REQUIREMENTS) &&
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
        return AspectErrors.errorMap[AspectErrors.VALIDATION_ERROR];
      case 401:
      case 403:
        return AspectErrors.errorMap[AspectErrors.UNAUTHORIZED];
      case 404:
        if (items && items.length > 0) {
          return items.length === 1
            ? AspectErrors.errorMap[AspectErrors.NOT_FOUND]
            : AspectErrors.errorMap[AspectErrors.MULTIPLE_NOT_FOUND];
        }
        return AspectErrors.errorMap[AspectErrors.NOT_FOUND];
      case 500:
        return AspectErrors.errorMap[AspectErrors.SERVER_ERROR];
      default:
        return AspectErrors.errorMap[AspectErrors.UNEXPECTED_ERROR];
    }
  }
}

export default AspectErrors;
