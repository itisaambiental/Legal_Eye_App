/**
 * Class for managing and mapping errors related to requirement types.
 * Centralizes error handling, mapping error codes and messages to user-friendly messages.
 */
class RequirementTypesErrors {
    static NETWORK_ERROR = "NETWORK_ERROR";
    static VALIDATION_ERROR = "VALIDATION_ERROR";
    static UNAUTHORIZED = "UNAUTHORIZED";
    static NOT_FOUND = "NOT_FOUND";
    static MULTIPLE_NOT_FOUND = "MULTIPLE_NOT_FOUND";
    static SERVER_ERROR = "SERVER_ERROR";
    static UNEXPECTED_ERROR = "UNEXPECTED_ERROR";
    static DUPLICATED_NAME = "DUPLICATED_NAME";
    static ASSOCIATED_REQUIREMENTS = "ASSOCIATED_REQUIREMENTS";
    static MULTIPLE_ASSOCIATED_REQUIREMENTS = "MULTIPLE_ASSOCIATED_REQUIREMENTS";
  
    /**
     * A map of error constants to user-friendly error objects.
     */
    static errorMap = {
      [RequirementTypesErrors.NETWORK_ERROR]: {
        title: "Error de conexión",
        message:
          "Hubo un problema de red. Verifique su conexión a internet e intente nuevamente.",
      },
      [RequirementTypesErrors.VALIDATION_ERROR]: {
        title: "Error de validación",
        message:
          "Revisa los datos introducidos. Uno o más campos no son válidos.",
      },
      [RequirementTypesErrors.UNAUTHORIZED]: {
        title: "Acceso no autorizado",
        message:
          "No tiene permisos para realizar esta acción. Verifique su sesión.",
      },
      [RequirementTypesErrors.NOT_FOUND]: {
        title: "No encontrado",
        message:
          "Tipo de requerimiento no encontrado. Verifique su existencia recargando la app e intente de nuevo.",
      },
      [RequirementTypesErrors.MULTIPLE_NOT_FOUND]: {
        title: "No encontrado",
        message:
          "Uno o más tipos de requerimiento no encontrados. Verifique su existencia recargando la app e intente de nuevo.",
      },
      [RequirementTypesErrors.SERVER_ERROR]: {
        title: "Error interno del servidor",
        message:
          "Hubo un error en el servidor. Espere un momento e intente nuevamente.",
      },
      [RequirementTypesErrors.UNEXPECTED_ERROR]: {
        title: "Error inesperado",
        message:
          "Ocurrió un error inesperado. Por favor, intente nuevamente más tarde.",
      },
      [RequirementTypesErrors.DUPLICATED_NAME]: {
        title: "Nombre duplicado",
        message: "El nombre ya está en uso. Por favor, utilice otro.",
      },
      [RequirementTypesErrors.ASSOCIATED_REQUIREMENTS]: {
        title: "Asociación con Requerimientos",
        message:
          "Este tipo de requerimiento está vinculado a uno o más requerimientos legales y no puede ser eliminado.",
      },
      [RequirementTypesErrors.MULTIPLE_ASSOCIATED_REQUIREMENTS]: {
        title: "Asociación con Requerimientos",
        message: ({ items }) =>
          items.length === 1
            ? `El tipo ${items[0]} está vinculado a uno o más requerimientos legales y no puede ser eliminado.`
            : `Los tipos ${items.join(
                ", "
              )} están vinculados a uno o más requerimientos legales y no pueden ser eliminados.`,
      },
    };
  
    /**
     * Maps specific backend or HTTP error messages to internal error codes.
     */
    static ErrorMessagesMap = {
      "Network Error": RequirementTypesErrors.NETWORK_ERROR,
      "Requirement type already exists": RequirementTypesErrors.DUPLICATED_NAME,
      "The requirement type is associated with one or more requirements":
        RequirementTypesErrors.ASSOCIATED_REQUIREMENTS,
      "Requirement types are associated with requirements":
        RequirementTypesErrors.MULTIPLE_ASSOCIATED_REQUIREMENTS,
    };
  
    /**
     * Main error handler for mapping raw errors into user-friendly ones.
     * @param {Object} params
     * @param {number} params.code - HTTP error status code.
     * @param {string} [params.error] - Raw server error message.
     * @param {string} [params.httpError] - Raw HTTP error message.
     * @param {Array<string|number>} [params.items] - Optional list of items for dynamic messages.
     * @returns {Object} - A user-friendly error object.
     */
    static handleError({ code, error, httpError, items }) {
      const message = error || httpError;
      if (message && RequirementTypesErrors.ErrorMessagesMap[message]) {
        const key = RequirementTypesErrors.ErrorMessagesMap[message];
        const errorConfig = RequirementTypesErrors.errorMap[key];
        if (
          key === RequirementTypesErrors.MULTIPLE_ASSOCIATED_REQUIREMENTS &&
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
          return RequirementTypesErrors.errorMap[RequirementTypesErrors.VALIDATION_ERROR];
        case 401:
        case 403:
          return RequirementTypesErrors.errorMap[RequirementTypesErrors.UNAUTHORIZED];
        case 404:
          if (items?.length > 0) {
            return items.length === 1
              ? RequirementTypesErrors.errorMap[RequirementTypesErrors.NOT_FOUND]
              : RequirementTypesErrors.errorMap[RequirementTypesErrors.MULTIPLE_NOT_FOUND];
          }
          return RequirementTypesErrors.errorMap[RequirementTypesErrors.MULTIPLE_NOT_FOUND];
        case 500:
          return RequirementTypesErrors.errorMap[RequirementTypesErrors.SERVER_ERROR];
        default:
          return RequirementTypesErrors.errorMap[RequirementTypesErrors.UNEXPECTED_ERROR];
      }
    }
  }
  
  export default RequirementTypesErrors;
  