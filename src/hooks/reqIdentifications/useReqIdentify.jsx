import { useState, useCallback, useContext } from "react";
import Context from "../../context/userContext";
import { ReqIdentifyErrors, ReqIdentifyStatus } from "../../errors/reqIdentifications/reqIdentify/ReqIdentify";
import getReqIdentificationJobStatus from "../../services/reqIdentificationService/reqIdentify/getReqIdentificationJobStatus";

/**
 * Custom hook for monitoring requirement identification job status.
 * @returns {Object} - Contains status, error, progress, and utility functions.
 */
export default function useReqIdentify() {
  const { jwt } = useContext(Context);

  const [jobStatus, setJobStatus] = useState({
    progress: null,
    status: null,
    message: null,
    error: null,
    errorStatus: null,
  });

  /**
   * Clears the error state.
   */
  const clearError = () => {
    setJobStatus((prev) => ({ ...prev, error: null, errorStatus: null }));
  };

  /**
   * Resets the entire job status to initial state.
   */
  const cleanJobStatus = useCallback(() => {
    setJobStatus({
      progress: null,
      message: null,
      status: null,
      error: null,
      errorStatus: null,
    });
  }, []);

  /**
   * Fetches and updates job status using its ID.
   *
   * @param {string} jobId - The job ID to check status for.
   */
  const fetchJobStatus = useCallback(
    async (jobId) => {
      try {
        const { message, jobProgress, error } = await getReqIdentificationJobStatus({
          jobId,
          token: jwt,
        });

        if (error) {
          setJobStatus({
            progress: null,
            message: null,
            status: ReqIdentifyStatus.handleStatus(message),
            error: ReqIdentifyErrors.handleError({ error }),
            errorStatus: ReqIdentifyErrors.handleStatus({ error }),
          });
          return;
        }

        setJobStatus({
          progress: jobProgress,
          message: ReqIdentifyStatus.handleMessage(message),
          status: ReqIdentifyStatus.handleStatus(message),
          error: null,
          errorStatus: null,
        });
      } catch (err) {
        const errorCode = err.response?.status;
        const serverMessage = err.response?.data?.message;
        const clientMessage = err.message;

        setJobStatus({
          progress: null,
          message: null,
          status: null,
          error: ReqIdentifyErrors.handleError({
            code: errorCode,
            error: serverMessage,
            httpError: clientMessage,
          }),
          errorStatus: ReqIdentifyErrors.handleStatus({
            code: errorCode,
            error: serverMessage,
            httpError: clientMessage,
          }),
        });
      }
    },
    [jwt]
  );

  return {
    progress: jobStatus.progress,
    message: jobStatus.message,
    status: jobStatus.status,
    error: jobStatus.error,
    errorStatus: jobStatus.errorStatus,
    fetchJobStatus,
    clearError,
    cleanJobStatus,
  };
}
