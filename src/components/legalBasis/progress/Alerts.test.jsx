/* eslint-disable no-undef */
import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import Alerts from "./Alerts";
import {
  ExtractArticlesErrors,
  ExtractArticlesStatus,
} from "../../../errors/articles/ExtractArticles.js";

describe("Alerts Component", () => {
  const mockProps = {
    status: "",
    cancelState: {
      isCancelling: false,
      cancelError: null,
      cancelErrorStatus: null,
      cancelMessage: null,
      isCancelled: false,
    },
    error: null,
    errorStatus: null,
    message: "Proceso en ejecución",
    onCancel: vi.fn(),
    onRetry: vi.fn(),
    onComplete: vi.fn(),
    onClose: vi.fn(),
    labelButton: "Aceptar",
  };

  afterEach(() => {
    vi.clearAllMocks();
  });

  it("renders cancellation in progress message", () => {
    render(
      <Alerts
        {...mockProps}
        cancelState={{ ...mockProps.cancelState, isCancelling: true, cancelMessage: "Cancelando..." }}
      />
    );

    expect(screen.getByText("Cancelando...")).toBeInTheDocument();
  });

  it("renders successful cancellation message", () => {
    render(
      <Alerts
        {...mockProps}
        cancelState={{ ...mockProps.cancelState, isCancelled: true, cancelMessage: "Cancelación exitosa." }}
      />
    );

    expect(screen.getByText("Cancelación exitosa.")).toBeInTheDocument();
    fireEvent.click(screen.getByText("Cerrar"));
    expect(mockProps.onClose).toHaveBeenCalled();
  });

  it("renders cancellation error with retry button", () => {
    render(
      <Alerts
        {...mockProps}
        cancelState={{
          ...mockProps.cancelState,
          cancelError: { message: "Error en la cancelación." },
          cancelErrorStatus: ExtractArticlesErrors.NETWORK_ERROR,
        }}
      />
    );

    expect(screen.getByText("Error cancelando extracción de artículos")).toBeInTheDocument();
    expect(screen.getByText("Error en la cancelación.")).toBeInTheDocument();

    fireEvent.click(screen.getByText("Reintentar"));
    expect(mockProps.onCancel).toHaveBeenCalled();
  });

  it("renders job completed message with completion button", () => {
    render(
      <Alerts
        {...mockProps}
        status={ExtractArticlesStatus.COMPLETED}
        message="Proceso completado con éxito."
      />
    );

    expect(screen.getByText("Proceso completado con éxito.")).toBeInTheDocument();
    fireEvent.click(screen.getByText("Aceptar"));
    expect(mockProps.onComplete).toHaveBeenCalled();
  });

  it("renders general error with retry button", () => {
    render(
      <Alerts
        {...mockProps}
        error={{ title: "Error general", message: "Ha ocurrido un error inesperado." }}
        errorStatus={ExtractArticlesErrors.NETWORK_ERROR}
      />
    );

    expect(screen.getByText("Error general")).toBeInTheDocument();
    expect(screen.getByText("Ha ocurrido un error inesperado.")).toBeInTheDocument();
    
    fireEvent.click(screen.getByText("Reintentar"));
    expect(mockProps.onRetry).toHaveBeenCalled();
  });

  it("renders processing message when status and message are empty", () => {
    render(
      <Alerts {...mockProps} status={""} message={""} />
    );

    expect(screen.getByText("Procesando...")).toBeInTheDocument();
  });

  it("renders default alert with cancel button", () => {
    render(<Alerts {...mockProps} />);

    expect(screen.getByText("Proceso en ejecución")).toBeInTheDocument();
    
    fireEvent.click(screen.getByText("Cancelar"));
    expect(mockProps.onCancel).toHaveBeenCalled();
  });
});
