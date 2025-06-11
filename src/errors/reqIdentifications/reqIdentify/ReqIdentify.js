/**
 * Class for managing and mapping messages and errors related to requirement identification jobs.
 * Centralizes error handling for user-friendly feedback.
 */
export class ReqIdentifyErrors {
  static INVALID_REQUEST = "INVALID_REQUEST";
  static NETWORK_ERROR = "NETWORK_ERROR";
  static UNAUTHORIZED = "UNAUTHORIZED";
  static JOB_NOT_FOUND = "JOB_NOT_FOUND";
  static SERVER_ERROR = "SERVER_ERROR";
  static UNEXPECTED_ERROR = "UNEXPECTED_ERROR";

  static errorMap = {
    [ReqIdentifyErrors.INVALID_REQUEST]: {
      title: "Solicitud inválida",
      message:
        "La solicitud es inválida. Por favor, cierre esta ventana e intente nuevamente.",
    },
    [ReqIdentifyErrors.NETWORK_ERROR]: {
      title: "Error de conexión",
      message:
        "Hubo un problema de red. Verifique su conexión a internet e intente nuevamente.",
    },
    [ReqIdentifyErrors.UNAUTHORIZED]: {
      title: "No autorizado",
      message:
        "No tiene autorización para realizar esta acción. Verifique su sesión e intente nuevamente.",
    },
    [ReqIdentifyErrors.JOB_NOT_FOUND]: {
      title: "Identificación de requerimientos cancelada",
      message:
        "La identificación de requerimientos fue cancelada anteriormente. Cierre esta ventana e intente nuevamente.",
    },
    [ReqIdentifyErrors.SERVER_ERROR]: {
      title: "Error del servidor",
      message:
        "Hubo un error interno en el servidor. Espere un momento e intente nuevamente.",
    },
    [ReqIdentifyErrors.UNEXPECTED_ERROR]: {
      title: "Error inesperado",
      message:
        "Ocurrió un error inesperado. Por favor, intente nuevamente más tarde.",
    },
  };

  /**
   * Map of specific error messages to corresponding internal error types.
   */
  static ErrorMessagesMap = {
    "Network Error": ReqIdentifyErrors.NETWORK_ERROR,
    "Job not found": ReqIdentifyErrors.JOB_NOT_FOUND,
    "Unexpected error identifying requirements":
      ReqIdentifyErrors.UNEXPECTED_ERROR,
  };

  /**
   * Maps server or network error to user-friendly error object.
   *
   * @param {Object} params
   * @param {number} [params.code] - HTTP status code
   * @param {string} [params.error] - Server error message
   * @param {string} [params.httpError] - Axios/network error message
   * @returns {{title: string, message: string}}
   */
  static handleError({ code, error, httpError }) {
    const message = error || httpError;
    if (message && ReqIdentifyErrors.ErrorMessagesMap[message]) {
      const key = ReqIdentifyErrors.ErrorMessagesMap[message];
      return ReqIdentifyErrors.errorMap[key];
    }
    switch (code) {
      case 400:
        return ReqIdentifyErrors.errorMap[ReqIdentifyErrors.INVALID_REQUEST];
      case 401:
      case 403:
        return ReqIdentifyErrors.errorMap[ReqIdentifyErrors.UNAUTHORIZED];
      case 500:
        return ReqIdentifyErrors.errorMap[ReqIdentifyErrors.SERVER_ERROR];
      default:
        return ReqIdentifyErrors.errorMap[ReqIdentifyErrors.UNEXPECTED_ERROR];
    }
  }

  /**
   * Maps error to internal status identifier.
   *
   * @param {Object} params
   * @param {number} [params.code] - HTTP status code
   * @param {string} [params.error] - Server error message
   * @param {string} [params.httpError] - Axios/network error message
   * @returns {string}
   */
  static handleStatus({ code, error, httpError }) {
    const message = error || httpError;
    if (message && ReqIdentifyErrors.ErrorMessagesMap[message]) {
      return ReqIdentifyErrors.ErrorMessagesMap[message];
    }

    switch (code) {
      case 400:
        return ReqIdentifyErrors.INVALID_REQUEST;
      case 401:
      case 403:
        return ReqIdentifyErrors.UNAUTHORIZED;
      case 500:
        return ReqIdentifyErrors.SERVER_ERROR;
      default:
        return ReqIdentifyErrors.UNEXPECTED_ERROR;
    }
  }
}

/**
 * Class for managing and mapping messages related to requirement identification jobs.
 */
export class ReqIdentifyStatus {
  static WAITING = "WAITING";
  static ACTIVE = "ACTIVE";
  static COMPLETED = "COMPLETED";
  static FAILED = "FAILED";
  static DELAYED = "DELAYED";
  static PAUSED = "PAUSED";
  static STUCK = "STUCK";
  static UNKNOWN = "UNKNOWN";

  static MessageStatusMap = {
    "The job is waiting to be processed": ReqIdentifyStatus.WAITING,
    "Job is still processing": ReqIdentifyStatus.ACTIVE,
    "Job completed successfully": ReqIdentifyStatus.COMPLETED,
    "Job failed": ReqIdentifyStatus.FAILED,
    "Job is delayed and will be processed later": ReqIdentifyStatus.DELAYED,
    "Job is paused and will be resumed once unpaused": ReqIdentifyStatus.PAUSED,
    "Job is stuck and cannot proceed": ReqIdentifyStatus.STUCK,
    "Job is in an unknown state": ReqIdentifyStatus.UNKNOWN,
  };

  static messageMap = Object.fromEntries(
    Object.entries(ReqIdentifyStatus.MessageStatusMap).map(([, value]) => [
      value,
      {
        [ReqIdentifyStatus.WAITING]:
          "La identificación de requerimientos comenzará en un momento.",
        [ReqIdentifyStatus.ACTIVE]:
          "La identificación de requerimientos está en curso...",
        [ReqIdentifyStatus.COMPLETED]:
          "La identificación de requerimientos se completó con éxito.",
        [ReqIdentifyStatus.DELAYED]:
          "La identificación de requerimientos está retrasada y se procesará más tarde.",
        [ReqIdentifyStatus.PAUSED]:
          "La identificación de requerimientos está en pausa. Comuníquese con los administradores del sistema para continuar.",
        [ReqIdentifyStatus.STUCK]:
          "La identificación de requerimientos está atascada y no puede continuar. Comuníquese con los administradores del sistema.",
        [ReqIdentifyStatus.UNKNOWN]:
          "La identificación de requerimientos está en un estado desconocido. Comuníquese con los administradores del sistema.",
      }[value],
    ])
  );

  /**
   * Maps a server message to a localized, user-friendly message.
   *
   * @param {string} message - The server-provided message.
   * @returns {string} - A user-facing localized message.
   */
  static handleMessage(message) {
    const status = ReqIdentifyStatus.MessageStatusMap[message];
    return ReqIdentifyStatus.messageMap[status];
  }

  /**
   * Maps a server message to its internal status key.
   *
   * @param {string} message - The server-provided message.
   * @returns {string} - Internal status key (e.g., "ACTIVE", "FAILED").
   */
  static handleStatus(message) {
    return ReqIdentifyStatus.MessageStatusMap[message];
  }
}
