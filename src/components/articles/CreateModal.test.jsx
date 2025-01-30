import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";
import CreateModal from "./CreateModal";
import { ToastContainer } from "react-toastify";

describe("CreateModal Component", () => {
  let config;

  beforeEach(() => {
    config = {
      isOpen: true,
      closeModalCreate: vi.fn(),
      addArticle: vi.fn().mockResolvedValue({ success: true }),
      nameError: null,
      orderError: null,
      setNameError: vi.fn(),
      setOrderError: vi.fn(),
      handleNameChange: vi.fn(),
      handleDescriptionChange: vi.fn(),
      handleOrderChange: vi.fn(),
      formData: {
        order: "",
        legalBaseId: 1,
        name: "",
        description: "",
      },
    };
  });

  it("renders the modal with the correct structure", () => {
    render(<CreateModal config={config} />);
    expect(screen.getByText("Registrar Nuevo Artículo")).toBeInTheDocument();
    expect(screen.getByLabelText("Orden")).toBeInTheDocument();
    expect(screen.getByLabelText("Artículo")).toBeInTheDocument();
  });

  it("validates the order field on submit", async () => {
    render(<CreateModal config={config} />);
    const submitButton = screen.getByRole("button", {
      name: "Registrar Artículo",
    });
    fireEvent.click(submitButton);
    expect(config.setOrderError).toHaveBeenCalledWith(
      "Este campo es obligatorio"
    );
  });

  it("validates the name field on submit", async () => {
    config.formData.order = 1;
    render(<CreateModal config={config} />);
    const submitButton = screen.getByRole("button", {
      name: "Registrar Artículo",
    });

    fireEvent.click(submitButton);
    expect(config.setNameError).toHaveBeenCalledWith(
      "Este campo es obligatorio"
    );
  });

  it("calls addArticle when form is valid", async () => {
    config.formData = {
      order: 1,
      legalBaseId: 1,
      name: "Artículo 1",
      description: "Descripción de prueba",
    };

    render(<CreateModal config={config} />);
    const submitButton = screen.getByRole("button", {
      name: "Registrar Artículo",
    });

    fireEvent.click(submitButton);
    expect(config.addArticle).toHaveBeenCalledWith(1, {
      title: "Artículo 1",
      article: "Descripción de prueba",
      order: 1,
    });
  });

  it("displays success toast on successful article creation", async () => {
    config.addArticle = vi.fn().mockResolvedValue({ success: true });
    render(
      <>
        <ToastContainer />
        <CreateModal config={config} />
      </>
    );
    const submitButton = screen.getByRole("button", {
      name: "Registrar Artículo",
    });
    fireEvent.click(submitButton);
    expect(
      await screen.findByText("El artículo ha sido registrado correctamente")
    ).toBeInTheDocument();
  });

  it("displays error toast on article creation failure", async () => {
    config.addArticle = vi.fn().mockResolvedValue({
      success: false,
      error: "Error al registrar",
    });

    render(<CreateModal config={config} />);
    const submitButton = screen.getByRole("button", {
      name: "Registrar Artículo",
    });

    fireEvent.click(submitButton);
    await waitFor(() => {
      expect(config.closeModalCreate).not.toHaveBeenCalled();
    });
  });
});
