import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import FilterModal from "./FilterModal.jsx";

describe("FilterModal", () => {
  let mockConfig;

  beforeEach(() => {
    mockConfig = {
      formData: {
        jurisdiction: "",
        state: "",
        municipality: "",
        subject: "",
        aspects: new Set(),
      },
      fetchLegalBasisByCriteria: vi.fn(),
      isOpen: true,
      onClose: vi.fn(),
      setPage: vi.fn(),
      handleJurisdictionChange: vi.fn(),
      states: ["Nuevo León", "Jalisco"],
      isStateActive: false,
      handleStateChange: vi.fn(),
      clearMunicipalities: vi.fn(),
      municipalities: ["Monterrey", "San Pedro"],
      isMunicipalityActive: false,
      loadingMunicipalities: false,
      errorMunicipalities: null,
      handleMunicipalityChange: vi.fn(),
      subjects: [
        { id: "1", subject_name: "Seguridad" },
        { id: "2", subject_name: "Salud" },
      ],
      handleSubjectChange: vi.fn(),
      aspects: [
        { id: "1", aspect_name: "Protección Civil" },
        { id: "2", aspect_name: "Emergencias" },
      ],
      isAspectsActive: false,
      aspectsLoading: false,
      errorAspects: null,
      handleAspectsChange: vi.fn(),
    };
  });

  it("renders the modal when open", () => {
    render(<FilterModal config={mockConfig} />);
    expect(screen.getByText("Búsqueda Avanzada")).toBeInTheDocument();
  });

  it("disables state and municipality if jurisdiction is not selected", () => {
    render(<FilterModal config={mockConfig} />);
    expect(screen.getByLabelText("Estado")).toBeDisabled();
    expect(screen.getByLabelText("Municipio")).toBeDisabled();
  });

  it("enables state if jurisdiction is 'Estatal'", () => {
    mockConfig.formData.jurisdiction = "Estatal";
    mockConfig.isStateActive = true;
    render(<FilterModal config={mockConfig} />);
    expect(screen.getByLabelText("Estado")).not.toBeDisabled();
  });

  it("calls fetch and closes modal when 'Aplicar Filtros' is clicked", () => {
    render(<FilterModal config={mockConfig} />);
    fireEvent.click(screen.getByText("Aplicar Filtros"));
    expect(mockConfig.fetchLegalBasisByCriteria).toHaveBeenCalled();
    expect(mockConfig.onClose).toHaveBeenCalled();
  });

  it("calls onClose when 'Cancelar' is clicked", () => {
    render(<FilterModal config={mockConfig} />);
    fireEvent.click(screen.getByText("Cancelar"));
    expect(mockConfig.onClose).toHaveBeenCalled();
  });

  it("shows error message if errorMunicipalities is present", () => {
    mockConfig.errorMunicipalities = { message: "Error cargando municipios" };
    render(<FilterModal config={mockConfig} />);
    expect(screen.getByText("Error cargando municipios")).toBeInTheDocument();
  });

  it("shows error message if errorAspects is present", () => {
    mockConfig.errorAspects = { message: "Error cargando aspectos" };
    render(<FilterModal config={mockConfig} />);
    expect(screen.getByText("Error cargando aspectos")).toBeInTheDocument();
  });
});
