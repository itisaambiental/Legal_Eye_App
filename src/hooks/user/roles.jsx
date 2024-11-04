import { useContext, useState, useEffect, useCallback } from 'react';
import Context from '../../context/userContext.jsx';
import getRoles from '../../server/userService/getRoles.js';

/**
 * Custom hook for fetching and managing user roles data.
 * @returns {Object} - Contains roles list, loading state, and error state.
 */
export default function useRoles() {
  const { jwt } = useContext(Context);  
  const [roles, setRoles] = useState([]);
  const [stateRoles, setStateRoles] = useState({ loading: false, error: null }); 

  /**
   * Fetches the list of user roles.
   */
  const fetchRoles = useCallback(async () => {
    setStateRoles({ loading: true, error: null });

    try {
      const rolesList = await getRoles({ token: jwt });
      setRoles(rolesList);
      setStateRoles({ loading: false, error: null });
    } catch (error) {
      console.error('Error fetching roles:', error);
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
      setStateRoles({ loading: false, error: errorMessage });
    }
  }, [jwt]);

  /**
   * useEffect hook to fetch roles on component mount or when JWT token changes.
   */
  useEffect(() => {
    if (jwt) {
      fetchRoles();
    }
  }, [jwt, fetchRoles]);

  return {
    roles, 
    roles_loading: stateRoles.loading, 
    roles_error: stateRoles.error,
  };
}
