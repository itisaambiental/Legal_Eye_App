import { useState, useCallback, useContext } from "react";
import Context from "../../context/userContext";
import { SendLegalBasisErrors, SendLegalBasisStatus } from "../../errors/legalBasis/sendLegalBasis/SendLegalBasis";
import getSendLegalBasisJobStatus from "../../services/legalBaseService/sendLegalBasis/getSendLegalBasisJobStatus";


/**
 * Custom hook for sending LegalBasis entries to ACM Suite and monitoring job status.
 * @returns {Object} - Contains sending status, error, progress, and functions to send and monitor jobs.
 */
export default function useSendLegalBasis() {
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
                const { message, jobProgress, error } = await getSendLegalBasisJobStatus({
                    jobId,
                    token: jwt,
                });
                if (error) {
                    setJobStatus({
                        progress: null,
                        message: null,
                        status: SendLegalBasisStatus.handleStatus(message),
                        error: SendLegalBasisErrors.handleError({ error }),
                        errorStatus: SendLegalBasisErrors.handleStatus({ error }),
                    });
                    return;
                }

                setJobStatus({
                    progress: jobProgress,
                    message: SendLegalBasisStatus.handleMessage(message),
                    status: SendLegalBasisStatus.handleStatus(message),
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
                    error: SendLegalBasisErrors.handleError({
                        code: errorCode,
                        error: serverMessage,
                        httpError: clientMessage,
                    }),
                    errorStatus: SendLegalBasisErrors.handleStatus({
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
        cleanjobStatus,
    };
}
