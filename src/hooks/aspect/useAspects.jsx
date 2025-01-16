import { useContext, useState, useCallback } from "react";
import Context from "../../context/userContext.jsx";
import getAspectsBySubject from "../../services/aspectService/getAspects.js";
import createNewAspect from "../../services/aspectService/createAspect.js";
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
    loading: false,
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
      setStateAspects({ loading: true, error: null });
      try {
        const aspects = await getAspectsBySubject({ subjectId, token: jwt });
        setAspects(aspects.reverse());
        setStateAspects({ loading: false, error: null });
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
          error: handledError,
        });
      }
    },
    [jwt]
  );

  /**
   * Adds a new aspect to a specific subject.
   * @async
   * @function addAspect
   * @param {number} subjectId - The ID of the subject to link this aspect to.
   * @param {string} aspectName - The name of the aspect to add.
   * @returns {Promise<Object>}
   */
  const addAspect = useCallback(
    async (subjectId, aspectName) => {
      try {
        const newAspect = await createNewAspect({
          subjectId,
          aspectName,
          token: jwt,
        });
        setAspects((prevAspects) => [newAspect, ...prevAspects]);
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
   * Updates an existing aspect by ID.
   * @async
   * @function modifyAspect
   * @param {number} aspectId - The ID of the aspect to update.
   * @param {string} aspectName - The new name of the aspect.
   * @returns {Promise<Object>}
   */
  const modifyAspect = useCallback(
    async (aspectId, aspectName) => {
      try {
        const updatedAspect = await updateAspect({
          aspectId,
          aspectName,
          token: jwt,
        });
        setAspects((prevAspects) =>
          prevAspects.map((aspect) =>
            aspect.id === aspectId ? updatedAspect : aspect
          )
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
    loading: stateAspects.loading,
    error: stateAspects.error,
    clearAspects,
    fetchAspects,
    addAspect,
    modifyAspect,
    removeAspect,
    deleteAspectsBatch,
  };
}
