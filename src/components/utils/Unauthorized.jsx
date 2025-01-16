/**
 * Unauthorized component that displays a 401 error message when a user lacks permission.
 * Provides a user-friendly message indicating that access to the page is restricted.
 *
 * @component
 * @returns {JSX.Element} A styled 401 error page with a permission message.
 */
function Unauthorized() {
  return (
    <div className="flex items-center justify-center h-screen bg-primary text-white font-bold">
      <div className="text-center">
        <h1 className="text-4xl font-bold">401</h1>
        <p className="text-lg font-medium">
          No tienes permiso para entrar a esta página.
        </p>
      </div>
    </div>
  );
}

export default Unauthorized;
