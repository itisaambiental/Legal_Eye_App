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
    legalBasis: [{ id: 1 }, { id: 2 }],
    deleteLegalBasisBatch: vi.fn(),
    setSelectedKeys: vi.fn(),
    check: "check-icon-url",
};

describe("DeleteModal Component for Legal Basis", () => {
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

    test("renders correctly", () => {
        renderModal();
        expect(screen.getByText("¿Estás seguro de que deseas eliminar estos Fundamentos Legales?")).toBeInTheDocument();
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
        
        await waitFor(() => expect(config.deleteLegalBasisBatch).toHaveBeenCalledWith([1, 2]));
    });

    test("displays success toast on successful deletion", async () => {
        const config = renderModal({
            deleteLegalBasisBatch: vi.fn().mockResolvedValue({ success: true })
        });

        fireEvent.click(screen.getByText("Sí, estoy seguro"));

        await waitFor(() => {
            expect(toast.info).toHaveBeenCalledWith(
                "Fundamentos legales eliminados con éxito",
                expect.any(Object)
            );
        });

        expect(config.closeDeleteModal).toHaveBeenCalled();
    });

    test("displays error toast on failed deletion", async () => {
        const config = renderModal({
            deleteLegalBasisBatch: vi.fn().mockResolvedValue({ success: false, error: "Error message" })
        });

        fireEvent.click(screen.getByText("Sí, estoy seguro"));

        await waitFor(() => {
            expect(toast.error).toHaveBeenCalledWith("Error message");
        });

        expect(config.closeDeleteModal).not.toHaveBeenCalled();
    });

    test("displays error toast on exception", async () => {
        const config = renderModal({
            deleteLegalBasisBatch: vi.fn().mockRejectedValue(new Error("Exception message"))
        });

        fireEvent.click(screen.getByText("Sí, estoy seguro"));

        await waitFor(() => {
            expect(toast.error).toHaveBeenCalledWith(
                "Algo salió mal al eliminar los fundamentos legales. Intente de nuevo"
            );
        });

        expect(config.closeDeleteModal).not.toHaveBeenCalled();
    });
});
