import { useState, useCallback, useContext } from "react";
import getJobStatus from "../../services/workerService/getJobStatus.js";
import Context from "../../context/userContext.jsx";

/**
 * Custom hook to fetch and manage the status of a job, with localized messages and error handling.
 *
 * @returns {Object} - Contains job progress, message, and error states.
 */
const useWorker = () => {
  const { jwt } = useContext(Context);
  const [jobStatus, setJobStatus] = useState({
    progress: null,
    message: null,
    error: null,
  });

  /**
   * Maps job-specific states to user-friendly and localized messages.
   * @param {string} message - The raw message from the backend.
   * @returns {string} - A user-friendly localized message.
   */
  const mapMessageToLocalized = (message) => {
    switch (message) {
      case "The job is waiting to be processed":
        return "El proceso de extracción de artículos comenzará en un momento.";
      case "Job is still processing":
        return "El proceso de extracción de artículos está en curso...";
      case "Job completed successfully":
        return "El proceso de extracción de artículos se completó con éxito.";
      case "Job is delayed and will be processed later":
        return "El proceso de extracción de artículos está retrasado y se procesará más tarde.";
      case "Job is paused and will be resumed once unpaused":
        return "El proceso de extracción de artículos está en pausa. Comuníquese con los administradores del sistema para continuar.";
      case "Job is stuck and cannot proceed":
        return "El proceso de extracción de artículos está atascado y no puede continuar. Comuníquese con los administradores del sistema.";
      case "Job is in an unknown state":
        return "El proceso de extracción de artículos está en un estado desconocido. Comuníquese con los administradores del sistema.";
      default:
        return "Estado del proceso no reconocido. Comuníquese con los administradores del sistema.";
    }
  };

  /**
   * Maps all errors (job-specific or HTTP) to user-friendly messages.
   * @param {Object|string} error - The raw error object or error string.
   * @returns {Object} - An object with title and description for the error.
   */
  const mapErrorToMessage = (error) => {
    if (typeof error === "string") {
      switch (error) {
        case "Legal Basis not found":
          return {
            title: "Base legal no encontrada",
            description:
              "No se encontró el fundamento legal especificado. Verifique la información proporcionada e intente nuevamente.",
          };
        case "Invalid document: missing buffer or mimetype":
          return {
            title: "Documento inválido",
            description:
              "El documento proporcionado no es válido o está incompleto. Asegúrese de cargar un archivo válido.",
          };
        case "Document Processing Error":
          return {
            title: "Error al procesar el documento",
            description:
              "Hubo un problema procesando el documento. Por favor, revise el archivo y vuelva a intentarlo.",
          };
        case "Invalid Classification":
          return {
            title: "Clasificación inválida",
            description:
              "La clasificación proporcionada no es válida. Seleccione una clasificación válida e intente nuevamente.",
          };
        case "Article Processing Error":
          return {
            title: "Error al procesar los artículos",
            description:
              "No se pudieron extraer los artículos del documento. Verifique el archivo proporcionado e intente nuevamente.",
          };
        case "Failed to insert articles":
          return {
            title: "Error al guardar los artículos",
            description:
              "Hubo un problema al intentar guardar los artículos extraídos. Por favor, intente nuevamente.",
          };
        case "Unexpected error during article processing":
          return {
            title: "Error inesperado",
            description:
              "Se produjo un error inesperado durante el procesamiento de los artículos. Intente nuevamente o contacte al soporte técnico.",
          };
        default:
          return {
            title: "Error desconocido",
            description:
              "Se produjo un error desconocido durante el proceso. Intente nuevamente o contacte al soporte técnico.",
          };
      }
    }

    if (error.response) {
      switch (error.response.status) {
        case 400:
          return {
            title: "Solicitud inválida",
            description:
              "La solicitud es inválida. Por favor, recargue la página e intente nuevamente.",
          };
        case 401:
        case 403:
          return {
            title: "No autorizado",
            description:
              "No tiene autorización para realizar esta acción. Verifique su sesión e intente nuevamente.",
          };
        case 404:
          return {
            title: "Proceso no encontrado",
            description:
              "El proceso solicitado no fue encontrado. Es posible que haya expirado o el ID sea incorrecto.",
          };
        case 500:
          return {
            title: "Error interno del servidor",
            description:
              "Se produjo un error interno en el servidor. Por favor, intente nuevamente más tarde.",
          };
        default:
          return {
            title: "Error inesperado",
            description: "Ocurrió un error inesperado. Intente nuevamente o contacte al soporte técnico.",
          };
      }
    } else if (error.message === "Network Error") {
      return {
        title: "Error de conexión",
        description: "Error de conexión. Verifique su conexión a internet.",
      };
    } else {
      return {
        title: "Error inesperado",
        description:
          "Ocurrió un error inesperado. Intente nuevamente o contacte al soporte técnico.",
      };
    }
  };

  /**
   * Fetches the job status using the provided job ID and updates the state.
   *
   * @async
   * @function fetchJobStatus
   * @param {string} jobId - The ID of the job to retrieve.
   */
  const fetchJobStatus = useCallback(
    async (jobId) => {
      try {
        const { message, jobProgress, error } = await getJobStatus({
          id: jobId,
          token: jwt,
        });
        if (error) {
          setJobStatus({
            progress: null,
            message: null,
            error: mapErrorToMessage(error),
          });
          return;
        }

        setJobStatus({
          progress: jobProgress,
          message: mapMessageToLocalized(message),
          error: null,
        });
      } catch (err) {
        setJobStatus({
          progress: null,
          message: null,
          error: mapErrorToMessage(err),
        });
      }
    },
    [jwt]
  );

  const clearError = () => {
    setJobStatus((prev) => ({ ...prev, error: null }));
  };

  return {
    progress: jobStatus.progress,
    message: jobStatus.message,
    error: jobStatus.error,
    fetchJobStatus,
    clearError,
  };
};

export default useWorker;
