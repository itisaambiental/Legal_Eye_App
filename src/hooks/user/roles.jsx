import { useContext, useState, useEffect, useCallback } from 'react';
import Context from '../../context/userContext.jsx';
import getRoles from '../../services/userService/getRoles.js';

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

      let errorTitle;
      let errorMessage;
      if (error.response && error.response.status === 403) {
        errorTitle = 'Acceso no autorizado';
        errorMessage = 'No tiene permisos para acceder a los roles. Verifique su sesión.';
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

      setStateRoles({ loading: false, error: { title: errorTitle, message: errorMessage } });
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
