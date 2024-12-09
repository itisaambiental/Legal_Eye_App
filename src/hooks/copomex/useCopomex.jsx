import { useState, useEffect, useCallback } from "react";
import getStates from "../../services/copomexService/getStates";
import getMunicipalitiesByState from "../../services/copomexService/getMunicipalitiesByState";

/**
 * Custom hook for managing States and Municipalities.
 * @returns {Object} - Contains States and Municipalities list, loading state, error state.
 */

export default function useCopomex() {
  const [states, setStates] = useState([]);
  const [stateStates, setStateStates] = useState({
    loading: true,
    error: null,
  });
  const [municipalities, setMunicipalities] = useState([]);
  const [stateMunicipalities, setStateMunicipalities] = useState({
    loading: false,
    error: null,
  });


        /**
     * Clears the list of municipalities from the state.
     * 
     * @function clearMunicipalities
     * @returns {void} - Resets the aspects list to an empty array.
     */
        const clearMunicipalities = useCallback(() => {
            setMunicipalities([]);
            setStateMunicipalities((prevState) => ({ ...prevState, error: null }));
        }, []);
    /**
  /**
   * Fetches the complete list of states.
   * @async
   * @function fetchStates
   * @returns {Promise<void>} - Updates the states list and loading state.
   * @throws {Object} - Updates error state with the appropriate error message if fetching fails.
   */
  const fetchStates = useCallback(async () => {
    setStateStates({ loading: true, error: null });
    try {
      const data = await getStates();
      setStates(data);
      setStateStates({ loading: false, error: null });
    } catch (error) {
      console.error("Error fetching states:", error);
      let errorTitle = "Error inesperado";
      let errorMessage =
        "Ha ocurrido un error inesperado. Por favor intente nuevamente más tarde.";
      if (error.message === "Network Error") {
        errorTitle = "Error de conexión";
        errorMessage =
          "Hubo un problema de red. Verifique su conexión a internet e intente nuevamente.";
      } else if (error.response) {
        const { status, data } = error.response;
        if (status === 400 && data && data.code_error) {
          switch (data.code_error) {
            case 1:
            case 2:
            case 3:
            case 4:
            case 5:
              errorTitle = "Error obteniendo estados";
              errorMessage =
                "Hubo un error al obtener los estados de méxico. Por favor, comuníquese con los administradores del sistema.";
              break;
            default:
              errorTitle = "Error inesperado";
              errorMessage =
                "Ocurrió un error inesperado. Por favor, intente nuevamente más tarde.";
              break;
          }
        } else if (status >= 500) {
          errorTitle = "Error en el servidor";
          errorMessage =
            "Hubo un error en el servidor. Espere un momento e intente nuevamente.";
        }
      }

      setStateStates({
        loading: false,
        error: { title: errorTitle, message: errorMessage },
      });
    }
  }, []);

  /**
   * Fetches the list of municipalities for a given state.
   * @async
   * @function fetchMunicipalities
   * @param {string} state - The name of the state for which to retrieve municipalities.
   * @returns {Promise<void>} - Updates the municipalities list and loading state.
   * @throws {Object} - Updates error state with the appropriate error message if fetching fails.
   */
  const fetchMunicipalities = useCallback(async (state) => {
    setStateMunicipalities({ loading: true, error: null });
    try {
      const data = await getMunicipalitiesByState(state);
      setMunicipalities(data);
      setStateMunicipalities({ loading: false, error: null });
    } catch (error) {
      console.error("Error fetching municipalities:", error);
      let errorTitle = "Error inesperado";
      let errorMessage =
        "Ha ocurrido un error inesperado. Por favor intente nuevamente más tarde.";

      if (error.message === "Network Error") {
        errorTitle = "Error de conexión";
        errorMessage =
          "Hubo un problema de red. Verifique su conexión a internet e intente nuevamente.";
      } else if (error.response) {
        const { status, data } = error.response;
        if (status === 400 && data && data.code_error) {
          switch (data.code_error) {
            case 1:
            case 2:
            case 3:
            case 4:
            case 5:
              errorTitle = "Error obteniendo municipios";
              errorMessage =
                "Hubo un error al obtener los municipios del estado. Por favor, comuníquese con los administradores del sistema.";
              break;
            default:
              errorTitle = "Error inesperado";
              errorMessage =
                "Ocurrió un error inesperado. Por favor, intente nuevamente más tarde.";
              break;
          }
        } else if (status >= 500) {
          errorTitle = "Error en el servidor";
          errorMessage =
            "Hubo un error en el servidor. Espere un momento e intente nuevamente.";
        }
      }

      setStateMunicipalities({
        loading: false,
        error: { title: errorTitle, message: errorMessage },
      });
    }
  }, []);

  useEffect(() => {
    fetchStates();
  }, [fetchStates]);

  return {
    states,
    loadingStates: stateStates.loading,
    errorStates: stateStates.error,
    municipalities,
    loadingMunicipalities: stateMunicipalities.loading,
    errorMunicipalities: stateMunicipalities.error,
    clearMunicipalities,
    fetchStates,
    fetchMunicipalities,
  };
}
