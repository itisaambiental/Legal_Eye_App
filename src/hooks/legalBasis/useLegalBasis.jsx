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
import getLegalBasisByLastReform from "../../services/legalBaseService/getLegalBasisByLastReform";
import getClassifications from "../../services/legalBaseService/getClassifications";
import getJurisdictions from "../../services/legalBaseService/getJurisdictions";
import updateLegalBasis from "../../services/legalBaseService/updateLegalBasis";
import deleteLegalBasis from "../../services/legalBaseService/deleteLegalBasis";
import deleteLegalBasisBatch from "../../services/legalBaseService/deleteLegalBasisBatch";
import LegalBasisErrors from "../../errors/LegalBasisErrors";
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
  const [classifications, setClassifications] = useState([]);
  const [stateClassifications, setStateClassifications] = useState({
    loading: true,
    error: null,
  });
  const [jurisdictions, setJurisdictions] = useState([]);
  const [stateJurisdictions, setStateJurisdictions] = useState({
    loading: true,
    error: null,
  });

  /**
   * Fetches the list of classifications.
   * @async
   * @function fetchClassifications
   * @returns {Promise<void>} - Updates the classifications list and loading state.
   * @throws {Object} - Updates error state with the appropriate error message if fetching fails.
   */
  const fetchClassifications = useCallback(async () => {
    setStateClassifications({ loading: true, error: null });
    try {
      const classificationsData = await getClassifications({ token: jwt });
      setClassifications(classificationsData);
      setStateClassifications({ loading: false, error: null });
    } catch (error) {
      const errorCode = error.response?.status;
      const serverMessage = error.response?.data?.message;
      const clientMessage = error.message;
      const handledError = LegalBasisErrors.handleError({
        code: errorCode,
        error: serverMessage,
        httpError: clientMessage,
      });
      setStateClassifications({
        loading: false,
        error: handledError,
      });
    }
  }, [jwt]);

  /**
   * Fetches the list of jurisdictions.
   * @async
   * @function fetchJurisdictions
   * @returns {Promise<void>} - Updates the jurisdictions list and loading state.
   * @throws {Object} - Updates error state with the appropriate error message if fetching fails.
   */
  const fetchJurisdictions = useCallback(async () => {
    setStateJurisdictions({ loading: true, error: null });
    try {
      const jurisdictionsData = await getJurisdictions({ token: jwt });
      setJurisdictions(jurisdictionsData);
      setStateJurisdictions({ loading: false, error: null });
    } catch (error) {
      const errorCode = error.response?.status;
      const serverMessage = error.response?.data?.message;
      const clientMessage = error.message;
      const handledError = LegalBasisErrors.handleError({
        code: errorCode,
        error: serverMessage,
        httpError: clientMessage,
      });
      setStateJurisdictions({
        loading: false,
        error: handledError,
      });
    }
  }, [jwt]);

  /**
   * Creates a new Legal Basis by sending the request with the provided data.
   * @async
   * @function addLegalBasis
   * @param {Object} params - The data to create a new legal basis.
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
          document,
          token: jwt,
        });
        setLegalBasis((prevLegalBasis) => [legalBasis, ...prevLegalBasis]);
        fetchClassifications();
        fetchJurisdictions();
        return { success: true, jobId };
      } catch (error) {
        console.error(error);
        let errorMessage;
        if (error.response) {
          switch (error.response.status) {
            case 400:
              if (
                error.response.data.message ===
                "A document must be provided if extractArticles is true"
              ) {
                errorMessage =
                  "Debe proporcionarse un documento si se desea extraer artículos.";
              } else {
                errorMessage =
                  "Error de validación: revisa los datos introducidos.";
              }
              break;
            case 401:
            case 403:
              errorMessage =
                "No autorizado para crear un nuevo fundamento legal. Verifique su sesión.";
              break;
            case 409:
              errorMessage =
                "Ya existe un fundamento legal con el mismo nombre. Por favor, utiliza otro.";
              break;
            case 404:
              if (error.response.data.message.includes("Invalid Subject ID")) {
                errorMessage =
                  "La materia especificada no fue encontrada. Verifique su existencia recargando la app e intente de nuevo.";
              } else if (
                error.response.data.message.includes("Invalid Aspects IDs")
              ) {
                errorMessage =
                  "Los aspectos especificados no fueron encontrados. Verifique su existencia seleccionando de nuevo la materia e intente de nuevo.";
              }
              break;
            case 500:
              errorMessage =
                "Error interno del servidor. Intente nuevamente más tarde.";
              break;
            default:
              errorMessage =
                "Error inesperado durante la creación del fundamento legal. Intente de nuevo.";
          }
        } else if (error.message === "Network Error") {
          errorMessage =
            "Error de conexión durante la creación del fundamento legal. Verifique su conexión a internet.";
        } else {
          errorMessage =
            "Error inesperado durante la creación del fundamento legal. Intente de nuevo.";
        }

        return { success: false, error: errorMessage };
      }
    },
    [jwt, fetchClassifications, fetchJurisdictions]
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
   * @param {number} legalBasisId - The ID of the legal basis to retrieve.
   * @returns {Promise<Object|null>} - The retrieved legal basis data or null if an error occurs.
   */
  const fetchLegalBasisById = useCallback(
    async (legalBasisId) => {
      setStateLegalBasis({ loading: true, error: null });
      try {
        const legalBasis = await getLegalBasisById({
          legalBasisId,
          token: jwt,
        });
        setStateLegalBasis({ loading: false, error: null });
        return { success: true, data: legalBasis };
      } catch (error) {
        const errorCode = error.response?.status;
        const serverMessage = error.response?.data?.message;
        const clientMessage = error.message;
        const handledError = LegalBasisErrors.handleError({
          code: errorCode,
          error: serverMessage,
          httpError: clientMessage,
          items: [legalBasisId],
        });
        setStateLegalBasis({
          loading: false,
          error: handledError,
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
        const clientMessage = error.message
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
        const clientMessage = error.message
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
        const clientMessage = error.message
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
   * @param {Object} params - The data to update an existing Legal Base
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
          removeDocument,
          document,
          token: jwt,
        });
        setLegalBasis((prevLegalBases) =>
          prevLegalBases.map((prevLegalBasis) =>
            prevLegalBasis.id === legalBasis.id ? legalBasis : prevLegalBasis
          )
        );
        fetchClassifications();
        fetchJurisdictions();
        return { success: true, jobId };
      } catch (error) {
        console.error(error);
        let errorMessage;
        if (error.response) {
          const { status, data } = error.response;
          switch (status) {
            case 400:
              if (
                data.message ===
                "A document must be provided if extractArticles is true"
              ) {
                errorMessage =
                  "Debe proporcionarse un documento si se desea extraer artículos.";
              } else if (
                data.message ===
                "Cannot provide a document if removeDocument is true"
              ) {
                errorMessage =
                  "No se puede proporcionar un documento si se solicita eliminarlo.";
              } else {
                errorMessage =
                  "Error de validación: revisa los datos introducidos.";
              }
              break;
            case 401:
            case 403:
              errorMessage =
                "No autorizado para editar el fundamento legal. Verifique su sesión.";
              break;
            case 404:
              if (data.message.includes("LegalBasis not found")) {
                errorMessage =
                  "Fundamento legal no encontrado. Verifique su existencia recargando la app e intente de nuevo.";
              } else if (data.message.includes("Invalid Subject ID")) {
                errorMessage =
                  "La materia especificada no fue encontrada. Verifique su existencia recargando la app e intente de nuevo.";
              } else if (data.message.includes("Invalid Aspects IDs")) {
                errorMessage =
                  "Los aspectos especificados no fueron encontrados. Verifique su existencia seleccionando de nuevo la materia e intente de nuevo.";
              }
              break;
            case 409:
              if (data.message === "LegalBasis already exists") {
                errorMessage =
                  "Ya existe un fundamento legal con el mismo nombre. Por favor, utiliza otro.";
              } else if (
                data.message ===
                "The document cannot be removed because there are pending jobs for this Legal Basis"
              ) {
                errorMessage =
                  "El documento no puede ser eliminado porque en este momento se estan extrayendo articulos.";
              } else if (
                data.message ===
                "Articles cannot be extracted because there is already a process that does so"
              ) {
                errorMessage =
                  "El fundamento legal no puede modificarse porque en este momento se estan extrayendo articulos de su documento asociado.";
              }
              break;

            case 500:
              errorMessage =
                "Error interno del servidor. Intente nuevamente más tarde.";
              break;

            default:
              errorMessage = "Error inesperado al actualizar la base legal.";
          }
        } else if (error.message === "Network Error") {
          errorMessage = "Error de conexión. Verifique su conexión a internet.";
        } else {
          errorMessage = "Error inesperado. Intente de nuevo.";
        }

        return { success: false, error: errorMessage };
      }
    },
    [jwt, fetchClassifications, fetchJurisdictions]
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
        fetchClassifications();
        fetchJurisdictions();
        return { success: true };
      } catch (error) {
        console.error(error);
        let errorMessage;
        if (error.response) {
          switch (error.response.status) {
            case 401:
            case 403:
              errorMessage =
                "No autorizado para eliminar este fundamento legal. Verifique su sesión.";
              break;
            case 409:
              errorMessage =
                "El fundamento legal no puede ser eliminado porque en este momento se estan extrayendo articulos de su documento asociado.";
              break;
            case 404:
              errorMessage =
                "Fundamento legal no encontrado. Verifique su existencia recargando la app e intente de nuevo.";
              break;
            case 500:
              errorMessage =
                "Error interno del servidor. Por favor, intente más tarde.";
              break;
            default:
              errorMessage =
                "Error inesperado durante la eliminación. Intente de nuevo.";
          }
        } else if (error.message === "Network Error") {
          errorMessage =
            "Error de conexión durante la eliminación. Verifique su conexión a internet.";
        } else {
          errorMessage =
            "Error inesperado durante la eliminación. Intente de nuevo.";
        }

        return { success: false, error: errorMessage };
      }
    },
    [jwt, fetchClassifications, fetchJurisdictions]
  );

  /**
   * Deletes multiple legal bases by their IDs.
   * @async
   * @function removeLegalBasisBatch
   * @param {Array<string>} legalBasisIds - The IDs of the legal bases to delete.
   * @returns {Promise<Object>} - Result of the operation with success status or error message.
   * @throws {Object} - Returns an error message if the deletion fails.
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
        fetchClassifications();
        fetchJurisdictions();
        return { success: true };
      } catch (error) {
        console.error(error);
        let errorMessage;
        if (error.response) {
          const { status, data } = error.response;
          switch (status) {
            case 400:
              errorMessage =
                "Faltan campos requeridos: legalBasisIds. Verifique los parámetros enviados.";
              break;
            case 401:
            case 403:
              errorMessage =
                "No autorizado para eliminar fundamentos legales. Verifique su sesión.";
              break;
            case 404:
              errorMessage =
                "Uno o más fundamentos legales no existen. Verifique su existencia recargando la app e intente de nuevo.";
              break;
            case 409: {
              const { errors, message } = data;
              const { LegalBases } = errors;
              if (LegalBases && LegalBases.length > 0) {
                const errorDetails = LegalBases.map(
                  (legalBase) => legalBase.name
                ).join(", ");
                const plural = LegalBases.length > 1;
                if (message === "Cannot delete Legal Bases with pending jobs") {
                  errorMessage = `${
                    plural ? "Los fundamentos legales" : "El fundamento legal"
                  } ${errorDetails} ${
                    plural ? "no pueden" : "no puede"
                  } ser eliminados porque en este momento se están extrayendo artículos de ${
                    plural
                      ? "sus documentos asociados"
                      : "su documento asociado"
                  }.`;
                } else {
                  errorMessage = `Uno o más fundamentos legales no pueden ser eliminados debido a problemas desconocidos. Verifique e intente nuevamente.`;
                }
              } else {
                errorMessage =
                  "Uno o más fundamentos legales no pueden ser eliminados porque se están extrayendo artículos de sus documentos asociados. Intente nuevamente más tarde.";
              }
              break;
            }

            case 500:
              errorMessage =
                "Error interno del servidor. Por favor, intente más tarde.";
              break;

            default:
              errorMessage =
                "Error inesperado durante la eliminación. Intente nuevamente.";
          }
        } else if (error.message === "Network Error") {
          errorMessage =
            "Error de conexión al eliminar fundamentos legales. Verifique su conexión a internet.";
        } else {
          errorMessage =
            "Error inesperado al eliminar fundamentos legales. Intente nuevamente.";
        }

        return { success: false, error: errorMessage };
      }
    },
    [jwt, fetchClassifications, fetchJurisdictions]
  );

  useEffect(() => {
    fetchLegalBasis();
    fetchClassifications();
    fetchJurisdictions();
  }, [fetchLegalBasis, fetchClassifications, fetchJurisdictions]);

  return {
    legalBasis,
    loading: stateLegalBasis.loading,
    error: stateLegalBasis.error,
    classifications,
    classificationsLoading: stateClassifications.loading,
    classificationsError: stateClassifications.error,
    jurisdictions,
    jurisdictionsLoading: stateJurisdictions.loading,
    jurisdictionsError: stateJurisdictions.error,
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
    modifyLegalBasis,
    removeLegalBasis,
    removeLegalBasisBatch,
  };
}
