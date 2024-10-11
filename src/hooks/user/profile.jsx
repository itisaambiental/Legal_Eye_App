// hooks/user/profile.jsx
import { useContext, useState, useEffect, useCallback } from 'react';
import Context from '../../context/userContext.jsx';
import getUserById from '../../server/userService/getUserById.js';
import { jwtDecode } from "jwt-decode";

export default function useUserProfile() {
  const { jwt } = useContext(Context);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [profilePicture, setProfilePicture] = useState(null);
  const [stateProfile, setStateProfile] = useState({ loading: false, error: null });

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
      let errorMessage = 'Error retrieving user';
      if (error.response && error.response.status === 404) {
        errorMessage = 'User not found';
      } else if (error.response && error.response.status === 403) {
        errorMessage = 'Unauthorized access';
      }

      setStateProfile({ loading: false, error: errorMessage });
    }
  }, [jwt]); 

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
