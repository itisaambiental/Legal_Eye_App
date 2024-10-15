/* eslint-disable no-undef */
import { render, screen, fireEvent } from "@testing-library/react";
import Error from "./Error.jsx";

describe("Error Component", () => {
  test("displays network error message correctly", () => {
    render(<Error message="Network error" />);
    expect(screen.getByText("Error de conexión. Revisa tu conexión a Internet e intenta de nuevo.")).toBeInTheDocument();
  });

  test("displays unauthorized access message correctly", () => {
    render(<Error message="Unauthorized access" />);
    expect(screen.getByText("Recurso no permitido. Asegúrate de tener los permisos necesarios.")).toBeInTheDocument();
  });

  test("displays server error message correctly", () => {
    render(<Error message="Server error" />);
    expect(screen.getByText("Error en el servidor. Por favor, intenta nuevamente más tarde.")).toBeInTheDocument();
  });

  test("displays default error message correctly", () => {
    render(<Error message="Some other error" />);
    expect(screen.getByText("Algo mal sucedió. Por favor, espere un momento e intenta nuevamente.")).toBeInTheDocument();
  });

  test("displays default error message correctly", () => {
    render(<Error message="Some other error" />);
    expect(screen.getByText("Algo mal sucedió. Por favor, espere un momento e intenta nuevamente.")).toBeInTheDocument();
  });


  test("calls window.location.reload when retry button is clicked", () => {
    const originalLocation = window.location;
    delete window.location;
    window.location = { reload: vi.fn() };
    render(<Error message="Network error" />);
    const retryButton = screen.getByText("Intentar de nuevo");
    fireEvent.click(retryButton);
  
    expect(window.location.reload).toHaveBeenCalled();
    window.location = originalLocation;
  });
  
});

