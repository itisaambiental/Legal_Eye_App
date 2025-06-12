import { useCallback, useContext, useEffect, useState } from "react";
import Context from "../../context/userContext";
import createReqIdentification from "../../services/reqIdentificationService/createReqIdentification";
import deleteReqIdentification from "../../services/reqIdentificationService/deleteReqIdentification";
import deleteReqIdentificationsBatch from "../../services/reqIdentificationService/deleteReqIdentificationsBatch";
import getAllReqIdentifications from "../../services/reqIdentificationService/getAllReqIdentifications";
import getReqIdentificationById from "../../services/reqIdentificationService/getReqIdentificationById";
import getReqIdentifications from "../../services/reqIdentificationService/getReqIdentifications"
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
import ReqIdentificationErrors from "../../errors/reqIdentifications/ReqIdentificationErrors";

/**
 * Custom hook for managing Requirement Identifications and performing CRUD operations.
 * @returns {Object} - Contains the identifications list, loading/error state, and functions for operations.
 */
export default function useReqIdentification() {
    const { jwt } = useContext(Context);
    const [reqIdentifications, setReqIdentifications] = useState([]);
    const [state, setState] = useState({
        loading: true,
        error: null,
    });

    /**
     * Creates a new Requirement Identification by sending the request with the provided data.
     *
     * @async
     * @function addReqIdentification
     * @param {Object} params - The data to create a new identification.
     * @param {string} params.reqIdentificationName - The name of the identification.
     * @param {string} params.reqIdentificationDescription - The description of the identification.
     * @param {number[]} params.legalBasisIds - The IDs of the associated legal basis entries.
     * @param {string} params.intelligenceLevel - The level of intelligence to use ("High" or "Low").
     * @returns {Object} - Result of the creation process including success status and job/ID data.
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
     * Fetches the complete list of Requirement Identifications from the backend.
     *
     * @async
     * @function fetchReqIdentifications
     * @returns {Promise<void>} Updates local state with identifications or error.
     */
    const fetchReqIdentifications = useCallback(async () => {
        setState({ loading: true, error: null });
        try {
            const identifications = await getReqIdentifications({ token: jwt });
            setReqIdentifications(identifications);
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
    }, [jwt]);

    /**
 * Fetches all Requirement Identifications without user-based filtering (e.g., for admin view).
 *
 * @async
 * @function fetchAllReqIdentifications
 * @returns {Promise<Object>} - Contains success flag and data or error.
 */
    const fetchAllReqIdentifications = useCallback(async () => {
        try {
            const results = await getAllReqIdentifications({ token: jwt });
            return { success: true, data: results };
        } catch (error) {
            const errorCode = error.response?.status;
            const serverMessage = error.response?.data?.message;
            const clientMessage = error.message;

            const handledError = ReqIdentificationErrors.handleError({
                code: errorCode,
                error: serverMessage,
                httpError: clientMessage,
            });

            return {
                success: false,
                error: handledError.message,
            };
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
                const identification = await getReqIdentificationById({ id, token: jwt });
                return { success: true, data: identification };
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
                const results = await getReqIdentificationsByName({ name, token: jwt });
                setReqIdentifications(results);
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
                const results = await getReqIdentificationsByDescription({ description, token: jwt });
                setReqIdentifications(results);
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
                const results = await getReqIdentificationsByCreatedAt({ from, to, token: jwt });
                setReqIdentifications(results);
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
                const results = await getReqIdentificationsByJurisdiction({ jurisdiction, token: jwt });
                setReqIdentifications(results);
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
   * @param {string} stateName - The name of the state to filter by.
   * @returns {Promise<void>} - Updates the list of identifications or sets an error.
   */
    const fetchReqIdentificationsByState = useCallback(
        async (stateName) => {
            setState({ loading: true, error: null });
            try {
                const results = await getReqIdentificationsByState({ state: stateName, token: jwt });
                setReqIdentifications(results);
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
                const results = await getReqIdentificationsByStateAndMunicipalities({
                    state,
                    municipalities,
                    token: jwt,
                });
                setReqIdentifications(results);
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
     * @param {string} status - The status to filter by ("Active", "Failed", or "Completed").
     * @returns {Promise<void>} - Updates the list of identifications or sets an error.
     */
    const fetchReqIdentificationsByStatus = useCallback(
        async (status) => {
            setState({ loading: true, error: null });
            try {
                const results = await getReqIdentificationsByStatus({ status, token: jwt });
                setReqIdentifications(results);
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
     * Fetches Requirement Identifications created by a specific user.
     *
     * @async
     * @function fetchReqIdentificationsByUserId
     * @param {number} userId - The ID of the user whose identifications will be fetched.
     * @returns {Promise<void>} - Updates the list of identifications or sets an error.
     */
    const fetchReqIdentificationsByUserId = useCallback(
        async (userId) => {
            setState({ loading: true, error: null });
            try {
                const results = await getReqIdentificationsByUserId({ userId, token: jwt });
                setReqIdentifications(results);
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
                const results = await getReqIdentificationsBySubjectId({ subjectId, token: jwt });
                setReqIdentifications(results);
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
                const results = await getReqIdentificationsBySubjectAndAspects({
                    subjectId,
                    aspectIds,
                    token: jwt,
                });
                setReqIdentifications(results);
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
     * @param {string} [params.status] - New status (optional).
     * @returns {Object} - Result of the update process including success and updated data.
     */
    const editReqIdentification = useCallback(
        async ({ id, reqIdentificationName, reqIdentificationDescription, status }) => {
            try {
                const updated = await updateReqIdentification({
                    id,
                    reqIdentificationName,
                    reqIdentificationDescription,
                    status,
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
   * @param {number[]} ids - An array of identification IDs to delete.
   * @returns {Object} - Result of the deletion process including success or error message.
   */
    const removeReqIdentificationsBatch = useCallback(
        async (ids) => {
            try {
                await deleteReqIdentificationsBatch({ ids, token: jwt });
                return { success: true };
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
     * Automatically fetches all requirement identifications on mount.
     */
    useEffect(() => {
        fetchReqIdentifications();
    }, [fetchReqIdentifications]);

    return {
        reqIdentifications,
        loading: state.loading,
        error: state.error,
        addReqIdentification,
        fetchReqIdentifications,
        fetchAllReqIdentifications,
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