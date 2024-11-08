/* eslint-disable no-undef */
import { render, screen, fireEvent } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import TopContent from "./TopContent";
import { vi } from "vitest";

describe("TopContent Component for Subjects", () => {
  const defaultProps = {
    onRowsPerPageChange: vi.fn(),
    totalSubjects: 8,
    openModalCreate: vi.fn(),
    onFilterChange: vi.fn(),
    onClear: vi.fn(),
  };

  test("renders the total subjects count correctly", () => {
    render(
      <MemoryRouter>
        <TopContent {...defaultProps} />
      </MemoryRouter>
    );

    expect(screen.getByText("Materias totales: 8")).toBeInTheDocument();
  });

  test("opens modal to create a new subject when 'Nueva Materia' button is clicked", () => {
    render(
      <MemoryRouter>
        <TopContent {...defaultProps} />
      </MemoryRouter>
    );

    const newSubjectButton = screen.getByText("Nueva Materia");
    fireEvent.click(newSubjectButton);

    expect(defaultProps.openModalCreate).toHaveBeenCalled();
  });

  test("triggers filter change on input change", () => {
    render(
      <MemoryRouter>
        <TopContent {...defaultProps} />
      </MemoryRouter>
    );

    const searchInput = screen.getByPlaceholderText("Buscar por nombre...");
    fireEvent.change(searchInput, { target: { value: "Math" } });

    expect(defaultProps.onFilterChange).toHaveBeenCalledWith("Math");
  });

  test("clears filter input when clear button is clicked", () => {
    render(
      <MemoryRouter>
        <TopContent {...defaultProps} />
      </MemoryRouter>
    );

    const searchInput = screen.getByPlaceholderText("Buscar por nombre...");
    fireEvent.change(searchInput, { target: { value: "Math" } });
    const clearButton = screen.getByRole("button", { name: /clear/i });
    fireEvent.click(clearButton);

    expect(defaultProps.onClear).toHaveBeenCalled();
  });

  test("changes rows per page when a new option is selected", () => {
    render(
      <MemoryRouter>
        <TopContent {...defaultProps} />
      </MemoryRouter>
    );

    const select = screen.getByLabelText("Filas por página:");
    fireEvent.change(select, { target: { value: "10" } });

    expect(defaultProps.onRowsPerPageChange).toHaveBeenCalledWith(expect.anything());
  });
});
