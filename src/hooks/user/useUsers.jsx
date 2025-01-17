import { useContext, useState, useEffect, useCallback } from "react";
import Context from "../../context/userContext.jsx";
import getUsers from "../../services/userService/getUsers.js";
import registerNewUser from "../../services/userService/registerNewUser.js";
import updateUser from "../../services/userService/updateUser.js";
import deleteUserById from "../../services/userService/deleteUserById.js";
import deleteUsers from "../../services/userService/deleteUsers.js";
import getUserByRoleId from "../../services/userService/getUserByRole.js";
import getUsersByNameOrGmail from "../../services/userService/getUsersByNameOrGmail.js";
import { jwtDecode } from "jwt-decode";
import UserErrors from "../../errors/users/UserErrors.js";

/**
 * Custom hook for managing users and performing CRUD operations.
 * Centralizes error handling using the UserErrors class.
 * @returns {Object} - Contains user list, loading state, error state, and functions for user operations.
 */
export default function useUsers() {
  const { jwt, logout, updateUserContext } = useContext(Context);
  const [users, setUsers] = useState([]);
  const [stateUsers, setStateUsers] = useState({ loading: true, error: null });

  /**
   * Fetches the complete list of users.
   */
  const fetchUsers = useCallback(async () => {
    setStateUsers({ loading: true, error: null });
    try {
      const users = await getUsers({ token: jwt });
      setUsers(users.reverse());
      setStateUsers({ loading: false, error: null });
    } catch (error) {
      const errorCode = error.response?.status;
      const serverMessage = error.response?.data?.message;
      const clientMessage = error.message;
      const handledError = UserErrors.handleError({
        code: errorCode,
        error: serverMessage,
        httpError: clientMessage,
      });
      setStateUsers({ loading: false, error: handledError });
    }
  }, [jwt]);

  /**
   * Registers a new user.
   * @param {Object} userData - User data including name, email, role ID, and profile picture.
   * @returns {Promise<Object>} - Success status and user data or error message.
   */
  const addUser = useCallback(
    async ({ name, email, role_id, profile_picture }) => {
      try {
        const newUser = await registerNewUser({
          name,
          email,
          role_id,
          profile_picture,
          token: jwt,
        });
        setUsers((prevUsers) => [newUser, ...prevUsers]);
        return { success: true };
      } catch (error) {
        const errorCode = error.response?.status;
        const serverMessage = error.response?.data?.message;
        const clientMessage = error.message;
        const handledError = UserErrors.handleError({
          code: errorCode,
          error: serverMessage,
          httpError: clientMessage,
        });
        return { success: false, error: handledError.message };
      }
    },
    [jwt]
  );
  /**
   * Fetches users by their role ID.
   * @param {number} roleId - Role ID to filter users.
   */
  const fetchUsersByRole = useCallback(
    async (roleId) => {
      setStateUsers({ loading: true, error: null });

      try {
        const users = await getUserByRoleId({ roleId, token: jwt });
        setUsers(users.reverse());
        setStateUsers({ loading: false, error: null });
      } catch (error) {
        const errorCode = error.response?.status;
        const serverMessage = error.response?.data?.message;
        const clientMessage = error.message;
        const handledError = UserErrors.handleError({
          code: errorCode,
          error: serverMessage,
          httpError: clientMessage,
        });
        setStateUsers({ loading: false, error: handledError });
      }
    },
    [jwt]
  );

  /**
   *
   * @async
   * @function fetchUsersByNameOrGmail
   * @param {string} nameOrEmail - The name or email of the user to search for.
   * @returns {Promise<void>} - Updates the state with the filtered users or an error object.
   */
  const fetchUsersByNameOrGmail = useCallback(
    async (nameOrEmail) => {
      setStateUsers({ loading: true, error: null });
      try {
        const users = await getUsersByNameOrGmail({
          nameOrEmail,
          token: jwt,
        });
        setUsers(users.reverse());
        setStateUsers({ loading: false, error: null });
      } catch (error) {
        const errorCode = error.response?.status;
        const serverMessage = error.response?.data?.message;
        const clientMessage = error.message;
        const handledError = UserErrors.handleError({
          code: errorCode,
          error: serverMessage,
          httpError: clientMessage,
        });
        setStateUsers({ loading: false, error: handledError });
      }
    },
    [jwt]
  );

  /**
   * Updates user details.
   * @param {Object} userData - User data including ID, name, email, role ID, profile picture, and removePicture flag.
   * @returns {Promise<Object>} - Success status and updated user data or error message.
   */
  const updateUserDetails = useCallback(
    async ({ id, name, email, role_id, profile_picture, removePicture }) => {
      try {
        const { updatedUser, token } = await updateUser({
          id,
          name,
          email,
          role_id,
          profile_picture,
          token: jwt,
          removePicture,
        });
        setUsers((prevUsers) =>
          prevUsers.map((user) => (user.id === id ? updatedUser : user))
        );
        if (jwt && id === jwtDecode(jwt).userForToken.id && token) {
          updateUserContext(token);
        }
        return { success: true };
      } catch (error) {
        const errorCode = error.response?.status;
        const serverMessage = error.response?.data?.message;
        const clientMessage = error.message;
        const handledError = UserErrors.handleError({
          code: errorCode,
          error: serverMessage,
          httpError: clientMessage,
          items: [id],
        });
        return { success: false, error: handledError.message };
      }
    },
    [jwt, updateUserContext]
  );

  /**
   * Deletes a user by ID.
   * @param {number} id - User ID.
   * @returns {Promise<Object>} - Success status or error message.
   */
  const deleteUser = useCallback(
    async (id) => {
      try {
        const success = await deleteUserById({ id, token: jwt });
        if (success) {
          setUsers((prevUsers) => prevUsers.filter((user) => user.id !== id));
          if (jwt && id === jwtDecode(jwt).userForToken.id) {
            logout();
          }
          return { success: true };
        }
      } catch (error) {
        const errorCode = error.response?.status;
        const serverMessage = error.response?.data?.message;
        const clientMessage = error.message;
        const handledError = UserErrors.handleError({
          code: errorCode,
          error: serverMessage,
          httpError: clientMessage,
          items: [id],
        });
        return { success: false, error: handledError.message };
      }
    },
    [jwt, logout]
  );

  /**
   * Deletes multiple users by their IDs.
   * @param {Array<number>} userIds - Array of user IDs to delete.
   * @returns {Promise<Object>} - Success status or error message.
   */
  const deleteUsersBatch = useCallback(
    async (userIds) => {
      try {
        const success = await deleteUsers({ userIds, token: jwt });
        if (success) {
          setUsers((prevUsers) =>
            prevUsers.filter((user) => !userIds.includes(user.id))
          );
          if (jwt && userIds.includes(jwtDecode(jwt).userForToken.id)) {
            logout();
          }
          return { success: true };
        }
      } catch (error) {
        const errorCode = error.response?.status;
        const serverMessage = error.response?.data?.message;
        const clientMessage = error.message;
        const handledError = UserErrors.handleError({
          code: errorCode,
          error: serverMessage,
          httpError: clientMessage,
          items: userIds,
        });
        return { success: false, error: handledError.message };
      }
    },
    [jwt, logout]
  );

  // Automatically fetch users when the hook is initialized
  useEffect(() => {
    fetchUsers();
  }, [jwt, fetchUsers]);

  return {
    users,
    loading: stateUsers.loading,
    error: stateUsers.error,
    fetchUsers,
    addUser,
    fetchUsersByRole,
    fetchUsersByNameOrGmail,
    updateUserDetails,
    deleteUser,
    deleteUsersBatch,
  };
}
