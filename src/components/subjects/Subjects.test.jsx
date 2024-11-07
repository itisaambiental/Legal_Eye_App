/* eslint-disable no-undef */
import { render, screen, fireEvent } from "@testing-library/react";
import Subjects from "./Subjects.jsx";
import useSubjects from "../../hooks/subject/useSubjects.jsx";

// Mock global de useSubjects
vi.mock("../../hooks/subject/useSubjects.jsx", () => ({
  __esModule: true,
  default: vi.fn(),
}));

describe("Subjects Component", () => {
  beforeEach(() => {
    useSubjects.mockReturnValue({
      subjects: [
        { id: 1, subject_name: "Environmental" },
        { id: 2, subject_name: "Safety" }
      ],
      loading: false,
      error: null,
      addSubject: vi.fn(),
      modifySubject: vi.fn(),
      removeSubject: vi.fn(),
      deleteSubjectsBatch: vi.fn(),
    });

    render(<Subjects />);
  });

  test("renders the subjects table with correct headers", () => {
    expect(screen.getByText("Materia")).toBeInTheDocument();
    expect(screen.getByText("Acciones")).toBeInTheDocument();
  });

  test("renders subjects data correctly in the table", () => {
    expect(screen.getByText("Environmental")).toBeInTheDocument();
    expect(screen.getByText("Safety")).toBeInTheDocument();
  });

  test("shows a loading indicator when subjects are loading", () => {
    useSubjects.mockReturnValueOnce({ ...useSubjects(), loading: true });
    render(<Subjects />);
    expect(screen.getByRole("status")).toBeInTheDocument();
  });

  test("displays an error message if there is an error loading subjects", () => {
    useSubjects.mockReturnValueOnce({ ...useSubjects(), error: "Failed to load subjects" });
    render(<Subjects />);
    expect(screen.getByText("Failed to load subjects")).toBeInTheDocument();
  });
});

describe("Subjects Component with no subjects", () => {
  beforeEach(() => {
    useSubjects.mockReturnValue({
      subjects: [],
      loading: false,
      error: null,
      addSubject: vi.fn(),
      modifySubject: vi.fn(),
      removeSubject: vi.fn(),
      deleteSubjectsBatch: vi.fn(),
    });

    render(<Subjects />);
  });

  test("renders empty content message when there are no subjects", () => {
    const emptyMessage = screen.getByText("No hay materias para mostrar");
    expect(emptyMessage).toBeInTheDocument();
  });
});

describe("Subjects Component - Edit Modal", () => {
  beforeEach(() => {
    useSubjects.mockReturnValue({
      subjects: [
        { id: 1, subject_name: "Environmental" },
        { id: 2, subject_name: "Safety" }
      ],
      loading: false,
      error: null,
      addSubject: vi.fn(),
      modifySubject: vi.fn(),
      removeSubject: vi.fn(),
      deleteSubjectsBatch: vi.fn(),
    });

    render(<Subjects />);
  });

  test("opens EditModal with correct data when Edit button is clicked", () => {
    const optionsButtons = screen.getAllByLabelText("Opciones");
    fireEvent.click(optionsButtons[0]);
    const editButton = screen.getByText("Editar Materia");
    fireEvent.click(editButton);

    const modalTitle = screen.getByRole("heading", { name: "Editar Materia" });
    expect(modalTitle).toBeInTheDocument();
    const nameInput = screen.getByDisplayValue("Environmental");
    expect(nameInput).toBeInTheDocument();
  });
});