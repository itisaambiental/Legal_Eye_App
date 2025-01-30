import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";
import CreateModal from "./CreateModal";
import { parseDate } from "@internationalized/date";
import { ToastContainer } from "react-toastify";

describe("CreateModal Component for Legal Basis", () => {
  let config;

  beforeEach(() => {
    config = {
      isOpen: true,
      closeModalCreate: vi.fn(),
      goToArticles: vi.fn(),
      addLegalBasis: vi.fn().mockResolvedValue({ success: true }),
      nameError: null,
      setNameError: vi.fn(),
      handleNameChange: vi.fn(),
      abbreviationError: null,
      setAbbreviationError: vi.fn(),
      handleAbbreviationChange: vi.fn(),
      classificationError: null,
      setClassificationError: vi.fn(),
      handleClassificationChange: vi.fn(),
      jurisdictionError: null,
      setJurisdictionError: vi.fn(),
      handleJurisdictionChange: vi.fn(),
      states: ["State1", "State2"],
      stateError: null,
      setStateError: vi.fn(),
      isStateActive: true,
      handleStateChange: vi.fn(),
      clearMunicipalities: vi.fn(),
      municipalities: ["Municipality1", "Municipality2"],
      municipalityError: null,
      setMunicipalityError: vi.fn(),
      isMunicipalityActive: true,
      loadingMunicipalities: false,
      errorMunicipalities: null,
      handleMunicipalityChange: vi.fn(),
      subjects: [{ id: 1, subject_name: "Subject1" }],
      subjectInputError: null,
      setSubjectError: vi.fn(),
      handleSubjectChange: vi.fn(),
      aspects: [{ id: 1, aspect_name: "Aspect1" }],
      aspectError: null,
      setAspectInputError: vi.fn(),
      isAspectsActive: true,
      aspectsLoading: false,
      errorAspects: null,
      handleAspectsChange: vi.fn(),
      lastReformError: null,
      setLastReformError: vi.fn(),
      handleLastReformChange: vi.fn(),
      handleFileChange: vi.fn(),
      fileError: null,
      handleRemoveDocument: vi.fn(),
      checkboxInputError: null,
      setCheckboxInputError: vi.fn(),
      isCheckboxChecked: false,
      handleCheckboxChange: vi.fn(),
      formData: {
        name: "",
        abbreviation: "",
        classification: "",
        jurisdiction: "",
        state: "",
        municipality: "",
        subject: "",
        aspects: [],
        lastReform: null,
        document: null,
        extractArticles: false,
      },
    };
  });

  it("renders the modal with the correct structure", () => {
    render(<CreateModal config={config} />);
    expect(screen.getByText("Registrar Nuevo Fundamento")).toBeInTheDocument();
    expect(screen.getByLabelText("Nombre")).toBeInTheDocument();
    expect(screen.getByLabelText("Abreviatura")).toBeInTheDocument();
  });

  it("validates the name field on submit", async () => {
    render(<CreateModal config={config} />);
    const submitButton = screen.getByRole("button", {
      name: "Registrar Fundamento",
    });
    fireEvent.click(submitButton);
    expect(config.setNameError).toHaveBeenCalledWith(
      "Este campo es obligatorio"
    );
  });

  it("validates the abbreviation field on submit", async () => {
    config.formData.name = "Test Name";
    render(<CreateModal config={config} />);
    const submitButton = screen.getByRole("button", {
      name: "Registrar Fundamento",
    });
    fireEvent.click(submitButton);
    expect(config.setAbbreviationError).toHaveBeenCalledWith(
      "Este campo es obligatorio"
    );
  });

  it("updates name on input change", () => {
    render(<CreateModal config={config} />);
    const nameInput = screen.getByLabelText("Nombre");
    fireEvent.change(nameInput, { target: { value: "Ley Ambiental" } });
    expect(config.handleNameChange).toHaveBeenCalled();
  });

  it("calls addLegalBasis when form is valid", async () => {
    config.formData = {
      name: "Test Name",
      abbreviation: "Test Abbreviation",
      classification: "Ley",
      jurisdiction: "Federal",
      state: "State1",
      municipality: "Municipality1",
      subject: 1,
      aspects: [1],
      lastReform: parseDate("2024-01-01"),
      document: { file: new File([""], "test.pdf") },
      extractArticles: true,
    };

    render(<CreateModal config={config} />);
    const submitButton = screen.getByRole("button", {
      name: "Registrar Fundamento",
    });

    fireEvent.click(submitButton);
    await waitFor(() => {
      expect(config.addLegalBasis).toHaveBeenCalledWith({
        legalName: "Test Name",
        abbreviation: "Test Abbreviation",
        subjectId: 1,
        aspectsIds: [1],
        classification: "Ley",
        jurisdiction: "Federal",
        state: "State1",
        municipality: "Municipality1",
        lastReform: expect.any(String),
        extractArticles: true,
        document: expect.any(File),
      });
    });
  });

  it("displays success toast on successful legal basis creation", async () => {
    config.addLegalBasis = vi.fn().mockResolvedValue({ success: true });
    render(
      <>
        <ToastContainer />
        <CreateModal config={config} />
      </>
    );
    const submitButton = screen.getByRole("button", {
      name: "Registrar Fundamento",
    });
    fireEvent.click(submitButton);
    expect(
      await screen.findByText(
        "El fundamento legal ha sido registrado correctamente"
      )
    ).toBeInTheDocument();
  });

  it("displays error toast on legal basis creation failure", async () => {
    config.addLegalBasis = vi.fn().mockResolvedValue({
      success: false,
      error: "Error al registrar",
    });

    render(<CreateModal config={config} />);
    const submitButton = screen.getByRole("button", {
      name: "Registrar Fundamento",
    });

    fireEvent.click(submitButton);
    await waitFor(() => {
      expect(config.closeModalCreate).not.toHaveBeenCalled();
    });
  });

  it("checks the extract articles checkbox", () => {
    render(<CreateModal config={config} />);
    const checkbox = screen.getByText("Extraer Articulos");
    fireEvent.click(checkbox);
    expect(config.handleCheckboxChange).toHaveBeenCalled();
  });
});
