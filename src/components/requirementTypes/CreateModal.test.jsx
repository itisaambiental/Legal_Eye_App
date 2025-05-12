import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { describe, it, vi, beforeEach, expect } from "vitest";
import "@testing-library/jest-dom";
import { ToastContainer } from "react-toastify";
import CreateModal from "./CreateModal";

describe("CreateModal Component for RequirementTypes", () => {
  let config;

  beforeEach(() => {
    config = {
      isOpen: true,
      closeModalCreate: vi.fn(),
      addRequirementType: vi.fn().mockResolvedValue({ success: true }),
      nameError: null,
      setNameError: vi.fn(),
      handleNameChange: vi.fn(),
      descriptionError: null,
      setDescriptionError: vi.fn(),
      handleDescriptionChange: vi.fn(),
      classificationError: null,
      setClassificationError: vi.fn(),
      handleClassificationChange: vi.fn(),
      formData: {
        name: "",
        description: "",
        classification: "",
      },
    };
  });

  it("renders form fields correctly", () => {
    render(<CreateModal config={config} />);
    expect(screen.getByLabelText("Nombre")).toBeInTheDocument();
    expect(screen.getByLabelText("Descripción")).toBeInTheDocument();
    expect(screen.getByLabelText("Clasificación")).toBeInTheDocument();
  });

  it("validates that it cannot be sent if the fields are empty", async () => {
    render(<CreateModal config={config} />);
    fireEvent.submit(screen.getByRole("button", { name: /crear tipo de requerimiento/i }));
    await waitFor(() => {
      expect(config.setNameError).toHaveBeenCalledWith("Este campo es obligatorio");
    });
  });

  it("sends correctly if the fields are completed", async () => {
    config.formData = {
      name: "Tipo 1",
      description: "Descripción",
      classification: "Clase",
    };

    render(<CreateModal config={config} />);
    fireEvent.submit(screen.getByRole("button", { name: /crear tipo de requerimiento/i }));

    await waitFor(() => {
      expect(config.addRequirementType).toHaveBeenCalledWith({
        name: "Tipo 1",
        description: "Descripción",
        classification: "Clase",
      });
      expect(config.closeModalCreate).toHaveBeenCalled();
    });
  });

  it("does not close the modal if an error occurs", async () => {
    config.formData = {
      name: "Tipo 1",
      description: "Descripción",
      classification: "Clase",
    };
    config.addRequirementType = vi.fn().mockResolvedValue({ success: false, error: "Error grave" });

    render(
      <>
        <ToastContainer />
        <CreateModal config={config} />
      </>
    );

    fireEvent.submit(screen.getByRole("button", { name: /crear tipo de requerimiento/i }));

    await waitFor(() => {
      expect(config.closeModalCreate).not.toHaveBeenCalled();
      expect(screen.getByText("Error grave")).toBeInTheDocument();
    });
  });
});
