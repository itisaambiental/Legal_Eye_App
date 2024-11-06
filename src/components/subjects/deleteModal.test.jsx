/* eslint-disable no-undef */
import { render, screen, fireEvent } from "@testing-library/react";
import DeleteModal from "../subjects/deleteModal";

describe("DeleteModal Component for Subjects", () => {
    const mockCloseDeleteModal = vi.fn();
    const mockDeleteSubjectsBatch = vi.fn();
    const mockSetIsDeletingBatch = vi.fn();
    const mockSetShowDeleteModal = vi.fn();
    const mockSetSelectedKeys = vi.fn();

    const renderModal = (showDeleteModal, selectedKeys) => {
        render(
            <DeleteModal
                showDeleteModal={showDeleteModal}
                closeDeleteModal={mockCloseDeleteModal}
                setIsDeletingBatch={mockSetIsDeletingBatch}
                isDeletingBatch={false}
                selectedKeys={selectedKeys}
                subjects={[{ id: 1 }, { id: 2 }]}
                deleteSubjectsBatch={mockDeleteSubjectsBatch}
                setShowDeleteModal={mockSetShowDeleteModal}
                setSelectedKeys={mockSetSelectedKeys}
            />
        );
    };

    beforeEach(() => {
        mockCloseDeleteModal.mockClear();
        mockDeleteSubjectsBatch.mockClear();
        mockSetIsDeletingBatch.mockClear();
        mockSetShowDeleteModal.mockClear();
        mockSetSelectedKeys.mockClear();
    });

    test("displays message for deleting all subjects", () => {
        renderModal(true, "all");
        expect(screen.getByText("¿Estás seguro de que deseas eliminar TODAS las materias?")).toBeInTheDocument();
    });

    test("displays message for deleting a single subject", () => {
        renderModal(true, new Set([1]));
        expect(screen.getByText("¿Estás seguro de que deseas eliminar esta materia?")).toBeInTheDocument();
    });

    test("displays message for deleting multiple subjects", () => {
        renderModal(true, new Set([1, 2]));
        expect(screen.getByText("¿Estás seguro de que deseas eliminar estas materias?")).toBeInTheDocument();
    });

    test("calls closeDeleteModal when clicking cancel button", () => {
        renderModal(true, new Set([1]));
        const cancelButton = screen.getByText("No, cancelar");
        fireEvent.click(cancelButton);
        expect(mockCloseDeleteModal).toHaveBeenCalledTimes(1);
    });
});
