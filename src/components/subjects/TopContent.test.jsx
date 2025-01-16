/* eslint-disable no-undef */
import { render, screen, fireEvent } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import TopContent from "./TopContent";
import { vi } from "vitest";

describe("TopContent Component for Subjects", () => {
  const defaultConfig = {
    onRowsPerPageChange: vi.fn(),
    totalSubjects: 8,
    openModalCreate: vi.fn(),
    onFilterChange: vi.fn(),
    onClear: vi.fn(),
  };

  const renderComponent = (config = defaultConfig) => {
    render(
      <MemoryRouter>
        <TopContent config={config} />
      </MemoryRouter>
    );
  };

  test("renders the total subjects count correctly", () => {
    renderComponent();

    expect(screen.getByText("Materias totales: 8")).toBeInTheDocument();
  });

  test("opens modal to create a new subject when 'Nueva Materia' button is clicked", () => {
    renderComponent();

    const newSubjectButton = screen.getByText("Nueva Materia");
    fireEvent.click(newSubjectButton);

    expect(defaultConfig.openModalCreate).toHaveBeenCalled();
  });

  test("triggers filter change on input change", () => {
    renderComponent();

    const searchInput = screen.getByPlaceholderText("Buscar por nombre...");
    fireEvent.change(searchInput, { target: { value: "Math" } });

    expect(defaultConfig.onFilterChange).toHaveBeenCalledWith("Math");
  });

  test("clears filter input when clear button is clicked", () => {
    renderComponent();

    const searchInput = screen.getByPlaceholderText("Buscar por nombre...");
    fireEvent.change(searchInput, { target: { value: "Math" } });
    const clearButton = screen.getByRole("button", { name: /clear/i });
    fireEvent.click(clearButton);

    expect(defaultConfig.onClear).toHaveBeenCalled();
  });

  test("changes rows per page when a new option is selected", () => {
    renderComponent();

    const select = screen.getByLabelText("Filas por página:");
    fireEvent.change(select, { target: { value: "10" } });

    expect(defaultConfig.onRowsPerPageChange).toHaveBeenCalledWith(
      expect.anything()
    );
  });
});
