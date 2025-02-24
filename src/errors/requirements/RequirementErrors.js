/**
* Class to handle and map errors related to requirements.
* Centralizes error management, assigning user-friendly messages based on the error code received.
*/
class RequirementErrors {
    static NETWORK_ERROR = "NETWORK_ERROR";
    static UNAUTHORIZED = "UNAUTHORIZED";
    static SERVER_ERROR = "SERVER_ERROR";
    static VALIDATION_ERROR = "VALIDATION_ERROR";
    static NOT_FOUND = "NOT_FOUND";
    static MULTIPLE_NOT_FOUND = "MULTIPLE_NOT_FOUND";
    static NUMBER_DUPLICATED_REQUIREMENT = "NUMBER_DUPLICATED_REQUIREMENT";
    static NAME_DUPLICATED_REQUIREMENT = "NAME_DUPLICATED_REQUIREMENT";
    static CONFLICT = "CONFLICT";
    static SUBJECT_NOT_FOUND = "SUBJECT_NOT_FOUND";
    static ASPECT_NOT_FOUND = "ASPECT_NOT_FOUND";
    static UNEXPECTED_ERROR = "UNEXPECTED_ERROR";
  
  /**
   * A map of error constants to user-friendly error objects.
   */
    static errorMap = {
      [RequirementErrors.NETWORK_ERROR]: {
        title: "Error de conexión",
        message: "Hubo un problema de red. Verifique su conexión a internet e intente nuevamente.",
      },
      [RequirementErrors.UNAUTHORIZED]: {
        title: "Acceso no autorizado",
        message: "No tiene permisos para realizar esta acción. Verifique su sesión.",
      },
      [RequirementErrors.SERVER_ERROR]: {
        title: "Error interno del servidor",
        message: "Hubo un error en el servidor. Espere un momento e intente nuevamente.",
      },
      [RequirementErrors.VALIDATION_ERROR]: {
        title: "Error de validación",
        message: "Revisa los datos introducidos. Uno o más campos no son válidos.",
      },
      [RequirementErrors.NOT_FOUND]: {
        title: "Requerimiento no encontrado",
        message: "El requerimiento solicitado no existe. Verifique su existencia recargando la app e intente de nuevo.",
      },
      [RequirementErrors.MULTIPLE_NOT_FOUND]: {
        title: "Varios requerimientos legales no encontrados",
        message: "Uno o más requerimientos no fueron encontrados. Verifique su existencia recargando la app e intente de nuevo.",
      },
      [RequirementErrors.NUMBER_DUPLICATED_REQUIREMENT]: {
        title: "Numero de Requerimiento duplicado",
        message: "Ya existe un requerimiento con el mismo número. Por favor, utiliza otro.",
      },
      [RequirementErrors.NAME_DUPLICATED_REQUIREMENT]: {
        title: "Nombre de Requerimiento duplicado",
        message: "Ya existe un requerimiento con el mismo nombre. Por favor, utiliza otro.",
      },
      [RequirementErrors.CONFLICT]: {
        title: "Conflicto detectado",
        message: "Ocurrió un conflicto con la operación. Verifique la información e intente nuevamente.",
      },
      [RequirementErrors.SUBJECT_NOT_FOUND]: {
        title: "Materia no encontrada",
        message: "La materia seleccionada no fue encontrada. Verifique su existencia recargando la app e intente de nuevo.",
      },
      [RequirementErrors.ASPECT_NOT_FOUND]: {
        title: "Aspecto no encontrados",
        message: "El aspecto seleccionado no fue encontrado. Verifique su existencia recargando la app e intente de nuevo.",
      },
      [RequirementErrors.UNEXPECTED_ERROR]: {
        title: "Error inesperado",
        message: "Ocurrió un error inesperado. Por favor, intente nuevamente más tarde.",
      },
    };
  
  /**
   * A map of specific error messages to their corresponding error constants.
   */
    static ErrorMessagesMap = {
      "Network Error": RequirementErrors.NETWORK_ERROR,
      "Validation failed": RequirementErrors.VALIDATION_ERROR,
      "Requirement number already exists": RequirementErrors.NUMBER_DUPLICATED_REQUIREMENT,
      "Requirement name already exists": RequirementErrors.NAME_DUPLICATED_REQUIREMENT,
      "Requirement not found": RequirementErrors.NOT_FOUND,
      "Subject not found": RequirementErrors.SUBJECT_NOT_FOUND,
      "Aspect not found": RequirementErrors.ASPECT_NOT_FOUND,
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
  
      if (message && RequirementErrors.ErrorMessagesMap[message]) {
        const key = RequirementErrors.ErrorMessagesMap[message];
        return RequirementErrors.errorMap[key];
      }
  
      switch (code) {
        case 400:
          return RequirementErrors.errorMap[RequirementErrors.VALIDATION_ERROR];
        case 401:
        case 403:
          return RequirementErrors.errorMap[RequirementErrors.UNAUTHORIZED];
          case 404:
            if (items && items.length > 0) {
              if (items.length === 1) {
                return RequirementErrors.errorMap[RequirementErrors.NOT_FOUND];
              } else {
                return RequirementErrors.errorMap[RequirementErrors.MULTIPLE_NOT_FOUND];
              }
            }
            return RequirementErrors.errorMap[RequirementErrors.MULTIPLE_NOT_FOUND];
        case 409:
          return RequirementErrors.errorMap[RequirementErrors.CONFLICT];
        case 500:
          return RequirementErrors.errorMap[RequirementErrors.SERVER_ERROR];
        default:
          return RequirementErrors.errorMap[RequirementErrors.UNEXPECTED_ERROR];
      }
    }
  }
  
  export default RequirementErrors;
  