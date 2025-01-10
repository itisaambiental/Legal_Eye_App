import { useState, useEffect, useCallback } from "react";
import getStates from "../../services/copomexService/getStates";
import getMunicipalitiesByState from "../../services/copomexService/getMunicipalitiesByState";
import CopomexErrors from "../../errors/copomex/CopomexErrors";

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
     * @function clearMunicipalities
     * @returns {void}
     */
    const clearMunicipalities = useCallback(() => {
        setMunicipalities([]);
        setStateMunicipalities((prevState) => ({ ...prevState, error: null }));
    }, []);

    /**
     * Fetches the complete list of states.
     * @async
     * @function fetchStates
     * @returns {Promise<void>}
     */
    const fetchStates = useCallback(async () => {
        setStateStates({ loading: true, error: null });
        try {
            const data = await getStates();
            setStates(data);
            setStateStates({ loading: false, error: null });
        } catch (error) {
            const errorCode = error.response?.status;
            const serverMessage = error.response?.data?.message;
            const clientMessage = error.message;
            const handledError = CopomexErrors.handleError({
                code: errorCode,
                error: serverMessage,
                httpError: clientMessage,
            });
            setStateStates({ loading: false, error: handledError });
        }
    }, []);

    /**
     * Fetches the list of municipalities for a given state.
     * @async
     * @function fetchMunicipalities
     * @param {string} state - The name of the state for which to retrieve municipalities.
     * @returns {Promise<void>}
     */
    const fetchMunicipalities = useCallback(async (state) => {
        setStateMunicipalities({ loading: true, error: null });
        try {
            const data = await getMunicipalitiesByState(state);
            setMunicipalities(data);
            setStateMunicipalities({ loading: false, error: null });
        } catch (error) {
            const errorCode = error.response?.status;
            const serverMessage = error.response?.data?.message;
            const clientMessage = error.message;
            const handledError = CopomexErrors.handleError({
                code: errorCode,
                error: serverMessage,
                httpError: clientMessage,
            });
            setStateMunicipalities({ loading: false, error: handledError });
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
