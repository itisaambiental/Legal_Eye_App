/* eslint-disable no-undef */
import { render, screen, fireEvent, act } from "@testing-library/react";
import CreateModal from "./CreateModal";
import { useState } from "react";
import { toast } from "react-toastify";

describe("CreateModal Component for Subjects", () => {
  const mockCloseModalCreate = vi.fn();
  const mockAddSubject = vi.fn();
  const mockSetNameError = vi.fn();

  vi.mock("react-toastify", () => ({
    toast: {
      error: vi.fn(),
      info: vi.fn(),
    },
  }));

  const TestCreateModalComponent = () => {
    const [formData, setFormData] = useState({ name: "" });
    const [nameError, setNameError] = useState(null);

    const handleNameChange = (e) => {
      setFormData({ ...formData, name: e.target.value });
    };

    const config = {
      isOpen: true,
      closeModalCreate: mockCloseModalCreate,
      addSubject: mockAddSubject,
      nameError,
      setNameError,
      handleNameChange,
      formData,
    };

    return <CreateModal config={config} />;
  };

  beforeEach(() => {
    mockSetNameError.mockClear();
    mockCloseModalCreate.mockClear();
    mockAddSubject.mockClear();
    render(<TestCreateModalComponent />);
  });

  test("modal opens with empty fields", () => {
    expect(screen.getByLabelText("Nombre de la Materia")).toHaveValue("");
  });

  test("displays error message when submitting without filling name field", async () => {
    const submitButton = screen.getByText("Registrar Materia");
    await act(async () => {
      fireEvent.click(submitButton);
    });

    expect(screen.queryByText("Este campo es obligatorio")).toBeInTheDocument();
  });

  test("updates name on input change", async () => {
    const nameInput = screen.getByLabelText("Nombre de la Materia");
    fireEvent.change(nameInput, { target: { value: "Ecología" } });

    expect(nameInput).toHaveValue("Ecología");
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
    expect(toast.info).toHaveBeenCalledWith(
      "La materia ha sido registrada correctamente",
      expect.anything()
    );
  });

  test("shows error toast when subject already exists", async () => {
    mockAddSubject.mockResolvedValueOnce({
      success: false,
      error:
        "La materia ya existe. Cambia el nombre de la materia e intenta nuevamente.",
    });

    const nameInput = screen.getByLabelText("Nombre de la Materia");
    fireEvent.change(nameInput, { target: { value: "Matemáticas" } });

    const submitButton = screen.getByText("Registrar Materia");
    await act(async () => {
      fireEvent.click(submitButton);
    });

    expect(toast.error).toHaveBeenCalledWith(
      "La materia ya existe. Cambia el nombre de la materia e intenta nuevamente."
    );
  });
});
