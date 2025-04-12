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
      setConditionError: vi.fn(),
      setEvidenceError: vi.fn(),
      setPeriodicityError: vi.fn(),
      specifyEvidenceError: null,
      handlSpecifyEvidenceChange: vi.fn(),
      setSpecifyEvidenceError: vi.fn(),
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
      mandatoryDescriptionError: null,
      setMandatoryDescriptionError: vi.fn(),
      complementaryDescriptionError: null,
      setComplementaryDescriptionError: vi.fn(),
      mandatorySentencesError: null,
      setMandatorySentencesError: vi.fn(),
      complementarySentencesError: null,
      setComplementarySentencesError: vi.fn(),
      mandatoryKeywordsError: null,
      setMandatoryKeywordsError: vi.fn(),
      complementaryKeywordsError: null,
      setComplementaryKeywordsError: vi.fn(),

      formData: {
        number: "",
        name: "",
        condition: "",
        evidence: "",
        specifyEvidence: "",
        periodicity: "",
        subject: "",
        aspects: ["1"],
        mandatoryDescription: "",
        complementaryDescription: "",
        mandatorySentences: "",
        complementarySentences: "",
        mandatoryKeywords: "",
        complementaryKeywords: "",
      },
      handleMandatoryDescriptionChange: (e) => {
        config.formData.mandatoryDescription = e.target.value;
      },
      handleComplementaryDescriptionChange: (e) => {
        config.formData.complementaryDescription = e.target.value;
      },
      handleMandatorySentencesChange: (e) => {
        config.formData.mandatorySentences = e.target.value;
      },
      handleComplementarySentencesChange: (e) => {
        config.formData.complementarySentences = e.target.value;
      },
      handleMandatoryKeywordsChange: (e) => {
        config.formData.mandatoryKeywords = e.target.value;
      },
      handleComplementaryKeywordsChange: (e) => {
        config.formData.complementaryKeywords = e.target.value;
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
      subject: "1",
      aspects: ["1"],
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
      subject: "1",
      aspects: ["1"],
    };

    render(<CreateModal config={config} />);
    fireEvent.click(screen.getByRole("button", { name: "Siguiente" }));

    await waitFor(() => {
      expect(screen.getByText(/Detalles Adicionales/i)).toBeInTheDocument();
    });
  });

  it("validates textareas on submit in step 2", async () => {
    config.formData = {
      ...config.formData,
      number: "123",
      name: "Nombre válido",
      condition: "Crítica",
      evidence: "Trámite",
      periodicity: "Anual",
      subject: "1",
      aspects: ["1"],
      mandatoryDescription: "",
      complementaryDescription: "",
      mandatorySentences: "",
      complementarySentences: "",
      mandatoryKeywords: "",
      complementaryKeywords: "",
    };

    render(<CreateModal config={config} />);
    fireEvent.click(screen.getByRole("button", { name: "Siguiente" }));

    await waitFor(() => {
      expect(screen.getByText("Detalles Adicionales")).toBeInTheDocument();
    });

    fireEvent.click(screen.getByRole("button", { name: "Crear Requerimiento" }));

    await waitFor(() => {
      expect(config.setMandatoryDescriptionError).toHaveBeenCalledWith("Este campo es obligatorio.");
    });
  });

  it("calls addRequirement and closes modal on valid submission", async () => {
    config.formData = {
      ...config.formData,
      number: "001",
      name: "Req Test",
      condition: "Crítica",
      evidence: "Trámite",
      periodicity: "Anual",
      subject: "1",
      aspects: ["1"],
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

    fireEvent.click(screen.getByRole("button", { name: "Crear Requerimiento" }));

    await waitFor(() => {
      expect(config.addRequirement).toHaveBeenCalled();
      expect(config.closeModalCreate).toHaveBeenCalled();
    });
  });

  it("shows success toast after creating requirement", async () => {
    config.formData = {
      ...config.formData,
      number: "001",
      name: "Req Test",
      condition: "Crítica",
      evidence: "Trámite",
      periodicity: "Anual",
      subject: "1",
      aspects: ["1"],
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

    fireEvent.click(screen.getByRole("button", { name: "Crear Requerimiento" }));

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
      ...config.formData,
      number: "001",
      name: "Req Test",
      condition: "Crítica",
      evidence: "Trámite",
      periodicity: "Anual",
      subject: "1",
      aspects: ["1"],
      mandatoryDescription: "desc",
      complementaryDescription: "desc",
      mandatorySentences: "desc",
      complementarySentences: "desc",
      mandatoryKeywords: "desc",
      complementaryKeywords: "desc",
    };

    render(<CreateModal config={config} />);

    fireEvent.click(screen.getByRole("button", { name: "Siguiente" }));
    await waitFor(() => expect(screen.queryByText("Detalles Adicionales")).toBeInTheDocument());

    fireEvent.click(screen.getByRole("button", { name: "Crear Requerimiento" }));

    await waitFor(() => {
      expect(config.closeModalCreate).not.toHaveBeenCalled();
    });
  });
});
