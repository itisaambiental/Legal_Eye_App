import { useContext, useState, useEffect, useCallback } from 'react';
import Context from '../../context/userContext.jsx';
import getUserById from '../../server/userService/getUserById.js';
import { jwtDecode } from "jwt-decode";

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
      console.error('Error fetching user profile:', error);
      let errorMessage = 'Error al obtener el perfil del usuario';
      if (error.response && error.response.status === 404) {
        errorMessage = 'Usuario no encontrado';
      } else if (error.response && error.response.status === 403) {
        errorMessage = 'Acceso no autorizado';
      }

      setStateProfile({ loading: false, error: errorMessage });
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
    isLoading: stateProfile.loading,
    error: stateProfile.error,
  };
}
