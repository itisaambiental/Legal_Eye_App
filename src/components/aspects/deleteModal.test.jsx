/* eslint-disable no-undef */
import { render, screen, fireEvent } from "@testing-library/react";
import DeleteModal from "./deleteModal.jsx";
import { vi } from "vitest";

describe("DeleteModal Component for Aspects", () => {
    const mockCloseDeleteModal = vi.fn();
    const mockDeleteAspectsBatch = vi.fn();
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
                aspects={[{ id: 1 }, { id: 2 }]}
                deleteAspectsBatch={mockDeleteAspectsBatch}
                setShowDeleteModal={mockSetShowDeleteModal}
                setSelectedKeys={mockSetSelectedKeys}
                check="/path/to/check-icon"
            />
        );
    };

    beforeEach(() => {
        vi.clearAllMocks();
    });

    test("displays message for deleting all aspects", () => {
        renderModal(true, "all");
        expect(screen.getByText("¿Estás seguro de que deseas eliminar TODOS los aspectos?")).toBeInTheDocument();
    });

    test("displays message for deleting a single aspect", () => {
        renderModal(true, new Set([1]));
        expect(screen.getByText("¿Estás seguro de que deseas eliminar este aspecto?")).toBeInTheDocument();
    });

    test("displays message for deleting multiple aspects", () => {
        renderModal(true, new Set([1, 2]));
        expect(screen.getByText("¿Estás seguro de que deseas eliminar estos aspectos?")).toBeInTheDocument();
    });

    test("calls closeDeleteModal when clicking cancel button", () => {
        renderModal(true, new Set([1]));
        const cancelButton = screen.getByText("No, cancelar");
        fireEvent.click(cancelButton);
        expect(mockCloseDeleteModal).toHaveBeenCalledTimes(1);
    });
});
