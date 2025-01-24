import { useState, useCallback, useContext } from "react";
import getJobStatus from "../../../services/articlesService/extractArticles/getJobStatus.js";
import getJobByLegalBasis from "../../../services/articlesService/extractArticles/getJobByLegalBasis.js";
import cancelJob from "../../../services/articlesService/extractArticles/cancelJob.js";
import Context from "../../../context/userContext.jsx";
import {
  ExtractArticlesErrors,
  ExtractArticlesStatus,
} from "../../../errors/articles/ExtractArticles.js";

/**
 * Custom hook to fetch and manage the status of a extract articles job, with localized messages and error handling.
 *
 * @returns {Object} - Contains job progress, message, and error states.
 */
const useExtractArticles = () => {
  const { jwt } = useContext(Context);

  const [jobStatus, setJobStatus] = useState({
    progress: null,
    status: null,
    message: null,
    error: null,
    errorStatus: null,
  });

  const [legalBasisJob, setLegalBasisJob] = useState({
    isLoading: false,
    error: null,
  });

  /**
   * Clears the error state.
   */
  const clearError = () => {
    setJobStatus((prev) => ({ ...prev, error: null, errorStatus: null }));
  };

  /**
   * Resets the job status to its initial state.
   */
  const cleanjobStatus = useCallback(() => {
    setJobStatus({
      progress: null,
      message: null,
      status: null,
      error: null,
      errorStatus: null,
    });
  }, []);

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
          jobId,
          token: jwt,
        });

        if (error) {
          setJobStatus({
            progress: null,
            message: null,
            status: ExtractArticlesStatus.handleStatus(message),
            error: ExtractArticlesErrors.handleError({ error }),
            errorStatus: ExtractArticlesErrors.handleStatus({ error }),
          });
          return;
        }

        setJobStatus({
          progress: jobProgress,
          message: ExtractArticlesStatus.handleMessage(message),
          status: ExtractArticlesStatus.handleStatus(message),
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
          error: ExtractArticlesErrors.handleError({
            code: errorCode,
            error: serverMessage,
            httpError: clientMessage,
          }),
          errorStatus: ExtractArticlesErrors.handleStatus({
            code: errorCode,
            error: serverMessage,
            httpError: clientMessage,
          }),
        });
      }
    },
    [jwt]
  );

  /**
   * Fetches the job using the provided legalBasisId.
   *
   * @async
   * @function fetchJobByLegalBasis
   * @param {string} legalBasisId - The ID of the legal basis to retrieve job.
   */
  const fetchJobByLegalBasis = useCallback(
    async (legalBasisId) => {
      setLegalBasisJob({ isLoading: true, error: null });
      try {
        const { hasPendingJobs, jobId } = await getJobByLegalBasis({
          legalBasisId,
          token: jwt,
        });

        setLegalBasisJob({ isLoading: false, error: null });
        return { hasPendingJobs, jobId };
      } catch (err) {
        const errorCode = err.response?.status;
        const serverMessage = err.response?.data?.message;
        const clientMessage = err.message;
        setLegalBasisJob({
          isLoading: false,
          error: ExtractArticlesErrors.handleError({
            code: errorCode,
            error: serverMessage,
            httpError: clientMessage,
          }),
        });
      }
    },
    [jwt]
  );

  /**
   * Cancels a job using the provided job ID and updates the state.
   *
   * @async
   * @function cancelJobById
   * @param {string} jobId - The ID of the job to cancel.
   * @returns {Promise<Object>} - Returns { success: true } if successful, otherwise includes error details.
   */
  const cancelJobById = useCallback(
    async (jobId) => {
      try {
        await cancelJob({ jobId, token: jwt });
        return { success: true };
      } catch (err) {
        const errorCode = err.response?.status;
        const serverMessage = err.response?.data?.message;
        const clientMessage = err.message;
        return {
          success: false,
          error: ExtractArticlesErrors.handleError({
            code: errorCode,
            error: serverMessage,
            httpError: clientMessage,
          }),
          errorStatus: ExtractArticlesErrors.handleStatus({
            code: errorCode,
            error: serverMessage,
            httpError: clientMessage,
          }),
        };
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
    legalBasisJobLoading: legalBasisJob.isLoading,
    legalBasisJobError: legalBasisJob.error,
    fetchJobStatus,
    clearError,
    cleanjobStatus,
    cancelJobById,
    fetchJobByLegalBasis,
  };
};

export default useExtractArticles;
