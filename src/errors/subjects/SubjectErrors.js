/**
 * Class for managing and mapping errors related to subjects.
 * Centralizes error handling, mapping error codes and messages to user-friendly messages.
 */
class SubjectErrors {
  static NETWORK_ERROR = "NETWORK_ERROR";
  static VALIDATION_ERROR = "VALIDATION_ERROR";
  static UNAUTHORIZED = "UNAUTHORIZED";
  static NOT_FOUND = "NOT_FOUND";
  static MULTIPLE_NOT_FOUND = "MULTIPLE_NOT_FOUND";
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
    [SubjectErrors.NETWORK_ERROR]: {
      title: "Error de conexión",
      message:
        "Hubo un problema de red. Verifique su conexión a internet e intente nuevamente.",
    },
    [SubjectErrors.VALIDATION_ERROR]: {
      title: "Error de validación",
      message:
        "Revisa los datos introducidos. Uno o más campos no son válidos.",
    },
    [SubjectErrors.UNAUTHORIZED]: {
      title: "Acceso no autorizado",
      message:
        "No tiene permisos para realizar esta acción. Verifique su sesión.",
    },
    [SubjectErrors.NOT_FOUND]: {
      title: "No encontrado",
      message:
        "Materia no encontrada. Verifique su existencia recargando la app e intente de nuevo.",
    },
    [SubjectErrors.MULTIPLE_NOT_FOUND]: {
      title: "No encontrado",
      message:
        "Una o más materias no encontradas. Verifique su existencia recargando la app e intente de nuevo.",
    },
    [SubjectErrors.SERVER_ERROR]: {
      title: "Error interno del servidor",
      message:
        "Hubo un error en el servidor. Espere un momento e intente nuevamente.",
    },
    [SubjectErrors.UNEXPECTED_ERROR]: {
      title: "Error inesperado",
      message:
        "Ocurrió un error inesperado. Por favor, intente nuevamente más tarde.",
    },
    [SubjectErrors.DUPLICATED_NAME]: {
      title: "Nombre duplicado",
      message: "El nombre ya está en uso. Por favor, utilice otro.",
    },
    [SubjectErrors.ASSOCIATED_BASES]: {
      title: "Asociación con Fundamentos legales",
      message:
        "La materia está vinculada a uno o más fundamentos legales y no puede ser eliminada. Por favor, verifique e intente de nuevo.",
    },
    [SubjectErrors.MULTIPLE_ASSOCIATED_BASES]: {
      title: "Asociación con Fundamentos legales",
      message: ({ items }) =>
        items.length === 1
          ? `La materia ${items[0]} está vinculada a uno o más fundamentos legales y no puede ser eliminada. Por favor, verifique e intente de nuevo.`
          : `Las materias ${items.join(
              ", "
            )} están vinculadas a uno o más fundamentos legales y no pueden ser eliminadas. Por favor, verifique e intente de nuevo.`,
    },
    [SubjectErrors.ASSOCIATED_REQUIREMENTS]: {
      title: "Asociación con Requerimientos",
      message:
        "La materia está vinculada a uno o más requerimientos legales y no puede ser eliminada. Por favor, verifique e intente de nuevo.",
    },
    [SubjectErrors.MULTIPLE_ASSOCIATED_REQUIREMENTS]: {
      title: "Asociación con Requerimientos",
      message: ({ items }) =>
        items.length === 1
          ? `La materia ${items[0]} está vinculada a uno o más requerimientos legales y no puede ser eliminada. Por favor, verifique e intente de nuevo.`
          : `Las materias ${items.join(
              ", "
            )} están vinculadas a uno o más requerimientos legales y no pueden ser eliminadas. Por favor, verifique e intente de nuevo.`,
    },
  };

  /**
   * A map of specific error messages to their corresponding error constants.
   * This map is used to translate error messages from the server or Http Erros into standardized error types.
   *
   * @type {Object.<string, SubjectErrors>}
   */
  static ErrorMessagesMap = {
    "Network Error": SubjectErrors.NETWORK_ERROR,
    "Subject already exists": SubjectErrors.DUPLICATED_NAME,
    "The subject is associated with one or more legal bases": SubjectErrors.ASSOCIATED_BASES, 
    "Subjects are associated with legal bases": SubjectErrors.MULTIPLE_ASSOCIATED_BASES,
    "The subject is associated with one or more requirements": SubjectErrors.ASSOCIATED_REQUIREMENTS,
    "Subjects are associated with requirements": SubjectErrors.MULTIPLE_ASSOCIATED_REQUIREMENTS,
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
    if (message && SubjectErrors.ErrorMessagesMap[message]) {
      const key = SubjectErrors.ErrorMessagesMap[message];
      const errorConfig = SubjectErrors.errorMap[key];
      if (
        (key === SubjectErrors.MULTIPLE_ASSOCIATED_BASES ||
          key === SubjectErrors.MULTIPLE_ASSOCIATED_REQUIREMENTS) &&
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
        return SubjectErrors.errorMap[SubjectErrors.VALIDATION_ERROR];
      case 401:
      case 403:
        return SubjectErrors.errorMap[SubjectErrors.UNAUTHORIZED];
      case 404:
        if (items && items.length > 0) {
          if (items.length === 1) {
            return SubjectErrors.errorMap[SubjectErrors.NOT_FOUND];
          } else {
            return SubjectErrors.errorMap[SubjectErrors.MULTIPLE_NOT_FOUND];
          }
        }
        return SubjectErrors.errorMap[SubjectErrors.MULTIPLE_NOT_FOUND];
      case 500:
        return SubjectErrors.errorMap[SubjectErrors.SERVER_ERROR];
      default:
        return SubjectErrors.errorMap[SubjectErrors.UNEXPECTED_ERROR];
    }
  }
}

export default SubjectErrors;
