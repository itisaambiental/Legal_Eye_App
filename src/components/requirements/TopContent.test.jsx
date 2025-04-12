import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import { describe, test, expect, vi } from "vitest";
import TopContent from "./TopContent";

const baseMockConfig = {
  isCreateModalOpen: false,
  isEditModalOpen: false,
  onRowsPerPageChange: vi.fn(),
  totalRequirements: 100,
  openModalCreate: vi.fn(),
  filterByNumber: "",
  onFilterByNumber: vi.fn(),
  filterByName: "",
  onFilterByName: vi.fn(),
  selectedCondition: "",
  onFilterByCondition: vi.fn(),
  selectedEvidence: "",
  onFilterByEvidence: vi.fn(),
  selectedPeriodicity: "",
  onFilterByPeriodicity: vi.fn(),
  filterByMandatoryDescription: "",
  onFilterByMandatoryDescription: vi.fn(),
  filterByComplementaryDescription: "",
  onFilterByComplementaryDescription: vi.fn(),
  filterByMandatorySentences: "",
  onFilterByMandatorySentences: vi.fn(),
  filterByComplementarySentences: "",
  onFilterByComplementarySentences: vi.fn(),
  filterByMandatoryKeywords: "",
  onFilterByMandatoryKeywords: vi.fn(),
  filterByComplementaryKeywords: "",
  onFilterByComplementaryKeywords: vi.fn(),
  subjects: [{ id: "1", subject_name: "Fiscal" }],
  selectedSubject: "",
  subjectLoading: false,
  onFilterBySubject: vi.fn(),
  aspects: [{ id: "a1", aspect_name: "Aspecto A" }],
  selectedAspects: [],
  aspectsLoading: false,
  onFilterByAspects: vi.fn(),
  onClear: vi.fn(),
};

describe("TopContent Component for Requirements", () => {
  test("renders the total Requirements count correctly", () => {
    render(<TopContent config={baseMockConfig} />);
    expect(screen.getByText(/Requerimientos totales:\s*100/)).toBeInTheDocument();
  });

  test("calls onRowsPerPageChange when a new option is selected", () => {
    render(<TopContent config={baseMockConfig} />);
    const select = screen.getByLabelText("Filas por página:");
    fireEvent.change(select, { target: { value: "20" } });
    expect(baseMockConfig.onRowsPerPageChange).toHaveBeenCalled();
  });

  test("calls openModalCreate when 'Nueva Requerimiento' is clicked", () => {
    render(<TopContent config={baseMockConfig} />);
    fireEvent.click(screen.getByText("Nueva Requerimiento"));
    expect(baseMockConfig.openModalCreate).toHaveBeenCalled();
  });

  test("calls onFilterByNumber when number input changes", () => {
    render(<TopContent config={baseMockConfig} />);
    const input = screen.getByPlaceholderText("Buscar por orden...");
    fireEvent.change(input, { target: { value: "123" } });
    expect(baseMockConfig.onFilterByNumber).toHaveBeenCalledWith("123");
  });

  test("calls onClear when clear button is pressed in number input", () => {
    const updatedConfig = {
      ...baseMockConfig,
      filterByNumber: "123",
    };
    const { container } = render(<TopContent config={updatedConfig} />);
    const wrapper = container.querySelector('input[placeholder="Buscar por orden..."]')?.closest("div");
    const clearButton = wrapper?.querySelector("button");
    fireEvent.click(clearButton);
    expect(updatedConfig.onClear).toHaveBeenCalled();
  });

  test("calls onFilterByName when name input changes", () => {
    render(<TopContent config={baseMockConfig} />);
    const input = screen.getByPlaceholderText("Buscar por Requerimiento...");
    fireEvent.change(input, { target: { value: "test name" } });
    expect(baseMockConfig.onFilterByName).toHaveBeenCalledWith("test name");
  });

  test("calls onFilterByCondition when a condition is selected", async () => {
    render(<TopContent config={baseMockConfig} />);
    const combo = screen.getByPlaceholderText("Seleccionar condición...");
    fireEvent.keyDown(combo, { key: "ArrowDown" });
    fireEvent.click(await screen.findByText("Crítica"));
    expect(baseMockConfig.onFilterByCondition).toHaveBeenCalled();
  });

  test("calls onFilterByEvidence when evidence is selected", async () => {
    render(<TopContent config={baseMockConfig} />);
    const combo = screen.getByPlaceholderText("Seleccionar evidencia...");
    fireEvent.keyDown(combo, { key: "ArrowDown" });
    fireEvent.click(await screen.findByText("Trámite"));
    expect(baseMockConfig.onFilterByEvidence).toHaveBeenCalled();
  });

  test("calls onFilterByPeriodicity when periodicity is selected", async () => {
    render(<TopContent config={baseMockConfig} />);
    const combo = screen.getByPlaceholderText("Seleccionar periodicidad...");
    fireEvent.keyDown(combo, { key: "ArrowDown" });
    fireEvent.click(await screen.findByText("Anual"));
    expect(baseMockConfig.onFilterByPeriodicity).toHaveBeenCalled();
  });


  test("calls onFilterBySubject when a subject is selected", async () => {
    render(<TopContent config={baseMockConfig} />);
    const combo = screen.getByPlaceholderText("Buscar por materia...");
    fireEvent.keyDown(combo, { key: "ArrowDown" });
    fireEvent.click(await screen.findByText("Fiscal"));
    expect(baseMockConfig.onFilterBySubject).toHaveBeenCalled();
  });

  test("calls onFilterByMandatoryDescription when input changes", () => {
    render(<TopContent config={baseMockConfig} />);
    const input = screen.getByPlaceholderText("Buscar por descripción obligatoria...");
    fireEvent.change(input, { target: { value: "desc" } });
    expect(baseMockConfig.onFilterByMandatoryDescription).toHaveBeenCalledWith("desc");
  });

  test("calls onFilterByComplementaryDescription when input changes", () => {
    render(<TopContent config={baseMockConfig} />);
    const input = screen.getByPlaceholderText("Buscar por descripción complementaria...");
    fireEvent.change(input, { target: { value: "desc" } });
    expect(baseMockConfig.onFilterByComplementaryDescription).toHaveBeenCalledWith("desc");
  });

  test("calls onFilterByMandatorySentences when input changes", () => {
    render(<TopContent config={baseMockConfig} />);
    const input = screen.getByPlaceholderText("Buscar por frases obligatorias...");
    fireEvent.change(input, { target: { value: "frase" } });
    expect(baseMockConfig.onFilterByMandatorySentences).toHaveBeenCalledWith("frase");
  });

  test("calls onFilterByComplementarySentences when input changes", () => {
    render(<TopContent config={baseMockConfig} />);
    const input = screen.getByPlaceholderText("Buscar por frases complementarias...");
    fireEvent.change(input, { target: { value: "frase" } });
    expect(baseMockConfig.onFilterByComplementarySentences).toHaveBeenCalledWith("frase");
  });

  test("calls onFilterByMandatoryKeywords when input changes", () => {
    render(<TopContent config={baseMockConfig} />);
    const input = screen.getByPlaceholderText("Buscar por palabras clave obligatorias...");
    fireEvent.change(input, { target: { value: "clave" } });
    expect(baseMockConfig.onFilterByMandatoryKeywords).toHaveBeenCalledWith("clave");
  });

  test("calls onFilterByComplementaryKeywords when input changes", () => {
    render(<TopContent config={baseMockConfig} />);
    const input = screen.getByPlaceholderText("Buscar por palabras clave complementarias...");
    fireEvent.change(input, { target: { value: "clave" } });
    expect(baseMockConfig.onFilterByComplementaryKeywords).toHaveBeenCalledWith("clave");
  });
});
