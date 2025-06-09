import { useContext, useState, useEffect, useCallback } from "react";
import Context from "../../context/userContext.jsx";
import createLegalVerb from "../../services/legalVerbsServices/createLegalVerb.js";
import getLegalVerbs from "../../services/legalVerbsServices/getLegalVerbs.js";
import getLegalVerbById from "../../services/legalVerbsServices/getLegalVerbById.js";
import getLegalVerbsByName from "../../services/legalVerbsServices/getLegalVerbsByName.js";
import getLegalVerbsByDescription from "../../services/legalVerbsServices/getLegalVerbsByDescription.js";
import getLegalVerbsByTranslation from "../../services/legalVerbsServices/getLegalVerbsByTranslation.js";
import updateLegalVerb from "../../services/legalVerbsServices/updateLegalVerb.js";
import deleteLegalVerb from "../../services/legalVerbsServices/deleteLegalVerb.js";
import deleteLegalVerbsBatch from "../../services/legalVerbsServices/deleteLegalVerbsBatch.js";
import LegalVerbsErrors from "../../errors/legalVerbs/LegalVerbsErrors.js";

/**
 * Custom hook for managing legal verbs and performing CRUD operations.
 * @returns {Object} - Contains legal verbs list, loading state, error state, and functions for operations.
 */
export default function useLegalVerbs() {
  const { jwt } = useContext(Context);
  const [legalVerbs, setLegalVerbs] = useState([]);
  const [state, setState] = useState({
    loading: true,
    error: null,
  });

  /**
   * Adds a new legal verb to the list.
   * @async
   * @function addLegalVerb
   * @param {Object} params - Legal verb data.
   * @param {string} params.name - The name of the legal verb.
   * @param {string} params.description - The description of the verb.
   * @param {string} params.translation - The translation category.
   * @returns {Promise<Object>} - Result of the operation with success or error.
   */
  const addLegalVerb = useCallback(
    async ({ name, description, translation }) => {
      try {
        const newLegalVerb = await createLegalVerb({
          name,
          description,
          translation,
          token: jwt,
        });
        setLegalVerbs((prevLegalVerbs) => [
          newLegalVerb,
          ...prevLegalVerbs,
        ]);
        return { success: true };
      } catch (error) {
        const errorCode = error.response?.status;
        const serverMessage = error.response?.data?.message;
        const clientMessage = error.message;
        const handledError = LegalVerbsErrors.handleError({
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
   * Fetches the complete list of legal verbs.
   * @async
   * @function fetchLegalVerbs
   * @returns {Promise<void>} - Updates the legal verbs list and loading state.
   * @throws {Object} - Updates error state if fetching fails.
   */
  const fetchLegalVerbs = useCallback(async () => {
    setState({ loading: true, error: null });
    try {
      const legalVerbs = await getLegalVerbs({ token: jwt });
      setLegalVerbs(legalVerbs);
      setState({ loading: false, error: null });
    } catch (error) {
      const errorCode = error.response?.status;
      const errorMessage = error.response?.data?.message;
      const clientMessage = error.message;
      const handledError = LegalVerbsErrors.handleError({
        code: errorCode,
        error: errorMessage,
        httpError: clientMessage,
      });
      setState({
        loading: false,
        error: handledError
      });
    }
  }, [jwt]);

  /**
   * Fetches a legal verb by its ID.
   * @async
   * @function fetchLegalVerbById
   * @param {number} id - The ID of the legal verb.
   * @returns {Promise<Object>} - The retrieved legal verb or error object.
   */
  const fetchLegalVerbById = useCallback(
    async (id) => {
      try {
        const legalVerb = await getLegalVerbById({ id, token: jwt });
        return { success: true, data: legalVerb };
      } catch (error) {
        const errorCode = error.response?.status;
        const serverMessage = error.response?.data?.message;
        const clientMessage = error.message;
        const handledError = LegalVerbsErrors.handleError({
          code: errorCode,
          error: serverMessage,
          httpError: clientMessage,
          items: [id],
        });
        return { success: false, error: handledError };
      }
    },
    [jwt]
  );

  /**
   * Fetches legal verbs by name.
   * @async
   * @function fetchLegalVerbsByName
   * @param {string} name - Partial or full name to search.
   * @returns {Promise<void>} - Updates the legal verbs list.
   */
  const fetchLegalVerbsByName = useCallback(
    async (name) => {
      setState({ loading: true, error: null });
      try {
        const legalVerbs = await getLegalVerbsByName({ name, token: jwt });
        setLegalVerbs(legalVerbs);
        setState({ loading: false, error: null });
      } catch (error) {
        const errorCode = error.response?.status;
        const serverMessage = error.response?.data?.message;
        const clientMessage = error.message;
        const handledError = LegalVerbsErrors.handleError({
          code: errorCode,
          error: serverMessage,
          httpError: clientMessage,
        });
        setState({
          loading: false,
          error: handledError
        });
      }
    },
    [jwt]
  );

  /**
   * Fetches legal verbs by description.
   * @async
   * @function fetchLegalVerbsByDescription
   * @param {string} description - Partial description to search.
   * @returns {Promise<void>} - Updates the legal verbs list.
   */
  const fetchLegalVerbsByDescription = useCallback(
    async (description) => {
      setState({ loading: true, error: null });
      try {
        const legalVerbs = await getLegalVerbsByDescription({ description, token: jwt });
        setLegalVerbs(legalVerbs);
        setState({ loading: false, error: null });
      } catch (error) {
        const errorCode = error.response?.status;
        const serverMessage = error.response?.data?.message;
        const clientMessage = error.message;
        const handledError = LegalVerbsErrors.handleError({
          code: errorCode,
          error: serverMessage,
          httpError: clientMessage,
        });
        setState({
          loading: false,
          error: handledError
        });
      }
    },
    [jwt]
  );

  /**
   * Fetches legal verbs by translation.
   * @async
   * @function fetchLegalVerbsByTranslation
   * @param {string} translation - Partial translation to search.
   * @returns {Promise<void>} - Updates the legal verbs list.
   */
  const fetchLegalVerbsByTranslation = useCallback(
    async (translation) => {
      setState({ loading: true, error: null });
      try {
        const legalVerbs = await getLegalVerbsByTranslation({ translation, token: jwt });
        setLegalVerbs(legalVerbs);
        setState({ loading: false, error: null });
      } catch (error) {
        const errorCode = error.response?.status;
        const serverMessage = error.response?.data?.message;
        const clientMessage = error.message;
        const handledError = LegalVerbsErrors.handleError({
          code: errorCode,
          error: serverMessage,
          httpError: clientMessage,
        });
        setState({
          loading: false,
          error: handledError
        });
      }
    },
    [jwt]
  );

  /**
   * Updates an existing legal verb.
   * @async
   * @function modifyLegalVerb
   * @param {Object} params - Legal verb data.
   * @param {number} params.id - The id of the legal verb.
   * @param {string} params.name - The name of the legal verb.
   * @param {string} params.description - The description of the verb.
   * @param {string} params.translation - The translation category.
   * @returns {Promise<Object>} - Result of the operation with success or error.
   */
  const modifyLegalVerb = useCallback(
    async ({ id, name, description, translation }) => {
      try {
        const updatedLegalVerb = await updateLegalVerb({
          id,
          name,
          description,
          translation,
          token: jwt,
        });
        setLegalVerbs((prevLegalVerbs) =>
          prevLegalVerbs.map((prevLegalVerb) =>
            prevLegalVerb.id === id ? updatedLegalVerb : prevLegalVerb
          )
        );
        return { success: true };
      } catch (error) {
        const errorCode = error.response?.status;
        const serverMessage = error.response?.data?.message;
        const clientMessage = error.message;
        const handledError = LegalVerbsErrors.handleError({
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
   * Deletes a legal verb by ID.
   * @async
   * @function removeLegalVerb
   * @param {number} id - ID of the legal verb to delete.
   * @returns {Promise<Object>} - Result of the operation with success or error.
   */
  const removeLegalVerb = useCallback(
    async (id) => {
      try {
        await deleteLegalVerb({ id, token: jwt });
        setLegalVerbs((prevLegalVerbs) =>
          prevLegalVerbs.filter((lv) => lv.id !== id)
        );
        return { success: true };
      } catch (error) {
        const errorCode = error.response?.status;
        const serverMessage = error.response?.data?.message;
        const clientMessage = error.message;
        const handledError = LegalVerbsErrors.handleError({
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
   * Deletes multiple legal verbs by their IDs.
   * @async
   * @function removeLegalVerbsBatch
   * @param {Array<number>} legalVerbsIds - Array of IDs to delete.
   * @returns {Promise<Object>} - Result of the operation with success or error.
   */
  const removeLegalVerbsBatch = useCallback(
    async (legalVerbsIds) => {
      try {
        await deleteLegalVerbsBatch({ legalVerbsIds, token: jwt });
        setLegalVerbs((prevLegalVerbs) =>
          prevLegalVerbs.filter((lv) => !legalVerbsIds.includes(lv.id)));
        return { success: true };
      } catch (error) {
        const errorCode = error.response?.status;
        const serverMessage = error.response?.data?.message;
        const clientMessage = error.message;
          const legalVerbs =
          error.response?.data?.errors?.legalVerbs?.map(
            (requirement) => requirement.name
          ) || legalVerbsIds;
        const handledError = LegalVerbsErrors.handleError({
          code: errorCode,
          error: serverMessage,
          httpError: clientMessage,
          items: legalVerbs,
        });
        return { success: false, error: handledError.message };
      }
    },
    [jwt]
  );

  useEffect(() => {
    fetchLegalVerbs();
  }, [fetchLegalVerbs]);

  return {
    legalVerbs,
    loading: state.loading,
    error: state.error,
    addLegalVerb,
    fetchLegalVerbs,
    fetchLegalVerbById,
    fetchLegalVerbsByName,
    fetchLegalVerbsByDescription,
    fetchLegalVerbsByTranslation,
    modifyLegalVerb,
    removeLegalVerb,
    removeLegalVerbsBatch,
  };
}
