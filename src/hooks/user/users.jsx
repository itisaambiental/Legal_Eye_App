import { useContext, useState, useEffect, useCallback } from 'react';
import Context from '../../context/userContext.jsx';
import getUsers from '../../server/userService/getUsers.js';


export default function useUsers() {
  const { jwt } = useContext(Context);  
  const [users, setUsers] = useState([]);
  const [stateUsers, setStateUsers] = useState({ loading: false, error: null }); 

 
  const fetchUsers = useCallback(async () => {
    setStateUsers({ loading: true, error: null }); 

    try {
      const usersList = await getUsers({ token: jwt }); 

      setUsers(usersList); 
      setStateUsers({ loading: false, error: null }); 
    } catch (error) {
      console.error('Error fetching users:', error);
      let errorMessage = 'Error retrieving users';
      
      // Maneja diferentes tipos de errores
      if (error.response && error.response.status === 404) {
        errorMessage = 'Users not found';
      } else if (error.response && error.response.status === 403) {
        errorMessage = 'Unauthorized access';
      } else if (error.message === 'Network Error') {
        errorMessage = 'Network error, please try again later';
      }

      setStateUsers({ loading: false, error: errorMessage }); 
    }
  }, [jwt]);

  useEffect(() => {
    if (jwt) {
      fetchUsers();  
    }
  }, [jwt, fetchUsers]);

  return {
    users, 
    loading: stateUsers.loading, 
    error: stateUsers.error,    
  };
}