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
  static DOCUMENT_REQUIRED = "DOCUMENT_REQUIRED";
  static PENDING_JOBS_CONFLICT = "PENDING_JOBS_CONFLICT";
  static MULTIPLE_PENDING_JOBS_CONFLICT = "MULTIPLE_PENDING_JOBS_CONFLICT";
  static CONFLICT = "CONFLICT";

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
      message: "El fundamento legal no fue encontrado. Verifique su existencia recargando la app e intente de nuevo.",
    },
    [LegalBasisErrors.MULTIPLE_NOT_FOUND]: {
      title: "Varios fundamentos legales no encontrados",
      message: "Uno o más fundamentos legales no fueron encontrados. Verifique su existencia recargando la app e intente de nuevo.",
    },
    [LegalBasisErrors.SUBJECT_NOT_FOUND]: {
      title: "Materia no encontrada",
      message: "La materia seleccionada no fue encontrada. Verifique su existencia recargando la app e intente de nuevo.",
    },
    [LegalBasisErrors.ASPECTS_NOT_FOUND]: {
      title: "Aspectos no encontrados",
      message: "Algunos aspectos seleccionados no fueron encontrados. Verifique su existencia recargando la app e intente de nuevo.",
    },
    [LegalBasisErrors.DUPLICATED_NAME]: {
      title: "Nombre duplicado",
      message: "Ya existe un fundamento legal con el mismo nombre. Por favor, utiliza otro.",
    },
    [LegalBasisErrors.DOCUMENT_REQUIRED]: {
      title: "Documento requerido",
      message: "Debe proporcionarse un documento si se desea extraer artículos.",
    },
    [LegalBasisErrors.PENDING_JOBS_CONFLICT]: {
      title: "Conflicto con trabajos pendientes",
      message: "El fundamento legal no puede ser eliminado porque en este momento se están extrayendo artículos de su documento asociado.",
    },
    [LegalBasisErrors.MULTIPLE_PENDING_JOBS_CONFLICT]: {
      title: "Conflicto con trabajos pendientes",
      message: ({ items }) =>
        items.length === 1
          ? `El fundamento legal ${items[0]} no puede ser eliminado porque se están extrayendo artículos de su documento asociado.`
          : `Los fundamentos legales ${items.join(", ")} no pueden ser eliminados porque se están extrayendo artículos de sus documentos asociados.`,
    },
    [LegalBasisErrors.CONFLICT]: {
      title: "Conflicto",
      message: "No puedes realizar esta acción porque actualmente hay un proceso asociado con este fundamento legal.",
    },
    [LegalBasisErrors.UNEXPECTED_ERROR]: {
      title: "Error inesperado",
      message: "Ocurrió un error inesperado. Por favor, intente nuevamente más tarde.",
    },
  };

  /**
   * A map of specific error messages to their corresponding error constants.
   */
  static ErrorMessagesMap = {
    "Network Error": LegalBasisErrors.NETWORK_ERROR,
    "LegalBasis already exists": LegalBasisErrors.DUPLICATED_NAME,
    "A document must be provided if extractArticles is true": LegalBasisErrors.DOCUMENT_REQUIRED,
    "Subject not found": LegalBasisErrors.SUBJECT_NOT_FOUND,
    "Aspects not found for IDs": LegalBasisErrors.ASPECTS_NOT_FOUND,
    "Cannot delete Legal Bases with pending jobs": LegalBasisErrors.MULTIPLE_PENDING_JOBS_CONFLICT,
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
      const errorConfig = LegalBasisErrors.errorMap[key];
      if (
        key === LegalBasisErrors.MULTIPLE_PENDING_JOBS_CONFLICT &&
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
      case 409:
        return LegalBasisErrors.errorMap[LegalBasisErrors.CONFLICT];
      case 500:
        return LegalBasisErrors.errorMap[LegalBasisErrors.SERVER_ERROR];
      default:
        return LegalBasisErrors.errorMap[LegalBasisErrors.UNEXPECTED_ERROR];
    }
  }
}

export default LegalBasisErrors;
