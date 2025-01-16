/* eslint-disable no-undef */
import { render, screen, fireEvent } from "@testing-library/react";
import DeleteModal from "../subjects/deleteModal";

describe("DeleteModal Component for Subjects", () => {
  const mockCloseDeleteModal = vi.fn();
  const mockDeleteSubjectsBatch = vi.fn();
  const mockSetIsDeletingBatch = vi.fn();
  const mockSetSelectedKeys = vi.fn();

  const defaultConfig = {
    showDeleteModal: true,
    closeDeleteModal: mockCloseDeleteModal,
    setIsDeletingBatch: mockSetIsDeletingBatch,
    isDeletingBatch: false,
    selectedKeys: new Set(),
    subjects: [{ id: 1 }, { id: 2 }],
    deleteSubjectsBatch: mockDeleteSubjectsBatch,
    setSelectedKeys: mockSetSelectedKeys,
    check: "/path/to/success/icon.png",
  };

  const renderModal = (configOverrides = {}) => {
    const config = { ...defaultConfig, ...configOverrides };
    render(<DeleteModal config={config} />);
  };

  beforeEach(() => {
    mockCloseDeleteModal.mockClear();
    mockDeleteSubjectsBatch.mockClear();
    mockSetIsDeletingBatch.mockClear();
    mockSetSelectedKeys.mockClear();
  });

  test("displays message for deleting all subjects", () => {
    renderModal({ selectedKeys: "all" });
    expect(
      screen.getByText(
        "¿Estás seguro de que deseas eliminar TODAS las materias?"
      )
    ).toBeInTheDocument();
  });

  test("displays message for deleting a single subject", () => {
    renderModal({ selectedKeys: new Set([1]) });
    expect(
      screen.getByText("¿Estás seguro de que deseas eliminar esta materia?")
    ).toBeInTheDocument();
  });

  test("displays message for deleting multiple subjects", () => {
    renderModal({ selectedKeys: new Set([1, 2]) });
    expect(
      screen.getByText("¿Estás seguro de que deseas eliminar estas materias?")
    ).toBeInTheDocument();
  });

  test("calls closeDeleteModal when clicking cancel button", () => {
    renderModal({ selectedKeys: new Set([1]) });
    const cancelButton = screen.getByText("No, cancelar");
    fireEvent.click(cancelButton);
    expect(mockCloseDeleteModal).toHaveBeenCalledTimes(1);
  });

  test("calls deleteSubjectsBatch when confirming deletion", async () => {
    renderModal({ selectedKeys: new Set([1]) });
    const confirmButton = screen.getByText("Sí, estoy seguro");
    fireEvent.click(confirmButton);
    expect(mockSetIsDeletingBatch).toHaveBeenCalledWith(true);
    expect(mockDeleteSubjectsBatch).toHaveBeenCalledWith([1]);
  });
});
