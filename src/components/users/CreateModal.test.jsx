/* eslint-disable no-undef */
import { render, screen, fireEvent, act } from "@testing-library/react";
import CreateModal from "./CreateModal";
import { vi } from "vitest";
import { useState } from "react";

describe("CreateModal Component", () => {
    const mockCloseModalCreate = vi.fn();
    const mockAddUser = vi.fn();
    const mockSetNameError = vi.fn();
    const mockSetEmailError = vi.fn();
    const mockSetusertypeError = vi.fn();

    const TestCreateModalComponent = () => {
        const [formData, setFormData] = useState({ nombre: "", email: "", user_type: "", profile_picture: null });

        const handleNameChange = (e) => {
            setFormData({ ...formData, nombre: e.target.value });
        };

        const handleEmailChange = (e) => {
            setFormData({ ...formData, email: e.target.value });
        };

        const handleTypeChange = (value) => {
            setFormData({ ...formData, user_type: value });
        };

        return (
            <CreateModal
                isOpen={true}
                closeModalCreate={mockCloseModalCreate}
                addUser={mockAddUser}
                handleEmailChange={handleEmailChange}
                handleNameChange={handleNameChange}
                handleFileChange={vi.fn()}
                handleRemoveImage={vi.fn()}
                handleTypeChange={handleTypeChange}
                formData={formData}
                nameError={null}
                setNameError={mockSetNameError}
                emailError={null}
                setEmailError={mockSetEmailError}
                usertypeError={null}
                setusertypeError={mockSetusertypeError}
                fileError={null}
                roles={[{ id: 1, role: "Admin" }, { id: 2, role: "Analyst" }]}
                translateRole={(role) => (role === "Admin" ? "Admin" : "Analista")}
            />
        );
    };

    beforeEach(() => {
        mockSetNameError.mockClear();
        mockSetEmailError.mockClear();
        mockSetusertypeError.mockClear();
        render(<TestCreateModalComponent />);
    });

    test("modal opens with empty fields", () => {
        expect(screen.getByLabelText("Nombre")).toHaveValue("");
        expect(screen.getByLabelText("Correo Electrónico")).toHaveValue("");
        expect(screen.getByText("Selecciona el tipo de usuario")).toBeInTheDocument();
    });

    test("displays error messages when submitting without filling name field", () => {
        const submitButton = screen.getByText("Registrar Usuario");
        fireEvent.click(submitButton);
        expect(mockSetNameError).toHaveBeenCalledWith("Este campo es obligatorio");
    });

    test("updates name on input change", async () => {
        const nameInput = screen.getByLabelText("Nombre");
        fireEvent.change(nameInput, { target: { value: "Nuevo Nombre" } });
        expect(nameInput).toHaveValue("Nuevo Nombre");
        const submitButton = screen.getByText("Registrar Usuario");
        await act(async () => {
            fireEvent.click(submitButton);
        });
        expect(mockSetNameError).not.toHaveBeenCalledWith("Este campo es obligatorio");
        expect(mockSetEmailError).toHaveBeenCalledWith("Este campo es obligatorio");
    });
    test("displays email error when email format is incorrect", async () => {
      const nameInput = screen.getByLabelText("Nombre");
      fireEvent.change(nameInput, { target: { value: "Nuevo Nombre" } });

      const emailInput = screen.getByLabelText("Correo Electrónico");
      fireEvent.change(emailInput, { target: { value: "example@gmail.com" } });

      const submitButton = screen.getByText("Registrar Usuario");
      await act(async () => {
          fireEvent.click(submitButton);
      });

      expect(mockSetEmailError).toHaveBeenCalledWith("El correo debe terminar con @isaambiental.com");
  });
  test("displays user type error when user type is not filled", async () => {
    const nameInput = screen.getByLabelText("Nombre");
    fireEvent.change(nameInput, { target: { value: "Nuevo Nombre" } });

    const emailInput = screen.getByLabelText("Correo Electrónico");
    fireEvent.change(emailInput, { target: { value: "usuario@isaambiental.com" } });

    const submitButton = screen.getByText("Registrar Usuario");
    await act(async () => {
        fireEvent.click(submitButton);
    });

    expect(mockSetusertypeError).toHaveBeenCalledWith("Este campo es obligatorio");
});
});
