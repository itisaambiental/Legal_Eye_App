import { useContext, useState, useEffect, useCallback } from "react";
import Context from "../../context/userContext.jsx";
import createReqIdentification from "../../services/reqIdentificationService/createReqIdentification.js";
import getReqIdentifications from "../../services/reqIdentificationService/getReqIdentifications.js";
import getReqIdentificationById from "../../services/reqIdentificationService/getReqIdentificationById";
import getReqIdentificationsByName from "../../services/reqIdentificationService/getReqIdentificationsByName";
import getReqIdentificationsByDescription from "../../services/reqIdentificationService/getReqIdentificationsByDescription";
import getReqIdentificationsByCreatedAt from "../../services/reqIdentificationService/getReqIdentificationsByCreatedAt";
import getReqIdentificationsByJurisdiction from "../../services/reqIdentificationService/getReqIdentificationsByJurisdiction";
import getReqIdentificationsByState from "../../services/reqIdentificationService/getReqIdentificationsByState";
import getReqIdentificationsByStateAndMunicipalities from "../../services/reqIdentificationService/getReqIdentificationsByStateAndMunicipalities";
import getReqIdentificationsByStatus from "../../services/reqIdentificationService/getReqIdentificationsByStatus";
import getReqIdentificationsByUserId from "../../services/reqIdentificationService/getReqIdentificationsByUserId";
import getReqIdentificationsBySubjectId from "../../services/reqIdentificationService/getReqIdentificationsBySubjectId";
import getReqIdentificationsBySubjectAndAspects from "../../services/reqIdentificationService/getReqIdentificationsBySubjectAndAspects";
import updateReqIdentification from "../../services/reqIdentificationService/updateReqIdentification";
import deleteReqIdentification from "../../services/reqIdentificationService/deleteReqIdentification";
import deleteReqIdentificationsBatch from "../../services/reqIdentificationService/deleteReqIdentificationsBatch";
import ReqIdentificationErrors from "../../errors/reqIdentifications/ReqIdentificationErrors";

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

  /**
 * Fetches a specific Requirement Identification by its ID.
 *
 * @async
 * @function fetchReqIdentificationById
 * @param {number} id - The ID of the requirement identification to retrieve.
 * @returns {Promise<Object>} - The identification object if successful, or an error message.
 */
  const fetchReqIdentificationById = useCallback(
    async (id) => {
      try {
        const reqIdentification = await getReqIdentificationById({ id, token: jwt });
        return { success: true, data: reqIdentification };
      } catch (error) {
        const errorCode = error.response?.status;
        const serverMessage = error.response?.data?.message;
        const clientMessage = error.message;

        const handledError = ReqIdentificationErrors.handleError({
          code: errorCode,
          error: serverMessage,
          httpError: clientMessage,
          items: [id],
        });

        return {
          success: false,
          error: handledError,
        };
      }
    },
    [jwt]
  );

  /**
* Fetches Requirement Identifications that partially match the provided name.
*
* @async
* @function fetchReqIdentificationsByName
* @param {string} name - The partial or full name to search for.
* @returns {Promise<void>} - Updates the list of identifications or sets an error.
*/
  const fetchReqIdentificationsByName = useCallback(
    async (name) => {
      setState({ loading: true, error: null });
      try {
        const reqIdentifications = await getReqIdentificationsByName({ name, token: jwt });
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

        setState({ loading: false, error: handledError });
      }
    },
    [jwt]
  );

  /**
* Fetches Requirement Identifications that match a description (full-text search).
*
* @async
* @function fetchReqIdentificationsByDescription
* @param {string} description - The description or keywords to search.
* @returns {Promise<void>} - Updates the list of identifications or sets an error.
*/
  const fetchReqIdentificationsByDescription = useCallback(
    async (description) => {
      setState({ loading: true, error: null });
      try {
        const reqIdentifications = await getReqIdentificationsByDescription({ description, token: jwt });
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

        setState({ loading: false, error: handledError });
      }
    },
    [jwt]
  );

  /**
* Fetches Requirement Identifications filtered by a creation date range.
*
* @async
* @function fetchReqIdentificationsByCreatedAt
* @param {string} from - Start date in YYYY-MM-DD format.
* @param {string} to - End date in YYYY-MM-DD format.
* @returns {Promise<void>} - Updates the list of identifications or sets an error.
*/
  const fetchReqIdentificationsByCreatedAt = useCallback(
    async (from, to) => {
      setState({ loading: true, error: null });
      try {
        const reqIdentifications = await getReqIdentificationsByCreatedAt({ from, to, token: jwt });
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

        setState({ loading: false, error: handledError });
      }
    },
    [jwt]
  );

  /**
* Fetches Requirement Identifications filtered by jurisdiction type.
*
* @async
* @function fetchReqIdentificationsByJurisdiction
* @param {string} jurisdiction - The jurisdiction type ("Federal", "Estatal", or "Local").
* @returns {Promise<void>} - Updates the list of identifications or sets an error.
*/
  const fetchReqIdentificationsByJurisdiction = useCallback(
    async (jurisdiction) => {
      setState({ loading: true, error: null });
      try {
        const reqIdentifications = await getReqIdentificationsByJurisdiction({ jurisdiction, token: jwt });
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

        setState({ loading: false, error: handledError });
      }
    },
    [jwt]
  );

  /**
 * Fetches Requirement Identifications filtered by a specific state.
 *
 * @async
 * @function fetchReqIdentificationsByState
 * @param {string} state - The state to filter by.
 * @returns {Promise<void>} - Updates the list of identifications or sets an error.
 */
  const fetchReqIdentificationsByState = useCallback(
    async (state) => {
      setState({ loading: true, error: null });
      try {
        const reqIdentifications = await getReqIdentificationsByState({ state, token: jwt });
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

        setState({ loading: false, error: handledError });
      }
    },
    [jwt]
  );

  /**
   * Fetches Requirement Identifications filtered by a state and one or more municipalities.
   *
   * @async
   * @function fetchReqIdentificationsByStateAndMunicipalities
   * @param {Object} params - Parameters for the request.
   * @param {string} params.state - The state to filter by.
   * @param {string[]} params.municipalities - The list of municipalities to include.
   * @returns {Promise<void>} - Updates the list of identifications or sets an error.
   */
  const fetchReqIdentificationsByStateAndMunicipalities = useCallback(
    async ({ state, municipalities }) => {
      setState({ loading: true, error: null });
      try {
        const reqIdentifications = await getReqIdentificationsByStateAndMunicipalities({
          state,
          municipalities,
          token: jwt,
        });
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

        setState({ loading: false, error: handledError });
      }
    },
    [jwt]
  );

  /**
   * Fetches Requirement Identifications filtered by their current status.
   *
   * @async
   * @function fetchReqIdentificationsByStatus
   * @param {string} status - The status to filter by ('Activo' | 'Fallido' | 'Completado').
   * @returns {Promise<void>} - Updates the list of identifications or sets an error.
   */
  const fetchReqIdentificationsByStatus = useCallback(
    async (status) => {
      setState({ loading: true, error: null });
      try {
        const reqIdentifications = await getReqIdentificationsByStatus({ status, token: jwt });
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

        setState({ loading: false, error: handledError });
      }
    },
    [jwt]
  );

  /**
   * Fetches Requirement Identifications associated with a specific user.
   *
   * @async
   * @function fetchReqIdentificationsByUserId
   * @param {number} userId - ID of the user to filter by.
   * @returns {Promise<void>} - Updates the list of identifications or sets an error.
   */
  const fetchReqIdentificationsByUserId = useCallback(
    async (userId) => {
      setState({ loading: true, error: null });
      try {
        const reqIdentifications = await getReqIdentificationsByUserId({ userId, token: jwt });
        setReqIdentifications(reqIdentifications);
        setState({ loading: false, error: null });
      } catch (error) {
        const errorCode = error.response?.status;
        const serverMessage = error.response?.data?.message;
        const clientMessage = error.message;

        const handledError = ReqIdentificationErrors.handleError({
          code: errorCode,
          error: serverMessage,
          httpError: clientMessage
        });

        setState({ loading: false, error: handledError });
      }
    },
    [jwt]
  );

  /**
 * Fetches Requirement Identifications associated with a specific subject.
 *
 * @async
 * @function fetchReqIdentificationsBySubjectId
 * @param {number} subjectId - The ID of the subject to filter by.
 * @returns {Promise<void>} - Updates the list of identifications or sets an error.
 */
  const fetchReqIdentificationsBySubjectId = useCallback(
    async (subjectId) => {
      setState({ loading: true, error: null });
      try {
        const reqIdentifications = await getReqIdentificationsBySubjectId({ subjectId, token: jwt });
        setReqIdentifications(reqIdentifications);
        setState({ loading: false, error: null });
      } catch (error) {
        const errorCode = error.response?.status;
        const serverMessage = error.response?.data?.message;
        const clientMessage = error.message;

        const handledError = ReqIdentificationErrors.handleError({
          code: errorCode,
          error: serverMessage,
          httpError: clientMessage
        });

        setState({ loading: false, error: handledError });
      }
    },
    [jwt]
  );

  /**
   * Fetches Requirement Identifications filtered by subject and associated aspects.
   *
   * @async
   * @function fetchReqIdentificationsBySubjectAndAspects
   * @param {Object} params - The filter parameters.
   * @param {number} params.subjectId - The ID of the subject.
   * @param {Array<number>} params.aspectIds - The list of aspect IDs.
   * @returns {Promise<void>} - Updates the list of identifications or sets an error.
   */
  const fetchReqIdentificationsBySubjectAndAspects = useCallback(
    async ({ subjectId, aspectIds }) => {
      setState({ loading: true, error: null });
      try {
        const reqIdentifications = await getReqIdentificationsBySubjectAndAspects({
          subjectId,
          aspectIds,
          token: jwt,
        });
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

        setState({ loading: false, error: handledError });
      }
    },
    [jwt]
  );

  /**
   * Updates a Requirement Identification with the provided data.
   *
   * @async
   * @function editReqIdentification
   * @param {Object} params - The update data.
   * @param {number} params.id - The ID of the identification to update.
   * @param {string} [params.reqIdentificationName] - New name (optional).
   * @param {string} [params.reqIdentificationDescription] - New description (optional).
   * @param {number} [params.newUserId] - New user ID (optional).
   * @returns {Object} - Result of the update process including success and updated data.
   */
  const editReqIdentification = useCallback(
    async ({ id, reqIdentificationName, reqIdentificationDescription, newUserId }) => {
      try {
        const updated = await updateReqIdentification({
          id,
          reqIdentificationName,
          reqIdentificationDescription,
          newUserId,
          token: jwt,
        });

        return { success: true, reqIdentification: updated };
      } catch (error) {
        const errorCode = error.response?.status;
        const serverMessage = error.response?.data?.message;
        const clientMessage = error.message;

        const handledError = ReqIdentificationErrors.handleError({
          code: errorCode,
          error: serverMessage,
          httpError: clientMessage,
          items: [id],
        });

        return { success: false, error: handledError.message };
      }
    },
    [jwt]
  );

  /**
 * Deletes a specific Requirement Identification by ID.
 *
 * @async
 * @function removeReqIdentification
 * @param {number} id - The ID of the identification to delete.
 * @returns {Object} - Result of the deletion process including success or error message.
 */
  const removeReqIdentification = useCallback(
    async (id) => {
      try {
        await deleteReqIdentification({ id, token: jwt });
        return { success: true };
      } catch (error) {
        const errorCode = error.response?.status;
        const serverMessage = error.response?.data?.message;
        const clientMessage = error.message;

        const handledError = ReqIdentificationErrors.handleError({
          code: errorCode,
          error: serverMessage,
          httpError: clientMessage,
          items: [id],
        });

        return { success: false, error: handledError.message };
      }
    },
    [jwt]
  );

  /**
 * Deletes multiple Requirement Identifications in batch.
 *
 * @async
 * @function removeReqIdentificationsBatch
 * @param {number[]} reqIdentificationIds - An array of identification IDs to delete.
 * @returns {Object} - Result of the deletion process including success or error message.
 */
  const removeReqIdentificationsBatch = useCallback(
    async (reqIdentificationIds) => {
      try {
        await deleteReqIdentificationsBatch({ reqIdentificationIds, token: jwt });
        return { success: true };
      } catch (error) {
        const errorCode = error.response?.status;
        const serverMessage = error.response?.data?.message;
        const clientMessage = error.message;

        const reqIdentifications =
          error.response?.data?.errors?.reqIdentifications?.map(
            (reqIdentification) => reqIdentification.name
          ) || reqIdentificationIds;
        const handledError = ReqIdentificationErrors.handleError({
          code: errorCode,
          error: serverMessage,
          httpError: clientMessage,
          items: reqIdentifications,
        });

        return { success: false, error: handledError.message };
      }
    },
    [jwt]
  );

  // Fetch all requirement identifications on initial load
  useEffect(() => {
    fetchReqIdentifications();
  }, [fetchReqIdentifications]);

  return {
    reqIdentifications,
    loading: state.loading,
    error: state.error,
    addReqIdentification,
    fetchReqIdentifications,
    fetchReqIdentificationById,
    fetchReqIdentificationsByName,
    fetchReqIdentificationsByDescription,
    fetchReqIdentificationsByCreatedAt,
    fetchReqIdentificationsByJurisdiction,
    fetchReqIdentificationsByState,
    fetchReqIdentificationsByStateAndMunicipalities,
    fetchReqIdentificationsByStatus,
    fetchReqIdentificationsByUserId,
    fetchReqIdentificationsBySubjectId,
    fetchReqIdentificationsBySubjectAndAspects,
    editReqIdentification,
    removeReqIdentification,
    removeReqIdentificationsBatch,
  };
}
