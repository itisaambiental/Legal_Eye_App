import useUserProfile from "../hooks/user/useUserProfile.jsx";
import { Button } from "@nextui-org/react";
import { useNavigate } from "react-router-dom";
import Error from "./utils/Error.jsx";
import { Spinner } from "@nextui-org/react";
import search_icon from "../assets/busqueda_blue.png";
import time_icon from "../assets/time.png";
import play_icon from "../assets/play.png";


/**
 * Home component
 * Displays a welcome message for the user and provides navigation options to start working.
 * @component
 * @returns {JSX.Element} The rendered Home component.
 */
function Home() {
  const { loading, error } = useUserProfile();
  const navigate = useNavigate();

  const handleClick = () => {
    navigate("/legal_basis");
  };

  if (loading) {
    return (
      <div
        role="status"
        className="fixed inset-0 flex items-center justify-center"
      >
        <Spinner
          className="h-10 w-10 transform translate-x-0 lg:translate-x-28 xl:translate-x-32"
          color="secondary"
        />
      </div>
    );
  }

  if (error) {
    return <Error title={error.title} message={error.message} />;
  }

  return (
    <div className="flex flex-col min-h-screen">
      <section className="flex-grow bg-gray-50 mt-12 text-center flex flex-col items-center -ml-64 px-4 sm:px-6 lg:px-8">
        <div className="py-8 px-4 max-w-screen-xl text-center lg:py-16 z-10 relative container xs:mx-auto sm:mx-auto md:mx-auto lg:mx-36 xl:mx-64 lg:pl-80">
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-8 md:p-12 mb-8">
          <Button
                onPress={handleClick}
                className="-mt-8 mb-4"
                size="sm"
                variant="flat"
                radius="full"
                startContent={
                  <img
                    src={play_icon}
                    alt="Search Icon"
                    className="w-4 h-4 flex-shrink-0"
                  />
                }
              >
                <span className="text-primary">Comienza</span>
              </Button>
            <h1 className="text-primary text-4xl font-extrabold mb-2">
              Comienza a analizar fundamentos legales
            </h1>
            <p className="text-lg font-normal text-gray-500 mb-8">
              Analiza fundamentos legales de manera instantánea. Obtén
              respuestas precisas usando IA y ahorra tiempo en tu flujo de
              trabajo.
            </p>
            <Button onPress={handleClick} color="primary">Pruébalo ahora</Button>
          </div>
          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-8 md:p-12">
              <Button
                onPress={handleClick}
                className="-mt-8 mb-4"
                size="sm"
                variant="flat"
                radius="full"
                startContent={
                  <img
                    src={search_icon}
                    alt="Search Icon"
                    className="w-4 h-4 flex-shrink-0"
                  />
                }
              >
                <span className="text-primary">Analizar</span>
              </Button>
              <h2 className="text-gray-900 text-3xl font-extrabold mb-2">
                Análisis legal en segundos
              </h2>
              <p className="text-lg font-normal text-gray-500 mb-4">
                Ingresa cualquier documento y obtén un análisis automático con
                sus artículos relevantes.
              </p>
              <a
                onClick={handleClick}
                className="text-primary hover:underline font-medium text-lg inline-flex items-center"
              >
                Hazlo ahora
                <svg
                  className="w-3.5 h-3.5 ms-2 rtl:rotate-180"
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 14 10"
                >
                  <path
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M1 5h12m0 0L9 1m4 4L9 9"
                  />
                </svg>
              </a>
            </div>

            <div className="bg-gray-50 border border-gray-200 rounded-lg p-8 md:p-12">
              <Button
                onPress={handleClick}
                className="-mt-8 mb-4"
                size="sm"
                variant="flat"
                radius="full"
                startContent={
                  <img
                    src={time_icon}
                    alt="Search Icon"
                    className="w-4 h-4 flex-shrink-0"
                  />
                }
              >
                <span className="text-primary">Ahorrar</span>
              </Button>
              <h2 className="text-gray-900 text-3xl font-extrabold mb-2">
                Ahorra tiempo y esfuerzo
              </h2>
              <p className="text-lg font-normal text-gray-500 mb-4">
                Evite búsquedas largas. Nuestro objetivo es facilitarle el
                trabajo para que solo tenga que revisar los resultados clave.
              </p>
              <a
                onClick={handleClick}
                className="text-primary hover:underline font-medium text-lg inline-flex items-center"
              >
                Aprende más
                <svg
                  className="w-3.5 h-3.5 ms-2 rtl:rotate-180"
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 14 10"
                >
                  <path
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M1 5h12m0 0L9 1m4 4L9 9"
                  />
                </svg>
              </a>
            </div>
          </div>
        </div>
        <div className="bg-gray-50 w-full h-full absolute top-0 left-0 z-0"></div>
      </section>
    </div>
  );
}

export default Home;
