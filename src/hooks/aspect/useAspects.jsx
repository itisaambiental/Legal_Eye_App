import { useContext, useState, useCallback } from 'react';
import Context from '../../context/userContext.jsx';
import getAspectsBySubject from '../../server/aspectService/getAspects.js';
import createNewAspect from '../../server/aspectService/createAspect.js';
import updateAspect from '../../server/aspectService/updateAspect.js';
import deleteAspect from '../../server/aspectService/deleteAspect.js';
import deleteAspects from '../../server/aspectService/deleteAspects.js';
/**
 * Custom hook for managing aspects and retrieving them based on a specific subject.
 * @returns {Object} - Contains aspects list, loading state, error state, and functions for aspect operations.
 */
export default function useAspects() {
    const { jwt } = useContext(Context);
    const [aspects, setAspects] = useState([]);
    const [stateAspects, setStateAspects] = useState({ loading: false, error: null });

    const fetchAspects = useCallback(async (subjectId) => {
        setStateAspects({ loading: true, error: null });

        try {
            const aspectsList = await getAspectsBySubject({ subjectId, token: jwt });
            setAspects(aspectsList.reverse());
            setStateAspects({ loading: false, error: null });
        } catch (error) {
            console.error('Error fetching aspects:', error);
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

            setStateAspects({ loading: false, error: errorMessage });
        }
    }, [jwt]);

    /**
     * Adds a new aspect to a specific subject.
     * @async
     * @function addAspect
     * @param {number} subjectId - The ID of the subject to link this aspect to.
     * @param {string} aspectName - The name of the aspect to add.
     * @returns {Promise<Object>} - Result of the operation with success status and aspect or error message.
     * @throws {Object} - Returns an error message if the addition fails.
     */
    const addAspect = useCallback(async (subjectId, aspectName) => {
        try {
            const newAspect = await createNewAspect({ subjectId, aspectName, token: jwt });
            setAspects(prevAspects => [newAspect, ...prevAspects]);
            return { success: true, aspect: newAspect };
        } catch (error) {
            console.error('Error creating aspect:', error);
            let errorMessage;
            if (error.response && error.response.status === 400) {
                errorMessage = error.response.data.message || 'Error de validación';
            } else if (error.response && error.response.status === 403) {
                errorMessage = 'No autorizado para crear un nuevo aspecto';
            } else if (error.response && error.response.status === 404) {
                errorMessage = 'La materia no existe';
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
  * Updates an existing aspect by ID.
  * @async
  * @function modifyAspect
  * @param {number} aspectId - The ID of the aspect to update.
  * @param {string} aspectName - The new name of the aspect.
  * @returns {Promise<Object>} - Result of the operation with success status and updated aspect or error message.
  * @throws {Object} - Returns an error message if the update fails.
  */
    const modifyAspect = useCallback(async (aspectId, aspectName) => {
        try {
            const updatedAspect = await updateAspect({ aspectId, aspectName, token: jwt });
            const formattedAspect = {
                id: updatedAspect.id,
                aspect_name: updatedAspect.aspect_name,
                subject_id: updatedAspect.subject_id,
                subject_name: updatedAspect.subject_name
            };

            setAspects(prevAspects =>
                prevAspects.map(aspect =>
                    aspect.id === aspectId ? formattedAspect : aspect
                )
            );

            return { success: true, aspect: formattedAspect };
        } catch (error) {
            console.error('Error updating aspect:', error);
            let errorMessage;

            if (error.response && error.response.status === 400) {
                errorMessage = error.response.data.message || 'Error de validación';
            } else if (error.response && error.response.status === 403) {
                errorMessage = 'No autorizado para actualizar el aspecto';
            } else if (error.response && error.response.status === 404) {
                errorMessage = 'Aspecto no encontrado';
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
 * Deletes an existing aspect by ID.
 * @async
 * @function removeAspect
 * @param {number} aspectId - The ID of the aspect to delete.
 * @returns {Promise<Object>} - Result of the operation with success status or error message.
 * @throws {Object} - Returns an error message if the deletion fails.
 */
    const removeAspect = useCallback(async (aspectId) => {
        try {
            await deleteAspect({ aspectId, token: jwt });
            setAspects(prevAspects => prevAspects.filter(aspect => aspect.id !== aspectId));
            return { success: true };
        } catch (error) {
            console.error('Error deleting aspect:', error);
            let errorMessage;

            if (error.response && error.response.status === 403) {
                errorMessage = 'No autorizado para eliminar el aspecto';
            } else if (error.response && error.response.status === 404) {
                errorMessage = 'Aspecto no encontrado';
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


    const deleteAspectsBatch = useCallback(async (aspectIds) => {
        try {
            const success = await deleteAspects({ aspectIds, token: jwt });
    
            if (success) {
                setAspects(prevAspects => prevAspects.filter(aspect => !aspectIds.includes(aspect.id)));
                return { success: true };
            } else {
                throw new Error('Failed to delete aspects');
            }
        } catch (error) {
            console.error('Error deleting aspects batch:', error);
            let errorMessage;
    
            if (error.response && error.response.status === 400) {
                errorMessage = 'Faltan campos requeridos: aspectIds';
            } else if (error.response && error.response.status === 403) {
                errorMessage = 'No autorizado para eliminar aspectos';
            } else if (error.response && error.response.status === 404) {
                errorMessage = error.response.data.message || 'Uno o más aspectos no encontrados';
            } else if (error.message === 'Network Error') {
                errorMessage = 'Error de conexión al eliminar aspectos';
            } else if (error.response && error.response.status === 500) {
                errorMessage = 'Error interno del servidor';
            } else {
                errorMessage = 'Error inesperado al eliminar aspectos';
            }
    
            return { success: false, error: errorMessage };
        }
    }, [jwt]);

    return {
        aspects,
        loading: stateAspects.loading,
        error: stateAspects.error,
        fetchAspects,
        addAspect,
        modifyAspect,
        removeAspect,
        deleteAspectsBatch
    };
}
