/* eslint-disable no-undef */
import { render, screen, fireEvent } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import TopContent from "./TopContent";
import { vi } from "vitest";

describe("TopContent Component for Users", () => {
  const renderTopContent = (configOverrides = {}) => {
    const defaultConfig = {
      roles: [
        { id: 1, role: "Admin" },
        { id: 2, role: "Analyst" },
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
      ...configOverrides,
    };

    render(
      <MemoryRouter>
        <TopContent config={defaultConfig} />
      </MemoryRouter>
    );

    return defaultConfig; 
  };

  test("renders the total users count correctly", () => {
    renderTopContent();

    expect(screen.getByText("Usuarios totales: 12")).toBeInTheDocument();
  });

  test("opens modal to create a new user when 'Nuevo Usuario' button is clicked", () => {
    const config = renderTopContent();

    const newUserButton = screen.getByText("Nuevo Usuario");
    fireEvent.click(newUserButton);

    expect(config.openModalCreate).toHaveBeenCalled();
  });

  test("triggers filter change on input change", () => {
    const config = renderTopContent();

    const searchInput = screen.getByPlaceholderText(
      "Buscar por nombre o email..."
    );
    fireEvent.change(searchInput, { target: { value: "John" } });

    expect(config.onFilterChange).toHaveBeenCalledWith("John");
  });

  test("clears filter input when clear button is clicked", () => {
    const config = renderTopContent();

    const searchInput = screen.getByPlaceholderText(
      "Buscar por nombre o email..."
    );
    fireEvent.change(searchInput, { target: { value: "John" } });
    const clearButton = screen.getByRole("button", { name: /clear/i });
    fireEvent.click(clearButton);

    expect(config.onClear).toHaveBeenCalled();
  });

  test("changes rows per page when a new option is selected", () => {
    const config = renderTopContent();

    const select = screen.getByLabelText("Filas por página:");
    fireEvent.change(select, { target: { value: "10" } });

    expect(config.onRowsPerPageChange).toHaveBeenCalledWith(expect.anything());
  });

  test("displays roles correctly in dropdown and handles role selection change", () => {
    const config = renderTopContent();

    const dropdownButton = screen.getByText("Todos los Roles");
    fireEvent.click(dropdownButton);

    expect(screen.getByText("Admin")).toBeInTheDocument();
    expect(screen.getByText("Analyst")).toBeInTheDocument();

    const roleOption = screen.getByText("Admin");
    fireEvent.click(roleOption);

    expect(config.onRoleChange).toHaveBeenCalled();
  });
});
