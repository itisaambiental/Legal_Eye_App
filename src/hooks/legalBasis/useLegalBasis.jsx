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


/**
 * Custom hook for managing LegalBasis and performing CRUD operations.
 * @returns {Object} - Contains LegalBasis list, loading state, error state, and functions for LegalBasis operations.
 */
export default function useLegalBasis() {
    const { jwt } = useContext(Context);
    const [legalBasis, setLegalBasis] = useState([]);
    const [stateLegalBasis, setStateLegalBasis] = useState({ loading: false, error: null });

    /**
     * Creates a new Legal Basis by sending the request with the provided data.
     * @async
     * @function addLegalBasis
     * @param {Object} params - The data to create a new legal basis.
     * @returns {Object} - Result of the creation process including success status and any errors.
     */
    const addLegalBasis = useCallback(async ({
        legalName,
        abbreviation,
        subjectId,
        aspectsIds,
        classification,
        jurisdiction,
        lastReform,
        extractArticles = false,
        document = null
    }) => {
        try {
            const { jobId, legalBasis } = await createLegalBasis({
                legalName,
                abbreviation,
                subjectId,
                aspectsIds,
                classification,
                jurisdiction,
                lastReform,
                extractArticles,
                document,
                token: jwt
            });
            setLegalBasis(prevLegalBasis => [legalBasis, ...prevLegalBasis]);
            return { success: true, jobId: jobId };
        } catch (error) {
            console.error('Error creating legal basis:', error);
            let errorMessage;

            if (error.response) {
                switch (error.response.status) {
                    case 400:
                        if (error.response.data.message === 'A document must be provided if extractArticles is true') {
                            errorMessage = 'Debe proporcionarse un documento si se desea extraer artículos.';
                        } else {
                            errorMessage = 'Error de validación: revisa los datos introducidos.';
                        }
                        break;
                    case 401:
                    case 403:
                        errorMessage = 'No autorizado para crear un nuevo fundamento legal. Verifique su sesión.';
                        break;
                    case 409:
                        errorMessage = 'Ya existe un fundamento legal con el mismo nombre. Por favor, utiliza otro.';
                        break;
                    case 404:
                        if (error.response.data.message.includes('Invalid Subject ID')) {
                            errorMessage = 'La materia especificada no fue encontrada. Verifique su existencia e intente de nuevo.';
                        } else if (error.response.data.message.includes('Invalid Aspects IDs')) {
                            errorMessage = `Los aspectos especificados no fueron encontrados. Verifique su existencia e intente de nuevo.`;
                        }
                        break;
                    case 500:
                        errorMessage = 'Error interno del servidor. Intente nuevamente más tarde.';
                        break;
                    default:
                        errorMessage = 'Error inesperado durante la creación del fundamento legal. Intente de nuevo.';
                }
            } else if (error.message === 'Network Error') {
                errorMessage = 'Error de conexión durante la creación del fundamento legal. Verifique su conexión a internet.';
            } else {
                errorMessage = 'Error inesperado durante la creación del fundamento legal. Intente de nuevo.';
            }

            return { success: false, error: errorMessage };
        }
    }, [jwt]);

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
            console.error
            let errorTitle;
            let errorMessage;
            if (error.response && (error.response.status === 403 || error.response.status === 401)) {
                errorTitle = 'Acceso no autorizado';
                errorMessage = 'No tiene permisos para ver los fundamentos legales. Verifique su sesión.';
            } else if (error.message === 'Network Error') {
                errorTitle = 'Error de conexión';
                errorMessage = 'Hubo un problema de red. Verifique su conexión a internet e intente nuevamente.';
            } else if (error.response && error.response.status === 500) {
                errorTitle = 'Error en el servidor';
                errorMessage = 'Hubo un error en el servidor. Espere un momento e intente nuevamente.';
            } else {
                errorTitle = 'Error inesperado';
                errorMessage = 'Ocurrió un error inesperado. Por favor, intente nuevamente más tarde.';
            }

            setStateLegalBasis({ loading: false, error: { title: errorTitle, message: errorMessage } });
        }
    }, [jwt]);


    /**
    * Fetches a specific legal basis by its ID.
    * @async
    * @function fetchLegalBasisById
    * @param {number} legalBasisId - The ID of the legal basis to retrieve.
    * @returns {Promise<Object|null>} - The retrieved legal basis data or null if an error occurs.
    */
    const fetchLegalBasisById = useCallback(async (legalBasisId) => {
        setStateLegalBasis({ loading: true, error: null });

        try {
            const legalBasis = await getLegalBasisById({ legalBasisId, token: jwt });
            setStateLegalBasis({ loading: false, error: null });
            return { success: true, data: legalBasis };
        } catch (error) {
            console.error('Error fetching legal basis by ID:', error);

            let errorTitle;
            let errorMessage;

            if (error.response && (error.response.status === 403 || error.response.status === 401)) {
                errorTitle = 'Acceso no autorizado';
                errorMessage = 'No tiene permisos para ver el fundamento legal. Verifique su sesión.';
            } else if (error.response && error.response.status === 404) {
                errorTitle = 'Fundamento legal no encontrado';
                errorMessage = 'El fundamento legal solicitado no existe o ha sido eliminado.';
            } else if (error.message === 'Network Error') {
                errorTitle = 'Error de conexión';
                errorMessage = 'Hubo un problema de red. Verifique su conexión a internet e intente nuevamente.';
            } else if (error.response && error.response.status === 500) {
                errorTitle = 'Error interno del servidor';
                errorMessage = 'Hubo un error en el servidor. Espere un momento e intente nuevamente.';
            } else {
                errorTitle = 'Error inesperado';
                errorMessage = 'Ocurrió un error inesperado. Por favor, intente nuevamente más tarde.';
            }

            setStateLegalBasis({ loading: false, error: { title: errorTitle, message: errorMessage } });
            return { success: false, error: { title: errorTitle, message: errorMessage } };
        }
    }, [jwt]);

    /**
    * Fetches the list of LegalBasis by name.
    * @async
    * @function fetchLegalBasisByName
    * @param {string} legalName - The name or part of the name of the legal basis to retrieve.
    * @returns {Promise<void>} - Updates the LegalBasis list and loading state.
    * @throws {Object} - Updates error state with the appropriate error message if fetching fails.
    */
    const fetchLegalBasisByName = useCallback(async (legalName) => {
        setStateLegalBasis({ loading: true, error: null });
        try {
            const legalBasis = await getLegalBasisByName({ legalName, token: jwt });
            setLegalBasis(legalBasis.reverse());
            setStateLegalBasis({ loading: false, error: null });
        } catch (error) {
            console.error
            let errorTitle;
            let errorMessage;
            if (error.response && (error.response.status === 403 || error.response.status === 401)) {
                errorTitle = 'Acceso no autorizado';
                errorMessage = 'No tiene permisos para ver los fundamentos legales. Verifique su sesión.';
            } else if (error.message === 'Network Error') {
                errorTitle = 'Error de conexión';
                errorMessage = 'Hubo un problema de red. Verifique su conexión a internet e intente nuevamente.';
            } else if (error.response && error.response.status === 500) {
                errorTitle = 'Error en el servidor';
                errorMessage = 'Hubo un error en el servidor. Espere un momento e intente nuevamente.';
            } else {
                errorTitle = 'Error inesperado';
                errorMessage = 'Ocurrió un error inesperado. Por favor, intente nuevamente más tarde.';
            }

            setStateLegalBasis({ loading: false, error: { title: errorTitle, message: errorMessage } });
        }
    }, [jwt]);

    /**
    * Fetches the list of LegalBasis by Abbreviation.
    * @async
    * @function fetchLegalBasisByAbbreviation
    * @param {string} abbreviation - The name or part of the abbreviation of the legal basis to retrieve.
    * @returns {Promise<void>} - Updates the LegalBasis list and loading state.
    * @throws {Object} - Updates error state with the appropriate error message if fetching fails.
    */
    const fetchLegalBasisByAbbreviation = useCallback(async (abbreviation) => {
        setStateLegalBasis({ loading: true, error: null });
        try {
            const legalBasis = await getLegalBasisByAbbreviation({ abbreviation, token: jwt });
            setLegalBasis(legalBasis.reverse());
            setStateLegalBasis({ loading: false, error: null });
        } catch (error) {
            console.error
            let errorTitle;
            let errorMessage;
            if (error.response && (error.response.status === 403 || error.response.status === 401)) {
                errorTitle = 'Acceso no autorizado';
                errorMessage = 'No tiene permisos para ver los fundamentos legales. Verifique su sesión.';
            } else if (error.message === 'Network Error') {
                errorTitle = 'Error de conexión';
                errorMessage = 'Hubo un problema de red. Verifique su conexión a internet e intente nuevamente.';
            } else if (error.response && error.response.status === 500) {
                errorTitle = 'Error en el servidor';
                errorMessage = 'Hubo un error en el servidor. Espere un momento e intente nuevamente.';
            } else {
                errorTitle = 'Error inesperado';
                errorMessage = 'Ocurrió un error inesperado. Por favor, intente nuevamente más tarde.';
            }

            setStateLegalBasis({ loading: false, error: { title: errorTitle, message: errorMessage } });
        }
    }, [jwt]);


    /**
* Fetches the list of LegalBasis by Classification.
* @async
* @function fetchLegalBasisByClassification
* @param {string} classification - The name of the classification of the legal basis to retrieve.
* @returns {Promise<void>} - Updates the LegalBasis list and loading state.
* @throws {Object} - Updates error state with the appropriate error message if fetching fails.
*/
    const fetchLegalBasisByClassification = useCallback(async (classification) => {
        setStateLegalBasis({ loading: true, error: null });
        try {
            const legalBasis = await getLegalBasisByClassification({ classification, token: jwt });
            setLegalBasis(legalBasis.reverse());
            setStateLegalBasis({ loading: false, error: null });
        } catch (error) {
            console.error
            let errorTitle;
            let errorMessage;
            if (error.response && (error.response.status === 403 || error.response.status === 401)) {
                errorTitle = 'Acceso no autorizado';
                errorMessage = 'No tiene permisos para ver los fundamentos legales. Verifique su sesión.';
            } else if (error.message === 'Network Error') {
                errorTitle = 'Error de conexión';
                errorMessage = 'Hubo un problema de red. Verifique su conexión a internet e intente nuevamente.';
            } else if (error.response && error.response.status === 500) {
                errorTitle = 'Error en el servidor';
                errorMessage = 'Hubo un error en el servidor. Espere un momento e intente nuevamente.';
            } else {
                errorTitle = 'Error inesperado';
                errorMessage = 'Ocurrió un error inesperado. Por favor, intente nuevamente más tarde.';
            }

            setStateLegalBasis({ loading: false, error: { title: errorTitle, message: errorMessage } });
        }
    }, [jwt]);

    /**
* Fetches the list of LegalBasis by Jurisdiction.
* @async
* @function fetchLegalBasisByJurisdiction
* @param {string} jurisdiction - The name of the jurisdiction of the legal basis to retrieve.
* @returns {Promise<void>} - Updates the LegalBasis list and loading state.
* @throws {Object} - Updates error state with the appropriate error message if fetching fails.
*/
    const fetchLegalBasisByJurisdiction = useCallback(async (jurisdiction) => {
        setStateLegalBasis({ loading: true, error: null });
        try {
            const legalBasis = await getLegalBasisByJurisdiction({ jurisdiction, token: jwt });
            setLegalBasis(legalBasis.reverse());
            setStateLegalBasis({ loading: false, error: null });
        } catch (error) {
            console.error
            let errorTitle;
            let errorMessage;
            if (error.response && (error.response.status === 403 || error.response.status === 401)) {
                errorTitle = 'Acceso no autorizado';
                errorMessage = 'No tiene permisos para ver los fundamentos legales. Verifique su sesión.';
            } else if (error.message === 'Network Error') {
                errorTitle = 'Error de conexión';
                errorMessage = 'Hubo un problema de red. Verifique su conexión a internet e intente nuevamente.';
            } else if (error.response && error.response.status === 500) {
                errorTitle = 'Error en el servidor';
                errorMessage = 'Hubo un error en el servidor. Espere un momento e intente nuevamente.';
            } else {
                errorTitle = 'Error inesperado';
                errorMessage = 'Ocurrió un error inesperado. Por favor, intente nuevamente más tarde.';
            }

            setStateLegalBasis({ loading: false, error: { title: errorTitle, message: errorMessage } });
        }
    }, [jwt]);

     /**
* Fetches the list of LegalBasis by State.
* @async
* @function fetchLegalBasisByState
* @param {string} state - The name of the state of the legal basis to retrieve.
* @returns {Promise<void>} - Updates the LegalBasis list and loading state.
* @throws {Object} - Updates error state with the appropriate error message if fetching fails.
*/
const fetchLegalBasisByState = useCallback(async (state) => {
    setStateLegalBasis({ loading: true, error: null });
    try {
        const legalBasis = await getLegalBasisByState({ state, token: jwt });
        setLegalBasis(legalBasis.reverse());
        setStateLegalBasis({ loading: false, error: null });
    } catch (error) {
        console.error
        let errorTitle;
        let errorMessage;
        if (error.response && (error.response.status === 403 || error.response.status === 401)) {
            errorTitle = 'Acceso no autorizado';
            errorMessage = 'No tiene permisos para ver los fundamentos legales. Verifique su sesión.';
        } else if (error.message === 'Network Error') {
            errorTitle = 'Error de conexión';
            errorMessage = 'Hubo un problema de red. Verifique su conexión a internet e intente nuevamente.';
        } else if (error.response && error.response.status === 500) {
            errorTitle = 'Error en el servidor';
            errorMessage = 'Hubo un error en el servidor. Espere un momento e intente nuevamente.';
        } else {
            errorTitle = 'Error inesperado';
            errorMessage = 'Ocurrió un error inesperado. Por favor, intente nuevamente más tarde.';
        }

        setStateLegalBasis({ loading: false, error: { title: errorTitle, message: errorMessage } });
    }
}, [jwt]);

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
        fetchLegalBasisByState
    };
}
