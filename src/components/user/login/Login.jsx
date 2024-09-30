import { useState, useEffect } from 'react';
import useUser from "../../../hooks/user/auth.jsx";
import { Spinner } from "@nextui-org/react";
import { useNavigate } from 'react-router-dom';
import logo from "../../../assets/logo.png";
import eye from "../../../assets/ojo.png";
import closed_eye from "../../../assets/ojo2.png";
import microsoft from "../../../assets/microsoft.png";

function Login({ onLogin }) {
    const [isLoading, setIsLoading] = useState(true);
    const [showPassword, setShowPassword] = useState(false);
    const [gmail, setGmail] = useState("");
    const [password, setPassword] = useState("");
    const [usernameError, setUsernameError] = useState(false);
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

        if (gmail.trim() === "") {
            setUsernameError(true);
            isValid = false;
        } else {
            setUsernameError(false);
        }

        if (password.trim() === "") {
            setPasswordError(true);
            isValid = false;
        } else {
            setPasswordError(false);
        }

        if (isValid) {
            login({ gmail, password }).then(() => {
                navigate('/');
            });
        }
    };

    const handleMicrosoftLogin = () => {
        if (hasLoginError) {
            setStateLogin({ ...stateLogin, error: false });
        }
        login_microsoft();
    };


    const showPasswordError = formSubmitted && passwordError;
    const showUsernameError = formSubmitted && usernameError;

    if (isLoading) {
        return (
            <div className="flex items-center justify-center h-screen bg-primary">
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
                        <img src={logo} className="h-24 w-27 ml-3 -mt-4" />
                    </div>
                    <div className="flex flex-col items-center gap-1 mb-8">
                        <h1 className="text-xl text-blue font-bold">Bienvenido</h1>
                        <p className="text-secondary text-sm">Inicia sesión en tu cuenta</p>
                    </div>


                    <form className="flex flex-col gap-4 w-full" onSubmit={handleSubmit}>
                        <div className="w-full">
                            <input
                                type="email"
                                className={`w-full border py-2 px-4 rounded-md placeholder-secondary outline-none ${showUsernameError ? 'border-blue' : ''}`}
                                placeholder="Dirección de correo"
                                onChange={(e) => handleInputChange(e, setGmail, setUsernameError)}
                                value={gmail}
                            />
                            {showUsernameError && <span className="text-blue text-xs">Este campo es obligatorio</span>}
                        </div>
                        <div className="w-full relative">
                            <input
                                type={showPassword ? "text" : "password"}
                                className={`w-full border py-2 px-4 rounded-md placeholder-secondary outline-none ${showPasswordError ? 'border-blue' : ''}`}
                                placeholder="Contraseña"
                                onChange={(e) => handleInputChange(e, setPassword, setPasswordError)}
                                value={password}
                            />
                            <button
                                onClick={handleShowPassword}
                                className="absolute right-2 top-1/2 transform -translate-y-1/2"
                            >
                                <img
                                    src={showPassword ? closed_eye : eye}
                                    alt={showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}
                                    className="w-5 h-5"
                                />
                            </button>
                            {showPasswordError && <span className="text-blue text-xs">Este campo es obligatorio</span>}
                        </div>
                        <div className="w-full text-start -mt-4 mb-2">
                            <button type="button" className="text-sm text-primary hover:text-primary/70 transition-colors">
                                ¿Olvidaste Contraseña?
                            </button>
                        </div>
                        <div className="w-full">
                            <button
                                type="submit"
                                className="w-full bg-blue py-2 px-4 text-white rounded-md hover:bg-blue/70 transition-colors"
                            >
                                {isLoginLoading ? <Spinner size="sm" color="white" /> : 'Iniciar sesión'}
                            </button>
                            {formSubmitted && !usernameError && !passwordError && hasLoginError && (
                                <div className="mt-2 text-red-500 text-xs">
                                    <strong>Gmail o contraseña inválido</strong>
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
                            className="w-full bg-blue py-2 px-4 text-white rounded-md hover:bg-blue/70 transition-colors flex items-center justify-center gap-2"
                            onClick={handleMicrosoftLogin}
                        >
                            {!isMicrosoftLoading && (
                                <img src={microsoft} alt="Microsoft" className="w-5 h-5" />
                            )}
                            {isMicrosoftLoading ? <Spinner size="sm" color="white" /> : 'Continuar con Microsoft'}
                        </button>

                        {stateMicrosoft.error && (
                            <div className="mt-2 text-red-500 text-xs">
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
