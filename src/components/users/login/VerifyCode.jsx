import { useState, useEffect } from 'react';
import useUser from "../../../hooks/user/auth.jsx";
import { Spinner } from "@nextui-org/react";
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import logo from "../../../assets/logo.png";
import go_back from "../../../assets/volver.png";

function VerifyCode() {
    const [isLoading, setIsLoading] = useState(true);
    const [code, setCode] = useState("");
    const [codeError, setCodeError] = useState(false);
    const [formSubmitted, setFormSubmitted] = useState(false);
    const [timer, setTimer] = useState(60); 
    const { email } = useParams();
    const decodedEmail = decodeURIComponent(email);
    const {
        reset_password,
        isResetPasswordLoading,
        hasResetPasswordError,
        verify_code,
        isVerifyCodeLoading,
        hasVerifyCodeError
    } = useUser();

    const navigate = useNavigate();
    const location = useLocation();


    useEffect(() => {
        if (!location.state || !location.state.fromRequest) {
            navigate('/*', { replace: true });
        }
    }, [location, navigate]);


    useEffect(() => {
        if (timer > 0) {
            const countdown = setInterval(() => {
                setTimer((prev) => prev - 1);
            }, 1000);
            return () => clearInterval(countdown);
        }
    }, [timer]);

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

        if (code.trim() === "") {
            setCodeError(true);
            isValid = false;
        } else {
            setCodeError(false);
        }

        if (isValid) {
            const success = await verify_code(email, code);
            if (success) {
                navigate(`/reset-password/complete`, { state: { fromVerify: true } });

            }
        }
    };

    const handleResendCode = async () => {
        const success = await reset_password(decodedEmail, true);
        if (success) {
            setTimer(60);
        } 
    };

    const handleGoToResetPassword = () => {
        navigate('/reset-password/request', { state: { fromVerify: true } });
    };

    const showCodeError = formSubmitted && codeError;

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

                <div className="bg-white w-full rounded-xl p-8 mb-8 relative flex flex-col items-center">
                    <div className="flex justify-center"></div>
                    <div className="w-full text-start -mt-4 mb-2">
                        <button onClick={handleGoToResetPassword} type="button" className="text-sm text-primary hover:text-primary/60 transition-colors flex items-center gap-2">
                            <img src={go_back} alt="Volver al inicio" className="w-6 h-6 inline-block" />
                            <span>Volver</span>
                        </button>
                    </div>
                    <div className="flex justify-center">
                    <img src={logo} className="h-24 w-24 ml-3 -mt-4" />
                   </div>
                    <div className="flex flex-col items-center gap-1 mb-8">
                        <h1 className="text-xl text-primary font-bold">Código enviado</h1>
                        <p className="text-secondary text-sm text-center mb-4">
                            Se ha enviado un código de seguridad a la dirección de correo
                            <span className="text-primary text-sm font-medium"> {decodedEmail} </span>.
                            Revísalo y pégalo abajo.
                        </p>
                        <h1 className="text-sm text-primary font-bold">
                            El código expira dentro de: {Math.floor(timer / 60)}:{("0" + (timer % 60)).slice(-2)}
                        </h1>
                    </div>

                    <form className="flex flex-col gap-4 w-full" onSubmit={handleSubmit}>
                        <div className="w-full">
                            <input
                                type="text"
                                className={`w-full border py-2 px-4 rounded-md placeholder-secondary outline-none ${showCodeError ? 'border-primary' : ''}`}
                                placeholder="XXXXXX"
                                onChange={(e) => handleInputChange(e, setCode, setCodeError)}
                                value={code}
                            />
                            {showCodeError && <span className="text-primary text-xs">Este campo es obligatorio</span>}
                        </div>

                        <div className="w-full">
                            <button
                                type="submit"
                                className="w-full bg-primary py-2 px-4 text-white rounded-md hover:bg-primary/70 transition-colors"
                            >
                                {isVerifyCodeLoading ? <Spinner size="sm" color="white" /> : 'Verificar Código'}
                            </button>
                        </div>
                        {hasVerifyCodeError && (
                            <div className="mt-2 text-red text-xs">
                                <strong>{hasVerifyCodeError}</strong>
                            </div>
                        )}


                        <div className="w-full text-start mt-2">
                            <button
                                type="button"
                                className="text-sm text-primary hover:underline transition-colors"
                                onClick={handleResendCode}
                                disabled={timer > 0 || isResetPasswordLoading} 
                            >
                                Reenviar Código {timer > 0 && `(${timer}s)`}
                            </button>

                        {hasResetPasswordError && (
                            <div className="mt-2 text-red text-xs">
                                <strong>{hasResetPasswordError}</strong>
                            </div>
                        )}

                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}

export default VerifyCode;
