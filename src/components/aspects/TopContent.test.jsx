/* eslint-disable no-undef */
import { render, screen, fireEvent } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import TopContent from "./TopContent";
import { vi } from "vitest";
import { useNavigate } from "react-router-dom";
vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual("react-router-dom");
  return {
    ...actual,
    useNavigate: vi.fn(),
  };
});

const mockedNavigate = vi.fn();

describe("TopContent Component", () => {
  beforeEach(() => {
    vi.resetAllMocks();
    vi.mocked(useNavigate).mockReturnValue(mockedNavigate);
  });

  const defaultProps = {
    subjectName: "Mathematics",
    onRowsPerPageChange: vi.fn(),
    totalAspects: 10,
    openModalCreate: vi.fn(),
    onFilterChange: vi.fn(),
    onClear: vi.fn(),
  };

  test("renders subject name and total aspects correctly", () => {
    render(
      <MemoryRouter>
        <TopContent {...defaultProps} />
      </MemoryRouter>
    );

    expect(screen.getByText("Aspectos de la materia: Mathematics")).toBeInTheDocument();
    expect(screen.getByText("Aspectos Totales: 10")).toBeInTheDocument();
  });

  test("navigates back to subjects when back button is clicked", () => {
    render(
      <MemoryRouter>
        <TopContent {...defaultProps} />
      </MemoryRouter>
    );

    const backButton = screen.getByText("Volver");
    fireEvent.click(backButton);

    expect(mockedNavigate).toHaveBeenCalledWith("/subjects");
  });

  test("opens modal to create a new aspect when 'Nuevo Aspecto' button is clicked", () => {
    render(
      <MemoryRouter>
        <TopContent {...defaultProps} />
      </MemoryRouter>
    );

    const newAspectButton = screen.getByText("Nuevo Aspecto");
    fireEvent.click(newAspectButton);

    expect(defaultProps.openModalCreate).toHaveBeenCalled();
  });

  test("triggers filter change on input change", () => {
    render(
      <MemoryRouter>
        <TopContent {...defaultProps} />
      </MemoryRouter>
    );

    const searchInput = screen.getByPlaceholderText("Buscar por nombre...");
    fireEvent.change(searchInput, { target: { value: "Safety" } });

    expect(defaultProps.onFilterChange).toHaveBeenCalledWith("Safety");
  });

  test("clears filter input when clear button is clicked", () => {
    render(
      <MemoryRouter>
        <TopContent {...defaultProps} />
      </MemoryRouter>
    );

    const searchInput = screen.getByPlaceholderText("Buscar por nombre...");
    fireEvent.change(searchInput, { target: { value: "Safety" } });
    const clearButton = screen.getByRole("button", { name: /clear/i });
    fireEvent.click(clearButton);

    expect(defaultProps.onClear).toHaveBeenCalled();
  });
});
