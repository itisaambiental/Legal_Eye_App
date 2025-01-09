import { useState, useCallback, useContext } from "react";
import getJobStatus from "../../services/articlesService/extractArticles/getJobStatus.js";
import getJobByLegalBasis from "../../services/articlesService/extractArticles/getJobByLegalBasis.js";
import Context from "../../context/userContext.jsx";
import { ExtractArticlesErrors, ExtractArticlesMessages } from "../../errors/ExtractArticlesErrors.js";

/**
 * Custom hook to fetch and manage the status of a extract articles job, with localized messages and error handling.
 *
 * @returns {Object} - Contains job progress, message, and error states.
 */
const useExtractArticles = () => {
  const { jwt } = useContext(Context);
  const [jobStatus, setJobStatus] = useState({
    progress: null,
    message: null,
    error: null,
  });
  const [legalBasisJob, setLegalBasisJob] = useState({
    isLoading: false,
    error: null,
  });

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
        console.log(message, jobProgress, error);
        if (error) {
          setJobStatus({
            progress: null,
            message: null,
            error: ExtractArticlesErrors.handleError({
              error,
            }),
          });
          return;
        }
        setJobStatus({
          progress: jobProgress,
          message: ExtractArticlesMessages.handleMessage(message),
          error: null,
        });
      } catch (err) {
        const errorCode = err.response?.status;
        const serverMessage = err.response?.data?.message;
        const clientMessage = err.message;
        const handledError = ExtractArticlesErrors.handleError({
          code: errorCode,
          error: serverMessage,
          httpError: clientMessage,
        });
        setJobStatus({
          progress: null,
          message: null,
          error: handledError,
        });
      }
    },
    [jwt]
  );

  const clearError = () => {
    setJobStatus((prev) => ({ ...prev, error: null }));
  };

  /**
   * Fetches the job using the provided legalBasisId.
   *
   * @async
   * @function fetchJobByLegalBasis
   * @param {string} legalBasisId - The ID of the legal Basis to retrieve job.
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
      } catch (error) {
        const errorCode = error.response?.status;
        const serverMessage = error.response?.data?.message;
        const clientMessage = error.message;
        const handledError = ExtractArticlesErrors.handleError({
          code: errorCode,
          error: serverMessage,
          httpError: clientMessage,
        });
        setLegalBasisJob({ isLoading: false, error: handledError });
        return { success: false, error: handledError };
      }
    },
    [jwt]
  );

  return {
    progress: jobStatus.progress,
    message: jobStatus.message,
    error: jobStatus.error,
    legalBasisJobLoading: legalBasisJob.isLoading,
    legalBasisJobError: legalBasisJob.error,
    fetchJobStatus,
    clearError,
    fetchJobByLegalBasis,
  };
};

export default useExtractArticles;
