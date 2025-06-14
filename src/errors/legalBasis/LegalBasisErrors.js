/**
 * Class for managing and mapping errors related to Legal Basis.
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
  static DUPLICATED_ABBREVIATION = "DUPLICATED_ABBREVIATION";
  static DOCUMENT_REQUIRED = "DOCUMENT_REQUIRED";
  static ARTICLE_EXTRACTION_JOBS_CONFLICT = "ARTICLE_EXTRACTION_JOBS_CONFLICT";
  static MULTIPLE_ARTICLE_EXTRACTION_JOBS_CONFLICT =
    "MULTIPLE_ARTICLE_EXTRACTION_JOBS_CONFLICT";
  static ARTICLES_EXTRACTION_CONFLICT = "ARTICLES_EXTRACTION_CONFLICT";
  static ASSOCIATED_TO_REQ_IDENTIFICATIONS_CONFLICT =
    "ASSOCIATED_TO_REQ_IDENTIFICATIONS_CONFLICT";
  static MULTIPLE_ASSOCIATED_TO_REQ_IDENTIFICATIONS_CONFLICT =
    "MULTIPLE_ASSOCIATED_TO_REQ_IDENTIFICATIONS_CONFLICT";
  static REQ_IDENTIFICATION_JOBS_CONFLICT = "REQ_IDENTIFICATION_JOBS_CONFLICT";
  static MULTIPLE_REQ_IDENTIFICATION_JOBS_CONFLICT =
    "MULTIPLE_REQ_IDENTIFICATION_JOBS_CONFLICT";
  static SEND_LEGAL_BASIS_JOBS_CONFLICT = "SEND_LEGAL_BASIS_JOBS_CONFLICT";
  static MULTIPLE_SEND_LEGAL_BASIS_JOBS_CONFLICT =
    "MULTIPLE_SEND_LEGAL_BASIS_JOBS_CONFLICT";
  static DOCUMENT_CONFLICT = "DOCUMENT_CONFLICT";
  static REMOVE_DOCUMENT_PENDING_CONFLICT = "REMOVE_DOCUMENT_PENDING_CONFLICT";
  static NEW_DOCUMENT_PENDING_CONFLICT = "NEW_DOCUMENT_PENDING_CONFLICT";
  static CONFLICT = "CONFLICT";

  /**
   * A map of error constants to user-friendly error objects.
   */
  static errorMap = {
    [LegalBasisErrors.NETWORK_ERROR]: {
      title: "Error de conexión",
      message:
        "Hubo un problema de red. Verifique su conexión a internet e intente nuevamente.",
    },
    [LegalBasisErrors.UNAUTHORIZED]: {
      title: "Acceso no autorizado",
      message:
        "No tiene permisos para realizar esta acción. Verifique su sesión.",
    },
    [LegalBasisErrors.SERVER_ERROR]: {
      title: "Error interno del servidor",
      message:
        "Hubo un error en el servidor. Espere un momento e intente nuevamente.",
    },
    [LegalBasisErrors.VALIDATION_ERROR]: {
      title: "Error de validación",
      message:
        "Revisa los datos introducidos. Uno o más campos no son válidos.",
    },
    [LegalBasisErrors.NOT_FOUND]: {
      title: "Fundamento legal no encontrado",
      message:
        "El fundamento legal no fue encontrado. Verifique su existencia recargando la app e intente de nuevo.",
    },
    [LegalBasisErrors.MULTIPLE_NOT_FOUND]: {
      title: "Varios fundamentos legales no encontrados",
      message:
        "Uno o más fundamentos legales no fueron encontrados. Verifique su existencia recargando la app e intente de nuevo.",
    },
    [LegalBasisErrors.SUBJECT_NOT_FOUND]: {
      title: "Materia no encontrada",
      message:
        "La materia seleccionada no fue encontrada. Verifique su existencia recargando la app e intente de nuevo.",
    },
    [LegalBasisErrors.ASPECTS_NOT_FOUND]: {
      title: "Aspectos no encontrados",
      message:
        "Algunos aspectos seleccionados no fueron encontrados. Verifique su existencia recargando la app e intente de nuevo.",
    },
    [LegalBasisErrors.DUPLICATED_NAME]: {
      title: "Nombre duplicado",
      message:
        "Ya existe un fundamento legal con el mismo nombre. Por favor, utiliza otro.",
    },
    [LegalBasisErrors.DUPLICATED_ABBREVIATION]: {
      title: "Abreviatura duplicada",
      message:
        "Ya existe un fundamento legal con la misma abreviatura. Por favor, utiliza otra.",
    },
    [LegalBasisErrors.DOCUMENT_REQUIRED]: {
      title: "Documento requerido",
      message:
        "Debe proporcionarse un documento si se desea extraer artículos.",
    },
    [LegalBasisErrors.ARTICLE_EXTRACTION_JOBS_CONFLICT]: {
      title: "Conflicto con trabajos pendientes",
      message:
        "El fundamento legal no puede ser eliminado porque en este momento se están extrayendo artículos de su documento asociado.",
    },
    [LegalBasisErrors.MULTIPLE_ARTICLE_EXTRACTION_JOBS_CONFLICT]: {
      title: "Conflicto con trabajos pendientes",
      message: ({ items }) =>
        items.length === 1
          ? `El fundamento legal ${items[0]} no puede ser eliminado porque se están extrayendo artículos de su documento asociado.`
          : `Los fundamentos legales ${items.join(
              ", "
            )} no pueden ser eliminados porque se están extrayendo artículos de sus documentos asociados.`,
    },
    [LegalBasisErrors.ARTICLES_EXTRACTION_CONFLICT]: {
      title: "Conflicto de extracción de artículos",
      message:
        "No se pueden extraer artículos en este momento porque ya se están extrayendo artículos de el documento asociado.",
    },
    [LegalBasisErrors.ASSOCIATED_TO_REQ_IDENTIFICATIONS_CONFLICT]: {
      title:
        "Fundamento Legal vinculado a una identificación de requerimientos",
      message:
        "El fundamento legal está vinculado a una o más identificación de requerimientos y no puede ser eliminado.",
    },
    [LegalBasisErrors.MULTIPLE_ASSOCIATED_TO_REQ_IDENTIFICATIONS_CONFLICT]: {
      title:
        "Fundamento Legales vinculados a una identificación de requerimientos",
      message: ({ items }) =>
        items.length === 1
          ? `El fundamento legal ${items[0]} está vinculado a una o más identificación de requerimientos y no puede ser eliminado.`
          : `Los fundamentos legales ${items.join(
              ", "
            )} están vinculados a una o más identificación de requerimientos y no pueden ser eliminados.`,
    },
    [LegalBasisErrors.REQ_IDENTIFICATION_JOBS_CONFLICT]: {
      title: "Conflicto con trabajos de identificación de requerimientos",
      message:
        "El fundamento legal no puede ser eliminado porque actualmente se están identificando requerimientos. Por favor, espere a que se complete la identificación e intente nuevamente.",
    },
    [LegalBasisErrors.MULTIPLE_REQ_IDENTIFICATION_JOBS_CONFLICT]: {
      title: "Conflicto con trabajos de identificación de requerimientos",
      message: ({ items }) =>
        items.length === 1
          ? `El fundamento legal ${items[0]} no puede ser eliminado porque actualmente se está identificando requerimientos. Por favor, espere a que se complete la identificación e intente nuevamente.`
          : `Los fundamentos legales ${items.join(
              ", "
            )}  no pueden ser eliminados porque actualmente se están identificando requerimientos. Por favor, espere a que se complete la identificación e intente nuevamente.`,
    },
    [LegalBasisErrors.SEND_LEGAL_BASIS_JOBS_CONFLICT]: {
      title: "Conflicto con trabajos de envío",
      message:
        "El fundamento legal no puede ser eliminado porque en este momento se está enviando a ACM Suite.",
    },
    [LegalBasisErrors.MULTIPLE_SEND_LEGAL_BASIS_JOBS_CONFLICT]: {
      title: "Conflicto con trabajos de envío",
      message: ({ items }) =>
        items.length === 1
          ? `El fundamento legal ${items[0]} no puede ser eliminado porque en este momento se está enviando a ACM Suite.`
          : `Los fundamentos legales ${items.join(
              ", "
            )} no pueden ser eliminados porque en este momento se están enviando a ACM Suite.`,
    },
    [LegalBasisErrors.DOCUMENT_CONFLICT]: {
      title: "Conflicto con el documento",
      message: "No se puede proporcionar un documento si desea eliminarlo.",
    },
    [LegalBasisErrors.REMOVE_DOCUMENT_PENDING_CONFLICT]: {
      title: "Conflicto al eliminar el documento",
      message:
        "El documento no puede ser eliminado porque en este momento se están extrayendo artículos de su documento asociado.",
    },
    [LegalBasisErrors.NEW_DOCUMENT_PENDING_CONFLICT]: {
      title: "Conflicto al subir un nuevo documento",
      message:
        "No se puede subir un nuevo documento porque en este momento se están extrayendo artículos de su documento asociado.",
    },
    [LegalBasisErrors.CONFLICT]: {
      title: "Conflicto detectado",
      message:
        "Ocurrió un conflicto con la operación. Verifique la información e intente nuevamente.",
    },
    [LegalBasisErrors.UNEXPECTED_ERROR]: {
      title: "Error inesperado",
      message:
        "Ocurrió un error inesperado. Por favor, intente nuevamente más tarde.",
    },
  };

  /**
   * A map of specific error messages to their corresponding error constants.
   * @type {Object.<string, LegalBasisErrors>}
   */
  static ErrorMessagesMap = {
    "Network Error": LegalBasisErrors.NETWORK_ERROR,
    "LegalBasis already exists": LegalBasisErrors.DUPLICATED_NAME,
    "LegalBasis abbreviation already exists":
      LegalBasisErrors.DUPLICATED_ABBREVIATION,
    "A document must be provided if extractArticles is true":
      LegalBasisErrors.DOCUMENT_REQUIRED,
    "Cannot provide a document if removeDocument is true":
      LegalBasisErrors.DOCUMENT_CONFLICT,
    "The document cannot be removed because there are pending jobs for this Legal Basis":
      LegalBasisErrors.REMOVE_DOCUMENT_PENDING_CONFLICT,
    "Articles cannot be extracted because there is already a process that does so":
      LegalBasisErrors.ARTICLES_EXTRACTION_CONFLICT,
    "A new document cannot be uploaded because there are pending jobs for this Legal Basis":
      LegalBasisErrors.NEW_DOCUMENT_PENDING_CONFLICT,
    "Subject not found": LegalBasisErrors.SUBJECT_NOT_FOUND,
    "Aspects not found for IDs": LegalBasisErrors.ASPECTS_NOT_FOUND,
    "Cannot delete LegalBasis with pending Article Extraction jobs":
      LegalBasisErrors.ARTICLE_EXTRACTION_JOBS_CONFLICT,
    "Cannot delete Legal Bases with pending Article Extraction jobs":
      LegalBasisErrors.MULTIPLE_ARTICLE_EXTRACTION_JOBS_CONFLICT,
    "The LegalBasis is associated with one or more requirement identifications":
      LegalBasisErrors.ASSOCIATED_TO_REQ_IDENTIFICATIONS_CONFLICT,
    "Some Legal Bases are associated with requirement identifications":
      LegalBasisErrors.MULTIPLE_ASSOCIATED_TO_REQ_IDENTIFICATIONS_CONFLICT,
    "Cannot delete LegalBasis with pending Requirement Identification jobs":
      LegalBasisErrors.REQ_IDENTIFICATION_JOBS_CONFLICT,
    "Cannot delete Legal Bases with pending Requirement Identification jobs":
      LegalBasisErrors.MULTIPLE_REQ_IDENTIFICATION_JOBS_CONFLICT,
    "Cannot delete LegalBasis with pending Send Legal Basis jobs":
      LegalBasisErrors.SEND_LEGAL_BASIS_JOBS_CONFLICT,
    "Cannot delete Legal Bases with pending Send Legal Basis jobs":
      LegalBasisErrors.MULTIPLE_SEND_LEGAL_BASIS_JOBS_CONFLICT,
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
        [
          LegalBasisErrors.MULTIPLE_ARTICLE_EXTRACTION_JOBS_CONFLICT,
          LegalBasisErrors.MULTIPLE_SEND_LEGAL_BASIS_JOBS_CONFLICT,
          LegalBasisErrors.MULTIPLE_ASSOCIATED_TO_REQ_IDENTIFICATIONS_CONFLICT,
          LegalBasisErrors.MULTIPLE_REQ_IDENTIFICATION_JOBS_CONFLICT,
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
        return LegalBasisErrors.errorMap[LegalBasisErrors.VALIDATION_ERROR];
      case 401:
      case 403:
        return LegalBasisErrors.errorMap[LegalBasisErrors.UNAUTHORIZED];
      case 404:
        if (items && items.length > 0) {
          if (items.length === 1) {
            return LegalBasisErrors.errorMap[LegalBasisErrors.NOT_FOUND];
          } else {
            return LegalBasisErrors.errorMap[
              LegalBasisErrors.MULTIPLE_NOT_FOUND
            ];
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
