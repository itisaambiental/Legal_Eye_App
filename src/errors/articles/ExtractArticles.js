/**
 * Class for managing and mapping messages and errors related to article extraction jobs.
 * Centralizes error handling, mapping error codes and messages to user-friendly messages.
 */
export class ExtractArticlesErrors {
  static INVALID_REQUEST = "INVALID_REQUEST";
  static NETWORK_ERROR = "NETWORK_ERROR";
  static UNAUTHORIZED = "UNAUTHORIZED";
  static JOB_NOT_FOUND = "JOB_NOT_FOUND";
  static LEGAL_BASE_NOT_FOUND = "LEGAL_BASE_NOT_FOUND";
  static JOB_CANCELED = "JOB_CANCELED";
  static SERVER_ERROR = "SERVER_ERROR";
  static UNEXPECTED_ERROR = "UNEXPECTED_ERROR";
  static INVALID_DOCUMENT = "INVALID_DOCUMENT";
  static DOCUMENT_PROCESSING_ERROR = "DOCUMENT_PROCESSING_ERROR";
  static INVALID_CLASSIFICATION = "INVALID_CLASSIFICATION";
  static ARTICLE_PROCESSING_ERROR = "ARTICLE_PROCESSING_ERROR";
  static FAILED_TO_INSERT_ARTICLES = "FAILED_TO_INSERT_ARTICLES";

  static errorMap = {
    [ExtractArticlesErrors.INVALID_REQUEST]: {
      title: "Solicitud inválida",
      message:
        "La solicitud es inválida. Por favor, cierre esta ventana e intente nuevamente.",
    },
    [ExtractArticlesErrors.NETWORK_ERROR]: {
      title: "Error de conexión",
      message:
        "Hubo un problema de red. Verifique su conexión a internet e intente nuevamente.",
    },
    [ExtractArticlesErrors.UNAUTHORIZED]: {
      title: "No autorizado",
      message:
        "No tiene autorización para realizar esta acción. Verifique su sesión e intente nuevamente.",
    },
    [ExtractArticlesErrors.JOB_NOT_FOUND]: {
      title: "Extracción de artículos cancelada anteriormente",
      message:
        "La extracción de artículos fue cancelada anteriormente. Si necesita realizar esta operación, cierre esta ventana e intente nuevamente.",
    },
    [ExtractArticlesErrors.LEGAL_BASE_NOT_FOUND]: {
      title: "Fundamento legal no encontrado",
      message:
        "Fundamento legal no encontrado. Verifique su existencia recargando la app e intente de nuevo.",
    },
    [ExtractArticlesErrors.SERVER_ERROR]: {
      title: "Error interno del servidor",
      message:
        "Hubo un problema en el servidor. Por favor, intente nuevamente más tarde.",
    },
    [ExtractArticlesErrors.UNEXPECTED_ERROR]: {
      title: "Error inesperado",
      message:
        "Se produjo un error inesperado durante la extracción de articulos. Por favor, intente nuevamente más tarde.",
    },
    [ExtractArticlesErrors.INVALID_DOCUMENT]: {
      title: "Documento inválido",
      message:
        "El documento proporcionado no es válido o está incompleto. Asegúrese de cargar un documento válido.",
    },
    [ExtractArticlesErrors.DOCUMENT_PROCESSING_ERROR]: {
      title: "Error al procesar el documento",
      message:
        "Hubo un problema procesando el documento. Por favor, revise el documento y vuelva a intentarlo.",
    },
    [ExtractArticlesErrors.INVALID_CLASSIFICATION]: {
      title: "Clasificación inválida",
      message:
        "La clasificación proporcionada no es válida. Seleccione una clasificación válida e intente nuevamente.",
    },
    [ExtractArticlesErrors.ARTICLE_PROCESSING_ERROR]: {
      title: "Error al procesar los artículos",
      message:
        "No se pudieron extraer los artículos del documento. Verifique el documento proporcionado e intente nuevamente.",
    },
    [ExtractArticlesErrors.FAILED_TO_INSERT_ARTICLES]: {
      title: "Error al guardar los artículos",
      message:
        "Hubo un problema al intentar guardar los artículos extraídos. Por favor, intente nuevamente.",
    },

    [ExtractArticlesErrors.JOB_CANCELED]: {
      title: "Extracción de artículos cancelada",
      message:
        "La extracción de artículos fue cancelada. Si necesita realizar esta operación, cierre esta ventana e intente de nuevo.",
    },
  };

  static ErrorMessagesMap = {
    "Network Error": ExtractArticlesErrors.NETWORK_ERROR,
    "Job not found": ExtractArticlesErrors.JOB_NOT_FOUND,
    "LegalBasis not found": ExtractArticlesErrors.LEGAL_BASE_NOT_FOUND,
    "Invalid document: missing buffer or mimetype":
      ExtractArticlesErrors.INVALID_DOCUMENT,
    "Document Processing Error":
      ExtractArticlesErrors.DOCUMENT_PROCESSING_ERROR,
    "Invalid Classification": ExtractArticlesErrors.INVALID_CLASSIFICATION,
    "Article Processing Error": ExtractArticlesErrors.ARTICLE_PROCESSING_ERROR,
    "Failed to insert articles":
      ExtractArticlesErrors.FAILED_TO_INSERT_ARTICLES,
    "Job was canceled": ExtractArticlesErrors.JOB_CANCELED,
    "Unexpected error during article processing":
      ExtractArticlesErrors.UNEXPECTED_ERROR,
  };

  /**
   * Handles errors by mapping error codes or messages to a user-friendly error object.
   *
   * @param {Object} params - Parameters for handling the error.
   * @param {number} params.code - The HTTP status code.
   * @param {string} [params.error] - The server error message.
   * @param {string} [params.httpError] - The HTTP error message.
   * @returns {Object} - A user-friendly error object containing a title and message.
   */
  static handleError({ code, error, httpError }) {
    const message = error || httpError;
    if (message && ExtractArticlesErrors.ErrorMessagesMap[message]) {
      const key = ExtractArticlesErrors.ErrorMessagesMap[message];
      return ExtractArticlesErrors.errorMap[key];
    }
    switch (code) {
      case 400:
        return ExtractArticlesErrors.errorMap[
          ExtractArticlesErrors.INVALID_REQUEST
        ];
      case 401:
      case 403:
        return ExtractArticlesErrors.errorMap[
          ExtractArticlesErrors.UNAUTHORIZED
        ];
      case 500:
        return ExtractArticlesErrors.errorMap[
          ExtractArticlesErrors.SERVER_ERROR
        ];
      default:
        return ExtractArticlesErrors.errorMap[
          ExtractArticlesErrors.UNEXPECTED_ERROR
        ];
    }
  }
  /**
   * Handles messages by mapping them to their associated status.
   *
   * @param {Object} params - Parameters for handling the status.
   * @param {number} params.code - The HTTP status code.
   * @param {string} [params.error] - The server error message.
   * @param {string} [params.httpError] - The HTTP error message.
   * @returns {string} - A string representing the associated status or a default status.
   */
  static handleStatus({ code, error, httpError }) {
    const message = error || httpError;
    if (message && ExtractArticlesErrors.ErrorMessagesMap[message]) {
      return ExtractArticlesErrors.ErrorMessagesMap[message];
    }

    switch (code) {
      case 400:
        return ExtractArticlesErrors.INVALID_REQUEST;
      case 401:
      case 403:
        return ExtractArticlesErrors.UNAUTHORIZED;
      case 500:
        return ExtractArticlesErrors.SERVER_ERROR;
      default:
        return ExtractArticlesErrors.UNEXPECTED_ERROR;
    }
  }
}
/**
 * Class for managing and mapping messages related to article extraction jobs.
 */
export class ExtractArticlesStatus {
  static WAITING = "WAITING";
  static ACTIVE = "ACTIVE";
  static COMPLETED = "COMPLETED";
  static FAILED = "FAILED";
  static DELAYED = "DELAYED";
  static PAUSED = "PAUSED";
  static STUCK = "STUCK";
  static UNKNOWN = "UNKNOWN";

  static MessageStatusMap = {
    "The job is waiting to be processed": ExtractArticlesStatus.WAITING,
    "Job is still processing": ExtractArticlesStatus.ACTIVE,
    "Job completed successfully": ExtractArticlesStatus.COMPLETED,
    "Job failed": ExtractArticlesStatus.FAILED,
    "Job is delayed and will be processed later": ExtractArticlesStatus.DELAYED,
    "Job is paused and will be resumed once unpaused":
      ExtractArticlesStatus.PAUSED,
    "Job is stuck and cannot proceed": ExtractArticlesStatus.STUCK,
    "Job is in an unknown state": ExtractArticlesStatus.UNKNOWN,
  };

  static messageMap = Object.fromEntries(
    Object.entries(ExtractArticlesStatus.MessageStatusMap).map(([, value]) => [
      value,
      {
        [ExtractArticlesStatus.WAITING]:
          "El proceso de extracción de artículos comenzará en un momento.",
        [ExtractArticlesStatus.ACTIVE]:
          "El proceso de extracción de artículos está en curso...",
        [ExtractArticlesStatus.COMPLETED]:
          "El proceso de extracción de artículos se completó con éxito.",
        [ExtractArticlesStatus.DELAYED]:
          "El proceso de extracción de artículos está retrasado y se procesará más tarde.",
        [ExtractArticlesStatus.PAUSED]:
          "El proceso de extracción de artículos está en pausa. Comuníquese con los administradores del sistema para continuar.",
        [ExtractArticlesStatus.STUCK]:
          "El proceso de extracción de artículos está atascado y no puede continuar. Comuníquese con los administradores del sistema.",
        [ExtractArticlesStatus.UNKNOWN]:
          "El proceso de extracción de artículos está en un estado desconocido. Comuníquese con los administradores del sistema.",
      }[value],
    ])
  );

  /**
   * Handles messages by mapping them to user-friendly localized messages.
   *
   * @param {string} message - The server message.
   * @returns {string} - A user-friendly localized message.
   */
  static handleMessage(message) {
    const status = ExtractArticlesStatus.MessageStatusMap[message];
    return ExtractArticlesStatus.messageMap[status];
  }

  /**
   * Handles messages by mapping them to their associated status.
   *
   * @param {string} message - The server message.
   * @returns {string} - The associated status.
   */
  static handleStatus(message) {
    return ExtractArticlesStatus.MessageStatusMap[message];
  }
}
