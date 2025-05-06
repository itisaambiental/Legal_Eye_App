import { useContext, useState, useEffect, useCallback } from "react";
import Context from "../../context/userContext.jsx";
import getRequirementTypes from "../../services/requirementService/requirementTypesService/getRequirementTypes.js";
import getRequirementTypesById from "../../services/requirementService/requirementTypesService/getRequirementTypesById.js";
import getRequirementTypesByName from "../../services/requirementService/requirementTypesService/getRequirementTypesByName.js";
import getRequirementTypesByClassification from "../../services/requirementService/requirementTypesService/getRequirementTypesByClassification.js";
import getRequirmentTypesByDescription from "../../services/requirementService/requirementTypesService/getRequirementTypesByDescription.js";
import createRequirementTypes from "../../services/requirementService/requirementTypesService/createRequirementTypes.js";
import updateRequirementTypes from "../../services/requirementService/requirementTypesService/updateRequirementTypes.js";
import deleteRequirementTypes from "../../services/requirementService/requirementTypesService/deleteRequirementTypes.js";
import deleteRequirementTypesBatch from "../../services/requirementService/requirementTypesService/deleteRequirementTypesBatch.js";
import RequirementTypesErrors from "../../errors/requirements/RequirementTypesErrors.js";

/**
 * Custom hook for managing requirement types and performing CRUD operations.
 * @returns {Object} - Contains requirement types list, loading state, error state, and functions for operations.
 */
export default function useRequirementTypes() {
  const { jwt } = useContext(Context);
  const [requirementTypes, setRequirementTypes] = useState([]);
  const [state, setState] = useState({
    loading: true,
    error: null,
  });

  /**
   * Fetches the complete list of requirement types.
   * @async
   * @function fetchRequirementTypes
   * @returns {Promise<void>} - Updates the requirement types list and loading state.
   * @throws {Object} - Updates error state if fetching fails.
   */
  const fetchRequirementTypes = useCallback(async () => {
    setState({ loading: true, error: null });
    try {
      const requirementTypes = await getRequirementTypes({ token: jwt });
      setRequirementTypes(requirementTypes);
      setState({ loading: false, error: null });
    } catch (error) {
      const errorCode = error.response?.status;
      const errorMessage = error.response?.data?.message;
      const clientMessage = error.message;
      const handledError = RequirementTypesErrors.handleError({
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
   * Fetches a requirement type by its ID.
   * @async
   * @function fetchRequirementTypeById
   * @param {number} id - The ID of the requirement type.
   * @returns {Promise<Object>} - The retrieved requirement type or error object.
   */
  const fetchRequirementTypeById = useCallback(
    async (id) => {
      try {
        const requirementTypes = await getRequirementTypesById({ id, token: jwt });
        return { success: true, data: requirementTypes };
      } catch (error) {
        const errorCode = error.response?.status;
        const serverMessage = error.response?.data?.message;
        const clientMessage = error.message;
        const handledError = RequirementTypesErrors.handleError({
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
   * Fetches requirement types by name.
   * @async
   * @function fetchRequirementTypesByName
   * @param {string} name - Partial or full name to search.
   * @returns {Promise<void>} - Updates the requirement types list.
   */
  const fetchRequirementTypesByName = useCallback(
    async (name) => {
      setState({ loading: true, error: null });
      try {
        const requirementTypes = await getRequirementTypesByName({ name, token: jwt });
        setRequirementTypes(requirementTypes);
        setState({ loading: false, error: null });
      } catch (error) {
        const errorCode = error.response?.status;
        const serverMessage = error.response?.data?.message;
        const clientMessage = error.message;
        const handledError = RequirementTypesErrors.handleError({
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
   * Fetches requirement types by classification.
   * @async
   * @function fetchRequirementTypesByClassification
   * @param {string} classification - The classification to filter by.
   * @returns {Promise<void>} - Updates the requirement types list.
   */
  const fetchRequirementTypesByClassification = useCallback(
    async (classification) => {
      setState({ loading: true, error: null });
      try {
        const requirementTypes = await getRequirementTypesByClassification({ classification, token: jwt });
        setRequirementTypes(requirementTypes);
        setState({ loading: false, error: null });
      } catch (error) {
        const errorCode = error.response?.status;
        const serverMessage = error.response?.data?.message;
        const clientMessage = error.message;
        const handledError = RequirementTypesErrors.handleError({
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
   * Fetches requirement types by description.
   * @async
   * @function fetchRequirementTypesByDescription
   * @param {string} description - Partial description to search.
   * @returns {Promise<void>} - Updates the requirement types list.
   */
  const fetchRequirementTypesByDescription = useCallback(
    async (description) => {
      setState({ loading: true, error: null });
      try {
        const requirementTypes = await getRequirmentTypesByDescription({ description, token: jwt });
        setRequirementTypes(requirementTypes);
        setState({ loading: false, error: null });
      } catch (error) {
        const errorCode = error.response?.status;
        const serverMessage = error.response?.data?.message;
        const clientMessage = error.message;
        const handledError = RequirementTypesErrors.handleError({
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
   * Adds a new requirement type to the list.
   * @async
   * @function addRequirementTypes
   * @param {Object} params - Requirement type data.
   * @param {string} params.name - The name of the requirement type.
   * @param {string} params.description - The description of the type.
   * @param {string} params.classification - The classification category.
   * @returns {Promise<Object>} - Result of the operation with success or error.
   */
  const addRequirementTypes = useCallback(
    async ({ name, description, classification }) => {
      try {
        const newRequirementType = await createRequirementTypes({
          name,
          description,
          classification,
          token: jwt,
        });
        setRequirementTypes((prevRequirementTypes) => [...prevRequirementTypes, newRequirementType]);
        return { success: true };
      } catch (error) {
        const errorCode = error.response?.status;
        const serverMessage = error.response?.data?.message;
        const clientMessage = error.message;
        const handledError = RequirementTypesErrors.handleError({
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
   * Updates an existing requirement type.
   * @async
   * @function modifyRequirementType
   * @param {Object} params - Requirement type data including ID.
   * @returns {Promise<Object>} - Result of the operation with success or error.
   */
  const modifyRequirementType = useCallback(
    async ({ id, name, description, classification }) => {
      try {
        const updatedRequirementType = await updateRequirementTypes({
          id,
          name,
          description,
          classification,
          token: jwt,
        });
        setRequirementTypes((prevRequirementTypes) =>
          prevRequirementTypes.map((prevRequirementType) =>
            prevRequirementType.id === id ? updatedRequirementType : prevRequirementType
          )
        );
        return { success: true };
      } catch (error) {
        const errorCode = error.response?.status;
        const serverMessage = error.response?.data?.message;
        const clientMessage = error.message;
        const handledError = RequirementTypesErrors.handleError({
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
   * Deletes a requirement type by ID.
   * @async
   * @function removeRequirementType
   * @param {number} id - ID of the requirement type to delete.
   * @returns {Promise<Object>} - Result of the operation with success or error.
   */
  const removeRequirementType = useCallback(
    async (id) => {
      try {
        await deleteRequirementTypes({ id, token: jwt });
        setRequirementTypes((prevRequirementTypes) =>
          prevRequirementTypes.filter((type) => type.id !== id)
        );
        return { success: true };
      } catch (error) {
        const errorCode = error.response?.status;
        const serverMessage = error.response?.data?.message;
        const clientMessage = error.message;
        const handledError = RequirementTypesErrors.handleError({
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
   * Deletes multiple requirement types by their IDs.
   * @async
   * @function removeRequirementTypesBatch
   * @param {Array<number>} requirementTypeIds - Array of IDs to delete.
   * @returns {Promise<Object>} - Result of the operation with success or error.
   */
  const removeRequirementTypesBatch = useCallback(
    async (requirementTypeIds) => {
      try {
        await deleteRequirementTypesBatch({ requirementTypeIds, token: jwt });
        setRequirementTypes((prevRequirementTypes) =>
          prevRequirementTypes.filter((type) => !requirementTypeIds.includes(type.id)));
        return { success: true };
      } catch (error) {
        const errorCode = error.response?.status;
        const serverMessage = error.response?.data?.message;
        const clientMessage = error.message;
        const handledError = RequirementTypesErrors.handleError({
          code: errorCode,
          error: serverMessage,
          httpError: clientMessage,
          items: requirementTypeIds,
        });
        return { success: false, error: handledError.message };
      }
    },
    [jwt]
  );
  useEffect(() => {
    fetchRequirementTypes();
  }, [fetchRequirementTypes]);

  return {
    requirementTypes,
    loading: state.loading,
    error: state.error,
    fetchRequirementTypes,
    fetchRequirementTypeById,
    fetchRequirementTypesByName,
    fetchRequirementTypesByClassification,
    fetchRequirementTypesByDescription,
    addRequirementTypes,
    modifyRequirementType,
    removeRequirementType,
    removeRequirementTypesBatch,
  };
}
