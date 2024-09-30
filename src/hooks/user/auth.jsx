import { useContext, useState, useEffect, useCallback } from 'react';
import Context from '../../context/userContext.jsx';
import login_user from '../../server/userService/login.js';
import verifyToken from '../../server/userService/verify_token.js';
import { jwtDecode } from 'jwt-decode';
import { msalInstance } from '../../utils/msalConfig.js'; 
import login_user_microsoft from '../../server/userService/login_microsoft.js';

const ADMIN_ROLE = 1;
const ANALYST_ROLE = 2;

export default function useUser() {
  const { jwt, setJWT, isAdmin, setIsAdmin, isAnalyst, setIsAnalyst } = useContext(Context);
  
  const [stateLogin, setStateLogin] = useState({ loading: false, error: false });
  const [stateMicrosoft, setStateMicrosoft] = useState({ loading: false, error: false });


  const login = useCallback(({ gmail, password }) => {
    setStateLogin({ loading: true, error: false });
    
    login_user({ gmail, password })
      .then(response => {
        const token = response.token;
        if (token) {
          const decodedToken = jwtDecode(token);
          const userRole = decodedToken.userForToken.userType;
          setIsAdmin(userRole === ADMIN_ROLE);
          setIsAnalyst(userRole === ANALYST_ROLE);

          window.localStorage.setItem('jwt', token);
          setStateLogin({ loading: false, error: false });
          setJWT(token);
        } else {
          window.localStorage.removeItem('jwt');
          setIsAdmin(false);
          setIsAnalyst(false);
          setStateLogin({ loading: false, error: true });
        }
      })
      .catch(err => {
        window.localStorage.removeItem('jwt');
        setIsAdmin(false);
        setIsAnalyst(false);
        setStateLogin({ loading: false, error: true });
        console.error(err);
      });
  }, [setJWT, setIsAdmin, setIsAnalyst]);

 
  const login_microsoft = useCallback(async () => {
    if (stateLogin.error) {
      setStateLogin({ ...stateLogin, error: false });
  }
    setStateMicrosoft({ loading: true, error: null });
  
    try {
      const loginRequest = {
        scopes: ['openid', 'profile', 'User.Read'] 
      };
  
      await msalInstance.initialize()
      const loginResponse = await msalInstance.loginPopup(loginRequest);
      const accessToken = loginResponse.accessToken;
  
      const response = await login_user_microsoft({ accessToken });
      const token = response.token;
  
      if (token) {
        const decodedToken = jwtDecode(token);
        const userRole = decodedToken.userForToken.userType;
        setIsAdmin(userRole === ADMIN_ROLE);
        setIsAnalyst(userRole === ANALYST_ROLE);
  
        window.localStorage.setItem('jwt', token);
        setStateMicrosoft({ loading: false, error: null }); 
        setJWT(token);
      } else {
        throw new Error('No token returned from backend');
      }
    } catch (error) {
      console.error('Error during Microsoft login:', error);
  
      if (error.response && error.response.status === 401 && error.response.data.message === 'Invalid email') {
        setStateMicrosoft({ loading: false, error: 'Correo Inválido' });
      } else {
        setStateMicrosoft({ loading: false, error: 'Error al iniciar sesión con Microsoft' });
      }
  
      window.localStorage.removeItem('jwt');
      setIsAdmin(false);
      setIsAnalyst(false);
    }
  }, [setJWT, setIsAdmin, setIsAnalyst, stateLogin]);
  
  // Logout
  const logout = useCallback(() => {
    window.localStorage.removeItem('jwt');
    setJWT(null);
    setIsAdmin(false);
    setIsAnalyst(false);
  }, [setJWT, setIsAdmin, setIsAnalyst]);


  useEffect(() => {
    const checkToken = async () => {
      if (jwt && jwt !== '' && jwt !== 'null') {
        const isValid = await verifyToken(jwt);
        if (!isValid) {
          logout();
        }
      }
    };

    checkToken();
  }, [jwt, logout]);

  return {
    isLogged: Boolean(jwt) && jwt !== '' && jwt !== 'null',
    isLoginLoading: stateLogin.loading,
    hasLoginError: stateLogin.error,
    isMicrosoftLoading: stateMicrosoft.loading,
    hasMicrosoftError: stateMicrosoft.error,
    stateMicrosoft,
    setStateLogin,
    setStateMicrosoft,
    stateLogin,
    login,
    login_microsoft,
    logout,
    isAdmin,
    isAnalyst,
  };
}
