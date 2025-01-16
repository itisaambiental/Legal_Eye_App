/* eslint-disable no-undef */
import { render, screen, fireEvent } from "@testing-library/react";
import DeleteModal from "./deleteModal.jsx";
import { vi } from "vitest";

describe("DeleteModal Component for Aspects", () => {
  const mockCloseDeleteModal = vi.fn();
  const mockDeleteAspectsBatch = vi.fn();
  const mockSetIsDeletingBatch = vi.fn();
  const mockSetSelectedKeys = vi.fn();

  const renderModal = (config) => {
    render(<DeleteModal config={config} />);
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  const defaultConfig = {
    showDeleteModal: true,
    closeDeleteModal: mockCloseDeleteModal,
    setIsDeletingBatch: mockSetIsDeletingBatch,
    isDeletingBatch: false,
    selectedKeys: new Set([1, 2]),
    aspects: [{ id: 1 }, { id: 2 }],
    deleteAspectsBatch: mockDeleteAspectsBatch,
    setSelectedKeys: mockSetSelectedKeys,
    check: "/path/to/check-icon",
  };

  test("displays message for deleting all aspects", () => {
    renderModal({
      ...defaultConfig,
      selectedKeys: "all",
    });

    expect(
      screen.getByText(
        "¿Estás seguro de que deseas eliminar TODOS los aspectos?"
      )
    ).toBeInTheDocument();
  });

  test("displays message for deleting a single aspect", () => {
    renderModal({
      ...defaultConfig,
      selectedKeys: new Set([1]),
    });

    expect(
      screen.getByText("¿Estás seguro de que deseas eliminar este aspecto?")
    ).toBeInTheDocument();
  });

  test("displays message for deleting multiple aspects", () => {
    renderModal({
      ...defaultConfig,
      selectedKeys: new Set([1, 2]),
    });

    expect(
      screen.getByText("¿Estás seguro de que deseas eliminar estos aspectos?")
    ).toBeInTheDocument();
  });

  test("calls closeDeleteModal when clicking cancel button", () => {
    renderModal({
      ...defaultConfig,
      selectedKeys: new Set([1]),
    });

    const cancelButton = screen.getByText("No, cancelar");
    fireEvent.click(cancelButton);

    expect(mockCloseDeleteModal).toHaveBeenCalledTimes(1);
  });

  test("handles delete batch process when confirming deletion", async () => {
    mockDeleteAspectsBatch.mockResolvedValueOnce({ success: true });
    const mockSetIsDeletingBatch = vi.fn();

    renderModal({
      ...defaultConfig,
      setIsDeletingBatch: mockSetIsDeletingBatch,
    });

    const confirmButton = screen.getByText("Sí, estoy seguro");
    fireEvent.click(confirmButton);

    expect(mockSetIsDeletingBatch).toHaveBeenCalledWith(true);
    expect(mockDeleteAspectsBatch).toHaveBeenCalledWith([1, 2]);
  });
});
