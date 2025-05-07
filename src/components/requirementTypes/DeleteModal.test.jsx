/* eslint-disable no-undef */
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { ToastContainer, toast } from "react-toastify";
import { vi } from "vitest";
import DeleteModal from "./DeleteModal";

const mockConfig = {
  showDeleteModal: true,
  closeDeleteModal: vi.fn(),
  setIsDeletingBatch: vi.fn(),
  isDeletingBatch: false,
  selectedKeys: new Set([1, 2]),
  requirementTypes: [
    { id: 1, name: "Tipo A", description: "desc A", classification: "clas A" },
    { id: 2, name: "Tipo B", description: "desc B", classification: "clas B" },
  ],
  deleteRequirementTypesBatch: vi.fn(),
  setSelectedKeys: vi.fn(),
  check: "/check-icon.png",
};

describe("DeleteModal Component for RequirementTypes", () => {
  const renderModal = (overrides = {}) => {
    const config = { ...mockConfig, ...overrides };
    render(
      <>
        <ToastContainer />
        <DeleteModal config={config} />
      </>
    );
    return config;
  };

  beforeEach(() => {
    vi.clearAllMocks();
    vi.spyOn(toast, "info").mockImplementation(() => {});
    vi.spyOn(toast, "error").mockImplementation(() => {});
  });

  it("renderiza correctamente el mensaje para múltiples tipos", () => {
    renderModal();
    expect(
      screen.getByText("¿Estas seguro de que deseas eliminar estos tipos de requerimiento?")
    ).toBeInTheDocument();
  });

  it("renderiza correctamente el mensaje para un solo tipo", () => {
    renderModal({ selectedKeys: new Set([1]) });
    expect(
      screen.getByText("¿Estas seguro de que deseas eliminar este tipo de requerimiento?")
    ).toBeInTheDocument();
  });

  it("renderiza correctamente el mensaje para 'todos'", () => {
    renderModal({ selectedKeys: "all" });
    expect(
      screen.getByText("¿Estas seguro de que deseas eliminar TODOS los tipos de requerimiento?")
    ).toBeInTheDocument();
  });

  it("llama a closeDeleteModal al hacer clic en 'No, cancelar'", () => {
    renderModal();
    fireEvent.click(screen.getByText("No, cancelar"));
    expect(mockConfig.closeDeleteModal).toHaveBeenCalled();
  });

  it("ejecuta deleteRequirementTypesBatch al confirmar", async () => {
    const config = renderModal();
    fireEvent.click(screen.getByText("Sí, estoy seguro"));

    expect(config.setIsDeletingBatch).toHaveBeenCalledWith(true);

    await waitFor(() => {
      expect(config.deleteRequirementTypesBatch).toHaveBeenCalledWith([1, 2]);
    });
  });

  it("muestra toast de éxito si la eliminación fue exitosa", async () => {
    const config = renderModal({
      deleteRequirementTypesBatch: vi.fn().mockResolvedValue({ success: true }),
    });

    fireEvent.click(screen.getByText("Sí, estoy seguro"));

    await waitFor(() => {
      expect(toast.info).toHaveBeenCalledWith(
        "Tipos de requerimiento eliminados con éxito",
        expect.any(Object)
      );
    });

    expect(config.setSelectedKeys).toHaveBeenCalledWith(new Set());
    expect(config.closeDeleteModal).toHaveBeenCalled();
  });

  it("muestra toast de error si deleteRequirementTypesBatch retorna error", async () => {
    const config = renderModal({
      deleteRequirementTypesBatch: vi.fn().mockResolvedValue({
        success: false,
        error: "Error del servidor",
      }),
    });

    fireEvent.click(screen.getByText("Sí, estoy seguro"));

    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith("Error del servidor");
    });

    expect(config.closeDeleteModal).not.toHaveBeenCalled();
  });

  it("muestra toast de error si deleteRequirementTypesBatch lanza excepción", async () => {
    const config = renderModal({
      deleteRequirementTypesBatch: vi.fn().mockRejectedValue(
        new Error("Excepción inesperada")
      ),
    });

    fireEvent.click(screen.getByText("Sí, estoy seguro"));

    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith(
        "Ocurrió un error al eliminar los tipos de requerimiento."
      );
    });

    expect(config.closeDeleteModal).not.toHaveBeenCalled();
  });
});
