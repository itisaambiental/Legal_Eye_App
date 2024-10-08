import { useContext, useState, useEffect, useCallback } from 'react';
import Context from '../../context/userContext.jsx';
import getUsers from '../../server/userService/getUsers.js';
import registerNewUser from '../../server/userService/registerNewUser.js';
import deleteUserById from '../../server/userService/deleteUserById.js';
import deleteUsers from '../../server/userService/deleteUsers.js';

export default function useUsers() {
  const { jwt } = useContext(Context);  
  const [users, setUsers] = useState([]);
  const [stateUsers, setStateUsers] = useState({ loading: false, error: null }); 

  const fetchUsers = useCallback(async () => {
    setStateUsers({ loading: true, error: null }); 

    try {
      const usersList = await getUsers({ token: jwt }); 
      setUsers(usersList.reverse()); 
      setStateUsers({ loading: false, error: null }); 
    } catch (error) {
      console.error('Error fetching users:', error);
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
      
      setStateUsers({ loading: false, error: errorMessage }); 
    }
  }, [jwt]);

  const addUser = useCallback(async ({ name, email, role_id, profile_picture }) => {
    try {
      const user = await registerNewUser({ name, email, role_id, profile_picture, token: jwt });
      
      setUsers(prevUsers => [user, ...prevUsers]);

      return { success: true, user }; 
    } catch (error) {
      console.error('Error registering new user:', error);
      let errorMessage;

      if (error.response && error.response.status === 400) {
        errorMessage = error.response.data.message || 'Validation error';
        if (error.response.data.errors) {
          errorMessage += `: ${error.response.data.errors.map(err => `${err.field}: ${err.message}`).join(', ')}`;
        }
      } else if (error.response && error.response.status === 403) {
        errorMessage = 'Unauthorized to register a new user';
      } else if (error.message === 'Network Error') {
        errorMessage = 'Network error occurred while registering';
      } else if (error.response && error.response.status === 500) {
        errorMessage = 'Internal server error';
      } else {
        errorMessage = 'Unexpected error occurred while registering';
      }
      return { success: false, error: errorMessage }; 
    }
  }, [jwt]);

  const deleteUser = useCallback(async (id) => {
    try {
      const success = await deleteUserById({ id, token: jwt });
      
      if (success) {
        setUsers(prevUsers => prevUsers.filter(user => user.id !== id));
        return { success: true };
      } else {
        throw new Error('Failed to delete user');
      }
    } catch (error) {
      console.error('Error deleting user:', error);
      let errorMessage;

      if (error.response && error.response.status === 404) {
        errorMessage = 'User not found';
      } else if (error.response && error.response.status === 403) {
        errorMessage = 'Unauthorized to delete user';
      } else if (error.message === 'Network Error') {
        errorMessage = 'Network error occurred while deleting';
      } else if (error.response && error.response.status === 500) {
        errorMessage = 'Internal server error';
      } else {
        errorMessage = 'Unexpected error occurred while deleting the user';
      }

      return { success: false, error: errorMessage };
    }
  }, [jwt]);


  const deleteUsersBatch = useCallback(async (userIds) => {
    try {
      const success = await deleteUsers({ userIds, token: jwt });
      
      if (success) {
        setUsers(prevUsers => prevUsers.filter(user => !userIds.includes(user.id)));
        return { success: true };
      } else {
        throw new Error('Failed to delete users');
      }
    } catch (error) {
      console.error('Error deleting users batch:', error);
      let errorMessage;

      if (error.response && error.response.status === 400) {
        errorMessage = 'Missing required fields: userIds';
      } else if (error.response && error.response.status === 403) {
        errorMessage = 'Unauthorized to delete users';
      } else if (error.response && error.response.status === 404) {
        errorMessage = error.response.data.message || 'One or more users not found';
      } else if (error.message === 'Network Error') {
        errorMessage = 'Network error occurred while deleting users';
      } else if (error.response && error.response.status === 500) {
        errorMessage = 'Internal server error';
      } else {
        errorMessage = 'Unexpected error occurred while deleting users';
      }

      return { success: false, error: errorMessage };
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
    addUser, 
    deleteUser,
    deleteUsersBatch
  };
}
