import { useContext, useState, useCallback } from 'react';
import Context from '../../context/userContext.jsx';
import getAspectsBySubject from '../../services/aspectService/getAspects.js';
import createNewAspect from '../../services/aspectService/createAspect.js';
import updateAspect from '../../services/aspectService/updateAspect.js';
import deleteAspect from '../../services/aspectService/deleteAspect.js';
import deleteAspects from '../../services/aspectService/deleteAspects.js';
/**
 * Custom hook for managing aspects and retrieving them based on a specific subject.
 * @returns {Object} - Contains aspects list, loading state, error state, and functions for aspect operations.
 */
export default function useAspects() {
    const { jwt } = useContext(Context);
    const [aspects, setAspects] = useState([]);
    const [stateAspects, setStateAspects] = useState({ loading: false, error: null });

        /**
     * Clears the list of aspects from the state.
     * 
     * @function clearAspects
     * @returns {void} - Resets the aspects list to an empty array.
     */
        const clearAspects = useCallback(() => {
            setAspects([]);
            setStateAspects((prevState) => ({ ...prevState, error: null }));
        }, []);
    /**
 * Fetches aspects associated with a specific subject.
 * 
 * @async
 * @function fetchAspects
 * @param {number} subjectId - The ID of the subject to retrieve aspects for.
 * @returns {Promise<void>} - Updates the state with the list of aspects or sets an error state in case of failure.
 * @throws {Object} - Sets an error object in state if the fetch operation fails, containing a title and message.
 */
    const fetchAspects = useCallback(async (subjectId) => {
        setStateAspects({ loading: true, error: null });

        try {
            const aspects = await getAspectsBySubject({ subjectId, token: jwt });
            setAspects(aspects.reverse());
            setStateAspects({ loading: false, error: null });
        } catch (error) {
            console.error('Error fetching aspects:', error);

            let errorTitle;
            let errorMessage;

             if (error.response && (error.response.status === 403 || error.response.status === 401)) {
                errorTitle = 'Acceso no autorizado';
                errorMessage = 'No tiene permisos para ver los aspectos de esta materia. Verifique su sesión.';
            } else if (error.message === 'Network Error') {
                errorTitle = 'Error de conexión';
                errorMessage = 'Hubo un problema de red al obtener los aspectos de la materia. Verifique su conexión a internet e intente nuevamente.';
            } else if (error.response && error.response.status === 500) {
                errorTitle = 'Error en el servidor';
                errorMessage = 'Hubo un error en el servidor al obtener los aspectos de la materia. Espere un momento e intente nuevamente.';
            }  else if (error.response && error.response.status === 404) {
                errorTitle = 'Materia no encontrada';
                errorMessage = 'La materia solicitada no existe o ha sido eliminada. Verifique e intente de nuevo'  
            } else {
                errorTitle = 'Error inesperado';
                errorMessage = 'Ocurrió un error inesperado al obtener los aspectos de la materia. Por favor, intente nuevamente más tarde.';
            }

            setStateAspects({ loading: false, error: { title: errorTitle, message: errorMessage } });
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
            return { success: true };
        } catch (error) {
            console.error('Error creating aspect:', error);
            let errorMessage;
            if (error.response) {
                switch (error.response.status) {
                    case 400:
                        errorMessage = 'Error de validación: revisa los datos introducidos.';
                        break;
                    case 401:
                    case 403:
                        errorMessage = 'No autorizado para crear un nuevo aspecto. Verifique su sesión.';
                        break;
                    case 404:
                        errorMessage = 'La materia no existe. Verifique la existencia de la materia e intente de nuevo';
                        break;
                    case 409:
                        errorMessage = 'El aspecto ya existe. Por favor cambie el nombre e intente de nuevo.';
                        break;
                    case 500:
                        errorMessage = 'Error interno del servidor. Por favor, intente más tarde.';
                        break;
                    default:
                        errorMessage = 'Error inesperado durante la creación del aspecto. Intente de nuevo.';
                }
            } else if (error.message === 'Network Error') {
                errorMessage = 'Error de conexión durante la creación. Verifique su conexión a internet.';
            } else {
                errorMessage = 'Error inesperado durante la creación del aspecto. Intente de nuevo.';
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
            return { success: true };
        } catch (error) {
            console.error('Error updating aspect:', error);
            let errorMessage;
            if (error.response) {
                switch (error.response.status) {
                    case 400:
                        errorMessage = 'Error de validación: revisa los datos introducidos.';
                        break;
                    case 401:
                    case 403:
                        errorMessage = 'No autorizado para actualizar el aspecto. Verifique su sesión.';
                        break;
                    case 404:
                        errorMessage = 'Aspecto no encontrado. Verifique su existencia recargando la app e intente de nuevo.';
                        break;
                    case 409:
                        errorMessage = 'El aspecto ya existe. Por favor cambie el nombre e intente de nuevo.';
                        break;
                    case 500:
                        errorMessage = 'Error interno del servidor. Por favor, intente más tarde.';
                        break;
                    default:
                        errorMessage = 'Error inesperado durante la actualización del aspecto. Intente de nuevo.';
                }
            } else if (error.message === 'Network Error') {
                errorMessage = 'Error de conexión durante la actualización. Verifique su conexión a internet.';
            } else {
                errorMessage = 'Error inesperado durante la actualización del aspecto. Intente de nuevo.';
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
            if (error.response) {
                switch (error.response.status) {
                    case 401:
                    case 403:
                        errorMessage = 'No autorizado para eliminar el aspecto. Verifique su sesión.';
                        break;
                    case 409: {
                        const message = error.response.data.message;
                        if (message === 'The aspect is associated with one or more legal bases') {
                            errorMessage = 'El aspecto está vinculado a uno o más fundamentos legales y no puede ser eliminado. Por favor, verifique e intente de nuevo.';
                        } else {
                            errorMessage = 'El aspecto no puede ser eliminado debido a que tiene vinculaciones con otros módulos. Por favor, verifique e intente de nuevo';
                        }
                        break;
                    }
                    case 404:
                        errorMessage = 'Aspecto no encontrado. Verifique su existencia recargando la app e intente de nuevo.';
                        break;
                    case 500:
                        errorMessage = 'Error interno del servidor. Por favor, intente más tarde.';
                        break;
                    default:
                        errorMessage = 'Error inesperado durante la eliminación del aspecto. Intente de nuevo.';
                }
            } else if (error.message === 'Network Error') {
                errorMessage = 'Error de conexión durante la eliminación. Verifique su conexión a internet.';
            } else {
                errorMessage = 'Error inesperado durante la eliminación del aspecto. Intente de nuevo.';
            }

            return { success: false, error: errorMessage };
        }
    }, [jwt]);

    /**
    * Deletes a batch of aspects by their IDs.
    * @async
    * @function deleteAspectsBatch
    * @param {Array<number>} aspectIds - The IDs of the aspects to delete.
    * @returns {Promise<Object>} - Result of the operation with success status or error message.
    * @throws {Object} - Returns an error message if the deletion fails.
    */
    const deleteAspectsBatch = useCallback(async (aspectIds) => {
        try {
            const success = await deleteAspects({ aspectIds, token: jwt });
            if (success) {
                setAspects(prevAspects => prevAspects.filter(aspect => !aspectIds.includes(aspect.id)));
                return { success: true };
            }
        } catch (error) {
            console.error('Error deleting aspects batch:', error);
            let errorMessage;

            if (error.response) {
                switch (error.response.status) {
                    case 400:
                        errorMessage = 'Faltan campos requeridos: aspectIds. Verifique los parámetros enviados.';
                        break;
                    case 401:
                    case 403:
                        errorMessage = 'No autorizado para eliminar los aspectos. Verifique su sesión.';
                        break;
                    case 409: {
                        const { errors, message } = error.response.data;
                        const { associatedAspects } = errors;
                        if (associatedAspects && associatedAspects.length > 0) {
                            const associatedNames = associatedAspects.map(aspect => aspect.name).join(', ');
                            const plural = associatedAspects.length > 1;
                            if (message === 'Aspects are associated with legal bases') {
                                errorMessage = `${plural ? 'Los aspectos' : 'El aspecto'} ${associatedNames} ${plural ? 'están' : 'está'} vinculado${plural ? 's' : ''} a uno o más  fundamentos legales y no puede${plural ? 'n' : ''} ser eliminado${plural ? 's' : ''}. Por favor, verifique e intente de nuevo.`;
                            } else {
                                errorMessage = `${plural ? 'Los aspectos' : 'El aspecto'} ${associatedNames} no puede${plural ? 'n' : ''} ser eliminado${plural ? 's' : ''} debido a vinculaciones con otros módulos. Por favor, verifique e intente de nuevo.`;
                            }
                        } else {
                            errorMessage = `Los aspectos no pueden ser eliminados debido a vinculaciones con otros módulos. Por favor, verifique e intente de nuevo.`;
                        }
                        break;
                    }
                    case 404:
                        errorMessage = 'Uno o más aspectos no encontrados. Verifique su existencia recargando la app e intente de nuevo.';
                        break;
                    case 500:
                        errorMessage = 'Error interno del servidor. Por favor, intente más tarde.';
                        break;
                    default:
                        errorMessage = 'Error inesperado al eliminar aspectos. Intente de nuevo.';
                }
            } else if (error.message === 'Network Error') {
                errorMessage = 'Error de conexión al eliminar aspectos. Verifique su conexión a internet.';
            } else {
                errorMessage = 'Error inesperado al eliminar aspectos. Intente de nuevo.';
            }

            return { success: false, error: errorMessage };
        }
    }, [jwt]);



    return {
        aspects,
        loading: stateAspects.loading,
        error: stateAspects.error,
        clearAspects,
        fetchAspects,
        addAspect,
        modifyAspect,
        removeAspect,
        deleteAspectsBatch
    };
}
