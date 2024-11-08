/* eslint-disable no-undef */
import { render, screen, fireEvent } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import Aspects from "./Aspects.jsx";
import useAspects from "../../hooks/aspect/useAspects.jsx";
import useSubjects from "../../hooks/subject/useSubjects.jsx";
import { vi } from "vitest";

vi.mock("../../hooks/aspect/useAspects.jsx", () => ({
  __esModule: true,
  default: vi.fn(),
}));

vi.mock("../../hooks/subject/useSubjects.jsx", () => ({
  __esModule: true,
  default: vi.fn(),
}));

describe("Aspects Component", () => {
  beforeEach(() => {
    useAspects.mockReturnValue({
      aspects: [
        { id: 1, aspect_name: "Safety" },
        { id: 2, aspect_name: "Environment" }
      ],
      loading: false,
      error: null,
      fetchAspects: vi.fn(),
      addAspect: vi.fn(),
      modifyAspect: vi.fn(),
      removeAspect: vi.fn(),
      deleteAspectsBatch: vi.fn(),
    });

    useSubjects.mockReturnValue({
      fetchSubjectById: vi.fn().mockResolvedValue({
        success: true,
        data: { id: 1, subject_name: "Health" }
      }),
      loading: false,
      error: null,
    });

    render(
      <MemoryRouter>
        <Aspects />
      </MemoryRouter>
    );
  });

  test("renders the aspects table with correct headers", () => {
    expect(screen.getByText("Aspecto")).toBeInTheDocument();
    expect(screen.getByText("Acciones")).toBeInTheDocument();
  });

  test("renders aspects data correctly in the table", () => {
    expect(screen.getByText("Safety")).toBeInTheDocument();
    expect(screen.getByText("Environment")).toBeInTheDocument();
  });

  test("shows a loading indicator when aspects are loading", async () => {
    useAspects.mockReturnValueOnce({ ...useAspects(), loading: true });
    useSubjects.mockReturnValueOnce({ ...useSubjects(), loading: true }); 
    render(
      <MemoryRouter>
        <Aspects />
      </MemoryRouter>
    );
    expect(screen.getByRole("status")).toBeInTheDocument();
  });

  test("displays an error message if there is an error loading aspects", () => {
    useAspects.mockReturnValueOnce({ ...useAspects(), error: "Failed to load aspects" });
    render(
      <MemoryRouter>
        <Aspects />
      </MemoryRouter>
    );
    expect(screen.getByText("Failed to load aspects")).toBeInTheDocument();
  });

  describe("Aspects Component with no aspects", () => {
    beforeEach(() => {
      useAspects.mockReturnValue({
        aspects: [],
        loading: false,
        error: null,
        fetchAspects: vi.fn(),
        addAspect: vi.fn(),
        modifyAspect: vi.fn(),
        removeAspect: vi.fn(),
        deleteAspectsBatch: vi.fn(),
      });
  
      useSubjects.mockReturnValue({
        fetchSubjectById: vi.fn().mockResolvedValue({
          success: true,
          data: { id: 1, subject_name: "Health" }
        }),
        loading: false,
        error: null,
      });
  
      render(
        <MemoryRouter>
          <Aspects />
        </MemoryRouter>
      );
    });
  
    test("renders empty content message when there are no aspects", () => {
      const emptyMessage = screen.getByText("No hay aspectos para mostrar");
      expect(emptyMessage).toBeInTheDocument();
    });
  });
  
  describe("Aspects Component - Edit Modal", () => {
    beforeEach(() => {
      useAspects.mockReturnValue({
        aspects: [
          { id: 1, aspect_name: "Safety" },
          { id: 2, aspect_name: "Environment" }
        ],
        loading: false,
        error: null,
        fetchAspects: vi.fn(),
        addAspect: vi.fn(),
        modifyAspect: vi.fn(),
        removeAspect: vi.fn(),
        deleteAspectsBatch: vi.fn(),
      });
  
      useSubjects.mockReturnValue({
        fetchSubjectById: vi.fn().mockResolvedValue({
          success: true,
          data: { id: 1, subject_name: "Health" }
        }),
        loading: false,
        error: null,
      });
  
      render(
        <MemoryRouter>
          <Aspects />
        </MemoryRouter>
      );
    });
  
    test("opens EditModal with correct data when Edit button is clicked", async () => {
      const optionsButtons = screen.getAllByLabelText("Opciones");
      fireEvent.click(optionsButtons[0]);
      const editButton = screen.getByText("Editar Aspecto");
      fireEvent.click(editButton);
  
      const modalTitle = screen.getByRole("heading", { name: "Editar Aspecto" });
      expect(modalTitle).toBeInTheDocument();
      const nameInput = screen.getByDisplayValue("Safety");
      expect(nameInput).toBeInTheDocument();
    });
  });
})