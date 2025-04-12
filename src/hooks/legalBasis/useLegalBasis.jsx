import { useContext, useState, useEffect, useCallback } from "react";
import Context from "../../context/userContext";
import createLegalBasis from "../../services/legalBaseService/createLegalBasis";
import getLegalBasis from "../../services/legalBaseService/getLegalBasis";
import getLegalBasisByName from "../../services/legalBaseService/getLegalBasisByName";
import getLegalBasisById from "../../services/legalBaseService/getLegalBasisById";
import getLegalBasisByAbbreviation from "../../services/legalBaseService/getLegalBasisByAbbreviation";
import getLegalBasisByClassification from "../../services/legalBaseService/getLegalBasisByClassification";
import getLegalBasisByJurisdiction from "../../services/legalBaseService/getLegalBasisByJurisdiction";
import getLegalBasisByState from "../../services/legalBaseService/getLegalBasisByState";
import getLegalBasisByStateAndMunicipalities from "../../services/legalBaseService/getLegalBasisByStateAndMunicipalities";
import getLegalBasisBySubject from "../../services/legalBaseService/getLegalBasisBySubject";
import getLegalBasisBySubjectAndAspects from "../../services/legalBaseService/getLegalBasisBySubjectAndAspects";
import getLegalBasisBySubjectAndFilters from "../../services/legalBaseService/getLegalBasisBySubjectAndFilters";
import getLegalBasisByLastReform from "../../services/legalBaseService/getLegalBasisByLastReform";
import updateLegalBasis from "../../services/legalBaseService/updateLegalBasis";
import deleteLegalBasis from "../../services/legalBaseService/deleteLegalBasis";
import deleteLegalBasisBatch from "../../services/legalBaseService/deleteLegalBasisBatch";
import LegalBasisErrors from "../../errors/legalBasis/LegalBasisErrors";

/**
 * Custom hook for managing LegalBasis and performing CRUD operations.
 * @returns {Object} - Contains LegalBasis list, loading state, error state, and functions for LegalBasis operations.
 */
export default function useLegalBasis() {
  const { jwt } = useContext(Context);
  const [legalBasis, setLegalBasis] = useState([]);
  const [stateLegalBasis, setStateLegalBasis] = useState({
    loading: true,
    error: null,
  });

  /**
   * Creates a new Legal Basis by sending the request with the provided data.
   * @async
   * @function addLegalBasis
   * @param {Object} params - The data to create a new legal basis.
   * @param {string} params.legalName - The name of the legal basis.
   * @param {string} params.abbreviation - The abbreviation of the legal basis.
   * @param {string} params.subjectId - The ID of the subject linked to the legal basis.
   * @param {Array<string>} params.aspectsIds - An array of aspect IDs linked to the legal basis.
   * @param {string} params.classification - The classification of the legal basis.
   * @param {string} params.jurisdiction - The jurisdiction of the legal basis (e.g., "Federal", "State").
   * @param {string} [params.state] - The state associated with the legal basis (optional).
   * @param {string} [params.municipality] - The municipality associated with the legal basis (optional).
   * @param {string} [params.lastReform] - The last reform date of the legal basis.
   * @param {boolean} [params.extractArticles=false] - Whether to extract articles from the document.
   * @param {string} [params.intelligenceLevel] - Intelligence level ("High" or "Low") for article extraction.
   * @param {File|null} [params.document=null] - A file representing the document (optional).
   * @returns {Object} - Result of the creation process including success status and any errors.
   */
  const addLegalBasis = useCallback(
    async ({
      legalName,
      abbreviation,
      subjectId,
      aspectsIds,
      classification,
      jurisdiction,
      state = null,
      municipality = null,
      lastReform,
      extractArticles = false,
      intelligenceLevel,
      document = null,
    }) => {
      try {
        const { jobId, legalBasis } = await createLegalBasis({
          legalName,
          abbreviation,
          subjectId,
          aspectsIds,
          classification,
          jurisdiction,
          state,
          municipality,
          lastReform,
          extractArticles,
          intelligenceLevel,
          document,
          token: jwt,
        });
        setLegalBasis((prevLegalBasis) => [legalBasis, ...prevLegalBasis]);
        return { success: true, jobId, legalBasis };
      } catch (error) {
        const errorCode = error.response?.status;
        const serverMessage = error.response?.data?.message;
        const clientMessage = error.message;
        const handledError = LegalBasisErrors.handleError({
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
   * Fetches the complete list of LegalBasis.
   * @async
   * @function fetchLegalBasis
   * @returns {Promise<void>} - Updates the LegalBasis list and loading state.
   * @throws {Object} - Updates error state with the appropriate error message if fetching fails.
   */
  const fetchLegalBasis = useCallback(async () => {
    setStateLegalBasis({ loading: true, error: null });
    try {
      const legalBasis = await getLegalBasis({ token: jwt });
      setLegalBasis(legalBasis.reverse());
      setStateLegalBasis({ loading: false, error: null });
    } catch (error) {
      const errorCode = error.response?.status;
      const serverMessage = error.response?.data?.message;
      const clientMessage = error.message;
      const handledError = LegalBasisErrors.handleError({
        code: errorCode,
        error: serverMessage,
        httpError: clientMessage,
      });
      setStateLegalBasis({
        loading: false,
        error: handledError,
      });
    }
  }, [jwt]);

  /**
   * Fetches a specific legal basis by its ID.
   * @async
   * @function fetchLegalBasisById
   * @param {number} legalBaseId - The ID of the legal basis to retrieve.
   * @returns {Promise<Object|null>} - The retrieved legal basis data or null if an error occurs.
   */
  const fetchLegalBasisById = useCallback(
    async (legalBaseId) => {
      try {
        const legalBasis = await getLegalBasisById({
          legalBaseId,
          token: jwt,
        });
        return { success: true, data: legalBasis };
      } catch (error) {
        const errorCode = error.response?.status;
        const serverMessage = error.response?.data?.message;
        const clientMessage = error.message;
        const handledError = LegalBasisErrors.handleError({
          code: errorCode,
          error: serverMessage,
          httpError: clientMessage,
          items: [legalBaseId],
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
   * Fetches the list of LegalBasis by name.getJurisdictions
   * @async
   * @function fetchLegalBasisByName
   * @param {string} legalName - The name or part of the name of the legal basis to retrieve.
   * @returns {Promise<void>} - Updates the LegalBasis list and loading state.
   * @throws {Object} - Updates error state with the appropriate error message if fetching fails.
   */
  const fetchLegalBasisByName = useCallback(
    async (legalName) => {
      setStateLegalBasis({ loading: true, error: null });
      try {
        const legalBasis = await getLegalBasisByName({ legalName, token: jwt });
        setLegalBasis(legalBasis.reverse());
        setStateLegalBasis({ loading: false, error: null });
      } catch (error) {
        const errorCode = error.response?.status;
        const serverMessage = error.response?.data?.message;
        const clientMessage = error.message;
        const handledError = LegalBasisErrors.handleError({
          code: errorCode,
          error: serverMessage,
          httpError: clientMessage,
        });
        setStateLegalBasis({
          loading: false,
          error: handledError,
        });
      }
    },
    [jwt]
  );

  /**
   * Fetches the list of LegalBasis by Abbreviation.
   * @async
   * @function fetchLegalBasisByAbbreviation
   * @param {string} abbreviation - The name or part of the abbreviation of the legal basis to retrieve.
   * @returns {Promise<void>} - Updates the LegalBasis list and loading state.
   * @throws {Object} - Updates error state with the appropriate error message if fetching fails.
   */
  const fetchLegalBasisByAbbreviation = useCallback(
    async (abbreviation) => {
      setStateLegalBasis({ loading: true, error: null });
      try {
        const legalBasis = await getLegalBasisByAbbreviation({
          abbreviation,
          token: jwt,
        });
        setLegalBasis(legalBasis.reverse());
        setStateLegalBasis({ loading: false, error: null });
      } catch (error) {
        const errorCode = error.response?.status;
        const serverMessage = error.response?.data?.message;
        const clientMessage = error.message;
        const handledError = LegalBasisErrors.handleError({
          code: errorCode,
          error: serverMessage,
          httpError: clientMessage,
        });
        setStateLegalBasis({
          loading: false,
          error: handledError,
        });
      }
    },
    [jwt]
  );

  /**
   * Fetches the list of LegalBasis by Classification.
   * @async
   * @function fetchLegalBasisByClassification
   * @param {string} classification - The name of the classification of the legal basis to retrieve.
   * @returns {Promise<void>} - Updates the LegalBasis list and loading state.
   * @throws {Object} - Updates error state with the appropriate error message if fetching fails.
   */
  const fetchLegalBasisByClassification = useCallback(
    async (classification) => {
      setStateLegalBasis({ loading: true, error: null });
      try {
        const legalBasis = await getLegalBasisByClassification({
          classification,
          token: jwt,
        });
        setLegalBasis(legalBasis.reverse());
        setStateLegalBasis({ loading: false, error: null });
      } catch (error) {
        const errorCode = error.response?.status;
        const serverMessage = error.response?.data?.message;
        const clientMessage = error.message;
        const handledError = LegalBasisErrors.handleError({
          code: errorCode,
          error: serverMessage,
          httpError: clientMessage,
        });
        setStateLegalBasis({
          loading: false,
          error: handledError,
        });
      }
    },
    [jwt]
  );

  /**
   * Fetches the list of LegalBasis by Jurisdiction.
   * @async
   * @function fetchLegalBasisByJurisdiction
   * @param {string} jurisdiction - The name of the jurisdiction of the legal basis to retrieve.
   * @returns {Promise<void>} - Updates the LegalBasis list and loading state.
   * @throws {Object} - Updates error state with the appropriate error message if fetching fails.
   */
  const fetchLegalBasisByJurisdiction = useCallback(
    async (jurisdiction) => {
      setStateLegalBasis({ loading: true, error: null });
      try {
        const legalBasis = await getLegalBasisByJurisdiction({
          jurisdiction,
          token: jwt,
        });
        setLegalBasis(legalBasis.reverse());
        setStateLegalBasis({ loading: false, error: null });
      } catch (error) {
        const errorCode = error.response?.status;
        const serverMessage = error.response?.data?.message;
        const clientMessage = error.message;
        const handledError = LegalBasisErrors.handleError({
          code: errorCode,
          error: serverMessage,
          httpError: clientMessage,
        });
        setStateLegalBasis({
          loading: false,
          error: handledError,
        });
      }
    },
    [jwt]
  );

  /**
   * Fetches the list of LegalBasis by State.
   * @async
   * @function fetchLegalBasisByState
   * @param {string} state - The name of the state of the legal basis to retrieve.
   * @returns {Promise<void>} - Updates the LegalBasis list and loading state.
   * @throws {Object} - Updates error state with the appropriate error message if fetching fails.
   */
  const fetchLegalBasisByState = useCallback(
    async (state) => {
      setStateLegalBasis({ loading: true, error: null });
      try {
        const legalBasis = await getLegalBasisByState({ state, token: jwt });
        setLegalBasis(legalBasis.reverse());
        setStateLegalBasis({ loading: false, error: null });
      } catch (error) {
        const errorCode = error.response?.status;
        const serverMessage = error.response?.data?.message;
        const clientMessage = error.message;
        const handledError = LegalBasisErrors.handleError({
          code: errorCode,
          error: serverMessage,
          httpError: clientMessage,
        });
        setStateLegalBasis({
          loading: false,
          error: handledError,
        });
      }
    },
    [jwt]
  );

  /**
   * Fetches the list of Legal Basis records filtered by a specific state and a list of municipalities.
   * @async
   * @function fetchLegalBasisByStateAndMunicipalities
   * @param {string} state - The name of the state of the legal basis to retrieve.
   * @param {Array<string>} municipalities - An array of municipalities to retrieve legal basis for.
   * @returns {Promise<void>} - Updates the LegalBasis list and loading state.
   * @throws {Object} - Updates error state with the appropriate error message if fetching fails.
   */ const fetchLegalBasisByStateAndMunicipalities = useCallback(
    async (state, municipalities) => {
      setStateLegalBasis({ loading: true, error: null });
      try {
        const legalBasisData = await getLegalBasisByStateAndMunicipalities({
          state,
          municipalities,
          token: jwt,
        });
        setLegalBasis(legalBasisData.reverse());
        setStateLegalBasis({ loading: false, error: null });
      } catch (error) {
        const errorCode = error.response?.status;
        const serverMessage = error.response?.data?.message;
        const clientMessage = error.message;
        const handledError = LegalBasisErrors.handleError({
          code: errorCode,
          error: serverMessage,
          httpError: clientMessage,
        });
        setStateLegalBasis({
          loading: false,
          error: handledError,
        });
      }
    },
    [jwt]
  );

  /**
   * Fetches the list of LegalBasis by Subject.
   * @async
   * @function fetchLegalBasisBySubject
   * @param {number} subjectId - The id of the subject of the legal basis to retrieve.
   * @returns {Promise<void>} - Updates the LegalBasis list and loading state.
   * @throws {Object} - Updates error state with the appropriate error message if fetching fails.
   */
  const fetchLegalBasisBySubject = useCallback(
    async (subjectId) => {
      setStateLegalBasis({ loading: true, error: null });
      try {
        const legalBasis = await getLegalBasisBySubject({
          subjectId,
          token: jwt,
        });
        setLegalBasis(legalBasis.reverse());
        setStateLegalBasis({ loading: false, error: null });
      } catch (error) {
        const errorCode = error.response?.status;
        const serverMessage = error.response?.data?.message;
        const clientMessage = error.message;
        const handledError = LegalBasisErrors.handleError({
          code: errorCode,
          error: serverMessage,
          httpError: clientMessage,
        });
        setStateLegalBasis({
          loading: false,
          error: handledError,
        });
      }
    },
    [jwt]
  );

  /**
   * Fetches the list of LegalBasis by Subject and Aspects.
   * @async
   * @function fetchLegalBasisBySubjectAndAspects
   * @param {number} subjectId - The id of the subject of the legal basis to retrieve.
   * @param {Array<number>} aspectsIds - The ids of the aspects of the legal basis to retrieve
   * @returns {Promise<void>} - Updates the LegalBasis list and loading state.
   * @throws {Object} - Updates error state with the appropriate error message if fetching fails.
   */
  const fetchLegalBasisBySubjectAndAspects = useCallback(
    async (subjectId, aspectsIds) => {
      setStateLegalBasis({ loading: true, error: null });
      try {
        const legalBasis = await getLegalBasisBySubjectAndAspects({
          subjectId,
          aspectsIds,
          token: jwt,
        });
        setLegalBasis(legalBasis.reverse());
        setStateLegalBasis({ loading: false, error: null });
      } catch (error) {
        const errorCode = error.response?.status;
        const serverMessage = error.response?.data?.message;
        const clientMessage = error.message;
        const handledError = LegalBasisErrors.handleError({
          code: errorCode,
          error: serverMessage,
          httpError: clientMessage,
        });
        setStateLegalBasis({
          loading: false,
          error: handledError,
        });
      }
    },
    [jwt]
  );

  /**
 * Fetches legal basis records filtered by subject, aspects, jurisdiction, state, and municipalities.
 * @async
 * @function fetchLegalBasisBySubjectAndFilters
 * @param {Object} params - Filtering options.
 * @param {number} params.subjectId - Subject ID (required).
 * @param {Array<number>} [params.aspectIds] - Optional aspect IDs.
 * @param {string} [params.jurisdiction] - Optional jurisdiction: 'Federal', 'Estatal', 'Local'.
 * @param {string} [params.state] - Optional state name.
 * @param {Array<string>} [params.municipalities] - Optional municipalities.
 * @returns {Promise<void>} Updates the legalBasis state and handles loading/error.
 */
const fetchLegalBasisBySubjectAndFilters = useCallback(
  async ({ subjectId, aspectIds, jurisdiction, state, municipalities }) => {
    setStateLegalBasis({ loading: true, error: null });
    try {
      const legalBasis = await getLegalBasisBySubjectAndFilters({
        subjectId,
        aspectIds,
        jurisdiction,
        state,
        municipalities,
        token: jwt,
      });
      setLegalBasis(legalBasis.reverse());
      setStateLegalBasis({ loading: false, error: null });
    } catch (error) {
      const errorCode = error.response?.status;
      const serverMessage = error.response?.data?.message;
      const clientMessage = error.message;
      const handledError = LegalBasisErrors.handleError({
        code: errorCode,
        error: serverMessage,
        httpError: clientMessage,
      });
      setStateLegalBasis({ loading: false, error: handledError });
    }
  },
  [jwt]
);

  /**
   * Fetches legal basis records filtered by a date range and updates the state.
   *
   * @async
   * @function fetchLegalBasisByLastReform
   * @param {string} from - Start date.
   * @param {string} to - End date.
   * @returns {Promise<void>} Updates the legal basis list and loading/error state.
   * @throws {Object} Updates error state with the appropriate error message if fetching fails.
   */
  const fetchLegalBasisByLastReform = useCallback(
    async (from, to) => {
      setStateLegalBasis({ loading: true, error: null });
      try {
        const legalBasisData = await getLegalBasisByLastReform({
          from,
          to,
          token: jwt,
        });
        setLegalBasis(legalBasisData.reverse());
        setStateLegalBasis({ loading: false, error: null });
      } catch (error) {
        const errorCode = error.response?.status;
        const serverMessage = error.response?.data?.message;
        const clientMessage = error.message;
        const handledError = LegalBasisErrors.handleError({
          code: errorCode,
          error: serverMessage,
          httpError: clientMessage,
        });
        setStateLegalBasis({
          loading: false,
          error: handledError,
        });
      }
    },
    [jwt]
  );

 /**
 * Updates an existing Legal Basis by ID.
 * @async
 * @function modifyLegalBasis
 * @param {Object} params - The data to update an existing Legal Base.
 * @param {string} params.id - The ID of the legal basis to update.
 * @param {string} [params.legalName] - The new legal name (optional).
 * @param {string} [params.abbreviation] - The new abbreviation (optional).
 * @param {string} [params.subjectId] - The new subject ID (optional).
 * @param {Array<string>} [params.aspectsIds] - The new aspects IDs (optional).
 * @param {string} [params.classification] - The new classification (optional).
 * @param {string} [params.jurisdiction] - The new jurisdiction (optional).
 * @param {string} [params.state] - The new state (optional).
 * @param {string} [params.municipality] - The new municipality (optional).
 * @param {string} [params.lastReform] - The last reform date (optional).
 * @param {boolean} [params.extractArticles] - Whether to extract articles from the document.
 * @param {string} [params.intelligenceLevel] - Intelligence level ("High" or "Low") for article extraction.
 * @param {boolean} [params.removeDocument] - Flag to indicate whether to remove the document (optional).
 * @param {File|null} [params.document] - The new document file (optional).
 * @returns {Promise<Object>} - Result of the operation with success status and updated Legal Base or error message.
 * @throws {Object} - Returns an error message if the update fails.
 */
const modifyLegalBasis = useCallback(
  async ({
    id,
    legalName,
    abbreviation,
    subjectId,
    aspectsIds,
    classification,
    jurisdiction,
    state,
    municipality,
    lastReform,
    extractArticles,
    intelligenceLevel,
    removeDocument,
    document,
  }) => {
    try {
      const { jobId, legalBasis } = await updateLegalBasis({
        id,
        legalName,
        abbreviation,
        subjectId,
        aspectsIds,
        classification,
        jurisdiction,
        state,
        municipality,
        lastReform,
        extractArticles,
        intelligenceLevel,
        removeDocument,
        document,
        token: jwt,
      });
      setLegalBasis((prevLegalBases) =>
        prevLegalBases.map((prevLegalBasis) =>
          prevLegalBasis.id === legalBasis.id ? legalBasis : prevLegalBasis
        )
      );
      return { success: true, jobId, legalBasis };
    } catch (error) {
      const errorCode = error.response?.status;
      const serverMessage = error.response?.data?.message;
      const clientMessage = error.message;
      const handledError = LegalBasisErrors.handleError({
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
   * Deletes an existing legal basis by ID.
   * @async
   * @function removeLegalBasis
   * @param {string} id - The ID of the legal basis to delete.
   * @returns {Promise<Object>} - Result of the operation with success status or error message.
   * @throws {Object} - Returns an error message if the deletion fails.
   */
  const removeLegalBasis = useCallback(
    async (id) => {
      try {
        await deleteLegalBasis({ id, token: jwt });
        setLegalBasis((prevLegalBasis) =>
          prevLegalBasis.filter((legalBasis) => legalBasis.id !== id)
        );
        return { success: true };
      } catch (error) {
        const errorCode = error.response?.status;
        const serverMessage = error.response?.data?.message;
        const clientMessage = error.message;
        const handledError = LegalBasisErrors.handleError({
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
   * Deletes multiple legal bases by their IDs.
   * @async
   * @function removeLegalBasisBatch
   * @param {Array<string>} legalBasisIds - The IDs of the legal bases to delete.
   * @returns {Promise<Object>} - Result of the operation with success status or error message.
   */
  const removeLegalBasisBatch = useCallback(
    async (legalBasisIds) => {
      try {
        await deleteLegalBasisBatch({ legalBasisIds, token: jwt });
        setLegalBasis((prevLegalBases) =>
          prevLegalBases.filter(
            (legalBasis) => !legalBasisIds.includes(legalBasis.id)
          )
        );
        return { success: true };
      } catch (error) {
        const errorCode = error.response?.status;
        const serverMessage = error.response?.data?.message;
        const clientMessage = error.message;
        const legalBases =
          error.response?.data?.errors?.legalBases?.map(
            (legalBase) => legalBase.name
          ) || legalBasisIds;
        const handledError = LegalBasisErrors.handleError({
          code: errorCode,
          error: serverMessage,
          httpError: clientMessage,
          items: legalBases,
        });

        return { success: false, error: handledError.message };
      }
    },
    [jwt]
  );

  useEffect(() => {
    fetchLegalBasis();
  }, [fetchLegalBasis]);

  return {
    legalBasis,
    loading: stateLegalBasis.loading,
    error: stateLegalBasis.error,
    addLegalBasis,
    fetchLegalBasis,
    fetchLegalBasisById,
    fetchLegalBasisByName,
    fetchLegalBasisByAbbreviation,
    fetchLegalBasisByClassification,
    fetchLegalBasisByJurisdiction,
    fetchLegalBasisByState,
    fetchLegalBasisByStateAndMunicipalities,
    fetchLegalBasisByLastReform,
    fetchLegalBasisBySubject,
    fetchLegalBasisBySubjectAndAspects,
    fetchLegalBasisBySubjectAndFilters,
    modifyLegalBasis,
    removeLegalBasis,
    removeLegalBasisBatch,
  };
}
