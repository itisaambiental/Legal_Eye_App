/* eslint-disable no-undef */
//import React from "react";
import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import Requirement from "./Requirements";
import useRequirements from "../../hooks/requirement/useRequirements";
import useSubjects from "../../hooks/subject/useSubjects";
import useAspects from "../../hooks/aspect/useAspects";
import useCopomex from "../../hooks/copomex/useCopomex";
import { vi } from "vitest";

vi.mock("../../hooks/requirement/useRequirements");
vi.mock("../../hooks/subject/useSubjects");
vi.mock("../../hooks/aspect/useAspects");
vi.mock("../../hooks/copomex/useCopomex");

describe("Requirement Component", () => {
  const defaultRequirementMock = {
    requirements: [
      {
        id: 1,
        requirement_name: "Ley General",
        abbreviation: "LG",
        classification: "Federal",
      },
      {
        id: 2,
        requirement_name: "Reglamento Ambiental",
        abbreviation: "RA",
        classification: "Local",
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
    fetchRequirementsByType: vi.fn(),
    fetchRequirementsByJurisdiction: vi.fn(),
    fetchRequirementsByState: vi.fn(),
    fetchRequirementsByStateAndMunicipalities: vi.fn(),
    fetchRequirementsByMandatoryDescription: vi.fn(),
    fetchRequirementsBySubject: vi.fn(),
    fetchRequirementsBySubjectAndAspects: vi.fn(),
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

  const defaultCopomex = {
    states: [],
    loadingStates: false,
    errorStates: null,
    municipalities: [],
    loadingMunicipalities: false,
    fetchMunicipalities: vi.fn(),
    errorMunicipalities: null,
    clearMunicipalities: vi.fn(),
  };

  beforeEach(() => {
    useRequirements.mockReturnValue(defaultRequirementMock);
    useSubjects.mockReturnValue(defaultSubjects);
    useAspects.mockReturnValue(defaultAspects);
    useCopomex.mockReturnValue(defaultCopomex);
  });

  test("renders Requirement component", () => {
    render(
      <MemoryRouter>
        <Requirement />
      </MemoryRouter>
    );

    expect(screen.getByText("Número")).toBeInTheDocument();
    expect(screen.getByText("Nombre")).toBeInTheDocument();
    expect(screen.getByText("Jurisdicción")).toBeInTheDocument();
  });

  test("renders requirement data correctly in the table", () => {
    render(
      <MemoryRouter>
        <Requirement />
      </MemoryRouter>
    );

    expect(screen.getByText("Ley General")).toBeInTheDocument();
    expect(screen.getByText("Reglamento Ambiental")).toBeInTheDocument();
  });


  test("shows loading indicator when requirements are loading", () => {
    useRequirements.mockReturnValueOnce({
      ...defaultRequirementMock,
      loading: true,
    });

    render(
      <MemoryRouter>
        <Requirement />
      </MemoryRouter>
    );

    expect(screen.getByRole("status")).toBeInTheDocument();
  });


});
