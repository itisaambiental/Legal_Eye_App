/* eslint-disable no-undef */
import { render, screen, fireEvent } from "@testing-library/react";
import { describe, test, expect, vi } from "vitest";
import "@testing-library/jest-dom";
import TopContent from "./TopContent";

const baseMockConfig = {
  filterByName: "",
  filterByDescription: "",
  filterByClassification: "",
  onFilterByName: vi.fn(),
  onFilterByDescription: vi.fn(),
  onFilterByClassification: vi.fn(),
  onClear: vi.fn(),
  totalRequirementTypes: 42,
  onRowsPerPageChange: vi.fn(),
  openModalCreate: vi.fn(),
};

describe("TopContent Component for RequirementTypes", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  test("renders totalRequirementTypes correctly", () => {
    render(<TopContent config={baseMockConfig} />);
    expect(
      screen.getByText(/Tipos de requerimiento totales:\s*42/)
    ).toBeInTheDocument();
  });

  test("calls onRowsPerPageChange when selecting a new value", () => {
    render(<TopContent config={baseMockConfig} />);
    const select = screen.getByLabelText("Filas por página:");
    fireEvent.change(select, { target: { value: "10" } });
    expect(baseMockConfig.onRowsPerPageChange).toHaveBeenCalled();
  });

  test("calls openModalCreate when 'Nuevo Tipo de Requerimiento' is clicked", () => {
    render(<TopContent config={baseMockConfig} />);
    fireEvent.click(
      screen.getByRole("button", { name: "Nuevo Tipo de Requerimiento" })
    );
    expect(baseMockConfig.openModalCreate).toHaveBeenCalled();
  });

  test("calls onFilterByName when name input changes", () => {
    render(<TopContent config={baseMockConfig} />);
    const input = screen.getByPlaceholderText("Buscar por nombre...");
    fireEvent.change(input, { target: { value: "Ambiental" } });
    expect(baseMockConfig.onFilterByName).toHaveBeenCalledWith("Ambiental");
  });

  test("calls onClear when clear button in name input is clicked", () => {
    const updatedConfig = {
      ...baseMockConfig,
      filterByName: "Ambiental",
    };
    const { container } = render(<TopContent config={updatedConfig} />);
    const wrapper = container.querySelector('input[placeholder="Buscar por nombre..."]')?.closest("div");
    const clearButton = wrapper?.querySelector("button");
    fireEvent.click(clearButton);
    expect(updatedConfig.onClear).toHaveBeenCalled();
  });
});
