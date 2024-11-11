import useUserProfile from '../hooks/user/profile.jsx';
import { useNavigate } from 'react-router-dom';
import Error from './utils/Error.jsx';
import { Spinner } from '@nextui-org/react';

/**
 * Home component
 * Displays a welcome message for the user and provides navigation options to start working.
 * @component
 * @returns {JSX.Element} The rendered Home component.
 */
function Home() {
  const { name, loading, error } = useUserProfile();
  const navigate = useNavigate();

  
  const handleDynamicClick = () => {
    navigate('/legal_basis');
  };

  if (loading) {
    return (
      <div role="status" className="fixed inset-0 flex items-center justify-center">
        <Spinner className="h-10 w-10 transform translate-x-0 lg:translate-x-28 xl:translate-x-32" color="secondary" />
      </div>
    );
  }

  if (error) {
    return <Error title={error.title} message={error.message} />;
  }

  return (
    <section className="bg-gray-50 mt-12 text-center justify-center  flex flex-col items-center -ml-64">
      <div className="py-8 px-4 max-w-screen-xl text-center lg:py-16 z-10 relative container xs:mx-auto sm:mx-auto md:mx-auto lg:mx-36 xl:mx-64 lg:pl-80">
        <button
          onClick={handleDynamicClick}
          className="inline-flex justify-between items-center py-1 px-1 pe-4 mb-7 text-sm text-primary bg-secondary/30 rounded-full dark:bg-primary-900 dark:text-primary-300 hover:bg-primary/40 sm:text-xs md:text-sm"
        >
          <span className="text-xs bg-secondary rounded-full text-white px-4 py-1.5 me-3">¡Confía en ti!</span>
          <span className="text-sm font-medium">Empieza a trabajar ahora.</span>
          <svg className="w-2.5 h-2.5 ms-2 rtl:rotate-180" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 6 10">
            <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m1 9 4-4-4-4" />
          </svg>
        </button>

        <h1 className="mb-4 text-3xl font-extrabold tracking-tight leading-none text-primary dark:text-white sm:text-2xl md:text-5xl lg:text-6xl">Bienvenido {name || "Invitado"}</h1>
        <p className="mb-8 text-lg font-normal text-secondary lg:text-xl sm:px-12 lg:px-44 sm:text-sm md:text-base">Dale click aca abajo para empezar</p>
        <form className="w-full max-w-md mx-auto sm:w-full md:w-3/4 lg:w-1/2">
          <div className="relative">
            <button
              onClick={handleDynamicClick}
              className="inline-flex justify-center items-center py-3 px-5 text-base font-medium text-center text-white rounded-lg bg-primary hover:bg-primary/80 sm:text-sm md:text-base"
            >
              Comenzar
              <svg className="w-3.5 h-3.5 ms-2 rtl:rotate-180" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 10">
                <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M1 5h12m0 0L9 1m4 4L9 9" />
              </svg>
            </button>
          </div>
        </form>
      </div>
      <div className="bg-gray-50  dark:from-primary-900 w-full h-full absolute top-0 left-0 z-0"></div>
    </section>
  );
}

export default Home;