/* eslint-disable no-undef */
import { render, screen, fireEvent, act } from "@testing-library/react";
import CreateModal from "./CreateModal";
import { useState } from "react";
import { toast } from "react-toastify";

vi.mock("react-toastify", () => ({
  toast: {
    error: vi.fn(),
    info: vi.fn(),
  },
}));

describe("CreateModal Component for Aspects", () => {
  const mockCloseModalCreate = vi.fn();
  const mockAddAspect = vi.fn();

  const TestCreateModalComponent = () => {
    const [formData, setFormData] = useState({
      name: "",
      order: "",
      abbreviation: "",
      subject_id: 1,
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
      addAspect: mockAddAspect,
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
    mockAddAspect.mockClear();
    toast.error.mockClear();
    toast.info.mockClear();
    render(<TestCreateModalComponent />);
  });

  test("modal opens with empty fields", () => {
    expect(screen.getByLabelText("Nombre del Aspecto")).toHaveValue("");
    expect(screen.getByLabelText("Orden")).toHaveValue(null);
    expect(screen.getByLabelText("Abreviatura")).toHaveValue("");
  });

  test("shows validation errors when submitting empty", async () => {
    const submitButton = screen.getByText("Registrar Aspecto");

    await act(async () => {
      fireEvent.click(submitButton);
    });

    expect(screen.getByText("Este campo es obligatorio")).toBeInTheDocument();
  });

  test("updates all fields on input change", () => {
    fireEvent.change(screen.getByLabelText("Nombre del Aspecto"), {
      target: { value: "Calidad del Aire" },
    });
    fireEvent.change(screen.getByLabelText("Orden"), {
      target: { value: "2" },
    });
    fireEvent.change(screen.getByLabelText("Abreviatura"), {
      target: { value: "CA" },
    });

    expect(screen.getByLabelText("Nombre del Aspecto")).toHaveValue("Calidad del Aire");
    expect(screen.getByLabelText("Orden")).toHaveValue(2);
    expect(screen.getByLabelText("Abreviatura")).toHaveValue("CA");
  });

  test("closes the modal on successful aspect creation", async () => {
    mockAddAspect.mockResolvedValueOnce({ success: true });

    fireEvent.change(screen.getByLabelText("Nombre del Aspecto"), {
      target: { value: "Seguridad" },
    });
    fireEvent.change(screen.getByLabelText("Orden"), {
      target: { value: "3" },
    });
    fireEvent.change(screen.getByLabelText("Abreviatura"), {
      target: { value: "SEG" },
    });

    const submitButton = screen.getByText("Registrar Aspecto");
    await act(async () => {
      fireEvent.click(submitButton);
    });

    expect(mockAddAspect).toHaveBeenCalled();
    expect(mockCloseModalCreate).toHaveBeenCalled();
    expect(toast.info).toHaveBeenCalledWith(
      "El aspecto ha sido registrado correctamente",
      expect.anything()
    );
  });

  test("shows error toast when aspect already exists", async () => {
    mockAddAspect.mockResolvedValueOnce({
      success: false,
      error: "El aspecto ya existe.",
    });

    fireEvent.change(screen.getByLabelText("Nombre del Aspecto"), {
      target: { value: "Seguridad" },
    });
    fireEvent.change(screen.getByLabelText("Orden"), {
      target: { value: "1" },
    });
    fireEvent.change(screen.getByLabelText("Abreviatura"), {
      target: { value: "SEG" },
    });

    const submitButton = screen.getByText("Registrar Aspecto");
    await act(async () => {
      fireEvent.click(submitButton);
    });

    expect(toast.error).toHaveBeenCalledWith("El aspecto ya existe.");
    expect(mockCloseModalCreate).not.toHaveBeenCalled();
  });
});
