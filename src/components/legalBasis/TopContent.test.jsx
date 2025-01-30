import { render, screen, fireEvent } from "@testing-library/react";
import { parseDate } from "@internationalized/date";
import "@testing-library/jest-dom";
import { describe, test, expect, vi } from "vitest";
import TopContent from "./TopContent";

const mockConfig = {
  isCreateModalOpen: false,
  isEditModalOpen: false,
  onRowsPerPageChange: vi.fn(),
  totalLegalBasis: 100,
  openModalCreate: vi.fn(),
  filterByName: "",
  filterByAbbreviation: "",
  onFilterByName: vi.fn(),
  onFilterByAbbreviation: vi.fn(),
  onClear: vi.fn(),
  subjects: [{ id: "1", subject_name: "Subject 1" }],
  selectedSubject: "",
  subjectLoading: false,
  onFilterBySubject: vi.fn(),
  aspects: [{ id: "1", aspect_name: "Aspect 1" }],
  selectedAspects: [],
  aspectsLoading: false,
  onFilterByAspects: vi.fn(),
  classifications: [{ classification_name: "Classification 1" }],
  selectedClassification: "",
  classificationsLoading: false,
  onFilterByClassification: vi.fn(),
  jurisdictions: [{ jurisdiction_name: "Jurisdiction 1" }],
  selectedJurisdiction: "",
  jurisdictionsLoading: false,
  onFilterByJurisdiction: vi.fn(),
  states: ["State 1"],
  selectedState: "",
  stateLoading: false,
  onFilterByState: vi.fn(),
  municipalities: ["Municipality 1"],
  selectedMunicipalities: new Set(),
  municipalitiesLoading: false,
  onFilterByMunicipalities: vi.fn(),
  lastReformRange: { start: parseDate("2024-01-01"), end: parseDate("2024-12-31") },
  lastReformIsInvalid: false,
  lastReformError: "",
  onFilterByLastReformRange: vi.fn(),
};

describe("TopContent Component for Legal Basis", () => {
  test("renders the total Legal Basis count correctly", () => {
    render(<TopContent config={mockConfig} />);
    expect(screen.getByText("Fundamentos totales: 100")).toBeInTheDocument();
  });
  test("opens modal to create a new subject when 'Nuevo Fundamento' button is clicked", () => {
    render(<TopContent config={mockConfig} />);
    const newSubjectButton = screen.getByText("Nuevo Fundamento");
    fireEvent.click(newSubjectButton);
    expect(mockConfig.openModalCreate).toHaveBeenCalled();
  });

  test("changes rows per page when a new option is selected", () => {
    render(<TopContent config={mockConfig} />);
    const select = screen.getByLabelText("Filas por página:");
    fireEvent.change(select, { target: { value: "10" } });
    expect(mockConfig.onRowsPerPageChange).toHaveBeenCalledWith(
      expect.anything()
    );
  });
   test('calls onFilterByName when name input changes', () => {
        render(<TopContent config={mockConfig} />);
        const nameInput = screen.getByPlaceholderText('Buscar por nombre...');
        fireEvent.change(nameInput, { target: { value: 'Test Name' } });
        expect(mockConfig.onFilterByName).toHaveBeenCalled();
    });

    test('calls onFilterByAbbreviation when abbreviation input changes', () => {
        render(<TopContent config={mockConfig} />);
        const abbreviationInput = screen.getByPlaceholderText('Buscar por abreviatura...');
        fireEvent.change(abbreviationInput, { target: { value: 'Test Abbreviation' } });
        expect(mockConfig.onFilterByAbbreviation).toHaveBeenCalled();
    });
    test("calls onFilterBySubject when a subject is selected", async () => {
        render(<TopContent config={mockConfig} />);
        const subjectInput = screen.getByPlaceholderText("Buscar por materia...");
        fireEvent.click(subjectInput);
        fireEvent.keyDown(subjectInput, { key: "ArrowDown" }); 
        fireEvent.keyDown(subjectInput, { key: "Enter" });
        expect(mockConfig.onFilterBySubject).toHaveBeenCalledWith("1");
    });
    test("calls onFilterByClassification when classification is selected", async () => {
        render(<TopContent config={mockConfig} />);
        const classificationInput = screen.getByPlaceholderText("Buscar por clasificación...");
        fireEvent.click(classificationInput);
        fireEvent.keyDown(classificationInput, { key: "ArrowDown" });
        fireEvent.keyDown(classificationInput, { key: "Enter" });
        expect(mockConfig.onFilterByClassification).toHaveBeenCalledWith("Classification 1");
    });
    test("calls onFilterByJurisdiction when jurisdiction is selected", async () => {
        render(<TopContent config={mockConfig} />);
        const jurisdictionInput = screen.getByPlaceholderText("Buscar por jurisdicción...");
        fireEvent.click(jurisdictionInput);
        fireEvent.keyDown(jurisdictionInput, { key: "ArrowDown" });
        fireEvent.keyDown(jurisdictionInput, { key: "Enter" });
        expect(mockConfig.onFilterByJurisdiction).toHaveBeenCalledWith("Jurisdiction 1");
    });
    test("calls onFilterByState when state is selected", async () => {
        render(<TopContent config={mockConfig} />);
        const stateInput = screen.getByPlaceholderText("Buscar por estado...");
        fireEvent.click(stateInput);
        fireEvent.keyDown(stateInput, { key: "ArrowDown" });
        fireEvent.keyDown(stateInput, { key: "Enter" });
        expect(mockConfig.onFilterByState).toHaveBeenCalledWith("State 1");
    });
    
});
