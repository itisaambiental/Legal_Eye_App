import { useContext, useState, useEffect, useCallback } from 'react';
import Context from '../../context/userContext.jsx';
import login_user from '../../server/userService/login.js';
import verifyToken from '../../server/userService/verify_token.js';
import resetPassword from '../../server/userService/reset_password.js';
import { msalInstance } from '../../utils/msalConfig.js'; 
import login_user_microsoft from '../../server/userService/login_microsoft.js';
import sendNewPassword from '../../server/userService/sendNewPassword.js';

/**
 * Custom hook for managing user authentication and related operations.
 * @returns {Object} - Contains functions and states for user authentication, Microsoft login, password reset, and verification.
 */
export default function useUser() {
  const { jwt, updateUserContext, logout } = useContext(Context);
  const [stateLogin, setStateLogin] = useState({ loading: false, error: false });
  const [stateMicrosoft, setStateMicrosoft] = useState({ loading: false, error: false });
  const [stateResetPassword, setStateResetPassword] = useState({ loading: false, error: false });
  const [stateVerifyCode, setStateVerifyCode] = useState({ loading: false, error: false });

  /**
   * Initiates login process using email and password.
   * @param {Object} - User's email and password.
   */
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

  /**
   * Initiates Microsoft login process with popup authentication.
   */
  const login_microsoft = useCallback(async () => {
    if (stateMicrosoft.loading) return;
    setStateMicrosoft({ loading: true, error: null });
    try {
      const loginRequest = {
        scopes: ['openid', 'profile', 'User.Read']
      };
      await msalInstance.initialize();
      if (msalInstance.getActiveAccount()) {
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
        throw new Error('No se devolvió un token del backend');
      }
    } catch (error) {
      console.error('Error durante el inicio de sesión con Microsoft:', error)
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

  /**
   * Initiates password reset by sending a verification code.
   * @param {string} email - User's email address.
   * @param {boolean} [isResend=false] - Whether this is a resend request.
   * @returns {boolean} - Returns true if successful, false otherwise.
   */
  const reset_password = useCallback(async (email, isResend = false) => {
    setStateResetPassword({ loading: true, error: null });
  
    try {
      const response = await resetPassword(email);
      if (response === 200) {
        setStateResetPassword({ loading: false, error: null });
        return true;
      }
    } catch (error) {
      console.error('Error al restablecer contraseña:', error);
  
      const errorMessage = isResend
        ? 'Error al reenviar el código de verificación'
        : 'Error al enviar el código de verificación';
  
      setStateResetPassword({ loading: false, error: errorMessage });
      return false;
    }
  }, []);

  /**
   * Verifies the code sent to the user for password reset.
   * @param {string} gmail - User's email address.
   * @param {string} code - Verification code.
   * @returns {boolean} - Returns true if the code is valid, false otherwise.
   */
  const verify_code = useCallback(async (gmail, code) => {
    setStateVerifyCode({ loading: true, error: null });
  
    try {
      const response = await sendNewPassword(gmail, code); 
  
      if (response === 200) {
        setStateVerifyCode({ loading: false, error: null });
        return true;
      } else {
        throw new Error('Respuesta inesperada');
      }
    } catch (error) {
      if (error.response && error.response.status === 400 && error.response.data.message) {
        if (error.response.data.message === 'Código de verificación inválido') {
          setStateVerifyCode({ loading: false, error: 'Código inválido' });
        } else if (error.response.data.message === 'Código de verificación expirado') {
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
    setStateLogin,
    stateMicrosoft,
  };
}
