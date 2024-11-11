/* eslint-disable no-undef */
import { render, screen, fireEvent } from "@testing-library/react";
import Error from "./Error.jsx";

describe("Error Component", () => {
  test("displays network error message correctly", () => {
    render(<Error title="Error de conexión" message="Revisa tu conexión a Internet e intenta de nuevo." />);
    expect(screen.getByText("Error de conexión")).toBeInTheDocument();
    expect(screen.getByText("Revisa tu conexión a Internet e intenta de nuevo.")).toBeInTheDocument();
  });

  test("displays unauthorized access message correctly", () => {
    render(<Error title="Acceso no autorizado" message="Asegúrate de tener los permisos necesarios." />);
    expect(screen.getByText("Acceso no autorizado")).toBeInTheDocument();
    expect(screen.getByText("Asegúrate de tener los permisos necesarios.")).toBeInTheDocument();
  });

  test("displays server error message correctly", () => {
    render(<Error title="Error en el servidor" message="Por favor, intenta nuevamente más tarde." />);
    expect(screen.getByText("Error en el servidor")).toBeInTheDocument();
    expect(screen.getByText("Por favor, intenta nuevamente más tarde.")).toBeInTheDocument();
  });

  test("displays default error message correctly", () => {
    render(<Error title="Algo mal sucedió" message="Por favor, espere un momento e intenta nuevamente." />);
    expect(screen.getByText("Algo mal sucedió")).toBeInTheDocument();
    expect(screen.getByText("Por favor, espere un momento e intenta nuevamente.")).toBeInTheDocument();
  });

  test("calls window.location.reload when retry button is clicked", () => {
    const originalLocation = window.location;
    delete window.location;
    window.location = { reload: vi.fn() };
    render(<Error title="Error de conexión" message="Revisa tu conexión a Internet e intenta de nuevo." />);
    const retryButton = screen.getByText("Intentar de nuevo");
    fireEvent.click(retryButton);
  
    expect(window.location.reload).toHaveBeenCalled();
    window.location = originalLocation;
  });
});
