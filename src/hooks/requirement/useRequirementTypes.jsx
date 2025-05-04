import { useContext, useState, useEffect, useCallback } from "react";
import Context from "../../context/userContext.jsx";
import getRequirementTypes from "../../services/requirementService/requirementTypesService/getRequirementTypes.js";
import getRequirementTypesById from "../../services/requirementService/requirementTypesService/getRequirementTypesById.js"
import getRequirementTypesByName from "../../services/requirementService/requirementTypesService/getRequirementTypesByName.js"
import getRequirementTypesByClassification from "../../services/requirementService/requirementTypesService/getRequirementTypesByClassification.js"
import getRequirmentTypesByDescription from "../../services/requirementService/requirementTypesService/getRequirementTypesByDescription.js"
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
   * Fetches all requirement types.
   */
  const fetchRequirementTypes = useCallback(async () => {
    setState({ loading: true, error: null });
    try {
      const types = await getRequirementTypes(jwt);
      setRequirementTypes(types);
      setState({ loading: false, error: null });
    } catch (error) {
      const errorCode = error.response?.status;
      const errorMessage = error.response?.data?.message;
      const clientMessage = error.message;
      const handledError = RequirementTypeErrors.handleError({
        code: errorCode,
        error: errorMessage,
        httpError: clientMessage,
      });
      setState({ loading: false, error: handledError });
    }
  }, [jwt]);

  /**
   * Adds a new requirement type.
   */
  const addRequirementType = useCallback(
    async ({ name, description, classification }) => {
      try {
        const newType = await createRequirementType({
          name,
          description,
          classification,
          token: jwt,
        });
        setRequirementTypes((prev) => [...prev, newType]);
        return { success: true };
      } catch (error) {
        const errorCode = error.response?.status;
        const serverMessage = error.response?.data?.message;
        const clientMessage = error.message;
        const handledError = RequirementTypeErrors.handleError({
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
   * Updates a requirement type by ID.
   */
  const modifyRequirementType = useCallback(
    async ({ id, name, description, classification }) => {
      try {
        const updatedType = await updateRequirementType({
          id,
          name,
          description,
          classification,
          token: jwt,
        });
        setRequirementTypes((prev) =>
          prev.map((type) => (type.id === id ? updatedType : type))
        );
        return { success: true };
      } catch (error) {
        const errorCode = error.response?.status;
        const serverMessage = error.response?.data?.message;
        const clientMessage = error.message;
        const handledError = RequirementTypeErrors.handleError({
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
   */
  const removeRequirementType = useCallback(
    async (id) => {
      try {
        await deleteRequirementType({ id, token: jwt });
        setRequirementTypes((prev) =>
          prev.filter((type) => type.id !== id)
        );
        return { success: true };
      } catch (error) {
        const errorCode = error.response?.status;
        const serverMessage = error.response?.data?.message;
        const clientMessage = error.message;
        const handledError = RequirementTypeErrors.handleError({
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
   */
  const deleteRequirementTypesBatch = useCallback(
    async (ids) => {
      try {
        const success = await deleteRequirementTypes({ ids, token: jwt });
        if (success) {
          setRequirementTypes((prev) =>
            prev.filter((type) => !ids.includes(type.id))
          );
          return { success: true };
        }
      } catch (error) {
        const errorCode = error.response?.status;
        const serverMessage = error.response?.data?.message;
        const clientMessage = error.message;
        const items =
          error.response?.data?.errors?.associatedTypes?.map(
            (type) => type.name
          ) || ids;
        const handledError = RequirementTypeErrors.handleError({
          code: errorCode,
          error: serverMessage,
          httpError: clientMessage,
          items,
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
    addRequirementType,
    modifyRequirementType,
    removeRequirementType,
    deleteRequirementTypesBatch,
  };
}
