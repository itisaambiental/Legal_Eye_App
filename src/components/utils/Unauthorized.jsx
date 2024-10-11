function Unauthorized() {
    return (
      <div className="flex items-center justify-center h-screen bg-primary text-white font-bold">
        <div className="text-center">
          <h1 className="text-4xl text font-bold-">401</h1>
          <p className="text-lg font-medium">No tienes permiso para entrar a esta página.</p>
        </div>
      </div>
    );
  }
  
  export default Unauthorized;