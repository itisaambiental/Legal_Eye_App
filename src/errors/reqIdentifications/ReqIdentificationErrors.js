/**
 * Class for managing and mapping errors related to Requirement Identifications.
 * Centralizes error handling, mapping error codes and messages to user-friendly messages.
 */
class ReqIdentificationErrors {
  static NETWORK_ERROR = "NETWORK_ERROR";
  static UNAUTHORIZED = "UNAUTHORIZED";
  static SERVER_ERROR = "SERVER_ERROR";
  static VALIDATION_ERROR = "VALIDATION_ERROR";
  static NOT_FOUND = "NOT_FOUND";
  static MULTIPLE_NOT_FOUND = "MULTIPLE_NOT_FOUND";
  static DUPLICATED_NAME = "DUPLICATED_NAME";
  static LEGAL_BASIS_NOT_FOUND = "LEGAL_BASIS_NOT_FOUND";
  static SUBJECTS_NOT_MATCH = "SUBJECTS_NOT_MATCH";
  static JURISDICTIONS_NOT_MATCH = "JURISDICTIONS_NOT_MATCH";
  static STATES_NOT_MATCH = "STATES_NOT_MATCH";
  static MUNICIPALITIES_NOT_MATCH = "MUNICIPALITIES_NOT_MATCH";
  static REQUIREMENTS_NOT_FOUND = "REQUIREMENTS_NOT_FOUND";
  static UNEXPECTED_ERROR = "UNEXPECTED_ERROR";

  /**
   * A map of error constants to user-friendly error objects.
   */
  static errorMap = {
    [ReqIdentificationErrors.NETWORK_ERROR]: {
      title: "Error de conexión",
      message:
        "Hubo un problema de red. Verifique su conexión a internet e intente nuevamente.",
    },
    [ReqIdentificationErrors.UNAUTHORIZED]: {
      title: "Acceso no autorizado",
      message:
        "No tiene permisos para realizar esta acción. Verifique su sesión.",
    },
    [ReqIdentificationErrors.SERVER_ERROR]: {
      title: "Error interno del servidor",
      message:
        "Hubo un error en el servidor. Espere un momento e intente nuevamente.",
    },
    [ReqIdentificationErrors.VALIDATION_ERROR]: {
      title: "Error de validación",
      message:
        "Revisa los datos introducidos. Uno o más campos no son válidos.",
    },
    [ReqIdentificationErrors.NOT_FOUND]: {
      title: "Identificación no encontrada",
      message:
        "La identificación de requerimientos no fue encontrada. Verifique su existencia recargando la app e intente de nuevo.",
    },
    [ReqIdentificationErrors.MULTIPLE_NOT_FOUND]: {
      title: "Identificaciones no encontradas",
      message:
        "Una o más identificaciones de requerimientos no fueron encontradas. Verifique su existencia recargando la app e intente de nuevo.",
    },
    [ReqIdentificationErrors.DUPLICATED_NAME]: {
      title: "Nombre duplicado",
      message:
        "Ya existe una identificación de requerimientos con el mismo nombre. Por favor, utilice otro.",
    },
    [ReqIdentificationErrors.LEGAL_BASIS_NOT_FOUND]: {
      title: "Fundamentos legales no encontrados",
      message:
        "Uno o más fundamentos legales seleccionados no fueron encontrados. Verifique su existencia recargando la app e intente de nuevo.",
    },
    [ReqIdentificationErrors.SUBJECTS_NOT_MATCH]: {
      title: "Conflicto de materias",
      message:
        "Todos los fundamentos legales seleccionados deben pertenecer a la misma materia.",
    },
    [ReqIdentificationErrors.JURISDICTIONS_NOT_MATCH]: {
      title: "Conflicto de jurisdicción",
      message:
        "Todos los fundamentos legales seleccionados deben tener la misma jurisdicción.",
    },
    [ReqIdentificationErrors.STATES_NOT_MATCH]: {
      title: "Conflicto de estado",
      message:
        "Todos los fundamentos legales seleccionados deben pertenecer al mismo estado si la jurisdicción es Estatal.",
    },
    [ReqIdentificationErrors.MUNICIPALITIES_NOT_MATCH]: {
      title: "Conflicto de municipio",
      message:
        "Todos los fundamentos legales seleccionados deben pertenecer al mismo si la jurisdicción es Municipal.",
    },
    [ReqIdentificationErrors.REQUIREMENTS_NOT_FOUND]: {
      title: "Requerimientos no encontrados",
      message:
        "No se encontraron requerimientos aplicables a la materia y aspectos seleccionados. Por favor, verifique que existen requerimientos registrados para la materia correspondiente y que los aspectos seleccionados estén correctamente asociados.",
    },
    [ReqIdentificationErrors.UNEXPECTED_ERROR]: {
      title: "Error inesperado",
      message:
        "Ocurrió un error inesperado. Por favor, intente nuevamente más tarde.",
    },
  };

  /**
   * A map of specific error messages to their corresponding error constants.
   * @type {Object.<string, ReqIdentificationErrors>}
   */
  static ErrorMessagesMap = {
    "Network Error": ReqIdentificationErrors.NETWORK_ERROR,
    "Requirement Identification name already exists":
      ReqIdentificationErrors.DUPLICATED_NAME,
    "LegalBasis not found for IDs":
      ReqIdentificationErrors.LEGAL_BASIS_NOT_FOUND,
    "All selected legal bases must have the same subject":
      ReqIdentificationErrors.SUBJECTS_NOT_MATCH,
    "All selected legal bases must have the same jurisdiction":
      ReqIdentificationErrors.JURISDICTIONS_NOT_MATCH,
    "All selected legal bases must have the same state":
      ReqIdentificationErrors.STATES_NOT_MATCH,
    "All selected legal bases must have the same municipality":
      ReqIdentificationErrors.MUNICIPALITIES_NOT_MATCH,
    "Requirements not found": ReqIdentificationErrors.REQUIREMENTS_NOT_FOUND,
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
    if (message && ReqIdentificationErrors.ErrorMessagesMap[message]) {
      const key = ReqIdentificationErrors.ErrorMessagesMap[message];
      return ReqIdentificationErrors.errorMap[key];
    }

    switch (code) {
      case 400:
        return ReqIdentificationErrors.errorMap[
          ReqIdentificationErrors.VALIDATION_ERROR
        ];
      case 401:
      case 403:
        return ReqIdentificationErrors.errorMap[
          ReqIdentificationErrors.UNAUTHORIZED
        ];
      case 404:
        if (items?.length > 0) {
          return items.length === 1
            ? ReqIdentificationErrors.errorMap[
                ReqIdentificationErrors.NOT_FOUND
              ]
            : ReqIdentificationErrors.errorMap[
                ReqIdentificationErrors.MULTIPLE_NOT_FOUND
              ];
        }
        return ReqIdentificationErrors.errorMap[
          ReqIdentificationErrors.MULTIPLE_NOT_FOUND
        ];
      case 500:
        return ReqIdentificationErrors.errorMap[
          ReqIdentificationErrors.SERVER_ERROR
        ];
      default:
        return ReqIdentificationErrors.errorMap[
          ReqIdentificationErrors.UNEXPECTED_ERROR
        ];
    }
  }
}

export default ReqIdentificationErrors;
