import { useState, useEffect } from 'react';
import useUser from "../../../hooks/user/auth.jsx";
import { Spinner } from "@nextui-org/react";
import { useNavigate } from 'react-router-dom';
import logo from "../../../assets/logo.png";
import eye from "../../../assets/ojo.png";
import closed_eye from "../../../assets/ojo2.png";
import microsoft from "../../../assets/microsoft.png";

/**
 * Login component
 * 
 * This component provides the user interface for logging into the application.
 * It includes fields for email and password input, with client-side validation.
 * Users can also log in using their Microsoft account. If login is successful,
 * the user is redirected to the home page, and any login errors are displayed.
 * 
 * Props:
 * - onLogin (function): Optional callback function triggered after successful login.
 * 
 * @component
 * @example
 * 
 * @returns {JSX.Element} - Rendered Login component.
 */

// eslint-disable-next-line react/prop-types
function Login({ onLogin }) {
    const [isLoading, setIsLoading] = useState(true);
    const [showPassword, setShowPassword] = useState(false);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [emailError, setemailError] = useState(false);
    const [passwordError, setPasswordError] = useState(false);
    const [formSubmitted, setFormSubmitted] = useState(false);

    const {
        isLoginLoading,
        hasLoginError,
        isMicrosoftLoading,
        stateMicrosoft,
        login,
        login_microsoft,
        setStateLogin,
        stateLogin,
        setStateMicrosoft,
        isLogged,
        isAdmin,
        isAnalyst
    } = useUser();

    const navigate = useNavigate();

    useEffect(() => {
        setIsLoading(true);
        const timeout = setTimeout(() => {
            setIsLoading(false);
        }, 0);
        return () => clearTimeout(timeout);
    }, []);

    useEffect(() => {
        if (isLogged) {
            navigate('/');
            onLogin && onLogin();
        }
    }, [isLogged, isAdmin, isAnalyst, navigate, onLogin]);

    const handleShowPassword = (event) => {
        event.preventDefault();
        setShowPassword(!showPassword);
    };

    const handleInputChange = (e, setInput, setError) => {
        setFormSubmitted(false);
        setInput(e.target.value);
        setError(false);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        setFormSubmitted(true);

        if (stateMicrosoft.error) {
            setStateMicrosoft({ ...stateMicrosoft, error: null });
        }

        let isValid = true;

        if (email.trim() === "") {
            setemailError(true);
            isValid = false;
        } else {
            setemailError(false);
        }

        if (password.trim() === "") {
            setPasswordError(true);
            isValid = false;
        } else {
            setPasswordError(false);
        }

        if (isValid) {
            login({ email, password })
        }
    };

    const handleMicrosoftLogin = () => {
        if (hasLoginError) {
            setStateLogin({ ...stateLogin, error: false });
        }
        login_microsoft();
    };

    const handleResetPassword = () => {
        navigate('/reset-password/request', { state: { fromLogin: true } });
    };


    const showPasswordError = formSubmitted && passwordError;
    const showUsernameError = formSubmitted && emailError;

    if (isLoading) {
        return (
            <div  role="status" className="flex items-center justify-center h-screen bg-primary">
                <Spinner className="h-10 w-10 ml-4" color="white" />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-primary flex flex-col items-center justify-center p-4 z-99">
            <div className="max-w-lg mb-auto relative mt-20 w-full" >
                <div className="flex justify-center"></div>
                <div className="bg-white w-full rounded-xl p-8 mb-8 relative flex flex-col items-center">
                    <div className="flex justify-center">
                        <img src={logo} className="h-24 w-24 ml-3 -mt-4" />
                    </div>
                    <div className="flex flex-col items-center gap-1 mb-8">
                        <h1 className="text-xl text-primary font-bold">Bienvenido</h1>
                        <p className="text-secondary text-sm">Inicia sesión en tu cuenta</p>
                    </div>


                    <form className="flex flex-col gap-4 w-full" onSubmit={handleSubmit}>
                        <div className="w-full">
                            <input
                                type="email"
                                className={`w-full border py-2 px-4 rounded-md placeholder-secondary outline-none ${showUsernameError ? 'border-primary' : ''}`}
                                placeholder="Dirección de correo"
                                onChange={(e) => handleInputChange(e, setEmail, setemailError)}
                                value={email}
                            />
                            {showUsernameError && <span className="text-primary text-xs">Este campo es obligatorio</span>}
                        </div>
                        <div className="w-full relative">
                            <input
                                type={showPassword ? "text" : "password"}
                                className={`w-full border py-2 px-4 rounded-md placeholder-secondary outline-none ${showPasswordError ? 'border-primary' : ''}`}
                                placeholder="Contraseña"
                                onChange={(e) => handleInputChange(e, setPassword, setPasswordError)}
                                value={password}
                            />
                            <button
                                onClick={handleShowPassword}
                                className={`absolute right-2 transform -translate-y-1/2 ${showUsernameError || showPasswordError ? 'top-1/3' : 'top-1/2'
                                    }`}
                            >
                                <img
                                    src={showPassword ? eye : closed_eye}
                                    alt={showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}
                                    className="w-5 h-5"
                                />
                            </button>
                            {showPasswordError && <span className="text-primary text-xs">Este campo es obligatorio</span>}
                        </div>
                        <div className="w-full text-start -mt-4 mb-2">
                            <button onClick={handleResetPassword} disabled={isMicrosoftLoading || isLoginLoading} type="button" className="text-sm text-primary hover:text-primary/60 transition-colors">
                                ¿Olvidaste tu contraseña?
                            </button>
                        </div>
                        <div className="w-full">
                            <button
                                type="submit"
                                disabled={isMicrosoftLoading || isLoginLoading}
                                className="w-full bg-primary py-2 px-4 text-white rounded-md hover:bg-primary/70 transition-colors"
                            >
                                {isLoginLoading ? <Spinner size="sm" color="white" /> : 'Iniciar sesión'}
                            </button>
                            {formSubmitted && !emailError && !passwordError && hasLoginError && (
                                <div className="mt-2 text-red text-xs">
                                    <strong>Dirección de correo o contraseña inválido</strong>
                                </div>
                            )}

                        </div>
                    </form>

                    <div className="w-full text-center my-4 flex items-center">
                        <hr className="border-t border-primary/40 flex-grow" />
                        <span className="px-4 text-sm text-primary">O</span>
                        <hr className="border-t border-primary/40 flex-grow" />
                    </div>


                    <div className="w-full">
                        <button
                            type="button"
                            disabled={isMicrosoftLoading || isLoginLoading}
                            className="w-full bg-primary py-2 px-4 text-white rounded-md hover:bg-primary/70 transition-colors flex items-center justify-center gap-2"
                            onClick={handleMicrosoftLogin}
                        >
                            {!isMicrosoftLoading && (
                                <img src={microsoft} alt="Microsoft" className="w-5 h-5" />
                            )}
                            {isMicrosoftLoading ? <Spinner size="sm" color="white" /> : 'Continuar con Microsoft'}
                        </button>

                        {stateMicrosoft.error && (
                            <div className="mt-2 text-red text-xs">
                                <strong>{stateMicrosoft.error}</strong>
                            </div>
                        )}

                    </div>
                </div>
            </div>
        </div>
    );
}

export default Login;
