import { useContext, useState, useEffect, useCallback } from 'react';
import Context from '../../context/userContext.jsx';
import getUserById from '../../services/userService/getUserById.js';
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
      console.error(error);

      let errorTitle;
      let errorMessage;

      if (error.response && error.response.status === 404) {
        errorTitle = 'Usuario no encontrado';
        errorMessage = 'Su informacion no fue encontrada en el sistema. Vuelva a iniciar sesión e intente de nuevo';
      } else if (error.response && (error.response.status === 403 || error.response.status === 401)) {
        errorTitle = 'Acceso no autorizado';
        errorMessage = 'No tiene permiso para acceder a este perfil. Verifique su sesión.';
      } else if (error.message === 'Network Error') {
        errorTitle = 'Error de conexión';
        errorMessage = 'Hubo un problema de red. Verifique su conexión a internet e intente nuevamente.';
      } else {
        errorTitle = 'Error inesperado';
        errorMessage = 'Ocurrió un error inesperado. Por favor, intente nuevamente más tarde.';
      }

      setStateProfile({ loading: false, error: { title: errorTitle, message: errorMessage } });
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
