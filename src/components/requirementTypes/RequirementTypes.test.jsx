/* eslint-disable no-undef */
import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import RequirementTypes from "./RequirementTypes";
import useRequirementTypes from "../../hooks/requirementTypes/useRequirementTypes";
import { vi } from "vitest";

vi.mock("../../hooks/requirementTypes/useRequirementTypes");

describe("RequirementTypes Component", () => {
  const mockRequirementTypes = [
    {
      id: 1,
      name: "Tipo A",
      description: "Descripción A",
      classification: "Clasificación A"
    },
    {
      id: 2,
      name: "Tipo B",
      description: "Descripción B",
      classification: "Clasificación B"
    }
  ];

  const defaultHookMock = {
    requirementTypes: mockRequirementTypes,
    loading: false,
    error: null,
    addRequirementType: vi.fn(),
    fetchRequirementTypes: vi.fn(),
    fetchRequirementTypesByName: vi.fn(),
    fetchRequirementTypesByClassification: vi.fn(),
    fetchRequirementTypesByDescription: vi.fn(),
    modifyRequirementType: vi.fn(),
    removeRequirementType: vi.fn(),
    removeRequirementTypesBatch: vi.fn(),
  };

  beforeEach(() => {
    useRequirementTypes.mockReturnValue(defaultHookMock);
  });

  test("renders RequirementTypes headers correctly", () => {
    render(
      <MemoryRouter>
        <RequirementTypes />
      </MemoryRouter>
    );
    expect(screen.getByText("Nombre")).toBeInTheDocument();
    expect(screen.getByText("Descripción")).toBeInTheDocument();
    expect(screen.getByText("Clasificación")).toBeInTheDocument();
    expect(screen.getByText("Acciones")).toBeInTheDocument();
  });

  test("renders requirement types data correctly", () => {
    render(
      <MemoryRouter>
        <RequirementTypes />
      </MemoryRouter>
    );
    expect(screen.getByText("Tipo A")).toBeInTheDocument();
    expect(screen.getByText("Tipo B")).toBeInTheDocument();
  });

  test("displays loading spinner when loading is true", () => {
    useRequirementTypes.mockReturnValueOnce({
      ...defaultHookMock,
      loading: true,
    });

    render(
      <MemoryRouter>
        <RequirementTypes />
      </MemoryRouter>
    );

    expect(screen.getByRole("status")).toBeInTheDocument();
  });
});
