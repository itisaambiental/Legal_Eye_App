import { useContext, useState, useCallback } from "react";
import Context from "../../context/userContext.jsx";
import insertSortedItem from "../../utils/insertSortedItem.js";
import getAspectsBySubject from "../../services/aspectService/getAspects.js";
import createNewAspect from "../../services/aspectService/createAspect.js";
import getAspectsByName from "../../services/aspectService/getAspectsByName.js";
import updateAspect from "../../services/aspectService/updateAspect.js";
import deleteAspect from "../../services/aspectService/deleteAspect.js";
import deleteAspects from "../../services/aspectService/deleteAspects.js";
import AspectErrors from "../../errors/aspects/AspectErrors.js";

/**
 * Custom hook for managing aspects and retrieving them based on a specific subject.
 * @returns {Object} - Contains aspects list, loading state, error state, and functions for aspect operations.
 */
export default function useAspects() {
  const { jwt } = useContext(Context);
  const [aspects, setAspects] = useState([]);
  const [stateAspects, setStateAspects] = useState({
    loadingState: false,
    loading: true,
    error: null,
  });

  /**
   * Clears the list of aspects from the state.
   * @function clearAspects
   * @returns {void}
   */
  const clearAspects = useCallback(() => {
    setAspects([]);
    setStateAspects((prevState) => ({ ...prevState, error: null }));
  }, []);

  /**
   * Fetches aspects associated with a specific subject.
   * @async
   * @function fetchAspects
   * @param {number} subjectId - The ID of the subject to retrieve aspects for.
   * @returns {Promise<void>}
   */
  const fetchAspects = useCallback(
    async (subjectId) => {
      setStateAspects({ loading: true, loadingState: true, error: null });
      try {
        const aspects = await getAspectsBySubject({ subjectId, token: jwt });
        setAspects(aspects);
        setStateAspects({ loading: false, loadingState: false, error: null });
      } catch (error) {
        const errorCode = error.response?.status;
        const serverMessage = error.response?.data?.message;
        const clientMessage = error.message;
        const handledError = AspectErrors.handleError({
          code: errorCode,
          error: serverMessage,
          httpError: clientMessage,
          items: [subjectId],
        });
        setStateAspects({
          loading: false,
          loadingState: false,
          error: handledError,
        });
      }
    },
    [jwt]
  );

  /**
 * Adds a new aspect to a specific subject in the correct order.
 *
 * @async
 * @function addAspect
 * @param {Object} params - Parameters for creating a new aspect.
 * @param {number} params.subjectId - The ID of the subject to link this aspect to.
 * @param {string} params.aspectName - The name of the aspect.
 * @param {number} params.order - The order number of the aspect.
 * @param {string} params.abbreviation - The abbreviation of the aspect.
 *
 * @returns {Promise<Object>} - Result of the operation with success status or error message.
 */
  const addAspect = useCallback(
    async ({ subjectId, aspectName, order, abbreviation }) => {
      try {
        const newAspect = await createNewAspect({
          subjectId,
          aspectName,
          order,
          abbreviation,
          token: jwt,
        });
        setAspects((prevAspects) =>
          insertSortedItem(prevAspects, newAspect, 'order_index')
        );
        return { success: true };
      } catch (error) {
        const errorCode = error.response?.status;
        const serverMessage = error.response?.data?.message;
        const clientMessage = error.message;

        const handledError = AspectErrors.handleError({
          code: errorCode,
          error: serverMessage,
          httpError: clientMessage,
          items: [subjectId],
        });

        return { success: false, error: handledError.message };
      }
    },
    [jwt]
  );

  /**
   * Fetches aspects by name for a specific subject.
   * @async
   * @function fetchAspectsByName
   * @param {Object} params - Parameters for retrieving aspects.
   * @param {number} params.subjectId - The ID of the subject to filter aspects by.
   * @param {string} params.aspectName - The name or partial name of the aspects to search for.
   * @returns {Promise<Object>} - The retrieved aspects data or an error message if an error occurs.
   */
  const fetchAspectsByName = useCallback(
    async (subjectId, aspectName) => {
      setStateAspects({ loading: true, loadingState: true, error: null });
      try {
        const aspects = await getAspectsByName({
          subjectId,
          aspectName,
          token: jwt,
        });
        setAspects(aspects);
        setStateAspects({ loading: false, loadingState: false, error: null });
      } catch (error) {
        const errorCode = error.response?.status;
        const serverMessage = error.response?.data?.message;
        const clientMessage = error.message;
        const handledError = AspectErrors.handleError({
          code: errorCode,
          error: serverMessage,
          httpError: clientMessage,
          items: [subjectId],
        });
        setStateAspects({
          loading: false,
          loadingState: false,
          error: handledError,
        });
      }
    },
    [jwt]
  );

  /**
   * Updates an existing aspect by ID and reorders the aspects list if the order is updated.
   *
   * @async
   * @function modifyAspect
   * @param {Object} params - Parameters for the aspect to update.
   * @param {number} params.id - The ID of the aspect to update.
   * @param {string} params.aspectName - The new name of the aspect.
   * @param {number} params.order - The new order number of the aspect.
   * @param {string} params.abbreviation - The abbreviation of the aspect.
   * @returns {Promise<Object>} - Result of the operation with success status and updated aspect or error message.
   */
  const modifyAspect = useCallback(
    async ({ id, aspectName, order, abbreviation }) => {
      try {
        const updatedAspect = await updateAspect({
          id,
          aspectName,
          order,
          abbreviation,
          token: jwt,
        });
        setAspects((prevAspects) => {
          const filtered = prevAspects.filter((a) => a.id !== id);
          return insertSortedItem(filtered, updatedAspect, 'order_index');
        });
        return { success: true };
      } catch (error) {
        const errorCode = error.response?.status;
        const serverMessage = error.response?.data?.message;
        const clientMessage = error.message;

        const handledError = AspectErrors.handleError({
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
   * Deletes an existing aspect by ID.
   * @async
   * @function removeAspect
   * @param {number} aspectId - The ID of the aspect to delete.
   * @returns {Promise<Object>}
   */
  const removeAspect = useCallback(
    async (aspectId) => {
      try {
        await deleteAspect({ aspectId, token: jwt });
        setAspects((prevAspects) =>
          prevAspects.filter((aspect) => aspect.id !== aspectId)
        );
        return { success: true };
      } catch (error) {
        const errorCode = error.response?.status;
        const serverMessage = error.response?.data?.message;
        const clientMessage = error.message;
        const handledError = AspectErrors.handleError({
          code: errorCode,
          error: serverMessage,
          httpError: clientMessage,
          items: [aspectId],
        });
        return { success: false, error: handledError.message };
      }
    },
    [jwt]
  );

  /**
   * Deletes a batch of aspects by their IDs.
   * @async
   * @function deleteAspectsBatch
   * @param {Array<number>} aspectIds - The IDs of the aspects to delete.
   * @returns {Promise<Object>}
   */
  const deleteAspectsBatch = useCallback(
    async (aspectIds) => {
      try {
        const success = await deleteAspects({ aspectIds, token: jwt });
        if (success) {
          setAspects((prevAspects) =>
            prevAspects.filter((aspect) => !aspectIds.includes(aspect.id))
          );
          return { success: true };
        }
      } catch (error) {
        const errorCode = error.response?.status;
        const serverMessage = error.response?.data?.message;
        const clientMessage = error.message;
        const aspects =
          error.response?.data?.errors?.associatedAspects?.map(
            (aspect) => aspect.name
          ) || aspectIds;
        const handledError = AspectErrors.handleError({
          code: errorCode,
          error: serverMessage,
          httpError: clientMessage,
          items: aspects,
        });
        return { success: false, error: handledError.message };
      }
    },
    [jwt]
  );

  return {
    aspects,
    loadingState: stateAspects.loadingState,
    loading: stateAspects.loading,
    error: stateAspects.error,
    clearAspects,
    fetchAspects,
    addAspect,
    fetchAspectsByName,
    modifyAspect,
    removeAspect,
    deleteAspectsBatch,
  };
}
