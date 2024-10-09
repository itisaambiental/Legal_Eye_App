import { useContext, useState, useEffect, useCallback } from 'react';
import Context from '../../context/userContext.jsx';
import login_user from '../../server/userService/login.js';
import verifyToken from '../../server/userService/verify_token.js';
import resetPassword from '../../server/userService/reset_password.js';
import { jwtDecode } from 'jwt-decode';
import { msalInstance } from '../../utils/msalConfig.js'; 
import login_user_microsoft from '../../server/userService/login_microsoft.js';
import sendNewPassword from '../../server/userService/sendNewPassword.js';

const ADMIN_ROLE = 1;
const ANALYST_ROLE = 2;

export default function useUser() {
  const { jwt, setJWT, isAdmin, setIsAdmin, isAnalyst, setIsAnalyst } = useContext(Context);
  const [stateLogin, setStateLogin] = useState({ loading: false, error: false });
  const [stateMicrosoft, setStateMicrosoft] = useState({ loading: false, error: false });
  const [stateResetPassword, setStateResetPassword] = useState({ loading: false, error: false });
  const [stateVerifyCode, setStateVerifyCode] = useState({ loading: false, error: false });

  const login = useCallback(({ email, password }) => {
    setStateLogin({ loading: true, error: false });
    
    login_user({ email, password })
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
  
      await msalInstance.initialize();
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
      if (error.errorCode === 'user_cancelled') {
        setStateMicrosoft({ loading: false, error: null }); 
      } else if (error.response && error.response.status === 401 && error.response.data.message === 'Invalid email') {
        setStateMicrosoft({ loading: false, error: 'Dirección de correo no válida' });
      } else {
        setStateMicrosoft({ loading: false, error: 'Error al iniciar sesión con Microsoft' });
      }
  
      window.localStorage.removeItem('jwt');
      setIsAdmin(false);
      setIsAnalyst(false);
    }
  }, [setJWT, setIsAdmin, setIsAnalyst, stateLogin]);
  

  const reset_password = useCallback(async (email, isResend = false) => {
    setStateResetPassword({ loading: true, error: null });
  
    try {
      const response = await resetPassword(email);
      if (response === 200) {
        setStateResetPassword({ loading: false, error: null });
        return true;
      }
    } catch (error) {
      console.error('Error during password reset:', error);
  
      const errorMessage = isResend
        ? 'Error al reenviar el código de verificación'
        : 'Error al enviar el código de verificación';
  
      setStateResetPassword({ loading: false, error: errorMessage });
      return false;
    }
  }, []);
  
    // Function to verify the reset code
    const verify_code = useCallback(async (gmail, code) => {
      setStateVerifyCode({ loading: true, error: null });
  
      try {
        const response = await sendNewPassword(gmail, code); 
  
        if (response === 200) {
          setStateVerifyCode({ loading: false, error: null });
          return true;
        } else {
          throw new Error('Unexpected response');
        }
      } catch (error) {
        if (error.response && error.response.status === 400 && error.response.data.message) {
          if (error.response.data.message === 'Invalid verification code') {
            setStateVerifyCode({ loading: false, error: 'Código inválido' });
          } else if (error.response.data.message === 'Verification code has expired') {
            setStateVerifyCode({ loading: false, error: 'Código expirado' });
          } else {
            setStateVerifyCode({ loading: false, error: 'Fallo al verificar el código' });
          }
        } else {
          setStateVerifyCode({ loading: false, error: 'Fallo al enviar el código' });
        }
        return false;
      }
    }, []);
  
  
  
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
    isResetPasswordLoading: stateResetPassword.loading,
    hasResetPasswordError: stateResetPassword.error,
    isVerifyCodeLoading: stateVerifyCode.loading,
    hasVerifyCodeError: stateVerifyCode.error,
    stateMicrosoft,
    stateLogin,
    setStateLogin,
    login,
    login_microsoft,
    reset_password,
    verify_code,
    logout,
    isAdmin,
    isAnalyst,
  };
}
