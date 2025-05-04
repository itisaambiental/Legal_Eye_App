/* eslint-disable no-undef */
import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import Requirements from "./Requirements";
import useRequirements from "../../hooks/requirement/useRequirements";
import useSubjects from "../../hooks/subject/useSubjects";
import useAspects from "../../hooks/aspect/useAspects";
import { vi } from "vitest";


vi.mock("../../hooks/requirement/useRequirements");
vi.mock("../../hooks/subject/useSubjects");
vi.mock("../../hooks/aspect/useAspects");

describe("Requirement Component", () => {
  const defaultRequirementMock = {
    requirements: [
      {
        id: 1,
        requirement_name: "Ley General",
        requirement_number: "REQ-001",
        subject: { subject_name: "Fiscal" },
        aspects: [{ aspect_name: "Aspecto A" }],
        evidence: "Trámite",
        formatted_evidence: "Trámite",
        periodicity: "Anual",
        formatted_periodicity: "Anual",
        requirement_condition: "Crítica",
        mandatory_description: "Desc obligatoria",
        complementary_description: "Desc complementaria",
        mandatory_sentences: "Frase obligatoria",
        complementary_sentences: "Frase complementaria",
        mandatory_keywords: "clave1, clave2",
        complementary_keywords: "clave3, clave4",
      },
      {
        id: 2,
        requirement_name: "Reglamento Ambiental",
        requirement_number: "REQ-002",
        subject: { subject_name: "Ambiental" },
        aspects: [{ aspect_name: "Aspecto B" }],
        evidence: "Específica",
        formatted_evidence: "Específica - Informe técnico",
        periodicity: "Específica",
        formatted_periodicity: "Específica - Cada 6 meses",
        requirement_condition: "Operativa",
        mandatory_description: "Obligatoria 2",
        complementary_description: "Complementaria 2",
        mandatory_sentences: "Frase 2",
        complementary_sentences: "Frase 2 comp",
        mandatory_keywords: "claveX",
        complementary_keywords: "claveY",
      },
    ],
    loading: false,
    error: null,
    addRequirement: vi.fn(),
    fetchRequirements: vi.fn(),
    fetchRequirementsByNumber: vi.fn(),
    fetchRequirementsByName: vi.fn(),
    fetchRequirementsByCondition: vi.fn(),
    fetchRequirementsByEvidence: vi.fn(),
    fetchRequirementsByPeriodicity: vi.fn(),
    fetchRequirementsBySubject: vi.fn(),
    fetchRequirementsBySubjectAndAspects: vi.fn(),
    fetchRequirementsByMandatoryDescription: vi.fn(),
    fetchRequirementsByComplementaryDescription: vi.fn(),
    fetchRequirementsByMandatorySentences: vi.fn(),
    fetchRequirementsByComplementarySentences: vi.fn(),
    fetchRequirementsByMandatoryKeywords: vi.fn(),
    fetchRequirementsByComplementaryKeywords: vi.fn(),
    modifyRequirement: vi.fn(),
    removeRequirement: vi.fn(),
    removeRequirementBatch: vi.fn(),
  };

  const defaultSubjects = {
    subjects: [],
    loading: false,
    error: null,
  };

  const defaultAspects = {
    aspects: [],
    loadingState: false,
    error: null,
    clearAspects: vi.fn(),
    fetchAspects: vi.fn(),
  };

  beforeEach(() => {
    useRequirements.mockReturnValue(defaultRequirementMock);
    useSubjects.mockReturnValue(defaultSubjects);
    useAspects.mockReturnValue(defaultAspects);
  });

  test("renders Requirement component headers", () => {
    render(
      <MemoryRouter>
        <Requirements />
      </MemoryRouter>
    );
    expect(screen.getByText("Orden")).toBeInTheDocument();
    expect(screen.getByText("Requerimiento/Nombre")).toBeInTheDocument();
    expect(screen.getByText("Condición")).toBeInTheDocument();
    expect(screen.getByText("Evidencia")).toBeInTheDocument();
    expect(screen.getByText("Periodicidad")).toBeInTheDocument();
    expect(screen.getByText("Materia")).toBeInTheDocument();
    expect(screen.getByText("Aspectos")).toBeInTheDocument();
  });

  test("renders requirement data correctly in the table", () => {
    render(
      <MemoryRouter>
        <Requirements />
      </MemoryRouter>
    );

    expect(screen.getByText("Ley General")).toBeInTheDocument();
    expect(screen.getByText("Reglamento Ambiental")).toBeInTheDocument();
    expect(screen.getByText("Trámite")).toBeInTheDocument();
    expect(screen.getByText("Específica - Informe técnico")).toBeInTheDocument();
  });

  test("shows loading indicator when requirements are loading", () => {
    useRequirements.mockReturnValueOnce({
      ...defaultRequirementMock,
      loading: true,
    });

    render(
      <MemoryRouter>
        <Requirements />
      </MemoryRouter>
    );

    expect(screen.getByRole("status")).toBeInTheDocument();
  });
});
