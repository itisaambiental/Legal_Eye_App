/* eslint-disable no-undef */
import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import LegalBasis from "./LegalBasis";
import useLegalBasis from "../../hooks/legalBasis/useLegalBasis";
import useSubjects from "../../hooks/subject/useSubjects";
import useAspects from "../../hooks/aspect/useAspects";
import useCopomex from "../../hooks/copomex/useCopomex";
import { useFiles } from "../../hooks/files/useFiles";
import { toast } from "react-toastify";
import { vi } from "vitest";

vi.mock("../../hooks/legalBasis/useLegalBasis");
vi.mock("../../hooks/subject/useSubjects");
vi.mock("../../hooks/aspect/useAspects");
vi.mock("../../hooks/copomex/useCopomex");
vi.mock("../../hooks/files/useFiles");
vi.mock("react-toastify");

describe("LegalBasis Component", () => {
    const mockLegalBasis = {
        legalBasis: [
            { id: 1, legal_name: "Ley General", abbreviation: "LG", classification: "Federal" },
            { id: 2, legal_name: "Reglamento Ambiental", abbreviation: "RA", classification: "Local" },
        ],
        loading: false,
        error: null,
        addLegalBasis: vi.fn(),
        fetchLegalBasis: vi.fn(),
        fetchLegalBasisByName: vi.fn(),
        fetchLegalBasisByAbbreviation: vi.fn(),
        fetchLegalBasisByClassification: vi.fn(),
        fetchLegalBasisByJurisdiction: vi.fn(),
        fetchLegalBasisByState: vi.fn(),
        fetchLegalBasisByStateAndMunicipalities: vi.fn(),
        fetchLegalBasisByLastReform: vi.fn(),
        fetchLegalBasisBySubject: vi.fn(),
        fetchLegalBasisBySubjectAndAspects: vi.fn(),
        fetchLegalBasisByCriteria: vi.fn(),
        modifyLegalBasis: vi.fn(),
        removeLegalBasis: vi.fn(),
        removeLegalBasisBatch: vi.fn(),
    };

    const mockSubjects = {
        subjects: [],
        loading: false,
        error: null,
    };

    const mockAspects = {
        aspects: [],
        error: null,
        clearAspects: vi.fn(),
        fetchAspects: vi.fn(),
    };

    const mockCopomex = {
        states: [],
        loadingStates: false,
        errorStates: null,
        municipalities: [],
        loadingMunicipalities: false,
        fetchMunicipalities: vi.fn(),
        errorMunicipalities: null,
        clearMunicipalities: vi.fn(),
    };

    const mockFiles = {
        downloadFile: vi.fn(),
        downloadBase64File: vi.fn(),
    };

    beforeEach(() => {
        useLegalBasis.mockReturnValue(mockLegalBasis);
        useSubjects.mockReturnValue(mockSubjects);
        useAspects.mockReturnValue(mockAspects);
        useCopomex.mockReturnValue(mockCopomex);
        useFiles.mockReturnValue(mockFiles);
        toast.loading = vi.fn();
        toast.update = vi.fn();
        toast.error = vi.fn();
    });

    test("renders LegalBasis component", () => {
        render(
            <MemoryRouter>
                <LegalBasis />
            </MemoryRouter>
        );
        expect(screen.getByText("Fundamento Legal")).toBeInTheDocument();
        expect(screen.getByText("Abreviatura")).toBeInTheDocument();
        expect(screen.getByText("Clasificación")).toBeInTheDocument();
    });

    test("renders legal basis data correctly in the table", () => {
        render(
            <MemoryRouter>
                <LegalBasis />
            </MemoryRouter>
        );

        expect(screen.getByText("Ley General")).toBeInTheDocument();
        expect(screen.getByText("Reglamento Ambiental")).toBeInTheDocument();
    });

    test("shows a loading indicator when legal basis data is loading", () => {
        useLegalBasis.mockReturnValueOnce({ ...mockLegalBasis, loading: true });
        render(
            <MemoryRouter>
                <LegalBasis />
            </MemoryRouter>
        );

        expect(screen.getByRole("status")).toBeInTheDocument();
    });
   
});
