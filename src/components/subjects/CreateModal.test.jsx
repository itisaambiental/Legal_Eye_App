/* eslint-disable no-undef */
import { render, screen, fireEvent, act } from "@testing-library/react";
import CreateModal from "./CreateModal";
import { useState } from "react";
import { toast } from 'react-toastify';
describe("CreateModal Component for Subjects", () => {
    const mockCloseModalCreate = vi.fn();
    const mockAddSubject = vi.fn();
    const mockSetNameError = vi.fn();



    vi.mock('react-toastify', () => ({
        toast: {
            error: vi.fn(),
            info: vi.fn(),
        },
    }));

    const TestCreateModalComponent = () => {
        const [formData, setFormData] = useState({ nombre: "" });
        const handleNameChange = (e) => {
            setFormData({ ...formData, nombre: e.target.value });
        };
        return (
            <CreateModal
                isOpen={true}
                closeModalCreate={mockCloseModalCreate}
                addSubject={mockAddSubject}
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
        expect(screen.getByLabelText("Nombre de la Materia")).toHaveValue("");
    });

    test("displays error message when submitting without filling name field", () => {
        const submitButton = screen.getByText("Registrar Materia");
        fireEvent.click(submitButton);
        expect(mockSetNameError).toHaveBeenCalledWith("Este campo es obligatorio");
    });

    test("updates name on input change", async () => {
        const nameInput = screen.getByLabelText("Nombre de la Materia");
        fireEvent.change(nameInput, { target: { value: "Ecología" } });
        expect(nameInput).toHaveValue("Ecología");
        const submitButton = screen.getByText("Registrar Materia");
        await act(async () => {
            fireEvent.click(submitButton);
        });
        expect(mockSetNameError).not.toHaveBeenCalledWith("Este campo es obligatorio");
    });

    test("closes the modal on successful subject creation", async () => {
        mockAddSubject.mockResolvedValueOnce({ success: true });
        const nameInput = screen.getByLabelText("Nombre de la Materia");
        fireEvent.change(nameInput, { target: { value: "Ecología" } });
        const submitButton = screen.getByText("Registrar Materia");
        await act(async () => {
            fireEvent.click(submitButton);
        });
        expect(mockCloseModalCreate).toHaveBeenCalled();
    });

    test("shows error toast when subject already exists", async () => {
        mockAddSubject.mockResolvedValueOnce({ success: false, error: "La materia ya existe. Cambia el nombre de la materia e intenta nuevamente." });
        const nameInput = screen.getByLabelText("Nombre de la Materia");
        fireEvent.change(nameInput, { target: { value: "Matemáticas" } });
        const submitButton = screen.getByText("Registrar Materia");
        
        await act(async () => {
            fireEvent.click(submitButton);
        });

        expect(toast.error).toHaveBeenCalledWith("La materia ya existe. Cambia el nombre de la materia e intenta nuevamente.");
        expect(mockSetNameError).not.toHaveBeenCalledWith("Este campo es obligatorio");
    });
});
