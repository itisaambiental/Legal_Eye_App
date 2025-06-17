/* eslint-disable no-undef */
import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import Alerts from "./Alerts";
import {
  ReqIdentifyErrors,
  ReqIdentifyStatus,
} from "../../../errors/reqIdentifications/reqIdentify/ReqIdentify";

describe("Alerts Component - ReqIdentify", () => {
  const mockProps = {
    status: "",
    error: null,
    errorStatus: null,
    message: "La identificación de requerimientos está en curso...",
    onRetry: vi.fn(),
    onComplete: vi.fn(),
    onClose: vi.fn(),
    labelButton: "Aceptar",
  };

  afterEach(() => {
    vi.clearAllMocks();
  });

  it("renders success message when job is completed", () => {
    render(
      <Alerts
        {...mockProps}
        status={ReqIdentifyStatus.COMPLETED}
        message="La identificación de requerimientos se completó con éxito."
      />
    );

    expect(screen.getByText("La identificación de requerimientos se completó con éxito.")).toBeInTheDocument();
    fireEvent.click(screen.getByText("Aceptar"));
    expect(mockProps.onComplete).toHaveBeenCalled();
  });

  it("renders retryable network error with retry button", () => {
    render(
      <Alerts
        {...mockProps}
        error={ReqIdentifyErrors.errorMap[ReqIdentifyErrors.NETWORK_ERROR]}
        errorStatus={ReqIdentifyErrors.NETWORK_ERROR}
      />
    );

    expect(screen.getByText("Error de conexión")).toBeInTheDocument();
    expect(screen.getByText("Hubo un problema de red. Verifique su conexión a internet e intente nuevamente.")).toBeInTheDocument();
    fireEvent.click(screen.getByText("Reintentar"));
    expect(mockProps.onRetry).toHaveBeenCalled();
  });

  it("renders non-retryable error with close button", () => {
    render(
      <Alerts
        {...mockProps}
        error={ReqIdentifyErrors.errorMap[ReqIdentifyErrors.UNAUTHORIZED]}
        errorStatus={ReqIdentifyErrors.UNAUTHORIZED}
      />
    );

    expect(screen.getByText("No autorizado")).toBeInTheDocument();
    expect(screen.getByText("No tiene autorización para realizar esta acción. Verifique su sesión e intente nuevamente.")).toBeInTheDocument();
    fireEvent.click(screen.getByText("Cerrar"));
    expect(mockProps.onClose).toHaveBeenCalled();
  });

  it("renders loading state when status and message are empty", () => {
    render(<Alerts {...mockProps} status="" message="" />);

    expect(screen.getByText("Procesando...")).toBeInTheDocument();
  });

  it("renders default alert with message", () => {
    render(<Alerts {...mockProps} />);

    expect(screen.getByText("La identificación de requerimientos está en curso...")).toBeInTheDocument();
  });
});
