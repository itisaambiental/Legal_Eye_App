/* eslint-disable no-undef */
import { render, screen, fireEvent } from "@testing-library/react";
import DeleteModal from "./deleteModal.jsx";
import { ToastContainer } from "react-toastify";

describe("DeleteModal Component for Articles", () => {
  const mockCloseDeleteModal = vi.fn();
  const mockDeleteArticlesBatch = vi.fn();
  const mockSetIsDeletingBatch = vi.fn();
  const mockSetSelectedKeys = vi.fn();

  const defaultConfig = {
    showDeleteModal: true,
    closeDeleteModal: mockCloseDeleteModal,
    setIsDeletingBatch: mockSetIsDeletingBatch,
    isDeletingBatch: false,
    selectedKeys: new Set(),
    articles: [{ id: 1 }, { id: 2 }],
    deleteArticlesBatch: mockDeleteArticlesBatch,
    setSelectedKeys: mockSetSelectedKeys,
    check: "/path/to/success/icon.png",
  };

  const renderModal = (configOverrides = {}) => {
    const config = { ...defaultConfig, ...configOverrides };
    render(
      <>
        <ToastContainer />
        <DeleteModal config={config} />
      </>
    );
  };

  beforeEach(() => {
    mockCloseDeleteModal.mockClear();
    mockDeleteArticlesBatch.mockClear();
    mockSetIsDeletingBatch.mockClear();
    mockSetSelectedKeys.mockClear();
  });

  test("displays message for deleting all articles", () => {
    renderModal({ selectedKeys: "all" });
    expect(
      screen.getByText("¿Estás seguro de que deseas eliminar TODOS los artículos?")
    ).toBeInTheDocument();
  });

  test("displays message for deleting a single article", () => {
    renderModal({ selectedKeys: new Set([1]) });
    expect(
      screen.getByText("¿Estás seguro de que deseas eliminar este artículo?")
    ).toBeInTheDocument();
  });

  test("displays message for deleting multiple articles", () => {
    renderModal({ selectedKeys: new Set([1, 2]) });
    expect(
      screen.getByText("¿Estás seguro de que deseas eliminar estos artículos?")
    ).toBeInTheDocument();
  });

  test("calls closeDeleteModal when clicking cancel button", () => {
    renderModal({ selectedKeys: new Set([1]) });
    const cancelButton = screen.getByText("No, cancelar");
    fireEvent.click(cancelButton);
    expect(mockCloseDeleteModal).toHaveBeenCalledTimes(1);
  });

  test("calls deleteArticlesBatch when confirming deletion", async () => {
    renderModal({ selectedKeys: new Set([1]) });
    const confirmButton = screen.getByText("Sí, estoy seguro");
    fireEvent.click(confirmButton);
    expect(mockSetIsDeletingBatch).toHaveBeenCalledWith(true);
    expect(mockDeleteArticlesBatch).toHaveBeenCalledWith([1]);
  });

  test("displays success toast on successful deletion", async () => {
    mockDeleteArticlesBatch.mockResolvedValue({ success: true });

    renderModal({ selectedKeys: new Set([1]) });
    const confirmButton = screen.getByText("Sí, estoy seguro");
    fireEvent.click(confirmButton);

    expect(await screen.findByText("Artículo eliminado con éxito")).toBeInTheDocument();
    expect(mockSetSelectedKeys).toHaveBeenCalledWith(new Set());
    expect(mockCloseDeleteModal).toHaveBeenCalledTimes(1);
  });

  test("displays error toast on deletion failure", async () => {
    mockDeleteArticlesBatch.mockResolvedValue({
      success: false,
      error: "Error al eliminar",
    });

    renderModal({ selectedKeys: new Set([1]) });
    const confirmButton = screen.getByText("Sí, estoy seguro");
    fireEvent.click(confirmButton);

    expect(await screen.findByText("Error al eliminar")).toBeInTheDocument();
    expect(mockCloseDeleteModal).not.toHaveBeenCalled();
  });
});
