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

      let errorTitle;
      let errorMessage;

      if (error.response && error.response.status === 403) {
        errorTitle = 'Acceso no autorizado';
        errorMessage = 'No tiene permisos para ver los usuarios. Verifique su sesión.';
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

      setStateUsers({ loading: false, error: { title: errorTitle, message: errorMessage } });
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
    }  catch (error) {
      console.error('Error fetching users by Role:', error);

      let errorTitle;
      let errorMessage;

      if (error.response && error.response.status === 403) {
        errorTitle = 'Acceso no autorizado';
        errorMessage = 'No tiene permisos para ver los roles. Verifique su sesión.';
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

      setStateUsers({ loading: false, error: { title: errorTitle, message: errorMessage } });
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
    if (error.response) {
      switch (error.response.status) {
        case 400:
          errorMessage = 'Error de validación: revisa los datos introducidos.';
          break;
        case 403:
          errorMessage = 'No autorizado para registrar un nuevo usuario. Intente de nuevo.';
          break;
        case 409:
          errorMessage = 'El correo ya está en uso. Por favor, utiliza otro.';
          break;
        case 500:
          errorMessage = 'Error interno del servidor. Intenta nuevamente más tarde.';
          break;
        default:
          errorMessage = 'Error inesperado durante el registro. Intente de nuevo.';
      }
    } else if (error.message === 'Network Error') {
      errorMessage = 'Error de conexión durante el registro. Verifica tu conexión a internet.';
    } else {
      errorMessage = 'Error inesperado durante el registro. Intente de nuevo.';
    }
    

    return { success: false, error: errorMessage };
  }
}, [jwt]);

/**
 * Updates user details.
 * @param {Object} userData - User data including ID, name, email, role ID, profile picture, and removePicture flag.
 * @returns {Promise<Object>} - Success status and updated user data or error message.
 */
const updateUserDetails = useCallback(async ({ id, name, email, role_id, profile_picture, removePicture }) => {
  try {
    const { updatedUser, token } = await updateUser({ id, name, email, role_id, profile_picture, token: jwt, removePicture });
    setUsers(prevUsers => prevUsers.map(user => (user.id === id ? updatedUser : user)));
    if (jwt && id === jwtDecode(jwt).userForToken.id && token) {
      updateUserContext(token);
    }
    return { success: true, updatedUser };
  } catch (error) {
    console.error('Error updating user:', error);
    let errorMessage;
    if (error.response) {
      switch (error.response.status) {
        case 400:
          errorMessage = 'Error de validación: revisa los datos introducidos.';
          break;
        case 403:
          errorMessage = 'No autorizado para actualizar este usuario. Intente de nuevo.';
          break;
        case 409:
          errorMessage = 'El correo ya está en uso. Por favor, utiliza otro.';
          break;
        case 404:
          errorMessage = 'El usuario no fue encontrado. Verifique su existencia recargando la app e intente de nuevo.';
          break;
        case 500:
          errorMessage = 'Error interno del servidor. Espere un momento e intente de nuevo.';
          break;
        default:
          errorMessage = 'Error inesperado durante la actualización. Intente de nuevo.';
      }
    } else if (error.message === 'Network Error') {
      errorMessage = 'Error de conexión durante la actualización. Verifica tu conexión a internet.';
    } else {
      errorMessage = 'Error inesperado durante la actualización. Intente de nuevo.';
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
    }
  } catch (error) {
    console.error('Error deleting user:', error);
    let errorMessage;
    if (error.response) {
      switch (error.response.status) {
        case 404:
          errorMessage = 'El usuario no fue encontrado. Verifique su existencia recargando la app e intente de nuevo.';
          break;
        case 403:
          errorMessage = 'No autorizado para eliminar este usuario. Intente de nuevo.';
          break;
        case 500:
          errorMessage = 'Error interno del servidor. Espere un momento e intente de nuevo.';
          break;
        default:
          errorMessage = 'Error inesperado al eliminar el usuario. Intente de nuevo.';
      }
    } else if (error.message === 'Network Error') {
      errorMessage = 'Error de conexión al eliminar el usuario. Verifica tu conexión a internet.';
    } else {
      errorMessage = 'Error inesperado al eliminar el usuario. Intente de nuevo.';
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
    }
  } catch (error) {
    console.error('Error deleting users batch:', error);
    let errorMessage;
    if (error.response) {
      switch (error.response.status) {
        case 400:
          errorMessage = 'Faltan campos requeridos: userIds. Verifique los parámetros enviados.';
          break;
        case 403:
          errorMessage = 'No autorizado para eliminar usuarios. Intente de nuevo.';
          break;
        case 404:
          errorMessage = 'Uno o más usuarios no encontrados.  Verifique su existencia recargando la app e intente de nuevo.';
          break;
        case 500:
          errorMessage = 'Error interno del servidor. Espere un momento e intente de nuevo.';
          break;
        default:
          errorMessage = 'Error inesperado al eliminar usuarios. Intente de nuevo.';
      }
    } else if (error.message === 'Network Error') {
      errorMessage = 'Error de conexión al eliminar los usuarios. Verifica tu conexión a internet.';
    } else {
      errorMessage = 'Error inesperado al eliminar usuarios. Intente de nuevo.';
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
