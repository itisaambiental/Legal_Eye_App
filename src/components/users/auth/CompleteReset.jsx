import { useState, useEffect } from "react";
import { Spinner } from "@heroui/react";
import { useNavigate, useLocation } from "react-router-dom";
import logo from "../../../assets/logo.png";

/**
 * CompleteReset component
 * This component provides the interface shown after a successful password reset.
 * It displays a confirmation message and allows the user to navigate back to the login page.
 * If accessed without a proper reset process, it redirects the user to a not-found page.
 *
 * @component
 * @returns {JSX.Element} - Rendered CompleteReset component.
 */
function CompleteReset() {
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingToLogin, setIsLoadingToLogin] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (!location.state || !location.state.fromVerify) {
      navigate("/*", { replace: true });
    }
  }, [location, navigate]);

  useEffect(() => {
    setIsLoading(true);
    const timeout = setTimeout(() => {
      setIsLoading(false);
    }, 0);
    return () => clearTimeout(timeout);
  }, []);

  const handleGoToLogin = async () => {
    setIsLoadingToLogin(true);
    navigate("/login");
    setIsLoadingToLogin(false);
  };

  if (isLoading) {
    return (
      <div
        role="status"
        className="flex items-center justify-center h-screen bg-primary"
      >
        <Spinner className="h-10 w-10 ml-4" color="white" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-primary flex flex-col items-center justify-center p-4 z-99">
      <div className="max-w-lg mb-auto relative mt-20 w-full">
        <div className="bg-white w-full rounded-xl p-8 mb-8 relative flex flex-col items-center">
          <div className="flex justify-center"></div>
          <div className="flex justify-center">
            <img src={logo} className="h-24 w-24 ml-3 -mt-4" />
          </div>
          <div className="flex flex-col items-center gap-1 mb-8">
            <h1 className="text-xl text-primary font-bold">
              Contraseña Actualizada
            </h1>
            <p className="text-secondary text-sm text-center mb-4">
              Se te ha enviado un correo electrónico con tu nueva contraseña.
            </p>
          </div>

          <form className="flex flex-col gap-4 w-full">
            <div className="w-full"></div>

            <div className="w-full">
              <button
                type="button"
                onClick={handleGoToLogin}
                className="w-full bg-primary py-2 px-4 text-white rounded-md hover:bg-primary/70 transition-colors"
              >
                {isLoadingToLogin ? (
                  <Spinner role="status" size="sm" color="white" />
                ) : (
                  "Ir al Inicio de Sesión"
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default CompleteReset;
