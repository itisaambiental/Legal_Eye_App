import { useContext, useState, useEffect, useCallback } from "react";
import Context from "../../context/userContext.jsx";
import getRoles from "../../services/userService/getRoles.js";
import UserErrors from "../../errors/UserErrors.js";

/**
 * Custom hook for fetching and managing user roles data.
 * Centralizes error handling using the UserErrors class.
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
      const roles = await getRoles({ token: jwt });
      setRoles(roles);
      setStateRoles({ loading: false, error: null });
    } catch (error) {
      const errorCode = error.response?.status;
      const serverMessage = error.response?.data?.message;
      const clientMessage = error.message;
      const handledError = UserErrors.handleError({
        code: errorCode,
        error: serverMessage,
        httpError: clientMessage,
      });
      setStateRoles({ loading: false, error: handledError });
    }
  }, [jwt]);

  /**
   * useEffect hook to fetch roles on component mount or when JWT token changes.
   */
  useEffect(() => {
    fetchRoles();
  }, [jwt, fetchRoles]);

  return {
    roles,
    roles_loading: stateRoles.loading,
    roles_error: stateRoles.error,
  };
}
