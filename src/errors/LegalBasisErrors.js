/**
 * Class for managing and mapping errors related to legal basis.
 * Centralizes error handling, mapping error codes and messages to user-friendly messages.
 */
class LegalBasisErrors {
    static NETWORK_ERROR = "NETWORK_ERROR";
    static UNAUTHORIZED = "UNAUTHORIZED";
    static SERVER_ERROR = "SERVER_ERROR";
    static VALIDATION_ERROR = "VALIDATION_ERROR";
    static NOT_FOUND = "NOT_FOUND";
    static MULTIPLE_NOT_FOUND = "MULTIPLE_NOT_FOUND";
    static SUBJECT_NOT_FOUND = "SUBJECT_NOT_FOUND";
    static ASPECTS_NOT_FOUND = "ASPECTS_NOT_FOUND";
    static UNEXPECTED_ERROR = "UNEXPECTED_ERROR";
    static DUPLICATED_NAME = "DUPLICATED_NAME";
  
    /**
     * A map of error constants to user-friendly error objects.
     */
    static errorMap = {
      [LegalBasisErrors.NETWORK_ERROR]: {
        title: "Error de conexión",
        message: "Hubo un problema de red. Verifique su conexión a internet e intente nuevamente.",
      },
      [LegalBasisErrors.UNAUTHORIZED]: {
        title: "Acceso no autorizado",
        message: "No tiene permisos para realizar esta acción. Verifique su sesión.",
      },
      [LegalBasisErrors.SERVER_ERROR]: {
        title: "Error interno del servidor",
        message: "Hubo un error en el servidor. Espere un momento e intente nuevamente.",
      },
      [LegalBasisErrors.VALIDATION_ERROR]: {
        title: "Error de validación",
        message: "Revisa los datos introducidos. Uno o más campos no son válidos.",
      },
      [LegalBasisErrors.NOT_FOUND]: {
        title: "Fundamento legal no encontrado",
        message: "El fundamento legal solicitado no fue encontrado. Verifique su existencia recargando la app e intente de nuevo.",
      },
      [LegalBasisErrors.MULTIPLE_NOT_FOUND]: {
        title: "Varios fundamentos legales no encontrados",
        message: "Uno o más fundamentos legales no fueron encontrados. Verifique su existencia recargando la app e intente de nuevo.",
      },
      [LegalBasisErrors.SUBJECT_NOT_FOUND]: {
        title: "Materia no encontrada",
        message: "La materia asociada no fue encontrada. Verifique su existencia recargando la app e intente de nuevo.",
      },
      [LegalBasisErrors.ASPECTS_NOT_FOUND]: {
        title: "Aspectos no encontrados",
        message: "Algunos aspectos seleccionados no fueron encontrados. Verifique su existencia recargando la app e intente de nuevo.",
      },
      [LegalBasisErrors.UNEXPECTED_ERROR]: {
        title: "Error inesperado",
        message:
          "Ocurrió un error inesperado. Por favor, intente nuevamente más tarde.",
      },
      [LegalBasisErrors.DUPLICATED_NAME]: {
        title: "Nombre duplicado",
        message: "El nombre ya está en uso. Por favor, utilice otro nombre.",
      },
    };
  
    /**
     * A map of specific error messages to their corresponding error constants.
     */
    static ErrorMessagesMap = {
      "Network Error": LegalBasisErrors.NETWORK_ERROR,
      "LegalBasis already exists": LegalBasisErrors.DUPLICATED_NAME,
      "Subject not found": LegalBasisErrors.SUBJECT_NOT_FOUND,
      "Aspects not found for IDs": LegalBasisErrors.ASPECTS_NOT_FOUND,
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
      if (message && LegalBasisErrors.ErrorMessagesMap[message]) {
        const key = LegalBasisErrors.ErrorMessagesMap[message];
        return LegalBasisErrors.errorMap[key];
      }
      switch (code) {
        case 400:
          return LegalBasisErrors.errorMap[LegalBasisErrors.VALIDATION_ERROR];
        case 401:
        case 403:
          return LegalBasisErrors.errorMap[LegalBasisErrors.UNAUTHORIZED];
          case 404:
            if (items && items.length > 0) {
              if (items.length === 1) {
                return LegalBasisErrors.errorMap[LegalBasisErrors.NOT_FOUND];
              } else {
                return LegalBasisErrors.errorMap[LegalBasisErrors.MULTIPLE_NOT_FOUND];
              }
            }
            return LegalBasisErrors.errorMap[LegalBasisErrors.MULTIPLE_NOT_FOUND];
        case 500:
          return LegalBasisErrors.errorMap[LegalBasisErrors.SERVER_ERROR];
        default:
          return LegalBasisErrors.errorMap[LegalBasisErrors.UNEXPECTED_ERROR];
      }
    }
  }
  
  export default LegalBasisErrors;
  