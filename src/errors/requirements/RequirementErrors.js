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
  static NAME_DUPLICATED_REQUIREMENT = "NAME_DUPLICATED_REQUIREMENT";
  static ASSOCIATED_TO_REQ_IDENTIFICATIONS_CONFLICT =
    "ASSOCIATED_TO_REQ_IDENTIFICATIONS_CONFLICT";
  static MULTIPLE_ASSOCIATED_TO_REQ_IDENTIFICATIONS_CONFLICT =
    "MULTIPLE_ASSOCIATED_TO_REQ_IDENTIFICATIONS_CONFLICT";
  static REQ_IDENTIFICATION_JOBS_CONFLICT = "REQ_IDENTIFICATION_JOBS_CONFLICT";
  static MULTIPLE_REQ_IDENTIFICATION_JOBS_CONFLICT =
    "MULTIPLE_REQ_IDENTIFICATION_JOBS_CONFLICT";
  static CONFLICT = "CONFLICT";
  static SUBJECT_NOT_FOUND = "SUBJECT_NOT_FOUND";
  static ASPECTS_NOT_FOUND = "ASPECTS_NOT_FOUND";
  static UNEXPECTED_ERROR = "UNEXPECTED_ERROR";

  /**
   * A map of error constants to user-friendly error objects.
   */
  static errorMap = {
    [RequirementErrors.NETWORK_ERROR]: {
      title: "Error de conexión",
      message:
        "Hubo un problema de red. Verifique su conexión a internet e intente nuevamente.",
    },
    [RequirementErrors.UNAUTHORIZED]: {
      title: "Acceso no autorizado",
      message:
        "No tiene permisos para realizar esta acción. Verifique su sesión.",
    },
    [RequirementErrors.SERVER_ERROR]: {
      title: "Error interno del servidor",
      message:
        "Hubo un error en el servidor. Espere un momento e intente nuevamente.",
    },
    [RequirementErrors.VALIDATION_ERROR]: {
      title: "Error de validación",
      message:
        "Revisa los datos introducidos. Uno o más campos no son válidos.",
    },
    [RequirementErrors.NOT_FOUND]: {
      title: "Requerimiento no encontrado",
      message:
        "El requerimiento no fue encontrado. Verifique su existencia recargando la app e intente de nuevo.",
    },
    [RequirementErrors.MULTIPLE_NOT_FOUND]: {
      title: "Varios requerimientos legales no encontrados",
      message:
        "Uno o más requerimientos no fueron encontrados. Verifique su existencia recargando la app e intente de nuevo.",
    },
    [RequirementErrors.NAME_DUPLICATED_REQUIREMENT]: {
      title: "Nombre de Requerimiento duplicado",
      message:
        "Ya existe un requerimiento con el mismo nombre. Por favor, utiliza otro.",
    },
    [RequirementErrors.ASSOCIATED_TO_REQ_IDENTIFICATIONS_CONFLICT]: {
      title: "Requerimiento vinculado a una identificación",
      message:
        "El requerimiento está vinculado a una o más identificación de requerimientos y no puede ser eliminado.",
    },
    [RequirementErrors.MULTIPLE_ASSOCIATED_TO_REQ_IDENTIFICATIONS_CONFLICT]: {
      title: "Requerimientos vinculados a identificaciones",
      message: ({ items }) =>
        items.length === 1
          ? `El requerimiento ${items[0]} está vinculado a una o más identificaciones de requerimientos y no puede ser eliminado.`
          : `Los requerimientos ${items.join(
              ", "
            )} están vinculados a una o más identificaciones de requerimientos y no pueden ser eliminados.`,
    },
    [RequirementErrors.REQ_IDENTIFICATION_JOBS_CONFLICT]: {
      title: "Conflicto con trabajos pendientes",
      message:
        "Este requerimiento no puede ser eliminado porque actualmente se están identificando requerimientos. Por favor, espere a que se complete la identificación e intente nuevamente.",
    },
    [RequirementErrors.MULTIPLE_REQ_IDENTIFICATION_JOBS_CONFLICT]: {
      title: "Conflicto con trabajos pendientes",
      message: ({ items }) =>
        items.length === 1
          ? `El requerimiento ${items[0]} no puede ser eliminado porque actualmente se están identificando requerimientos. Por favor, espere a que se complete la identificación e intente nuevamente.`
          : `Los requerimientos ${items.join(
              ", "
            )} no pueden ser eliminados porque actualmente se están identificando requerimientos. Por favor, espere a que se complete la identificación e intente nuevamente.`,
    },
    [RequirementErrors.CONFLICT]: {
      title: "Conflicto detectado",
      message:
        "Ocurrió un conflicto con la operación. Verifique la información e intente nuevamente.",
    },
    [RequirementErrors.SUBJECT_NOT_FOUND]: {
      title: "Materia no encontrada",
      message:
        "La materia seleccionada no fue encontrada. Verifique su existencia recargando la app e intente de nuevo.",
    },
    [RequirementErrors.ASPECTS_NOT_FOUND]: {
      title: "Aspectos no encontrados",
      message:
        "Algunos aspectos seleccionados no fueron encontrados. Verifique su existencia recargando la app e intente de nuevo.",
    },
    [RequirementErrors.UNEXPECTED_ERROR]: {
      title: "Error inesperado",
      message:
        "Ocurrió un error inesperado. Por favor, intente nuevamente más tarde.",
    },
  };

  /**
   * A map of specific error messages to their corresponding error constants.
   * @type {Object.<string, RequirementErrors>}
   */
  static ErrorMessagesMap = {
    "Network Error": RequirementErrors.NETWORK_ERROR,
    "Validation failed": RequirementErrors.VALIDATION_ERROR,
    "Requirement name already exists":
      RequirementErrors.NAME_DUPLICATED_REQUIREMENT,
    "Requirement not found": RequirementErrors.NOT_FOUND,
    "Subject not found": RequirementErrors.SUBJECT_NOT_FOUND,
    "Aspects not found for IDs": RequirementErrors.ASPECTS_NOT_FOUND,
    "The Requirement is associated with one or more requirement identifications":
      RequirementErrors.ASSOCIATED_TO_REQ_IDENTIFICATIONS_CONFLICT,
    "Some Requirements are associated with requirement identifications":
      RequirementErrors.MULTIPLE_ASSOCIATED_TO_REQ_IDENTIFICATIONS_CONFLICT,
    "Cannot delete Requirement with pending Requirement Identification jobs":
      RequirementErrors.REQ_IDENTIFICATION_JOBS_CONFLICT,
    "Cannot delete Requirements with pending Requirement Identification jobs":
      RequirementErrors.MULTIPLE_REQ_IDENTIFICATION_JOBS_CONFLICT,
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
      const errorConfig = RequirementErrors.errorMap[key];

      if (
        [
          RequirementErrors.MULTIPLE_ASSOCIATED_TO_REQ_IDENTIFICATIONS_CONFLICT,
          RequirementErrors.MULTIPLE_REQ_IDENTIFICATION_JOBS_CONFLICT,
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
        return RequirementErrors.errorMap[RequirementErrors.VALIDATION_ERROR];
      case 401:
      case 403:
        return RequirementErrors.errorMap[RequirementErrors.UNAUTHORIZED];
      case 404:
        if (items && items.length > 0) {
          if (items.length === 1) {
            return RequirementErrors.errorMap[RequirementErrors.NOT_FOUND];
          } else {
            return RequirementErrors.errorMap[
              RequirementErrors.MULTIPLE_NOT_FOUND
            ];
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
