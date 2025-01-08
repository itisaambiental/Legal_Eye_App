import { useContext, useState, useEffect, useCallback } from 'react';
import Context from '../../context/userContext.jsx';
import getUserById from '../../services/userService/getUserById.js';
import { jwtDecode } from "jwt-decode";
import UserErrors from '../../errors/UserErrors.js';
/**
 * Custom hook for fetching and managing user profile data.
 * @returns {Object} - Contains user's profile information and loading/error states.
 */
export default function useUserProfile() {
  const { jwt } = useContext(Context);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [profilePicture, setProfilePicture] = useState(null);
  const [stateProfile, setStateProfile] = useState({ loading: false, error: null });

  /**
   * Fetches user profile data by user ID.
   * @param {number} id - The ID of the user to fetch data for.
   */
  const fetchUserProfile = useCallback(async (id) => {
    setStateProfile({ loading: true, error: null });

    try {
      const user = await getUserById({ id, token: jwt });

      if (user) {
        setName(user.name);
        setEmail(user.gmail);
        setProfilePicture(user.profile_picture);
        setStateProfile({ loading: false, error: null });
      }
    } catch (error) {
      const errorCode = error.response?.status;
      const serverMessage = error.response?.data?.message;
      const clientMessage = error.message;
      const handledError = UserErrors.handleError({
        code: errorCode,
        error: serverMessage,
        httpError: clientMessage,
      });
      setStateProfile({ loading: false, error: handledError });
    }
  }, [jwt]);

  /**
   * useEffect hook to fetch user profile on mount or when JWT token changes.
   */
  useEffect(() => {
    if (jwt) {
      const decodedToken = jwtDecode(jwt);
      const userId = decodedToken.userForToken.id;
      fetchUserProfile(userId);
    }
  }, [jwt, fetchUserProfile]);

  return {
    name,
    email,
    profilePicture,
    loading: stateProfile.loading,
    error: stateProfile.error,
  };
}
