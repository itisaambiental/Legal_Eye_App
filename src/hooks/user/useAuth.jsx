import { useContext, useState, useCallback } from "react";
import Context from "../../context/userContext.jsx";
import login_user from "../../services/userService/login.js";
import resetPassword from "../../services/userService/reset_password.js";
import { msalInstance } from "../../config/msalConfig.js";
import login_user_microsoft from "../../services/userService/login_microsoft.js";
import sendNewPassword from "../../services/userService/sendNewPassword.js";
import AuthErrors from "../../errors/AuthErrors.js";

const loginRequest = {
  scopes: ["openid", "profile", "User.Read"],
  prompt: "select_account",
};

/**
 * Custom hook for managing user authentication and related operations.
 * @returns {Object} - Contains functions and states for user authentication, Microsoft login, password reset, and verification.
 */
export default function useAuth() {
  const { jwt, updateUserContext, logout } = useContext(Context);
  const [stateLogin, setStateLogin] = useState({
    loading: false,
    error: false,
  });
  const [stateMicrosoft, setStateMicrosoft] = useState({
    loading: false,
    error: false,
  });
  const [stateResetPassword, setStateResetPassword] = useState({
    loading: false,
    error: false,
  });
  const [stateVerifyCode, setStateVerifyCode] = useState({
    loading: false,
    error: false,
  });

  /**
   * Initiates login process using email and password.
   * @param {Object} - User's email and password.
   */
  const login = useCallback(
    async ({ email, password }) => {
      setStateLogin({ loading: true, error: false });
      return login_user({ email, password })
        .then((response) => {
          const token = response.token;
          if (token) {
            updateUserContext(token);
            setStateLogin({ loading: false, error: false });
          } else {
            logout();
            setStateLogin({ loading: false, error: true });
          }
        })
        .catch((err) => {
          logout();
          setStateLogin({ loading: false, error: true });
          console.error(err);
        });
    },
    [updateUserContext, logout]
  );

  /**
   * Initiates Microsoft login process with popup authentication.
   */
  const login_microsoft = useCallback(() => {
    if (stateMicrosoft.loading) return;
    setStateMicrosoft({ loading: true, error: null });
    return msalInstance
      .initialize()
      .then(() => {
        if (msalInstance.getActiveAccount()) {
          setStateMicrosoft({
            loading: false,
            error: "Una interacción de inicio de sesión ya está en progreso.",
          });
          return;
        }
        return msalInstance.loginPopup(loginRequest);
      })
      .then((loginResponse) => {
        const accessToken = loginResponse.accessToken;
        return login_user_microsoft({ accessToken });
      })
      .then((response) => {
        const token = response.token;
        if (token) {
          updateUserContext(token);
          setStateMicrosoft({ loading: false, error: null });
        } else {
          setStateMicrosoft({
            loading: false,
            error: "Error al iniciar sesión con Microsoft",
          });
        }
      })
      .catch((error) => {
        const errorCode = error.response?.status;
        const serverMessage = error.errorCode || error.response?.data?.message;
        const clientMessage = error.message;
        const handledError = AuthErrors.handleError({
          code: errorCode,
          error: serverMessage,
          httpError: clientMessage,
        });
        setStateMicrosoft({ loading: false, error: handledError.message });
        logout();
      });
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
      const success = await resetPassword(email);
      if (success) {
        setStateResetPassword({ loading: false, error: null });
        return true;
      }
    } catch (error) {
      const errorCode = error.response?.status;
      const serverMessage = error.response?.data?.message;
      const clientMessage = error.message;
      const handledError = AuthErrors.handleError({
        code: errorCode,
        error: serverMessage,
        httpError: clientMessage,
        isResend,
      });
      setStateResetPassword({ loading: false, error: handledError.message });
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
      const success = await sendNewPassword(gmail, code);
      if (success) {
        setStateVerifyCode({ loading: false, error: null });
        return true;
      }
    } catch (error) {
      const errorCode = error.response?.status;
      const serverMessage = error.response?.data?.message;
      const clientMessage = error.message;
      const handledError = AuthErrors.handleError({
        code: errorCode,
        error: serverMessage,
        httpError: clientMessage,
      });
      setStateVerifyCode({
        loading: false,
        error: handledError.message,
      });
      return false;
    }
  }, []);

  return {
    isLogged: Boolean(jwt) && jwt !== "" && jwt !== "null",
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
