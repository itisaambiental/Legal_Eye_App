import { useContext, useState, useEffect, useCallback } from "react";
import Context from "../../context/userContext";
import createRequirement from "../../services/requirementService/createRequirement";
import getRequirements from "../../services/requirementService/getRequirements";
import getRequirementById from "../../services/requirementService/getRequirementById";
import getRequirementsByName from "../../services/requirementService/getRequirementsByName";
import getRequirementsByNumber from "../../services/requirementService/getRequirementsByNumber";
import getRequirementsBySubject from "../../services/requirementService/getRequirementsBySubject";
import getRequirementsBySubjectAndAspects from "../../services/requirementService/getRequirementsBySubjectAndAspects";
import getRequirementsByComplementaryDescription from "../../services/requirementService/getRequirementsByComplementaryDescription";
import getRequirementsByComplementaryKeywords from "../../services/requirementService/getRequirementsByComplementaryKeywords";
import getRequirementsByComplementarySentences from "../../services/requirementService/getRequirementsByComplementarySentences";
import getRequirementsByCondition from "../../services/requirementService/getRequirementsByCondition";
import getRequirementsByEvidence from "../../services/requirementService/getRequirementsByEvidence";
import getRequirementsByMandatoryDescription from "../../services/requirementService/getRequirementsByMandatoryDescription";
import getRequirementsByMandatoryKeywords from "../../services/requirementService/getRequirementsByMandatoryKeywords";
import getRequirementsByMandatorySentences from "../../services/requirementService/getRequirementsByMandatorySentences";
import getRequirementsByPeriodicity from "../../services/requirementService/getRequirementsByPeriodicity";
import updateRequirement from "../../services/requirementService/updateRequirement";
import deleteRequirement from "../../services/requirementService/deleteRequirement";
import delereRequirementBatch from "../../services/requirementService/deleteRequirementBatch";
import RequirementErrors from "../../errors/requirements/RequirementErrors";
/**
 * Custom hook for managing Requirements and performing CRUD operations.
 * @returns {Object} - Contains  Requirements list, loading state, error state, and functions for Requirements operations.
 */
export default function useRequirement() {
  const { jwt } = useContext(Context);
  const [requirements, setRequirements] = useState([]);
  const [stateRequirements, setStateRequirements] = useState({
    loading: true,
    error: null,
  });

  /**
  * Creates a Requirement by sending the request with the provided data.
  * @async
  * @function addRequirement
  * @param {Object} params - Parameters for creating a requirement.
  * @param {string} params.subjectId - ID of the subject linked to the requirement.
  * @param {string} params.aspectsIds - An array of aspect IDs linked to the requirement.
  * @param {string} params.requirementNumber - Unique number of the requirement.
  * @param {string} params.requirementName - Name/title of the requirement.
  * @param {string} params.mandatoryDescription - Mandatory description.
  * @param {string} [params.complementaryDescription] - Complementary description (optional).
  * @param {string} [params.mandatorySentences] - Mandatory sentences (optional).
  * @param {string} [params.complementarySentences] - Complementary sentences (optional).
  * @param {string} [params.mandatoryKeywords] - Mandatory keywords (optional).
  * @param {string} [params.complementaryKeywords] - Complementary keywords (optional).
  * @param {string} params.condition - Requirement condition ('Critical', 'Operational', 'Recommendation', 'Pending').
  * @param {string} params.evidence - Type of evidence required ('Procedure', 'Record', 'Specific', 'Document').
  * @param {string} params.periodicity - Periodicity ('Annual', '2 years', 'Per event', 'One-time').
  * @returns {Promise<Object>} - Result of the operation with `success` and `data` or `error`.
  */
  const addRequirement = useCallback(
    async ({
      subjectId,
      aspectsIds,
      requirementNumber,
      requirementName,
      mandatoryDescription,
      complementaryDescription = null,
      mandatorySentences = null,
      complementarySentences = null,
      mandatoryKeywords = null,
      complementaryKeywords = null,
      condition,
      evidence,
      specifyEvidence,
      periodicity
    }) => {
      try {
        const newRequirement = await createRequirement({
          subjectId,
          aspectsIds,
          requirementNumber,
          requirementName,
          mandatoryDescription,
          complementaryDescription,
          mandatorySentences,
          complementarySentences,
          mandatoryKeywords,
          complementaryKeywords,
          condition,
          evidence,
          specifyEvidence,
          periodicity,
          token: jwt,
        });
        setRequirements((prevRequirement) => [newRequirement, ...prevRequirement]);
        return { success: true };
      } catch (error) {
        const errorCode = error.response?.status;
        const serverMessage = error.response?.data?.message;
        const clientMessage = error.message;
        const handledError = RequirementErrors.handleError({
          code: errorCode,
          error: serverMessage,
          httpError: clientMessage,
        });
        return { success: false, error: handledError.message };
      }
    }, [jwt]
  );

  /**
   * Fetches the complete list of Requirements.
   * @async
   * @function fetchRequirements
   * @returns {Promise<void>} - Updates Requirements list and loading state.
   * @throws {Object} - Updates error state with the appropriate error message if fetching fails.
   */
  const fetchRequirements = useCallback(async () => {
    setStateRequirements({ loading: true, error: null });
    try {
      const requirements = await getRequirements({ token: jwt });
      setRequirements(requirements);
      setStateRequirements({ loading: false, error: null });
    } catch (error) {
      const errorCode = error.response?.status;
      const serverMessage = error.response?.data?.message;
      const clientMessage = error.message;
      const handledError = RequirementErrors.handleError({
        code: errorCode,
        error: serverMessage,
        httpError: clientMessage,
      });
      setStateRequirements({
        loading: false,
        error: handledError
      });
    }
  }, [jwt]);

  /**
   * Fetches a specific Requirement by its ID.
   * @async
   * @function fetchRequirementsById
   * @param {number} requirementId - The ID of the requirement to retrieve.
   * @returns {Promise<Object|null>} - The retrieved requirement data or null if an error occurs.
   */
  const fetchRequirementById = useCallback(
    async (requirementId) => {
      try {
        const requirements = await getRequirementById({
          id: requirementId,
          token: jwt,
        });
        return { success: true, data: requirements };
      } catch (error) {
        const errorCode = error.response?.status;
        const serverMessage = error.response?.data?.message;
        const clientMessage = error.message;
        const handledError = RequirementErrors.handleError({
          code: errorCode,
          error: serverMessage,
          httpError: clientMessage,
          items: [requirementId],
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
   * Fetches the list of Requiremeent by name. 
   * @async
   * @function fetchRequirementsByName
   * @param {string} requirementName - The name or part of the name of the requirement to retrieve.
   * @returns {Promise<void>} - Updates the requirement list and loading state.
   * @throws {Object} - Updates error state with the appropriate error message if fetching fails.
   */
  const fetchRequirementsByName = useCallback(
    async (requirementName) => {
      setStateRequirements({ loading: true, error: null });
      try {
        const requirements = await getRequirementsByName({ name: requirementName, token: jwt });
        setRequirements(requirements);
        setStateRequirements({ loading: false, error: null });
      } catch (error) {
        const errorCode = error.response?.status;
        const serverMessage = error.response?.data?.message;
        const clientMessage = error.message;
        const handledError = RequirementErrors.handleError({
          code: errorCode,
          error: serverMessage,
          httpError: clientMessage,
        });
        setStateRequirements({
          loading: false,
          error: handledError
        });
      }
    }, [jwt]);

  /**
  * Fetches the list of Requiremeent by number. 
  * @async
  * @function fetchRequirementsByNumber
  * @param {string} requirementNumber - The number of the requirement to retrieve.
  * @returns {Promise<void>} - Updates the requirement list and loading state.
  * @throws {Object} - Updates error state with the appropriate error message if fetching fails.
  */
  const fetchRequirementsByNumber = useCallback(
    async (requirementNumber) => {
      setStateRequirements({ loading: true, error: null });
      try {
        const requirements = await getRequirementsByNumber({
          number: requirementNumber,
          token: jwt
        });
        setRequirements(requirements);
        setStateRequirements({ loading: false, error: null });
      } catch (error) {
        const errorCode = error.response?.status;
        const serverMessage = error.response?.data?.message;
        const clientMessage = error.message;
        const handledError = RequirementErrors.handleError({
          code: errorCode,
          error: serverMessage,
          httpError: clientMessage,
        });
        setStateRequirements({
          loading: false,
          error: handledError,
        });
      }
    }, [jwt]);

  /**
   * Fetches the list of Requirements by Subject.
   * @async
   * @function fetchRequirementsBySubject
   * @param {number} subjectId - The id of the subject of the requirement to retrieve.
   * @returns {Promise<void>} - Updates the LegalBasis list and loading state.
   * @throws {Object} - Updates error state with the appropriate error message if fetching fails.
   */
  const fetchRequirementsBySubject = useCallback(
    async (subjectId) => {
      setStateRequirements({ loading: true, error: null });
      try {
        const requirements = await getRequirementsBySubject({
          subjectId,
          token: jwt
        });
        setRequirements(requirements);
        setStateRequirements({ loading: false, error: null });
      } catch (error) {
        const errorCode = error.response?.status;
        const serverMessage = error.response?.data?.message;
        const clientMessage = error.message;
        const handledError = RequirementErrors.handleError({
          code: errorCode,
          error: serverMessage,
          httpError: clientMessage,
        });
        setStateRequirements({
          loading: false,
          error: handledError
        });
      }
    },
    [jwt]
  );

  /**
   * Fetches the list of Requirements by Subject and Aspects.
   * @async
   * @function fetchRequirementsBySubjectAndAspects
   * @param {number} subjectId - The id of the subject of the Requirements to retrieve.
   * @param {Array<number>} aspectsIds - The ids of the aspects of the Requirements to retrieve
   * @returns {Promise<void>} - Updates the Requirements list and loading state.
   * @throws {Object} - Updates error state with the appropriate error message if fetching fails.
   */
  const fetchRequirementsBySubjectAndAspects = useCallback(
    async (subjectId, aspectsIds) => {
      setStateRequirements({ loading: true, error: null });
      try {
        const requirements = await getRequirementsBySubjectAndAspects({
          subjectId,
          aspectsIds,
          token: jwt
        });
        setRequirements(requirements);
        setStateRequirements({ loading: false, error: null });
      } catch (error) {
        const errorCode = error.response?.status;
        const serverMessage = error.response?.data?.message;
        const clientMessage = error.message;
        const handledError = RequirementErrors.handleError({
          code: errorCode,
          error: serverMessage,
          httpError: clientMessage,
        });
        setStateRequirements({
          loading: false,
          error: handledError,aspectsIds
        });
      }
    },
    [jwt]
  );

  /**
   * Fetches the list of Requirements by Complementary Description.
   * @async
   * @function fetchRequirementsByComplementaryDescription
   * @param {string} complementaryDescription - The complementary description of the requirement.
   * @returns {Promise<void>} - Updates the requirements list and loading state.
   */
  const fetchRequirementsByComplementaryDescription = useCallback(
    async (complementaryDescription) => {
      setStateRequirements({ loading: true, error: null });
      try {
        const requirements = await getRequirementsByComplementaryDescription({
          description: complementaryDescription,
          token: jwt
        });
        setRequirements(requirements);
        setStateRequirements({ loading: false, error: null });
      } catch (error) {
        const errorCode = error.response?.status;
        const serverMessage = error.response?.data?.message;
        const clientMessage = error.message;
        const handledError = RequirementErrors.handleError({
          code: errorCode,
          error: serverMessage,
          httpError: clientMessage,
        });
        setStateRequirements({
          loading: false,
          error: handledError,
        });
      }
    }, [jwt]);

  /**
   * Fetches the list of Requirements by Complementary Keywords.
   * @async
   * @function fetchRequirementsByComplementaryKeywords
   * @param {string} complementaryKeywords - The complementary keywords of the requirement.
   */
  const fetchRequirementsByComplementaryKeywords = useCallback(
    async (complementaryKeywords) => {
      setStateRequirements({ loading: true, error: null });
      try {
        const requirements = await getRequirementsByComplementaryKeywords({ keyword: complementaryKeywords, token: jwt });
        setRequirements(requirements);
        setStateRequirements({ loading: false, error: null });
      } catch (error) {
        const errorCode = error.response?.status;
        const serverMessage = error.response?.data?.message;
        const clientMessage = error.message;
        const handledError = RequirementErrors.handleError({
          code: errorCode,
          error: serverMessage,
          httpError: clientMessage,
        });
        setStateRequirements({
          loading: false,
          error: handledError,
        });
      }
    }, [jwt]);



  /**
   * Fetches the list of Requirements by Complementary Sentences.
   * @async
   * @function fetchRequirementsByComplementarySentences
   * @param {string} complementarySentences - The complementary sentences of the requirement.
   * @returns {Promise<void>} - Updates the requirements list and loading state.
   */
  const fetchRequirementsByComplementarySentences = useCallback(
    async (complementarySentences) => {
      setStateRequirements({ loading: true, error: null });
      try {
        const requirements = await getRequirementsByComplementarySentences({ sentence: complementarySentences, token: jwt });
        setRequirements(requirements);
        setStateRequirements({ loading: false, error: null });
      } catch (error) {
        const errorCode = error.response?.status;
        const serverMessage = error.response?.data?.message;
        const clientMessage = error.message;
        const handledError = RequirementErrors.handleError({
          code: errorCode,
          error: serverMessage,
          httpError: clientMessage,
        });
        setStateRequirements({
          loading: false,
          error: handledError,
        });
      }
    }, [jwt]);

  /**
   * Fetches the list of Requirements by Condition.
   * @async
   * @function fetchRequirementsByCondition
   * @param {string} condition - The condition of the requirement.
   */
  const fetchRequirementsByCondition = useCallback(
    async (condition) => {
      setStateRequirements({ loading: true, error: null });
      try {
        const requirements = await getRequirementsByCondition({ condition, token: jwt });
        setRequirements(requirements);
        setStateRequirements({ loading: false, error: null });
      } catch (error) {
        const errorCode = error.response?.status;
        const serverMessage = error.response?.data?.message;
        const clientMessage = error.message;
        const handledError = RequirementErrors.handleError({
          code: errorCode,
          error: serverMessage,
          httpError: clientMessage,
        });
        setStateRequirements({
          loading: false,
          error: handledError,
        });
      }
    }, [jwt]);

  /**
   * Fetches the list of Requirements by Evidence.
   * @async
   * @function fetchRequirementsByEvidence
   * @param {string} evidence - The type of evidence required for the requirement.
   */
  const fetchRequirementsByEvidence = useCallback(
    async (evidence) => {
      setStateRequirements({ loading: true, error: null });
      try {
        const requirements = await getRequirementsByEvidence({ evidence, token: jwt });
        setRequirements(requirements);
        setStateRequirements({ loading: false, error: null });
      } catch (error) {
        const errorCode = error.response?.status;
        const serverMessage = error.response?.data?.message;
        const clientMessage = error.message;
        const handledError = RequirementErrors.handleError({
          code: errorCode,
          error: serverMessage,
          httpError: clientMessage,
        });
        setStateRequirements({
          loading: false,
          error: handledError,
        });
      }
    }, [jwt]);


  /**
   * Fetches the list of Requirements by Mandatory Description.
   * @async
   * @function fetchRequirementsByMandatoryDescription
   * @param {string} mandatoryDescription - The mandatory description of the requirement.
   * @returns {Promise<void>} - Updates the requirements list and loading state.
   */
  const fetchRequirementsByMandatoryDescription = useCallback(
    async (mandatoryDescription) => {
      setStateRequirements({ loading: true, error: null });
      try {
        const requirements = await getRequirementsByMandatoryDescription({ description: mandatoryDescription, token: jwt });
        setRequirements(requirements);
        setStateRequirements({ loading: false, error: null });
      } catch (error) {
        const errorCode = error.response?.status;
        const serverMessage = error.response?.data?.message;
        const clientMessage = error.message;
        const handledError = RequirementErrors.handleError({
          code: errorCode,
          error: serverMessage,
          httpError: clientMessage,
        });
        setStateRequirements({
          loading: false,
          error: handledError
        });
      }
    }, [jwt]);

  /**
   * Fetches the list of Requirements by Mandatory Keywords.
   * @async
   * @function fetchRequirementsByMandatoryKeywords
   * @param {string} mandatoryKeywords - The mandatory keywords of the requirement.
   */
  const fetchRequirementsByMandatoryKeywords = useCallback(
    async (mandatoryKeywords) => {
      setStateRequirements({ loading: true, error: null });
      try {
        const requirements = await getRequirementsByMandatoryKeywords({ keyword: mandatoryKeywords, token: jwt });
        setRequirements(requirements);
        setStateRequirements({ loading: false, error: null });
      } catch (error) {
        const errorCode = error.response?.status;
        const serverMessage = error.response?.data?.message;
        const clientMessage = error.message;
        const handledError = RequirementErrors.handleError({
          code: errorCode,
          error: serverMessage,
          httpError: clientMessage,
        });
        setStateRequirements({
          loading: false,
          error: handledError
        });
      }
    }, [jwt]);

  /**
   * Fetches the list of Requirements by Mandatory Sentences.
   * @async
   * @function fetchRequirementsByMandatorySentences
   * @param {string} mandatorySentences - The mandatory sentences of the requirement.
   */
  const fetchRequirementsByMandatorySentences = useCallback(
    async (mandatorySentences) => {
      setStateRequirements({ loading: true, error: null });
      try {
        const requirements = await getRequirementsByMandatorySentences({ sentence: mandatorySentences, token: jwt });
        setRequirements(requirements);
        setStateRequirements({ loading: false, error: null });
      } catch (error) {
        const errorCode = error.response?.status;
        const serverMessage = error.response?.data?.message;
        const clientMessage = error.message;
        const handledError = RequirementErrors.handleError({
          code: errorCode,
          error: serverMessage,
          httpError: clientMessage,
        });
        setStateRequirements({
          loading: false,
          error: handledError
        });
      }
    }, [jwt]);

  /**
   * Fetches the list of Requirements by Periodicity.
   * @async
   * @function fetchRequirementsByPeriodicity
   * @param {string} periodicity - The periodicity of the requirement.
   */
  const fetchRequirementsByPeriodicity = useCallback(
    async (periodicity) => {
      setStateRequirements({ loading: true, error: null });
      try {
        const requirements = await getRequirementsByPeriodicity({ periodicity, token: jwt });
        setRequirements(requirements);
        setStateRequirements({ loading: false, error: null });
      } catch (error) {
        const errorCode = error.response?.status;
        const serverMessage = error.response?.data?.message;
        const clientMessage = error.message;
        const handledError = RequirementErrors.handleError({
          code: errorCode,
          error: serverMessage,
          httpError: clientMessage,
        });
        setStateRequirements({
          loading: false,
          error: handledError
        });
      }
    }, [jwt]);


  /**
  * Updates an existing Requirement by ID.
  * @async
  * @function modifyRequirement
  * @param {Object} params - The data to update an existing Requirement.
  * @param {string} params.id - The ID of the requirement to update.
  * @param {string} [params.subjectId] - The new subject ID (optional).
   * @param {Array<string>} [params.aspectsIds] - The new aspects IDs (optional).
  * @param {string} [params.requirementNumber] - The new requirement number (optional).
  * @param {string} [params.requirementName] - The new name/title of the requirement (optional).
  * @param {string} [params.mandatoryDescription] - The new mandatory description (optional).
  * @param {string} [params.complementaryDescription] - The new complementary description (optional).
  * @param {string} [params.mandatorySentences] - The new mandatory sentences (optional).
  * @param {string} [params.complementarySentences] - The new complementary sentences (optional).
  * @param {string} [params.mandatoryKeywords] - The new mandatory keywords (optional).
  * @param {string} [params.complementaryKeywords] - The new complementary keywords (optional).
  * @param {string} [params.condition] - The requirement condition ('Crítica', 'Operativa', 'Recomendación', 'Pendiente') (optional).
  * @param {string} [params.evidence] - The type of evidence required ('Trámite', 'Registro', 'Específico', 'Documento') (optional).
  * @param {string} [params.periodicity] - The periodicity of the requirement ('Anual', '2 años', 'Por evento', 'Única vez') (optional).
  * @returns {Promise<Object>} - Result of the operation with success status and updated Requirement or error message.
  * @throws {Object} - Returns an error message if the update fails.
  */
  const modifyRequirement = useCallback(
    async ({
      id,
      subjectId,
      aspectsIds,
      requirementNumber,
      requirementName,
      mandatoryDescription,
      complementaryDescription,
      mandatorySentences,
      complementarySentences,
      mandatoryKeywords,
      complementaryKeywords,
      condition,
      evidence,
      specifyEvidence,
      periodicity
    }) => {
      try {
        const requirement = await updateRequirement({
          id,
          subjectId,
          aspectsIds,
          requirementNumber,
          requirementName,
          mandatoryDescription,
          complementaryDescription,
          mandatorySentences,
          complementarySentences,
          mandatoryKeywords,
          complementaryKeywords,
          condition,
          evidence,
          specifyEvidence,
          periodicity,
          token: jwt,
        });
        setRequirements((prevRequirements) =>
          prevRequirements.map((prevRequirement) =>
            prevRequirement.id === requirement.id ? requirement : prevRequirement
          )
        );
        return { success: true };
      } catch (error) {
        const errorCode = error.response?.status;
        const serverMessage = error.response?.data?.message;
        const clientMessage = error.message;
        const handledError = RequirementErrors.handleError({
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
   * Deletes a single Requirement.
   * @async
   * @function removeRequirement
   * @param {number} id - The ID of the requirement to delete.
   */
  const removeRequirement = useCallback(
    async (id) => {
      try {
        await deleteRequirement({ id, token: jwt });
        setRequirements((prev) => prev.filter((req) => req.id !== id));
        return { success: true };
      } catch (error) {
        const errorCode = error.response?.status;
        const serverMessage = error.response?.data?.message;
        const clientMessage = error.message;
        const handledError = RequirementErrors.handleError({
          code: errorCode,
          error: serverMessage,
          httpError: clientMessage,
          items: [id],
        });
        return { success: false, error: handledError.message };
      }
    }, [jwt]);

  /**
   * Deletes multiple Requirements in batch.
   * @async
   * @function removeRequirementBatch
   * @param {Array<number>} requirementIds - The IDs of the requirements to delete.
   */
  const removeRequirementBatch = useCallback(
    async (requirementIds) => {
      try {
        await delereRequirementBatch({ requirementIds, token: jwt });
        setRequirements((prev) => prev.filter((req) => !requirementIds.includes(req.id)));
        return { success: true };
      } catch (error) {
        const errorCode = error.response?.status;
        const serverMessage = error.response?.data?.message;
        const clientMessage = error.message;
        const handledError = RequirementErrors.handleError({
          code: errorCode,
          error: serverMessage,
          httpError: clientMessage,
          items: requirementIds,
        });
        return { success: false, error: handledError.message };
      }
    }, [jwt]);

  useEffect(() => {
    fetchRequirements();
  }, [fetchRequirements]);

  return {
    requirements,
    loading: stateRequirements.loading,
    error: stateRequirements.error,
    fetchRequirements,
    fetchRequirementById,
    fetchRequirementsByName,
    fetchRequirementsByNumber,
    fetchRequirementsBySubject,
    fetchRequirementsBySubjectAndAspects,
    fetchRequirementsByMandatoryDescription,
    fetchRequirementsByEvidence,
    fetchRequirementsByComplementaryDescription,
    fetchRequirementsByComplementaryKeywords,
    fetchRequirementsByComplementarySentences,
    fetchRequirementsByCondition,
    fetchRequirementsByMandatoryKeywords,
    fetchRequirementsByMandatorySentences,
    fetchRequirementsByPeriodicity,
    addRequirement,
    modifyRequirement,
    removeRequirement,
    removeRequirementBatch,
  };

}