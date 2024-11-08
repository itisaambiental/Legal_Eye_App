import { useContext, useState, useEffect, useCallback } from 'react';
import Context from '../../context/userContext.jsx';
import getSubjects from '../../server/subjectService/getSubjects.js';
import getSubjectById from '../../server/subjectService/getSubjectById.js';
import createNewSubject from '../../server/subjectService/createSubject.js';
import updateSubject from '../../server/subjectService/updateSubject.js';
import deleteSubject from '../../server/subjectService/deleteSubject.js';
import deleteSubjects from '../../server/subjectService/deleteSubjects.js';

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
            const subjectsList = await getSubjects(jwt);
            setSubjects(subjectsList.reverse());
            setStateSubjects({ loading: false, error: null });
        } catch (error) {
            console.error('Error fetching subjects:', error);
            let errorMessage;

            if (error.response && error.response.status === 403) {
                errorMessage = 'Acceso no autorizado';
            } else if (error.message === 'Network Error') {
                errorMessage = 'Error de conexión';
            } else if (error.response && error.response.status === 500) {
                errorMessage = 'Error en el servidor';
            } else {
                errorMessage = 'Error inesperado';
            }

            setStateSubjects({ loading: false, error: errorMessage });
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
            console.error('Error fetching subject by ID:', error);
            let errorMessage;
            if (error.response && error.response.status === 403) {
                errorMessage = 'Acceso no autorizado';
            } else if (error.response && error.response.status === 404) {
                errorMessage = 'Materia no encontrada';
            } else if (error.message === 'Network Error') {
                errorMessage = 'Error de conexión';
            } else if (error.response && error.response.status === 500) {
                errorMessage = 'Error interno del servidor';
            } else {
                errorMessage = 'Error inesperado';
            }

            setStateSubjects({ loading: false, error: errorMessage });
            return { success: false, error: errorMessage };
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
            return { success: true, subject: newSubject };
        } catch (error) {
            console.error('Error creating subject:', error);
            let errorMessage;

            if (error.response && error.response.status === 400) {
                errorMessage = error.response.data.message || 'Error de validación';
            } else if (error.response && error.response.status === 403) {
                errorMessage = 'No autorizado para crear un nuevo subject';
            } else if (error.message === 'Network Error') {
                errorMessage = 'Error de conexión durante la creación';
            } else if (error.response && error.response.status === 500) {
                errorMessage = 'Error interno del servidor';
            } else {
                errorMessage = 'Error inesperado durante la creación';
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
        
        return { success: true, subject: formattedSubject };
    } catch (error) {
        console.error('Error updating subject:', error);
        let errorMessage;

        if (error.response && error.response.status === 400) {
            errorMessage = error.response.data.message || 'Error de validación';
        } else if (error.response && error.response.status === 403) {
            errorMessage = 'No autorizado para actualizar el subject';
        } else if (error.response && error.response.status === 404) {
            errorMessage = 'Subject no encontrado';
        } else if (error.message === 'Network Error') {
            errorMessage = 'Error de conexión durante la actualización';
        } else if (error.response && error.response.status === 500) {
            errorMessage = 'Error interno del servidor';
        } else {
            errorMessage = 'Error inesperado durante la actualización';
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
            console.error('Error deleting subject:', error);
            let errorMessage;

            if (error.response && error.response.status === 403) {
                errorMessage = 'No autorizado para eliminar el subject';
            } else if (error.response && error.response.status === 404) {
                errorMessage = 'Subject no encontrado';
            } else if (error.message === 'Network Error') {
                errorMessage = 'Error de conexión durante la eliminación';
            } else if (error.response && error.response.status === 500) {
                errorMessage = 'Error interno del servidor';
            } else {
                errorMessage = 'Error inesperado durante la eliminación';
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
        console.error('Error deleting subjects batch:', error);
        let errorMessage;

        if (error.response && error.response.status === 400) {
            errorMessage = 'Faltan campos requeridos: subjectIds';
        } else if (error.response && error.response.status === 403) {
            errorMessage = 'No autorizado para eliminar materias';
        } else if (error.response && error.response.status === 404) {
            errorMessage = error.response.data.message || 'Una o más materias no encontradas';
        } else if (error.message === 'Network Error') {
            errorMessage = 'Error de conexión al eliminar materias';
        } else if (error.response && error.response.status === 500) {
            errorMessage = 'Error interno del servidor';
        } else {
            errorMessage = 'Error inesperado al eliminar materias';
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
        setSubjects,
    };
}
