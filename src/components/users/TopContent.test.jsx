/* eslint-disable no-undef */
import { render, screen, fireEvent } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import TopContent from "./TopContent";
import { vi } from "vitest";

describe("TopContent Component for Users", () => {
  const defaultProps = {
    roles: [
      { id: 1, role: "Admin" },
      { id: 2, role: "Analyst" }
    ],
    onRowsPerPageChange: vi.fn(),
    totalUsers: 12,
    capitalize: vi.fn((text) => text.charAt(0).toUpperCase() + text.slice(1)),
    openModalCreate: vi.fn(),
    onFilterChange: vi.fn(),
    onClear: vi.fn(),
    selectedValue: "Todos los Roles",
    selectedRoleKeys: new Set(["0"]),
    onRoleChange: vi.fn(),
    translateRole: vi.fn((role) => role),
  };

  test("renders the total users count correctly", () => {
    render(
      <MemoryRouter>
        <TopContent {...defaultProps} />
      </MemoryRouter>
    );

    expect(screen.getByText("Usuarios totales: 12")).toBeInTheDocument();
  });

  test("opens modal to create a new user when 'Nuevo Usuario' button is clicked", () => {
    render(
      <MemoryRouter>
        <TopContent {...defaultProps} />
      </MemoryRouter>
    );

    const newUserButton = screen.getByText("Nuevo Usuario");
    fireEvent.click(newUserButton);

    expect(defaultProps.openModalCreate).toHaveBeenCalled();
  });

  test("triggers filter change on input change", () => {
    render(
      <MemoryRouter>
        <TopContent {...defaultProps} />
      </MemoryRouter>
    );

    const searchInput = screen.getByPlaceholderText("Buscar por nombre o email...");
    fireEvent.change(searchInput, { target: { value: "John" } });

    expect(defaultProps.onFilterChange).toHaveBeenCalledWith("John");
  });

  test("clears filter input when clear button is clicked", () => {
    render(
      <MemoryRouter>
        <TopContent {...defaultProps} />
      </MemoryRouter>
    );

    const searchInput = screen.getByPlaceholderText("Buscar por nombre o email...");
    fireEvent.change(searchInput, { target: { value: "John" } });
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

  test("displays roles correctly in dropdown and handles role selection change", () => {
    render(
      <MemoryRouter>
        <TopContent {...defaultProps} />
      </MemoryRouter>
    );

    const dropdownButton = screen.getByText("Todos los Roles");
    fireEvent.click(dropdownButton);

    expect(screen.getByText("Admin")).toBeInTheDocument();
    expect(screen.getByText("Analyst")).toBeInTheDocument();

    const roleOption = screen.getByText("Admin");
    fireEvent.click(roleOption);

    expect(defaultProps.onRoleChange).toHaveBeenCalled();
  });
});
