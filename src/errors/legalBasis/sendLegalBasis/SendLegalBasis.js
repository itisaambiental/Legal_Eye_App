/**
 * Class for managing and mapping messages and errors related to send legal basis  jobs.
 * Centralizes error handling, mapping error codes and messages to user-friendly messages.
 */
export class SendLegalBasisErrors {
  static INVALID_REQUEST = "INVALID_REQUEST";
  static NETWORK_ERROR = "NETWORK_ERROR";
  static UNAUTHORIZED = "UNAUTHORIZED";
  static JOB_NOT_FOUND = "JOB_NOT_FOUND";
  static SERVER_ERROR = "SERVER_ERROR";
  static UNEXPECTED_ERROR = "UNEXPECTED_ERROR";
  static CONFLICT = "CONFLICT";


  static errorMap = {
    [SendLegalBasisErrors.INVALID_REQUEST]: {
      title: "Solicitud inválida",
      message:
        "La solicitud es inválida. Por favor, cierre esta ventana e intente nuevamente.",
    },
    [SendLegalBasisErrors.NETWORK_ERROR]: {
      title: "Error de conexión",
      message:
        "Hubo un problema de red. Verifique su conexión a internet e intente nuevamente.",
    },
    [SendLegalBasisErrors.UNAUTHORIZED]: {
      title: "No autorizado",
      message:
        "No tiene autorización para realizar esta acción. Verifique su sesión e intente nuevamente.",
    },
    [SendLegalBasisErrors.JOB_NOT_FOUND]: {
      title: "Envió de fundamentos legales cancelado anteriormente",
      message:
        "El envió de fundamentos legales fue cancelado anteriormente. Si necesita realizar esta operación, cierre esta ventana e intente nuevamente.",
    },
    [SendLegalBasisErrors.SERVER_ERROR]: {
      title: "Error interno del servidor",
      message: "Hubo un error en el servidor. Espere un momento e intente nuevamente.",
    },
    [SendLegalBasisErrors.UNEXPECTED_ERROR]: {
      title: "Error inesperado",
      message: "Ocurrió un error inesperado. Por favor, intente nuevamente más tarde.",
    },
    [SendLegalBasisErrors.CONFLICT]: {
      title: "Conflicto de datos",
      message:
        "Ocurrió un conflicto con la operación. Verifique la información e intente nuevamente.",
    },
  };

    /**
   * A map of specific error messages to their corresponding error constants.
   * @type {Object.<string, SendLegalBasisErrors>}
   */
  static ErrorMessagesMap = {
    "Network Error": SendLegalBasisErrors.NETWORK_ERROR,
    "Job not found": SendLegalBasisErrors.JOB_NOT_FOUND,
    "Unexpected error sending legal basis": SendLegalBasisErrors.UNEXPECTED_ERROR,
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
    if (message && SendLegalBasisErrors.ErrorMessagesMap[message]) {
      const key = SendLegalBasisErrors.ErrorMessagesMap[message];
      return SendLegalBasisErrors.errorMap[key];
    }
    switch (code) {
      case 400:
        return SendLegalBasisErrors.errorMap[
          SendLegalBasisErrors.INVALID_REQUEST
        ];
      case 401:
      case 403:
        return SendLegalBasisErrors.errorMap[
          SendLegalBasisErrors.UNAUTHORIZED
        ];
      case 404:
        return SendLegalBasisErrors.errorMap[
          SendLegalBasisErrors.JOB_NOT_FOUND
        ];
      case 500:
        return SendLegalBasisErrors.errorMap[
          SendLegalBasisErrors.SERVER_ERROR
        ];
      default:
        return SendLegalBasisErrors.errorMap[
          SendLegalBasisErrors.UNEXPECTED_ERROR
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
    if (message && SendLegalBasisErrors.ErrorMessagesMap[message]) {
      return SendLegalBasisErrors.ErrorMessagesMap[message];
    }

    switch (code) {
      case 400:
        return SendLegalBasisErrors.INVALID_REQUEST;
      case 401:
      case 403:
        return SendLegalBasisErrors.UNAUTHORIZED;
      case 404:
        return SendLegalBasisErrors.JOB_NOT_FOUND;
      case 500:
        return SendLegalBasisErrors.SERVER_ERROR;
      default:
        return SendLegalBasisErrors.UNEXPECTED_ERROR;
    }
  }
}
/**
 * Class for managing and mapping messages related to send legal basis jobs.
 */
export class SendLegalBasisStatus {
  static WAITING = "WAITING";
  static ACTIVE = "ACTIVE";
  static COMPLETED = "COMPLETED";
  static FAILED = "FAILED";
  static DELAYED = "DELAYED";
  static PAUSED = "PAUSED";
  static STUCK = "STUCK";
  static UNKNOWN = "UNKNOWN";

  static MessageStatusMap = {
    "The job is waiting to be processed": SendLegalBasisStatus.WAITING,
    "Job is still processing": SendLegalBasisStatus.ACTIVE,
    "Job completed successfully": SendLegalBasisStatus.COMPLETED,
    "Job failed": SendLegalBasisStatus.FAILED,
    "Job is delayed and will be processed later": SendLegalBasisStatus.DELAYED,
    "Job is paused and will be resumed once unpaused":
    SendLegalBasisStatus.PAUSED,
    "Job is stuck and cannot proceed": SendLegalBasisStatus.STUCK,
    "Job is in an unknown state": SendLegalBasisStatus.UNKNOWN,
  };

  static messageMap = Object.fromEntries(
    Object.entries(SendLegalBasisStatus.MessageStatusMap).map(([, value]) => [
      value,
      {
        [SendLegalBasisStatus.WAITING]:
          "El envió de fundamentos legales comenzará en un momento.",
        [SendLegalBasisStatus.ACTIVE]:
          "El envió de fundamentos legales está en curso...",
        [SendLegalBasisStatus.COMPLETED]:
          "El envió de fundamentos legales se completó con éxito.",
        [SendLegalBasisStatus.DELAYED]:
          "El envió de fundamentos legales está retrasado y se procesará más tarde.",
        [SendLegalBasisStatus.PAUSED]:
          "El envió de fundamentos legales está en pausa. Comuníquese con los administradores del sistema para continuar.",
        [SendLegalBasisStatus.STUCK]:
          "El envió de fundamentos legales está atascado y no puede continuar. Comuníquese con los administradores del sistema.",
        [SendLegalBasisStatus.UNKNOWN]:
          "El envió de fundamentos legales está en un estado desconocido. Comuníquese con los administradores del sistema.",
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
    const status = SendLegalBasisStatus.MessageStatusMap[message];
    return SendLegalBasisStatus.messageMap[status];
  }

  /**
   * Handles messages by mapping them to their associated status.
   *
   * @param {string} message - The server message.
   * @returns {string} - The associated status.
   */
  static handleStatus(message) {
    return SendLegalBasisStatus.MessageStatusMap[message];
  }
}
