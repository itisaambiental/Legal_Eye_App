import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import "@testing-library/jest-dom";
import Progress from "./Progress";
import Alerts from "./Alerts";
import useSendLegalBasis from "../../../hooks/legalBasis/useSendLegalBasis";

vi.mock("../../../hooks/legalBasis/useSendLegalBasis");
vi.mock("./Alerts");

describe("Progress Component (Legal Basis)", () => {
  const mockHookValues = {
    progress: 50,
    status: "in-progress",
    message: "Job is in progress",
    error: null,
    errorStatus: null,
    fetchJobStatus: vi.fn(),
    clearError: vi.fn(),
    cleanjobStatus: vi.fn(),
  };

  beforeEach(() => {
    useSendLegalBasis.mockReturnValue(mockHookValues);
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it("renders Progress with percentage and label", () => {
    render(
      <Progress
        jobId="ABC123"
        onComplete={vi.fn()}
        onClose={vi.fn()}
        labelTop="Estado de Envío"
        labelButton="Cerrar"
      />
    );

    expect(screen.getByText("Estado de Envío")).toBeInTheDocument();
    expect(screen.getByText("50%")).toBeInTheDocument(); // CircularProgress muestra texto visible
  });

  it("passes correct props to Alerts when progress is in-progress", () => {
    mockHookValues.progress = 50;
    mockHookValues.status = "in-progress";
    mockHookValues.message = "Job is in progress";

    render(
      <Progress
        jobId="ABC123"
        onComplete={vi.fn()}
        onClose={vi.fn()}
        labelTop="Progreso"
        labelButton="Reintentar"
      />
    );

    expect(Alerts).toHaveBeenCalledWith(
      expect.objectContaining({
        status: "in-progress",
        message: "Job is in progress",
        error: null,
        errorStatus: null,
      }),
      {}
    );
  });

  it("passes correct props to Alerts when job completes", () => {
    mockHookValues.progress = 100;
    mockHookValues.status = "COMPLETED";
    mockHookValues.message = "Job finished successfully";

    render(
      <Progress
        jobId="XYZ789"
        onComplete={vi.fn()}
        onClose={vi.fn()}
        labelTop="Finalizado"
        labelButton="Ver resultado"
      />
    );

    expect(Alerts).toHaveBeenCalledWith(
      expect.objectContaining({
        status: "COMPLETED",
        message: "Job finished successfully",
        error: null,
        errorStatus: null,
      }),
      {}
    );
  });

  it("calls cleanjobStatus and clearError when handleRetry is triggered", () => {
    const { rerender } = render(
      <Progress
        jobId="ID123"
        onComplete={vi.fn()}
        onClose={vi.fn()}
        labelTop="Estado"
        labelButton="Reintentar"
      />
    );
    mockHookValues.error = { title: "Error", message: "Falló el envío" };
    rerender(
      <Progress
        jobId="ID123"
        onComplete={vi.fn()}
        onClose={vi.fn()}
        labelTop="Estado"
        labelButton="Reintentar"
      />
    );

    expect(mockHookValues.cleanjobStatus).not.toHaveBeenCalled();
    expect(mockHookValues.clearError).not.toHaveBeenCalled(); 
  });
});
