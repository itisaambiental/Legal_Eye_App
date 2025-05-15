import { useContext, useState, useEffect, useCallback } from "react";
import Context from "../../context/userContext.jsx";
import createRequirementType from "../../services/requirementTypesService/createRequirementType.js";
import getRequirementTypes from "../../services/requirementTypesService/getRequirementTypes.js";
import getRequirementTypeById from "../../services/requirementTypesService/getRequirementTypeById.js";
import getRequirementTypesByName from "../../services/requirementTypesService/getRequirementTypesByName.js";
import getRequirementTypesByClassification from "../../services/requirementTypesService/getRequirementTypesByClassification.js";
import getRequirmentTypesByDescription from "../../services/requirementTypesService/getRequirementTypesByDescription.js";
import updateRequirementType from "../../services/requirementTypesService/updateRequirementType.js";
import deleteRequirementType from "../../services/requirementTypesService/deleteRequirementType.js";
import deleteRequirementTypesBatch from "../../services/requirementTypesService/deleteRequirementTypesBatch.js";
import RequirementTypesErrors from "../../errors/requirementTypes/RequirementTypesErrors.js";

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
   * Adds a new requirement type to the list.
   * @async
   * @function addRequirementType
   * @param {Object} params - Requirement type data.
   * @param {string} params.name - The name of the requirement type.
   * @param {string} params.description - The description of the type.
   * @param {string} params.classification - The classification category.
   * @returns {Promise<Object>} - Result of the operation with success or error.
   */
    const addRequirementType = useCallback(
      async ({ name, description, classification }) => {
        try {
          const newRequirementType = await createRequirementType({
            name,
            description,
            classification,
            token: jwt,
          });
          setRequirementTypes((prevRequirementTypes) => [
            newRequirementType,
            ...prevRequirementTypes,
          ]);
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
        const requirementType = await getRequirementTypeById({ id, token: jwt });
        return { success: true, data: requirementType };
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
   * Updates an existing requirement type.
   * @async
   * @function modifyRequirementType
   * @param {Object} params - Requirement type data.
   * @param {number} params.id - The id of the requirement type.
   * @param {string} params.name - The name of the requirement type.
   * @param {string} params.description - The description of the type.
   * @param {string} params.classification - The classification category.
   * @returns {Promise<Object>} - Result of the operation with success or error.
   */
  const modifyRequirementType = useCallback(
    async ({ id, name, description, classification }) => {
      try {
        const updatedRequirementType = await updateRequirementType({
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
        await deleteRequirementType({ id, token: jwt });
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
   * @param {Array<number>} requirementTypesIds - Array of IDs to delete.
   * @returns {Promise<Object>} - Result of the operation with success or error.
   */
  const removeRequirementTypesBatch = useCallback(
    async (requirementTypesIds) => {
      try {
        await deleteRequirementTypesBatch({ requirementTypesIds, token: jwt });
        setRequirementTypes((prevRequirementTypes) =>
          prevRequirementTypes.filter((type) => !requirementTypesIds.includes(type.id)));
        return { success: true };
      } catch (error) {
        const errorCode = error.response?.status;
        const serverMessage = error.response?.data?.message;
        const clientMessage = error.message;
        const handledError = RequirementTypesErrors.handleError({
          code: errorCode,
          error: serverMessage,
          httpError: clientMessage,
          items: requirementTypesIds,
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
    addRequirementType,
    fetchRequirementTypes,
    fetchRequirementTypeById,
    fetchRequirementTypesByName,
    fetchRequirementTypesByClassification,
    fetchRequirementTypesByDescription,
    modifyRequirementType,
    removeRequirementType,
    removeRequirementTypesBatch,
  };
}
