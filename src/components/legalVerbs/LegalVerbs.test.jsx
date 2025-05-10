/* eslint-disable no-undef */
import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import LegalVerbs from "./LegalVerbs";
import useLegalVerbs from "../../hooks/legalVerbs/useLegalVerbs.jsx";
import { vi } from "vitest";

vi.mock("../../hooks/legalVerbs/useLegalVerbs.jsx");

describe("LegalVerbs Component", () => {
  const mockLegalVerbs = [
    {
      id: 1,
      name: "Tipo A",
      description: "Descripción A",
      translation: "Traducción A"
    },
    {
      id: 2,
      name: "Tipo B",
      description: "Descripción B",
      translation: "Traducción B"
    }
  ];

  const defaultHookMock = {
    legalVerbs: mockLegalVerbs,
    loading: false,
    error: null,
    addLegalVerb: vi.fn(),
    fetchLegalVerbs: vi.fn(),
    fetchLegalVerbsByName: vi.fn(),
    fetchLegalVerbsByTranslation: vi.fn(),
    fetchLegalVerbsByDescription: vi.fn(),
    modifyLegalVerb: vi.fn(),
    removeLegalVerb: vi.fn(),
    removeLegalVerbsBatch: vi.fn(),
  };

  beforeEach(() => {
    useLegalVerbs.mockReturnValue(defaultHookMock);
  });

  test("renders LegalVerbs headers correctly", () => {
    render(
      <MemoryRouter>
        <LegalVerbs />
      </MemoryRouter>
    );
    expect(screen.getByText("Nombre")).toBeInTheDocument();
    expect(screen.getByText("Descripción")).toBeInTheDocument();
    expect(screen.getByText("Traducción")).toBeInTheDocument();
    expect(screen.getByText("Acciones")).toBeInTheDocument();
  });

  test("renders legal verbs data correctly", () => {
    render(
      <MemoryRouter>
        <LegalVerbs />
      </MemoryRouter>
    );
    expect(screen.getByText("Tipo A")).toBeInTheDocument();
    expect(screen.getByText("Tipo B")).toBeInTheDocument();
  });

  test("displays loading spinner when loading is true", () => {
    useLegalVerbs.mockReturnValueOnce({
      ...defaultHookMock,
      loading: true,
    });

    render(
      <MemoryRouter>
        <LegalVerbs />
      </MemoryRouter>
    );

    expect(screen.getByRole("status")).toBeInTheDocument();
  });
});
