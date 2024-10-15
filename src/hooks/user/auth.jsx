import { useContext, useState, useEffect, useCallback } from 'react';
import Context from '../../context/userContext.jsx';
import login_user from '../../server/userService/login.js';
import verifyToken from '../../server/userService/verify_token.js';
import resetPassword from '../../server/userService/reset_password.js';
import { msalInstance } from '../../utils/msalConfig.js'; 
import login_user_microsoft from '../../server/userService/login_microsoft.js';
import sendNewPassword from '../../server/userService/sendNewPassword.js';


export default function useUser() {
  const { jwt, updateUserContext, logout } = useContext(Context);
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
          updateUserContext(token); 
          setStateLogin({ loading: false, error: false });
        } else {
          logout();
          setStateLogin({ loading: false, error: true });
        }
      })
      .catch(err => {
        logout();
        setStateLogin({ loading: false, error: true });
        console.error(err);
      });
  }, [updateUserContext, logout]);

 
  const login_microsoft = useCallback(async () => {
    if (stateMicrosoft.loading) return;
  
    setStateMicrosoft({ loading: true, error: null });
  
    try {
      const loginRequest = {
        scopes: ['openid', 'profile', 'User.Read']
      };
  
      await msalInstance.initialize();

      if (msalInstance.getActiveAccount()) {
        console.warn("Login is already in progress.");
        setStateMicrosoft({ loading: false, error: 'Una interacción de inicio de sesión ya está en progreso.' });
        return;
      }
  
      const loginResponse = await msalInstance.loginPopup(loginRequest);
      const accessToken = loginResponse.accessToken;
  
      const response = await login_user_microsoft({ accessToken });
      const token = response.token;
  
      if (token) {
        updateUserContext(token);
        setStateMicrosoft({ loading: false, error: null });
      } else {
        throw new Error('No token returned from backend');
      }
    } catch (error) {
      console.error('Error during Microsoft login:', error);
  
      let errorMessage = 'Error al iniciar sesión con Microsoft';
      if (error.errorCode === 'user_cancelled') {
        errorMessage = null; 
      } else if (error.message.includes('interaction_in_progress')) {
        errorMessage = 'Una interacción de inicio de sesión ya está en progreso.';
      } else if (error.response && error.response.status === 401 && error.response.data.message === 'Invalid email') {
        errorMessage = 'Dirección de correo no válida';
      }
  
      setStateMicrosoft({ loading: false, error: errorMessage });
      logout();
    }
  }, [updateUserContext, stateMicrosoft, logout]);
  
  

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
    isResetPasswordLoading: stateResetPassword.loading,
    hasResetPasswordError: stateResetPassword.error,
    isVerifyCodeLoading: stateVerifyCode.loading,
    hasVerifyCodeError: stateVerifyCode.error,
    login,
    login_microsoft,
    reset_password,
    verify_code,
    setStateMicrosoft,
    stateMicrosoft,
  };
}
