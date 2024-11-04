import { useContext, useState, useEffect, useCallback } from 'react';
import Context from '../../context/userContext.jsx';
import getUsers from '../../server/userService/getUsers.js';
import registerNewUser from '../../server/userService/registerNewUser.js';
import updateUser from '../../server/userService/updateUser.js';
import deleteUserById from '../../server/userService/deleteUserById.js';
import deleteUsers from '../../server/userService/deleteUsers.js';
import getUserByRoleId from '../../server/userService/getUserByRole.js';
import { jwtDecode } from 'jwt-decode';

/**
 * Custom hook for managing users and performing CRUD operations.
 * @returns {Object} - Contains user list, loading state, error state, and functions for user operations.
 */
export default function useUsers() {
  const { jwt, logout, updateUserContext } = useContext(Context);
  const [users, setUsers] = useState([]);
  const [stateUsers, setStateUsers] = useState({ loading: false, error: null });

  /**
   * Fetches the complete list of users.
   */
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
        errorMessage = 'Acceso no autorizado';
      } else if (error.message === 'Network Error') {
        errorMessage = 'Error de conexión';
      } else if (error.response && error.response.status === 500) {
        errorMessage = 'Error en el servidor';
      } else {
        errorMessage = 'Error inesperado';
      }

      setStateUsers({ loading: false, error: errorMessage });
    }
  }, [jwt]);

  /**
   * Fetches users by their role ID.
   * @param {number} roleId - Role ID to filter users.
   */
  const fetchUsersByRole = useCallback(async (roleId) => {
    setStateUsers({ loading: true, error: null });

    try {
      const usersList = await getUserByRoleId({ roleId, token: jwt });
      setUsers(usersList.reverse());
      setStateUsers({ loading: false, error: null });
    } catch (error) {
      console.error('Error fetching users by Role:', error);
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

      setStateUsers({ loading: false, error: errorMessage });
    }
  }, [jwt]);

  /**
   * Registers a new user.
   * @param {Object} userData - User data including name, email, role ID, and profile picture.
   * @returns {Promise<Object>} - Success status and user data or error message.
   */
  const addUser = useCallback(async ({ name, email, role_id, profile_picture }) => {
    try {
      const user = await registerNewUser({ name, email, role_id, profile_picture, token: jwt });
      setUsers(prevUsers => [user, ...prevUsers]);
      return { success: true, user };
    } catch (error) {
      console.error('Error registering new user:', error);
      let errorMessage;

      if (error.response && error.response.status === 400) {
        errorMessage = error.response.data.message || 'Error de validación';
      } else if (error.response && error.response.status === 403) {
        errorMessage = 'No autorizado para registrar un nuevo usuario';
      } else if (error.message === 'Network Error') {
        errorMessage = 'Error de conexión durante el registro';
      } else if (error.response && error.response.status === 500) {
        errorMessage = 'Error interno del servidor';
      } else {
        errorMessage = 'Error inesperado durante el registro';
      }
      return { success: false, error: errorMessage };
    }
  }, [jwt]);

  /**
   * Updates user details.
   * @param {Object} userData - User data including ID, name, email, role ID, and profile picture.
   * @returns {Promise<Object>} - Success status and updated user data or error message.
   */
  const updateUserDetails = useCallback(async ({ id, name, email, role_id, profile_picture }) => {
    try {
      const { updatedUser, token } = await updateUser({ id, name, email, role_id, profile_picture, token: jwt });
      setUsers(prevUsers => prevUsers.map(user => (user.id === id ? updatedUser : user)));

      if (jwt && id === jwtDecode(jwt).userForToken.id && token) {
        updateUserContext(token);
      }

      return { success: true, updatedUser };
    } catch (error) {
      console.error('Error updating user:', error);
      let errorMessage = 'Error inesperado al actualizar';
      if (error.response && error.response.status === 400) {
        errorMessage = error.response.data.message || 'Error de validación';
      } else if (error.response && error.response.status === 403) {
        errorMessage = 'No autorizado para actualizar el usuario';
      } else if (error.message === 'Network Error') {
        errorMessage = 'Error de conexión durante la actualización';
      } else if (error.response && error.response.status === 500) {
        errorMessage = 'Error interno del servidor';
      }
      return { success: false, error: errorMessage };
    }
  }, [jwt, updateUserContext]);

  /**
   * Deletes a user by ID.
   * @param {number} id - User ID.
   * @returns {Promise<Object>} - Success status or error message.
   */
  const deleteUser = useCallback(async (id) => {
    try {
      const success = await deleteUserById({ id, token: jwt });

      if (success) {
        setUsers(prevUsers => prevUsers.filter(user => user.id !== id));
        if (jwt && id === jwtDecode(jwt).userForToken.id) {
          logout();
        }
        return { success: true };
      } else {
        throw new Error('Failed to delete user');
      }
    } catch (error) {
      console.error('Error deleting user:', error);
      let errorMessage;

      if (error.response && error.response.status === 404) {
        errorMessage = 'Usuario no encontrado';
      } else if (error.response && error.response.status === 403) {
        errorMessage = 'No autorizado para eliminar usuario';
      } else if (error.message === 'Network Error') {
        errorMessage = 'Error de conexión al eliminar';
      } else if (error.response && error.response.status === 500) {
        errorMessage = 'Error interno del servidor';
      } else {
        errorMessage = 'Error inesperado al eliminar el usuario';
      }

      return { success: false, error: errorMessage };
    }
  }, [jwt, logout]);

  /**
   * Deletes multiple users by their IDs.
   * @param {Array<number>} userIds - Array of user IDs to delete.
   * @returns {Promise<Object>} - Success status or error message.
   */
  const deleteUsersBatch = useCallback(async (userIds) => {
    try {
      const success = await deleteUsers({ userIds, token: jwt });

      if (success) {
        setUsers(prevUsers => prevUsers.filter(user => !userIds.includes(user.id)));
        if (jwt && userIds.includes(jwtDecode(jwt).userForToken.id)) {
          logout();
        }
        return { success: true };
      } else {
        throw new Error('Failed to delete users');
      }
    } catch (error) {
      console.error('Error deleting users batch:', error);
      let errorMessage;

      if (error.response && error.response.status === 400) {
        errorMessage = 'Faltan campos requeridos: userIds';
      } else if (error.response && error.response.status === 403) {
        errorMessage = 'No autorizado para eliminar usuarios';
      } else if (error.response && error.response.status === 404) {
        errorMessage = error.response.data.message || 'Uno o más usuarios no encontrados';
      } else if (error.message === 'Network Error') {
        errorMessage = 'Error de conexión al eliminar usuarios';
      } else if (error.response && error.response.status === 500) {
        errorMessage = 'Error interno del servidor';
      } else {
        errorMessage = 'Error inesperado al eliminar usuarios';
      }

      return { success: false, error: errorMessage };
    }
  }, [jwt, logout]);

  useEffect(() => {
    if (jwt) {
      fetchUsers();
    }
  }, [jwt, fetchUsers]);

  return {
    users,
    loading: stateUsers.loading,
    error: stateUsers.error,
    fetchUsersByRole,
    fetchUsers,
    addUser,
    updateUserDetails,
    deleteUser,
    deleteUsersBatch
  };
}
