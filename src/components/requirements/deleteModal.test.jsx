/* eslint-disable no-undef */
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { ToastContainer, toast } from "react-toastify";
import DeleteModal from "./deleteModal";
import { vi } from "vitest";

const mockConfig = {
  showDeleteModal: true,
  closeDeleteModal: vi.fn(),
  setIsDeletingBatch: vi.fn(),
  isDeletingBatch: false,
  selectedKeys: new Set([1, 2]),
  requirements: [{ id: 1 }, { id: 2 }],
  deleteRequirementBatch: vi.fn(),
  setSelectedKeys: vi.fn(),
  check: "check-icon-url",
};

describe("DeleteModal Component for Requirements", () => {
  const renderModal = (configOverrides = {}) => {
    const config = { ...mockConfig, ...configOverrides };
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

  test("renders correctly with multiple selected requirements", () => {
    renderModal();
    expect(
      screen.getByText("¿Estás seguro de que deseas eliminar estos Requerimientos?")
    ).toBeInTheDocument();
  });

  test("renders correctly with single selected requirement", () => {
    renderModal({ selectedKeys: new Set([1]) });
    expect(
      screen.getByText("¿Estás seguro de que deseas eliminar este Requerimiento?")
    ).toBeInTheDocument();
  });

  test("shows 'TODOS' in header when selectedKeys is 'all'", () => {
    renderModal({ selectedKeys: "all" });
    expect(
      screen.getByText("¿Estás seguro de que deseas eliminar TODOS los Requerimientos?")
    ).toBeInTheDocument();
  });

  test("calls closeDeleteModal when cancel button is clicked", () => {
    renderModal();
    fireEvent.click(screen.getByText("No, cancelar"));
    expect(mockConfig.closeDeleteModal).toHaveBeenCalled();
  });

  test("calls handleDeleteBatch when confirm button is clicked", async () => {
    const config = renderModal();
    fireEvent.click(screen.getByText("Sí, estoy seguro"));

    expect(config.setIsDeletingBatch).toHaveBeenCalledWith(true);

    await waitFor(() =>
      expect(config.deleteRequirementBatch).toHaveBeenCalledWith([1, 2])
    );
  });

  test("displays success toast on successful deletion", async () => {
    const config = renderModal({
      deleteRequirementBatch: vi.fn().mockResolvedValue({ success: true }),
    });

    fireEvent.click(screen.getByText("Sí, estoy seguro"));

    await waitFor(() => {
      expect(toast.info).toHaveBeenCalledWith(
        "Requerimientos eliminados con éxito",
        expect.any(Object)
      );
    });

    expect(config.closeDeleteModal).toHaveBeenCalled();
    expect(config.setSelectedKeys).toHaveBeenCalledWith(new Set());
  });

  test("displays error toast on failed deletion", async () => {
    const config = renderModal({
      deleteRequirementBatch: vi.fn().mockResolvedValue({
        success: false,
        error: "Error message",
      }),
    });

    fireEvent.click(screen.getByText("Sí, estoy seguro"));

    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith("Error message");
    });

    expect(config.closeDeleteModal).not.toHaveBeenCalled();
  });

  test("displays error toast on exception", async () => {
    const config = renderModal({
      deleteRequirementBatch: vi.fn().mockRejectedValue(
        new Error("Exception message")
      ),
    });

    fireEvent.click(screen.getByText("Sí, estoy seguro"));

    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith(
        "Algo salió mal al eliminar los requerimientos. Intente de nuevo"
      );
    });

    expect(config.closeDeleteModal).not.toHaveBeenCalled();
  });
});
