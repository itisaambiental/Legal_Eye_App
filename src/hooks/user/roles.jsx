import { useContext, useState, useEffect, useCallback } from 'react';
import Context from '../../context/userContext.jsx';
import getRoles from '../../server/userService/getRoles.js';

export default function useRoles() {
  const { jwt } = useContext(Context);  
  const [roles, setRoles] = useState([]);
  const [stateRoles, setStateRoles] = useState({ loading: false, error: null }); 

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
        errorMessage = 'Unauthorized access';
      } else if (error.message === 'Network Error') {
        errorMessage = 'Network error';
      } else if (error.response && error.response.status === 500) {
        errorMessage = 'Server error';
      } else {
        errorMessage = 'Unexpected error';
      }
      setStateRoles({ loading: false, error: errorMessage }); 
    }
  }, [jwt]);

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
