import { useState, useEffect, useContext } from 'react';
import useUserProfile from '../hooks/user/profile.jsx';
const motivationalPhrases = [
  "La justicia está de tu lado. Nosotros también.",
  "Cada deuda tiene una solución. Nosotros encontramos la tuya.",
  "Recupera lo que te pertenece con nuestra ayuda legal.",
  "Protegiendo tus derechos, asegurando tu futuro.",
  "Confía en los expertos para resolver tus problemas de crédito.",
  "Tu tranquilidad es nuestro compromiso."
];

function Home() {
  const [motivationalPhrase, setMotivationalPhrase] = useState("");
  const { name } = useUserProfile();

  useEffect(() => {
    const randomIndex = Math.floor(Math.random() * motivationalPhrases.length);
    setMotivationalPhrase(motivationalPhrases[randomIndex]);
  }, []);

  const handleDynamicClick = () => {
     };


  return (
    <section className="bg-white mt-12 text-center justify-center  flex flex-col items-center -ml-64">
      <div className="py-8 px-4 max-w-screen-xl text-center lg:py-16 z-10 relative container xs:mx-auto sm:mx-auto md:mx-auto lg:mx-36 xl:mx-64 lg:pl-80">
        <button
          onClick={handleDynamicClick}
          className="inline-flex justify-between items-center py-1 px-1 pe-4 mb-7 text-sm text-primary bg-blue/30 rounded-full dark:bg-blue-900 dark:text-blue-300 hover:bg-blue/40 sm:text-xs md:text-sm"
        >
          <span className="text-xs bg-blue rounded-full text-white px-4 py-1.5 me-3">¡Confía en ti!</span>
          <span className="text-sm font-medium">Empieza a trabajar ahora.</span>
          <svg className="w-2.5 h-2.5 ms-2 rtl:rotate-180" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 6 10">
            <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m1 9 4-4-4-4" />
          </svg>
        </button>

        <h1 className="mb-4 text-3xl font-extrabold tracking-tight leading-none text-primary dark:text-white sm:text-2xl md:text-5xl lg:text-6xl">Bienvenido {name || "Invitado"}</h1>
        <p className="mb-8 text-lg font-normal text-secondary lg:text-xl sm:px-12 lg:px-44 sm:text-sm md:text-base">{motivationalPhrase}</p>
        <form className="w-full max-w-md mx-auto sm:w-full md:w-3/4 lg:w-1/2">
          <div className="relative">
            <button
              onClick={handleDynamicClick}
              className="inline-flex justify-center items-center py-3 px-5 text-base font-medium text-center text-white rounded-lg bg-blue hover:bg-blue/80 sm:text-sm md:text-base"
            >
              Comenzar
              <svg className="w-3.5 h-3.5 ms-2 rtl:rotate-180" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 10">
                <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M1 5h12m0 0L9 1m4 4L9 9" />
              </svg>
            </button>
          </div>
        </form>
      </div>
      <div className="bg-white dark:from-blue-900 w-full h-full absolute top-0 left-0 z-0"></div>
    </section>
  );
}

export default Home;