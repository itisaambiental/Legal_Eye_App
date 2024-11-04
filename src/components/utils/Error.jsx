/* eslint-disable react/prop-types */
/**
 * Error component for displaying error messages based on specific error types.
 * Offers a user-friendly message and a button to reload the page.
 * 
 * @component
 * @param {Object} props - Component props.
 * @param {string} props.message - The error message to be displayed and used for determining the type of error.
 * 
 * @returns {JSX.Element} A styled error message component with a reload button.
 */
function Error(props) {
  const { message } = props;

    /**
   * Reloads the page when the user clicks the "Retry" button.
   */
  const handleReload = () => {
    window.location.reload();
  };

  let displayMessage;
  
  if (message === 'Network error') {
    displayMessage = "Error de conexión. Revisa tu conexión a Internet e intenta de nuevo.";
  } else if (message === 'Unauthorized access') {
    displayMessage = "Recurso no permitido. Asegúrate de tener los permisos necesarios.";
  } else if (message === 'Server error') {
    displayMessage = "Error en el servidor. Por favor, intenta nuevamente más tarde.";
  } else {
    displayMessage = "Algo mal sucedió. Por favor, espere un momento e intenta nuevamente.";
  }
  return (
    <div className="flex justify-center items-center h-screen -mt-24 -ml-60 mr-4 lg:-ml-0 lg:mr-0 xl:-ml-0 xl:mr-0">
      <div className="p-4 mb-4 text-red/80 border border-red/30 rounded-lg bg-red/10 max-w-md">
        <div className="flex items-center">
          <svg
            className="flex-shrink-0 w-4 h-4 me-2"
            aria-hidden="true"
            xmlns="http://www.w3.org/2000/svg"
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5ZM9.5 4a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3ZM12 15H8a1 1 0 0 1 0-2h1v-3H8a1 1 0 0 1 0-2h2a1 1 0 0 1 1 1v4h1a1 1 0 0 1 0 2Z"/>
          </svg>
          <span className="sr-only">Error</span>
          <h3 className="text-lg font-medium">{message}</h3>
        </div>
        <div className="mt-2 mb-4 text-sm">
          {displayMessage}
        </div>
        <div className="flex justify-end">
          <button
            type="button"
            className="text-red/80 bg-transparent border border-red/70 hover:bg-red/90 hover:text-white focus:outline-none font-medium rounded-lg text-xs px-3 py-1.5 text-center"
            onClick={handleReload}
          >
            Intentar de nuevo
          </button>
        </div>
      </div>
    </div>
  );
}

export default Error;