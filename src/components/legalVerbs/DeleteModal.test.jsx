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
  legalVerbs: [
    { id: 1, name: "Tipo A", description: "desc A", translation: "clas A" },
    { id: 2, name: "Tipo B", description: "desc B", translation: "clas B" },
  ],
  deleteLegalVerbsBatch: vi.fn(),
  setSelectedKeys: vi.fn(),
  check: "/check-icon.png",
};

describe("DeleteModal Component for LegalVerbs", () => {
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

  it("renderiza correctamente el mensaje para múltiples verbos", () => {
    renderModal();
    expect(
      screen.getByText("¿Estas seguro de que deseas eliminar estos verbos legales?")
    ).toBeInTheDocument();
  });

  it("renderiza correctamente el mensaje para un solo tipo", () => {
    renderModal({ selectedKeys: new Set([1]) });
    expect(
      screen.getByText("¿Estas seguro de que deseas eliminar este verbo legal?")
    ).toBeInTheDocument();
  });

  it("renderiza correctamente el mensaje para 'todos'", () => {
    renderModal({ selectedKeys: "all" });
    expect(
      screen.getByText("¿Estas seguro de que deseas eliminar TODOS los verbos legales?")
    ).toBeInTheDocument();
  });

  it("llama a closeDeleteModal al hacer clic en 'No, cancelar'", () => {
    renderModal();
    fireEvent.click(screen.getByText("No, cancelar"));
    expect(mockConfig.closeDeleteModal).toHaveBeenCalled();
  });

  it("ejecuta deleteLegalVerbsBatch al confirmar", async () => {
    const config = renderModal();
    fireEvent.click(screen.getByText("Sí, estoy seguro"));

    expect(config.setIsDeletingBatch).toHaveBeenCalledWith(true);

    await waitFor(() => {
      expect(config.deleteLegalVerbsBatch).toHaveBeenCalledWith([1, 2]);
    });
  });

  it("muestra toast de éxito si la eliminación fue exitosa", async () => {
    const config = renderModal({
        deleteLegalVerbsBatch: vi.fn().mockResolvedValue({ success: true }),
    });

    fireEvent.click(screen.getByText("Sí, estoy seguro"));

    await waitFor(() => {
      expect(toast.info).toHaveBeenCalledWith(
        "Verbos Legales eliminados con éxito",
        expect.any(Object)
      );
    });

    expect(config.setSelectedKeys).toHaveBeenCalledWith(new Set());
    expect(config.closeDeleteModal).toHaveBeenCalled();
  });

  it("muestra toast de error si deleteLegalVerbsBatch retorna error", async () => {
    const config = renderModal({
        deleteLegalVerbsBatch: vi.fn().mockResolvedValue({
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

  it("muestra toast de error si deleteLegalVerbsBatch lanza excepción", async () => {
    const config = renderModal({
        deleteLegalVerbsBatch: vi.fn().mockRejectedValue(
        new Error("Excepción inesperada")
      ),
    });

    fireEvent.click(screen.getByText("Sí, estoy seguro"));

    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith(
        "Ocurrió un error al eliminar los verbos legales."
      );
    });

    expect(config.closeDeleteModal).not.toHaveBeenCalled();
  });
});
