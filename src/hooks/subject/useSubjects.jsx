import { useContext, useState, useEffect, useCallback } from 'react';
import Context from '../../context/userContext.jsx';
import getSubjects from '../../services/subjectService/getSubjects.js';
import getSubjectById from '../../services/subjectService/getSubjectById.js';
import createNewSubject from '../../services/subjectService/createSubject.js';
import updateSubject from '../../services/subjectService/updateSubject.js';
import deleteSubject from '../../services/subjectService/deleteSubject.js';
import deleteSubjects from '../../services/subjectService/deleteSubjects.js';

/**
 * Custom hook for managing subjects and performing CRUD operations.
 * @returns {Object} - Contains subject list, loading state, error state, and functions for subject operations.
 */
export default function useSubjects() {
    const { jwt } = useContext(Context);
    const [subjects, setSubjects] = useState([]);
    const [stateSubjects, setStateSubjects] = useState({ loading: false, error: null });

    /**
     * Fetches the complete list of subjects.
     * @async
     * @function fetchSubjects
     * @returns {Promise<void>} - Updates the subjects list and loading state.
     * @throws {Object} - Updates error state with the appropriate error message if fetching fails.
     */
    const fetchSubjects = useCallback(async () => {
        setStateSubjects({ loading: true, error: null });

        try {
            const subjects = await getSubjects(jwt);
            setSubjects(subjects.reverse());
            setStateSubjects({ loading: false, error: null });
        } catch (error) {
            console.error(error);

            let errorTitle;
            let errorMessage;

            if (error.response && (error.response.status === 403 || error.response.status === 401)) {
                errorTitle = 'Acceso no autorizado';
                errorMessage = 'No tiene permisos para ver las materias. Verifique su sesión.';
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

            setStateSubjects({ loading: false, error: { title: errorTitle, message: errorMessage } });
        }
    }, [jwt]);
    /**
   * Fetches a specific subject by its ID.
   * @async
   * @function fetchSubjectById
   * @param {number} subjectId - The ID of the subject to retrieve.
   * @returns {Promise<Object|null>} - The retrieved subject data or null if an error occurs.
   */
    const fetchSubjectById = useCallback(async (subjectId) => {
        setStateSubjects({ loading: true, error: null });

        try {
            const subject = await getSubjectById({ subjectId, token: jwt });
            setStateSubjects({ loading: false, error: null });
            return { success: true, data: subject };
        } catch (error) {
            console.error(error);

            let errorTitle;
            let errorMessage;

            if (error.response && (error.response.status === 403 || error.response.status === 401)) {
                errorTitle = 'Acceso no autorizado';
                errorMessage = 'No tiene permisos para ver la materia. Verifique su sesión.';
            } else if (error.response && error.response.status === 404) {
                errorTitle = 'Materia no encontrada';
                errorMessage = 'La materia solicitada no existe o ha sido eliminada.';
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

            setStateSubjects({ loading: false, error: { title: errorTitle, message: errorMessage } });
            return { success: false, error: { title: errorTitle, message: errorMessage } };
        }
    }, [jwt]);

    /**
   * Adds a new subject to the list.
   * @async
   * @function addSubject
   * @param {string} subjectName - The name of the subject to add.
   * @returns {Promise<Object>} - Result of the operation with success status and subject or error message.
   * @throws {Object} - Returns an error message if the addition fails.
   */
    const addSubject = useCallback(async (subjectName) => {
        try {
            const newSubject = await createNewSubject({ subjectName, token: jwt });
            setSubjects(prevSubjects => [newSubject, ...prevSubjects]);
            return { success: true };
        } catch (error) {
            console.error(error);
            let errorMessage;
            if (error.response) {
                switch (error.response.status) {
                    case 400:
                        errorMessage = 'Error de validación: revisa los datos introducidos.';
                        break;
                    case 401:
                    case 403:
                        errorMessage = 'No autorizado para crear una nueva materia. Verifique su sesión.';
                        break;
                    case 409:
                        errorMessage = 'La materia ya existe. Por favor cambie el nombre e intente de nuevo.';
                        break;
                    case 500:
                        errorMessage = 'Error interno del servidor. Por favor, intente más tarde.';
                        break;
                    default:
                        errorMessage = 'Error inesperado durante la creación de la materia. Intente de nuevo.';
                }
            } else if (error.message === 'Network Error') {
                errorMessage = 'Error de conexión durante la creación. Verifique su conexión a internet.';
            } else {
                errorMessage = 'Error inesperado durante la creación de la materia. Intente de nuevo.';
            }

            return { success: false, error: errorMessage };
        }
    }, [jwt]);
    /**
     * Updates an existing subject by ID.
     * @async
     * @function modifySubject
     * @param {string} id - The ID of the subject to update.
     * @param {string} subjectName - The new name of the subject.
     * @returns {Promise<Object>} - Result of the operation with success status and updated subject or error message.
     * @throws {Object} - Returns an error message if the update fails.
     */
    const modifySubject = useCallback(async (id, subjectName) => {
        try {
            const updatedSubject = await updateSubject({ id, subjectName, token: jwt });
            const formattedSubject = {
                id: updatedSubject.id,
                subject_name: updatedSubject.subjectName
            };
            setSubjects(prevSubjects =>
                prevSubjects.map(subject =>
                    subject.id === id ? formattedSubject : subject
                )
            );
            return { success: true };
        } catch (error) {
            console.error(error);
            let errorMessage;
            if (error.response) {
                switch (error.response.status) {
                    case 400:
                        errorMessage = 'Error de validación: revisa los datos introducidos.';
                        break;
                    case 401:
                    case 403:
                        errorMessage = 'No autorizado para actualizar la materia. Verifique su sesión.';
                        break;
                    case 404:
                        errorMessage = 'Materia no encontrada. Verifique su existencia recargando la app e intente de nuevo.';
                        break;
                    case 409:
                        errorMessage = 'La materia ya existe. Por favor cambie el nombre e intente de nuevo.';
                        break;
                    case 500:
                        errorMessage = 'Error interno del servidor. Por favor, intente más tarde.';
                        break;
                    default:
                        errorMessage = 'Error inesperado durante la actualización. Intente de nuevo';
                }
            } else if (error.message === 'Network Error') {
                errorMessage = 'Error de conexión durante la actualización. Verifique su conexión a internet.';
            } else {
                errorMessage = 'Error inesperado durante la actualización. Intente de nuevo';
            }

            return { success: false, error: errorMessage };
        }
    }, [jwt]);


    /**
   * Deletes an existing subject by ID.
   * @async
   * @function removeSubject
   * @param {string} id - The ID of the subject to delete.
   * @returns {Promise<Object>} - Result of the operation with success status or error message.
   * @throws {Object} - Returns an error message if the deletion fails.
   */
    const removeSubject = useCallback(async (id) => {
        try {
            await deleteSubject({ id, token: jwt });
            setSubjects(prevSubjects => prevSubjects.filter(subject => subject.id !== id));
            return { success: true };
        } catch (error) {
            console.error(error);
            let errorMessage;
            if (error.response) {
                switch (error.response.status) {
                    case 401:
                    case 403:
                        errorMessage = 'No autorizado para eliminar esta materia. Verifique su sesión.';
                        break;
                    case 409: {
                        const message = error.response.data.message;
                        if (message === 'The subject is associated with one or more legal bases') {
                            errorMessage = 'La materia está vinculada a uno o más fundamentos legales y no puede ser eliminada. Por favor, verifique e intente de nuevo.';
                        } else if (message === 'Some aspects of the subject are associated with legal bases') {
                            errorMessage = 'Algunos aspectos de esta materia están vinculados a fundamentos legales y no puede ser eliminada. Por favor, verifique e intente de nuevo.';
                        } else {
                            errorMessage = 'La materia no puede ser eliminada debido a que tiene vinculaciones con otros módulos. Por favor, verifique e intente de nuevo.';
                        }
                        break;
                    }
                    case 404:
                        errorMessage = 'Materia no encontrada. Verifique su existencia recargando la app e intente de nuevo.';
                        break;
                    case 500:
                        errorMessage = 'Error interno del servidor. Por favor, intente más tarde.';
                        break;
                    default:
                        errorMessage = 'Error inesperado durante la eliminación. Intente de nuevo';
                }
            } else if (error.message === 'Network Error') {
                errorMessage = 'Error de conexión durante la eliminación. Verifique su conexión a internet.';
            } else {
                errorMessage = 'Error inesperado durante la eliminación. Intente de nuevo';
            }

            return { success: false, error: errorMessage };
        }
    }, [jwt]);


    /**
     * Deletes multiple subjects by their IDs.
     * @param {Array<number>} subjectIds - Array of subject IDs to delete.
     * @returns {Promise<Object>} - Success status or error message.
     */
    const deleteSubjectsBatch = useCallback(async (subjectIds) => {
        try {
            const success = await deleteSubjects({ subjectIds, token: jwt });

            if (success) {
                setSubjects(prevSubjects => prevSubjects.filter(subject => !subjectIds.includes(subject.id)));
                return { success: true };
            }
        } catch (error) {
            console.error(error);
            let errorMessage;

            if (error.response) {
                switch (error.response.status) {
                    case 400:
                        errorMessage = 'Faltan campos requeridos: subjectIds. Verifique los parámetros enviados.';
                        break;
                    case 401:
                    case 403:
                        errorMessage = 'No autorizado para eliminar las materias. Verifique su sesión.';
                        break;
                    case 409: {
                        const { errors, message } = error.response.data;
                        const { associatedSubjects } = errors;
                        if (associatedSubjects && associatedSubjects.length > 0) {
                            const associatedNames = associatedSubjects.map(subject => subject.name).join(', ');
                            const plural = associatedSubjects.length > 1;
                            if (message === 'Subjects are associated with legal bases') {
                                errorMessage = `${plural ? 'Las materias' : 'La materia'} ${associatedNames} ${plural ? 'están' : 'está'} vinculada${plural ? 's' : ''} a uno o más  fundamentos legales y no puede${plural ? 'n' : ''} ser eliminada${plural ? 's' : ''}. Por favor, verifique e intente de nuevo.`;
                            } else if (message === 'Subjects have aspects associated with legal bases') {
                                errorMessage = `${plural ? 'Las materias' : 'La materia'} ${associatedNames} ${plural ? 'tienen' : 'tiene'} aspectos asociados a fundamentos legales y no puede${plural ? 'n' : ''} ser eliminada${plural ? 's' : ''}. Por favor, verifique e intente de nuevo.`;
                            } else {
                                errorMessage = `${plural ? 'Las materias' : 'La materia'} ${associatedNames} no puede${plural ? 'n' : ''} ser eliminada${plural ? 's' : ''} debido a vinculaciones con otros módulos. Por favor, verifique e intente de nuevo.`;
                            }
                        } else {
                            errorMessage = `Las materias no pueden ser eliminadas debido a vinculaciones con otros módulos. Por favor, verifique e intente de nuevo.`;
                        }
                        break;
                    }
                    case 404:
                        errorMessage = 'Una o más materias no encontradas. Verifique su existencia recargando la app e intente de nuevo.';
                        break;
                    case 500:
                        errorMessage = 'Error interno del servidor. Por favor, intente más tarde.';
                        break;
                    default:
                        errorMessage = 'Error inesperado al eliminar materias. Intente de nuevo.';
                }
            } else if (error.message === 'Network Error') {
                errorMessage = 'Error de conexión al eliminar materias. Verifique su conexión a internet.';
            } else {
                errorMessage = 'Error inesperado al eliminar materias. Intente de nuevo.';
            }

            return { success: false, error: errorMessage };
        }
    }, [jwt]);


    useEffect(() => {
        fetchSubjects();
    }, [fetchSubjects]);

    return {
        subjects,
        loading: stateSubjects.loading,
        error: stateSubjects.error,
        fetchSubjects,
        fetchSubjectById,
        addSubject,
        modifySubject,
        removeSubject,
        deleteSubjectsBatch,
    };
}
