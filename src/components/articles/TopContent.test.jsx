/* eslint-disable no-undef */
import { render, screen, fireEvent } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import TopContent from "./TopContent";
import { vi } from "vitest";

describe("TopContent Component for Articles", () => {
  const defaultConfig = {
    legalBaseName: "Ley de Prueba",
    onRowsPerPageChange: vi.fn(),
    totalArticles: 12,
    openModalCreate: vi.fn(),
    onFilterByName: vi.fn(),
    onFilterByDescription: vi.fn(),
    onClear: vi.fn(),
    filterByName: "",
    filterByDescription: "",
  };

  const renderComponent = (config = defaultConfig) => {
    render(
      <MemoryRouter>
        <TopContent config={config} />
      </MemoryRouter>
    );
  };

  test("renders the legal base name correctly", () => {
    renderComponent();
    expect(screen.getByText("Artículos del fundamento:")).toBeInTheDocument();
    expect(screen.getByText("Ley de Prueba")).toBeInTheDocument();
  });

  test("renders the total articles count correctly", () => {
    renderComponent();
    expect(screen.getByText("Artículos totales: 12")).toBeInTheDocument();
  });

  test("opens modal to create a new article when 'Nuevo Artículo' button is clicked", () => {
    renderComponent();
    const newArticleButton = screen.getByText("Nuevo Artículo");
    fireEvent.click(newArticleButton);
    expect(defaultConfig.openModalCreate).toHaveBeenCalled();
  });

  test("triggers name filter change on input change", () => {
    renderComponent();
    const nameFilterInput = screen.getByPlaceholderText("Buscar por nombre...");
    fireEvent.change(nameFilterInput, { target: { value: "Artículo 1" } });
    expect(defaultConfig.onFilterByName).toHaveBeenCalledWith("Artículo 1");
  });

  test("triggers description filter change on input change", () => {
    renderComponent();
    const descriptionFilterInput = screen.getByPlaceholderText(
      "Buscar por descripción..."
    );
    fireEvent.change(descriptionFilterInput, {
      target: { value: "Descripción de prueba" },
    });
    expect(defaultConfig.onFilterByDescription).toHaveBeenCalledWith(
      "Descripción de prueba"
    );
  });

  test("clears both filters when clear button is clicked", () => {
    renderComponent();
    const nameFilterInput = screen.getByPlaceholderText("Buscar por nombre...");
    fireEvent.change(nameFilterInput, { target: { value: "Artículo" } });

    const clearButton = screen.getAllByRole("button", { name: /clear/i })[0];
    fireEvent.click(clearButton);

    expect(defaultConfig.onClear).toHaveBeenCalled();
  });

  test("changes rows per page when a new option is selected", () => {
    renderComponent();
    const select = screen.getByLabelText("Filas por página:");
    fireEvent.change(select, { target: { value: "20" } });
    expect(defaultConfig.onRowsPerPageChange).toHaveBeenCalledWith(
      expect.anything()
    );
  });

  test("renders the correct values in filter inputs", () => {
    const configWithFilters = {
      ...defaultConfig,
      filterByName: "Artículo inicial",
      filterByDescription: "Descripción inicial",
    };
    renderComponent(configWithFilters);

    const nameFilterInput = screen.getByPlaceholderText("Buscar por nombre...");
    const descriptionFilterInput = screen.getByPlaceholderText(
      "Buscar por descripción..."
    );

    expect(nameFilterInput.value).toBe("Artículo inicial");
    expect(descriptionFilterInput.value).toBe("Descripción inicial");
  });

});
