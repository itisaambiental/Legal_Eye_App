import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import "@testing-library/jest-dom";
import CreateModal from "./CreateModal";
import { ToastContainer } from "react-toastify";

describe("CreateModal Component for Requirements", () => {
  let config;

  beforeEach(() => {
    config = {
      isOpen: true,
      closeModalCreate: vi.fn(),
      addRequirement: vi.fn().mockResolvedValue({ success: true }),
      numberError: null,
      setNumberError: vi.fn(),
      handleNumberChange: vi.fn(),
      nameError: null,
      setNameError: vi.fn(),
      handleNameChange: vi.fn(),
      conditionError: null,
      handleConditionChange: vi.fn(),
      evidenceError: null,
      handleEvidenceChange: vi.fn(),
      periodicityError: null,
      handlePeriodicityChange: vi.fn(),
      requirementTypeError: null,
      handleRequirementType: vi.fn(),
      setConditionError: vi.fn(),
      setEvidenceError: vi.fn(),
      setPeriodicityError: vi.fn(),
      setRequirementTypeError: vi.fn(),
      jurisdictionError: null,
      setJurisdictionError: vi.fn(),
      handleJurisdictionChange: vi.fn(),
      states: ["Nuevo León"],
      stateError: null,
      setStateError: vi.fn(),
      isStateActive: true,
      handleStateChange: vi.fn(),
      clearMunicipalities: vi.fn(),
      municipalities: ["San Pedro"],
      municipalityError: null,
      setMunicipalityError: vi.fn(),
      isMunicipalityActive: true,
      loadingMunicipalities: false,
      errorMunicipalities: null,
      handleMunicipalityChange: vi.fn(),
      subjects: [{ id: "1", subject_name: "Ambiental" }],
      subjectInputError: null,
      setSubjectError: vi.fn(),
      handleSubjectChange: vi.fn(),
      aspects: [{ id: "1", aspect_name: "Impacto Ambiental" }],
      aspectError: null,
      setAspectInputError: vi.fn(),
      isAspectsActive: true,
      aspectsLoading: false,
      errorAspects: null,
      handleAspectsChange: vi.fn(),
      handleMandatoryDescriptionChange: vi.fn(),
      mandatoryDescriptionError: null,
      setMandatoryDescriptionError: vi.fn(),
      handleComplementaryDescriptionChange: vi.fn(),
      complementaryDescriptionError: null,
      setComplementaryDescriptionError: vi.fn(),
      handleMandatorySentencesChange: vi.fn(),
      mandatorySentencesError: null,
      setMandatorySentencesError: vi.fn(),
      handleComplementarySentencesChange: vi.fn(),
      complementarySentencesError: null,
      setComplementarySentencesError: vi.fn(),
      handleMandatoryKeywordsChange: vi.fn(),
      mandatoryKeywordsError: null,
      setMandatoryKeywordsError: vi.fn(),
      handleComplementaryKeywordsChange: vi.fn(),
      complementaryKeywordsError: null,
      setComplementaryKeywordsError: vi.fn(),

      formData: {
        number: "",
        name: "",
        condition: "",
        evidence: "",
        periodicity: "",
        requirementType: "",
        jurisdiction: "",
        state: "",
        municipality: "",
        subject: "",
        aspect: "",
        mandatoryDescription: "",
        complementaryDescription: "",
        mandatorySentences: "",
        complementarySentences: "",
        mandatoryKeywords: "",
        complementaryKeywords: "",
      },
    };
  });

  it("renders the modal with correct header", () => {
    render(<CreateModal config={config} />);
    expect(screen.getByText("Crear Nuevo Requerimiento")).toBeInTheDocument();
  });

  it("validates empty number and name on submit", async () => {
    config.formData = {
      ...config.formData,
      condition: "Crítica",
      evidence: "Trámite",
      periodicity: "Anual",
      jurisdiction: "Federal",
      requirementType: "Identificación Federal",
      subject: "1",
      aspect: "1",
      number: "",
      name: "",
    };

    render(<CreateModal config={config} />);
    fireEvent.click(screen.getByRole("button", { name: "Siguiente" }));

    await waitFor(() => {
      expect(config.setNumberError).toHaveBeenCalledWith("Este campo es obligatorio.");
    });
  });

  it("shows step 2 when step 1 is valid", async () => {
    config.formData = {
      ...config.formData,
      number: "001",
      name: "Req Test",
      condition: "Crítica",
      evidence: "Trámite",
      periodicity: "Anual",
      jurisdiction: "Federal",
      requirementType: "Identificación Federal",
      subject: "1",
      aspect: "1",
    };

    render(<CreateModal config={config} />);
    fireEvent.click(screen.getByRole("button", { name: "Siguiente" }));

    await waitFor(() => {
      expect(screen.getByText(/Detalles Adicionales/i)).toBeInTheDocument();
    });
  });

  it("validates textareas on submit in step 2", async () => {
    config.formData.number = "123";
    config.formData.name = "Nombre válido";
    config.formData.condition= "Crítica";
    config.formData.evidence= "Trámite";
    config.formData.periodicity = "Anual";
    config.formData.jurisdiction ="Federal";
    config.formData.requirementType ="Identificación Federal",
    config.formData.subject ="1",
    config.formData.aspect = "1",
    config.formData.state = "",
    config.formData.municipality = "",
    config.formData.mandatoryDescription = "desc",
    config.formData.complementaryDescription = "desc",
    config.formData.mandatorySentences = "desc",
    config.formData.complementarySentences = "desc",
    config.formData.mandatoryKeywords = "desc",
    config.formData.complementaryKeywords = "desc",
  
    render(<CreateModal config={config} />);
    fireEvent.click(screen.getByRole("button", { name: "Siguiente" }));
  
    await waitFor(() => screen.getByText("Detalles Adicionales"));
  
    fireEvent.change(screen.getByLabelText("Descripción Obligatoria"), { target: { value: "" } });
    fireEvent.change(screen.getByLabelText("Descripción Complementaria"), { target: { value: "" } });
    fireEvent.change(screen.getByLabelText("Frases Obligatorias"), { target: { value: "" } });
    fireEvent.change(screen.getByLabelText("Frases Complementarias"), { target: { value: "" } });
    fireEvent.change(screen.getByLabelText("Palabras clave obligatorias"), { target: { value: "" } });
    fireEvent.change(screen.getByLabelText("Palabras clave complementarias"), { target: { value: "" } });
  
    fireEvent.click(screen.getByRole("button", { name: "Enviar" }));
  
    await waitFor(() => {
      expect(config.setMandatoryDescriptionError).toHaveBeenCalledWith("Este campo es obligatorio.");
    });
  });
  

  it("calls addRequirement and closes modal on valid submission", async () => {
    config.formData = {
      number: "001",
      name: "Req Test",
      condition: "Crítica",
      evidence: "Trámite",
      periodicity: "Anual",
      jurisdiction: "Federal",
      requirementType: "Identificación Federal",
      subject: "1",
      aspect: "1",
      state: "",
      municipality: "",
      mandatoryDescription: "desc",
      complementaryDescription: "desc",
      mandatorySentences: "desc",
      complementarySentences: "desc",
      mandatoryKeywords: "desc",
      complementaryKeywords: "desc",
    };

    render(<CreateModal config={config} />);
    fireEvent.click(screen.getByRole("button", { name: "Siguiente" }));

    await waitFor(() => {
      expect(screen.getByText("Detalles Adicionales")).toBeInTheDocument();
    });

    fireEvent.click(screen.getByRole("button", { name: "Enviar" }));

    await waitFor(() => {
      expect(config.addRequirement).toHaveBeenCalled();
      expect(config.closeModalCreate).toHaveBeenCalled();
    });
  });

  it("shows success toast after creating requirement", async () => {
    config.formData = {
      number: "001",
      name: "Req Test",
      condition: "Crítica",
      evidence: "Trámite",
      periodicity: "Anual",
      jurisdiction: "Federal",
      requirementType: "Identificación Federal",
      subject: "1",
      aspect: "1",
      state: "",
      municipality: "",
      mandatoryDescription: "desc",
      complementaryDescription: "desc",
      mandatorySentences: "desc",
      complementarySentences: "desc",
      mandatoryKeywords: "desc",
      complementaryKeywords: "desc",
    };

    config.addRequirement = vi.fn().mockResolvedValue({ success: true });

    render(
      <>
        <ToastContainer />
        <CreateModal config={config} />
      </>
    );

    fireEvent.click(screen.getByRole("button", { name: "Siguiente" }));

    await waitFor(() => {
      expect(screen.getByText("Detalles Adicionales")).toBeInTheDocument();
    });

    fireEvent.click(screen.getByRole("button", { name: "Enviar" }));

    await waitFor(() => {
      expect(screen.getByText("El requerimiento ha sido registrado correctamente")).toBeInTheDocument();
    });
  });

  it("does NOT close modal if addRequirement returns error", async () => {
    config.addRequirement = vi.fn().mockResolvedValue({
      success: false,
      error: "Ocurrió un error",
    });

    config.formData = {
      number: "001",
      name: "Req Test",
      condition: "Crítica",
      evidence: "Trámite",
      periodicity: "Anual",
      jurisdiction: "Federal",
      requirementType: "Identificación Federal",
      subject: "1",
      aspect: "1",
      state: "",
      municipality: "",
      mandatoryDescription: "desc",
      complementaryDescription: "desc",
      mandatorySentences: "desc",
      complementarySentences: "desc",
      mandatoryKeywords: "desc",
      complementaryKeywords: "desc",
    };

    render(<CreateModal config={config} />);

    fireEvent.click(screen.getByRole("button", { name: "Siguiente" }));
    await waitFor(() => screen.getByText("Detalles Adicionales"));

    fireEvent.click(screen.getByRole("button", { name: "Enviar" }));

    await waitFor(() => {
      expect(config.closeModalCreate).not.toHaveBeenCalled();
    });
  });
});
