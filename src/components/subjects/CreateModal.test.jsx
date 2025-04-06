/* eslint-disable no-undef */
import { render, screen, fireEvent, act } from "@testing-library/react";
import CreateModal from "./CreateModal";
import { useState } from "react";
import { toast } from "react-toastify";

describe("CreateModal Component for Subjects", () => {
  const mockCloseModalCreate = vi.fn();
  const mockAddSubject = vi.fn();

  vi.mock("react-toastify", () => ({
    toast: {
      error: vi.fn(),
      info: vi.fn(),
    },
  }));

  const TestCreateModalComponent = () => {
    const [formData, setFormData] = useState({
      name: "",
      order: "",
      abbreviation: "",
    });
    const [nameError, setNameError] = useState(null);
    const [orderError, setOrderError] = useState(null);
    const [abbreviationError, setAbbreviationError] = useState(null);

    const handleNameChange = (e) => {
      setFormData({ ...formData, name: e.target.value });
    };

    const handleOrderChange = (e) => {
      setFormData({ ...formData, order: e.target.value });
    };

    const handleAbbreviationChange = (e) => {
      setFormData({ ...formData, abbreviation: e.target.value });
    };

    const config = {
      isOpen: true,
      closeModalCreate: mockCloseModalCreate,
      addSubject: mockAddSubject,
      nameError,
      setNameError,
      handleNameChange,
      orderError,
      setOrderError,
      handleOrderChange,
      abbreviationError,
      setAbbreviationError,
      handleAbbreviationChange,
      formData,
    };

    return <CreateModal config={config} />;
  };

  beforeEach(() => {
    mockCloseModalCreate.mockClear();
    mockAddSubject.mockClear();
    render(<TestCreateModalComponent />);
  });

  test("modal opens with empty fields", () => {
    expect(screen.getByLabelText("Nombre de la Materia")).toHaveValue("");
    expect(screen.getByLabelText("Orden")).toHaveValue(null);
    expect(screen.getByLabelText("Abreviatura")).toHaveValue("");
  });

  test("shows validation errors when submitting empty", async () => {
    const submitButton = screen.getByText("Registrar Materia");
    await act(async () => {
      fireEvent.click(submitButton);
    });

    expect(screen.getByText("Este campo es obligatorio")).toBeInTheDocument();
  });

  test("updates all fields on input change", () => {
    fireEvent.change(screen.getByLabelText("Nombre de la Materia"), {
      target: { value: "Ecología" },
    });
    fireEvent.change(screen.getByLabelText("Orden"), {
      target: { value: "1" },
    });
    fireEvent.change(screen.getByLabelText("Abreviatura"), {
      target: { value: "Eco" },
    });

    expect(screen.getByLabelText("Nombre de la Materia")).toHaveValue("Ecología");
    expect(screen.getByLabelText("Orden")).toHaveValue(1);
    expect(screen.getByLabelText("Abreviatura")).toHaveValue("Eco");
  });

  test("closes the modal on successful subject creation", async () => {
    mockAddSubject.mockResolvedValueOnce({ success: true });

    fireEvent.change(screen.getByLabelText("Nombre de la Materia"), {
      target: { value: "Historia" },
    });
    fireEvent.change(screen.getByLabelText("Orden"), {
      target: { value: "2" },
    });
    fireEvent.change(screen.getByLabelText("Abreviatura"), {
      target: { value: "His" },
    });

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

    fireEvent.change(screen.getByLabelText("Nombre de la Materia"), {
      target: { value: "Matemáticas" },
    });
    fireEvent.change(screen.getByLabelText("Orden"), {
      target: { value: "1" },
    });
    fireEvent.change(screen.getByLabelText("Abreviatura"), {
      target: { value: "Mat" },
    });

    const submitButton = screen.getByText("Registrar Materia");
    await act(async () => {
      fireEvent.click(submitButton);
    });

    expect(toast.error).toHaveBeenCalledWith(
      "La materia ya existe. Cambia el nombre de la materia e intenta nuevamente."
    );
  });
});
