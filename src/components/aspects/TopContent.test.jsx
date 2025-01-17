/* eslint-disable no-undef */
import { render, screen, fireEvent } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import TopContent from "./TopContent";
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
    config: {
      subjectName: "Mathematics",
      onRowsPerPageChange: vi.fn(),
      totalAspects: 10,
      openModalCreate: vi.fn(),
      onFilterByName: vi.fn(),
      onClear: vi.fn(),
      filterByName: "",
    },
  };

  test("renders subject name and total aspects correctly", () => {
    render(
      <MemoryRouter>
        <TopContent {...defaultProps} />
      </MemoryRouter>
    );

    expect(screen.getByText("Mathematics")).toBeInTheDocument();
    expect(screen.getByText("Aspectos totales: 10")).toBeInTheDocument();
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

    expect(defaultProps.config.openModalCreate).toHaveBeenCalled();
  });

  test("triggers filter change on input change", () => {
    render(
      <MemoryRouter>
        <TopContent {...defaultProps} />
      </MemoryRouter>
    );

    const searchInput = screen.getByPlaceholderText("Buscar por nombre...");
    fireEvent.change(searchInput, { target: { value: "Safety" } });

    expect(defaultProps.config.onFilterByName).toHaveBeenCalledWith("Safety");
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

    expect(defaultProps.config.onClear).toHaveBeenCalled();
  });

  test("updates rows per page when select option changes", () => {
    render(
      <MemoryRouter>
        <TopContent {...defaultProps} />
      </MemoryRouter>
    );

    const select = screen.getByLabelText(/Filas por página:/i);
    fireEvent.change(select, { target: { value: "10" } });

    expect(defaultProps.config.onRowsPerPageChange).toHaveBeenCalled();
  });
});
