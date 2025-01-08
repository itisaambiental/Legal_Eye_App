import { useState, useEffect } from 'react';
import useAuth from "../../../hooks/user/useAuth.jsx";
import { Spinner } from "@nextui-org/react";
import { useNavigate, useLocation } from 'react-router-dom';
import logo from "../../../assets/logo.png";
import go_back from "../../../assets/volver.png";

/**
 * ResetPassword component
 * 
 * This component provides an interface for users to initiate a password reset process.
 * It includes an input for the user's email address and submits a request to send a verification code 
 * to the provided email. Upon successful submission, the user is redirected to a verification page.
 * 
 * @component
 * 
 * @returns {JSX.Element} - Rendered ResetPassword component.
 */

function ResetPassword() {
    const [isLoading, setIsLoading] = useState(true);
    const [email, setEmail] = useState("");
    const [usernameError, setUsernameError] = useState(false);
    const [formSubmitted, setFormSubmitted] = useState(false);
    const {
        reset_password,
        isResetPasswordLoading,
        hasResetPasswordError
    } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        if (!location.state || (!location.state.fromLogin && !location.state.fromVerify)) {
            navigate('/*', { replace: true });
        }
    }, [location, navigate]);



    useEffect(() => {
        setIsLoading(true);
        const timeout = setTimeout(() => {
            setIsLoading(false);
        }, 0);
        return () => clearTimeout(timeout);
    }, []);


    const handleInputChange = (e, setInput, setError) => {
        setFormSubmitted(false);
        setInput(e.target.value);
        setError(false);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setFormSubmitted(true);

        let isValid = true;

        if (email.trim() === "") {
            setUsernameError(true);
            isValid = false;
        } else {
            setUsernameError(false);
        }

        if (isValid) {
            const success = await reset_password(email);
            if (success) {
                const encodedEmail = encodeURIComponent(email);
                navigate(`/reset-password/verify/${encodedEmail}`, { state: { fromRequest: true } });

            }
        }
    };

    const handleGoToLogin = () => {
        navigate('/login');
    };

    const showEmailError = formSubmitted && usernameError;

    if (isLoading) {
        return (
            <div role='status' className="flex items-center justify-center h-screen bg-primary">
                <Spinner className="h-10 w-10 ml-4" color="white" />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-primary flex flex-col items-center justify-center p-4 z-99">
            <div className="max-w-lg mb-auto relative mt-20 w-full" >

                <div className="bg-white w-full rounded-xl p-8 mb-8 relative flex flex-col items-center">
                    <div className="w-full text-start -mt-4 mb-2">
                        <button onClick={handleGoToLogin} type="button" className="text-sm text-primary hover:text-primary/60 transition-colors flex items-center gap-2">
                            <img src={go_back} alt="Volver al inicio" className="w-6 h-6 inline-block" />
                            <span>Volver al inicio</span>
                        </button>
                    </div>
                    <div className="flex justify-center">
                        <img src={logo} className="h-24 w-24 ml-3 -mt-4" />
                    </div>
                    <div className="flex flex-col items-center gap-1 mb-8">
                        <h1 className="text-xl text-primary font-bold">Restablece tu contraseña</h1>
                        <p className="text-secondary text-sm text-center">Ingrese su dirección de correo electrónico y le enviaremos el código de verificación para restablecer su contraseña.</p>
                    </div>


                    <form className="flex flex-col gap-4 w-full" onSubmit={handleSubmit}>
                        <div className="w-full">
                            <input
                                type="email"
                                className={`w-full border py-2 px-4 rounded-md placeholder-secondary outline-none ${showEmailError ? 'border-primary' : ''}`}
                                placeholder="Dirección de correo"
                                onChange={(e) => handleInputChange(e, setEmail, setUsernameError)}
                                value={email}
                            />
                            {showEmailError && <span className="text-primary text-xs">Este campo es obligatorio</span>}
                        </div>

                        <div className="w-full">
                            <button
                                type="submit"
                                className="w-full bg-primary py-2 px-4 text-white rounded-md hover:bg-primary/70 transition-colors"
                            >
                                {isResetPasswordLoading ? <Spinner size="sm" color="white" /> : 'Enviar Email'}
                            </button>
                        </div>

                        {hasResetPasswordError && (
                            <div className="mt-2 text-red text-xs">
                                <strong>{hasResetPasswordError}</strong>
                            </div>
                        )}

                    </form>

                </div>
            </div>
        </div>
    );
}

export default ResetPassword;
