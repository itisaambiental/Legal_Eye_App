import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { describe, it, vi, beforeEach, expect } from "vitest";
import "@testing-library/jest-dom";
import { ToastContainer } from "react-toastify";
import CreateModal from "./CreateModal";

describe("CreateModal Component for LegalVerbs", () => {
  let config;

  beforeEach(() => {
    config = {
      isOpen: true,
      closeModalCreate: vi.fn(),
      addLegalVerb: vi.fn().mockResolvedValue({ success: true }),
      nameError: null,
      setNameError: vi.fn(),
      handleNameChange: vi.fn(),
      descriptionError: null,
      setDescriptionError: vi.fn(),
      handleDescriptionChange: vi.fn(),
      translationError: null,
      setTranslationError: vi.fn(),
      handleTranslationChange: vi.fn(),
      formData: {
        name: "",
        description: "",
        translation: "",
      },
    };
  });

  it("renders form fields correctly", () => {
    render(<CreateModal config={config} />);
    expect(screen.getByLabelText("Nombre")).toBeInTheDocument();
    expect(screen.getByLabelText("Descripción")).toBeInTheDocument();
    expect(screen.getByLabelText("Traducción")).toBeInTheDocument();
  });

  it("validates that it cannot be sent if the fields are empty", async () => {
    render(<CreateModal config={config} />);
    fireEvent.submit(screen.getByRole("button", { name: /crear verbo legal/i }));
    await waitFor(() => {
      expect(config.setNameError).toHaveBeenCalledWith("Este campo es obligatorio");
    });
  });

  it("sends correctly if the fields are completed", async () => {
    config.formData = {
      name: "Tipo 1",
      description: "Descripción",
      translation: "Clase",
    };

    render(<CreateModal config={config} />);
    fireEvent.submit(screen.getByRole("button", { name: /crear verbo legal/i }));

    await waitFor(() => {
      expect(config.addLegalVerb).toHaveBeenCalledWith({
        name: "Tipo 1",
        description: "Descripción",
        translation: "Clase",
      });
      expect(config.closeModalCreate).toHaveBeenCalled();
    });
  });

  it("does not close the modal if an error occurs", async () => {
    config.formData = {
      name: "Tipo 1",
      description: "Descripción",
      translation: "Clase",
    };
    config.addLegalVerb = vi.fn().mockResolvedValue({ success: false, error: "Error grave" });

    render(
      <>
        <ToastContainer />
        <CreateModal config={config} />
      </>
    );

    fireEvent.submit(screen.getByRole("button", { name: /crear verbo legal/i }));

    await waitFor(() => {
      expect(config.closeModalCreate).not.toHaveBeenCalled();
      expect(screen.getByText("Error grave")).toBeInTheDocument();
    });
  });
});
