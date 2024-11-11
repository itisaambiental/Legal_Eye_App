/* eslint-disable no-undef */
import { render, screen, fireEvent, act } from "@testing-library/react";
import CreateModal from "./CreateModal";
import { useState } from "react";
import { toast } from 'react-toastify';

describe("CreateModal Component for Aspects", () => {
    const mockCloseModalCreate = vi.fn();
    const mockAddAspect = vi.fn();
    const mockSetNameError = vi.fn();


    vi.mock('react-toastify', () => ({
        toast: {
            error: vi.fn(),
            info: vi.fn(),
        },
    }));

    const TestCreateModalComponent = () => {
        const [formData, setFormData] = useState({ nombre: "", subject_id: 1 });
        const handleNameChange = (e) => {
            setFormData({ ...formData, nombre: e.target.value });
        };
        return (
            <CreateModal
                isOpen={true}
                closeModalCreate={mockCloseModalCreate}
                addAspect={mockAddAspect}
                handleNameChange={handleNameChange}
                formData={formData}
                nameError={null}
                setNameError={mockSetNameError}
            />
        );
    };

    beforeEach(() => {
        mockSetNameError.mockClear();
        render(<TestCreateModalComponent />);
    });

    test("modal opens with empty fields", () => {
        expect(screen.getByLabelText("Nombre del Aspecto")).toHaveValue("");
    });

    test("displays error message when submitting without filling name field", () => {
        const submitButton = screen.getByText("Registrar Aspecto");
        fireEvent.click(submitButton);
        expect(mockSetNameError).toHaveBeenCalledWith("Este campo es obligatorio");
    });

    test("updates name on input change", async () => {
        const nameInput = screen.getByLabelText("Nombre del Aspecto");
        fireEvent.change(nameInput, { target: { value: "Seguridad" } });
        expect(nameInput).toHaveValue("Seguridad");
        const submitButton = screen.getByText("Registrar Aspecto");
        await act(async () => {
            fireEvent.click(submitButton);
        });
        expect(mockSetNameError).not.toHaveBeenCalledWith("Este campo es obligatorio");
    });

    test("closes the modal on successful aspect creation", async () => {
        mockAddAspect.mockResolvedValueOnce({ success: true });
        const nameInput = screen.getByLabelText("Nombre del Aspecto");
        fireEvent.change(nameInput, { target: { value: "Seguridad" } });
        const submitButton = screen.getByText("Registrar Aspecto");
        await act(async () => {
            fireEvent.click(submitButton);
        });
        expect(mockCloseModalCreate).toHaveBeenCalled();
    });

    test("shows error toast when aspect already exists", async () => {
        mockAddAspect.mockResolvedValueOnce({ success: false, error: "El aspecto ya existe. Por favor cambie el nombre e intente de nuevo." });
        const nameInput = screen.getByLabelText("Nombre del Aspecto");
        fireEvent.change(nameInput, { target: { value: "Seguridad" } });
        const submitButton = screen.getByText("Registrar Aspecto");
        await act(async () => {
            fireEvent.click(submitButton);
        });
        expect(toast.error).toHaveBeenCalledWith("El aspecto ya existe. Por favor cambie el nombre e intente de nuevo.");

        expect(mockSetNameError).not.toHaveBeenCalledWith("Este campo es obligatorio");
    });
});
