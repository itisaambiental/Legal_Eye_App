/* eslint-disable no-undef */
import { render, screen, fireEvent } from "@testing-library/react";
import DeleteModal from "../users/deleteModal.jsx";

describe("DeleteModal Component", () => {
  const mockCloseDeleteModal = vi.fn();
  const mockDeleteUsersBatch = vi.fn();
  const mockSetIsDeletingBatch = vi.fn();
  const mockSetShowDeleteModal = vi.fn();
  const mockSetSelectedKeys = vi.fn();

  const renderModal = (showDeleteModal, selectedKeys) => {
    const config = {
      showDeleteModal,
      closeDeleteModal: mockCloseDeleteModal,
      setIsDeletingBatch: mockSetIsDeletingBatch,
      isDeletingBatch: false,
      selectedKeys,
      users: [{ id: 1 }, { id: 2 }],
      deleteUsersBatch: mockDeleteUsersBatch,
      setShowDeleteModal: mockSetShowDeleteModal,
      setSelectedKeys: mockSetSelectedKeys,
      check: "check-icon-path",
    };

    render(<DeleteModal config={config} />);
  };

  beforeEach(() => {
    mockCloseDeleteModal.mockClear();
    mockDeleteUsersBatch.mockClear();
    mockSetIsDeletingBatch.mockClear();
    mockSetShowDeleteModal.mockClear();
    mockSetSelectedKeys.mockClear();
  });

  test("displays message for deleting all users", () => {
    renderModal(true, "all");
    expect(
      screen.getByText(
        "¿Estás seguro de que deseas eliminar TODOS los usuarios?"
      )
    ).toBeInTheDocument();
  });

  test("displays message for deleting a single user", () => {
    renderModal(true, new Set([1]));
    expect(
      screen.getByText("¿Estás seguro de que deseas eliminar este usuario?")
    ).toBeInTheDocument();
  });

  test("displays message for deleting multiple users", () => {
    renderModal(true, new Set([1, 2]));
    expect(
      screen.getByText("¿Estás seguro de que deseas eliminar estos usuarios?")
    ).toBeInTheDocument();
  });

  test("calls closeDeleteModal when clicking cancel button", () => {
    renderModal(true, new Set([1]));
    const cancelButton = screen.getByText("No, cancelar");
    fireEvent.click(cancelButton);
    expect(mockCloseDeleteModal).toHaveBeenCalledTimes(1);
  });
});
