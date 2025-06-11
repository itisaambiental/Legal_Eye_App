import { useContext, useState, useEffect, useCallback } from "react";
import Context from "../../context/userContext.jsx";
import createReqIdentification from "../../services/reqIdentificationService/createReqIdentification.js";
import getReqIdentifications from "../../services/reqIdentificationService/getReqIdentifications.js";
import ReqIdentificationErrors from "../../errors/reqIdentifications/ReqIdentificationErrors.js";

/**
 * Custom hook for managing requirement identifications.
 * @returns {Object} - Contains state and functions for requirement identifications.
 */
export default function useReqIdentifications() {
  const { jwt } = useContext(Context);
  const [reqIdentifications, setReqIdentifications] = useState([]);
  const [state, setState] = useState({
    loading: true,
    error: null,
  });

  /**
   * Adds a new requirement identification.
   *
   * @async
   * @function addReqIdentification
   * @param {Object} params - Data for the new requirement identification.
   * @param {string} params.reqIdentificationName - Name of the requirement identification.
   * @param {string} [params.reqIdentificationDescription] - Description (optional).
   * @param {number[]} params.legalBasisIds - Associated legal basis IDs.
   * @param {string} params.intelligenceLevel - Intelligence level.
   * @returns {Promise<{ success: true, jobId: number|string, reqIdentificationId: number } | { success: false, error: string }>}
   */
  const addReqIdentification = useCallback(
    async ({
      reqIdentificationName,
      reqIdentificationDescription,
      legalBasisIds,
      intelligenceLevel,
    }) => {
      try {
        const { reqIdentificationId, jobId } = await createReqIdentification({
          reqIdentificationName,
          reqIdentificationDescription,
          legalBasisIds,
          intelligenceLevel,
          token: jwt,
        });
        return { success: true, reqIdentificationId, jobId };
      } catch (error) {
        const errorCode = error.response?.status;
        const serverMessage = error.response?.data?.message;
        const clientMessage = error.message;

        const handledError = ReqIdentificationErrors.handleError({
          code: errorCode,
          error: serverMessage,
          httpError: clientMessage,
        });

        return { success: false, error: handledError.message };
      }
    },
    [jwt]
  );

  /**
   * Fetches the complete list of requirement identifications.
   * @async
   * @function fetchReqIdentifications
   * @returns {Promise<void>} - Updates the list and loading state.
   */
  const fetchReqIdentifications = useCallback(async () => {
    setState({ loading: true, error: null });
    try {
      const reqIdentifications = await getReqIdentifications({ token: jwt });
      setReqIdentifications(reqIdentifications);
      setState({ loading: false, error: null });
    } catch (error) {
      const errorCode = error.response?.status;
      const serverMessage = error.response?.data?.message;
      const clientMessage = error.message;

      const handledError = ReqIdentificationErrors.handleError({
        code: errorCode,
        error: serverMessage,
        httpError: clientMessage,
      });

      setState({
        loading: false,
        error: handledError,
      });
    }
  }, [jwt]);

  useEffect(() => {
    fetchReqIdentifications();
  }, [fetchReqIdentifications]);

  return {
    reqIdentifications,
    addReqIdentification,
    fetchReqIdentifications,
    loading: state.loading,
    error: state.error,
  };
}
