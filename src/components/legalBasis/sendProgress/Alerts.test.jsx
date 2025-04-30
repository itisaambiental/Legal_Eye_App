import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi, afterEach } from "vitest";
import "@testing-library/jest-dom";
import Alerts from "./Alerts";
import {
  SendLegalBasisErrors,
  SendLegalBasisStatus,
} from "../../../errors/legalBasis/sendLegalBasis/SendLegalBasis";

describe("Alerts Component (Legal Basis)", () => {
  const mockProps = {
    status: "",
    error: null,
    errorStatus: null,
    message: "Proceso en ejecución",
    onRetry: vi.fn(),
    onComplete: vi.fn(),
    onClose: vi.fn(),
    labelButton: "Aceptar",
  };

  afterEach(() => {
    vi.clearAllMocks();
  });

  it("renders job completed message with completion button", () => {
    render(
      <Alerts
        {...mockProps}
        status={SendLegalBasisStatus.COMPLETED}
        message="Proceso completado con éxito."
      />
    );

    expect(screen.getByText("Proceso completado con éxito.")).toBeInTheDocument();
    fireEvent.click(screen.getByText("Aceptar"));
    expect(mockProps.onComplete).toHaveBeenCalled();
  });

  it("renders retryable error alert and triggers onRetry", () => {
    render(
      <Alerts
        {...mockProps}
        error={{ title: "Error de red", message: "Fallo de conexión" }}
        errorStatus={SendLegalBasisErrors.NETWORK_ERROR}
      />
    );

    expect(screen.getByText("Error de red")).toBeInTheDocument();
    expect(screen.getByText("Fallo de conexión")).toBeInTheDocument();
    fireEvent.click(screen.getByText("Reintentar"));
    expect(mockProps.onRetry).toHaveBeenCalled();
  });

  it("renders non-retryable error alert and triggers onClose", () => {
    render(
      <Alerts
        {...mockProps}
        error={{ title: "Error fatal", message: "Fallo interno del servidor" }}
        errorStatus="ANY_OTHER_ERROR"
      />
    );

    expect(screen.getByText("Error fatal")).toBeInTheDocument();
    expect(screen.getByText("Fallo interno del servidor")).toBeInTheDocument();
    fireEvent.click(screen.getByText("Cerrar"));
    expect(mockProps.onClose).toHaveBeenCalled();
  });

  it("renders processing alert when no status, message, or error are provided", () => {
    render(
      <Alerts
        {...mockProps}
        status=""
        message=""
        error={null}
      />
    );

    expect(screen.getByText("Procesando...")).toBeInTheDocument();
  });

  it("renders fallback alert with message", () => {
    render(
      <Alerts
        {...mockProps}
        status=""
        error={null}
        message="Esperando respuesta del servidor..."
      />
    );

    expect(screen.getByText("Esperando respuesta del servidor...")).toBeInTheDocument();
  });
});
