/* eslint-disable no-undef */
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import Progress from "./Progress";
import Alerts from "./Alerts"; 
import useExtractArticles from "../../../hooks/articles/extractArticles/useExtractArticles";

vi.mock("../../../hooks/articles/extractArticles/useExtractArticles");
vi.mock("./Alerts"); // Mockeamos Alerts para verificar solo props

describe("Progress Component", () => {
  const mockUseExtractArticles = {
    progress: 50,
    status: "in-progress",
    message: "Job is in progress",
    error: null,
    errorStatus: null,
    fetchJobStatus: vi.fn(),
    cancelJobById: vi.fn(),
    clearError: vi.fn(),
    cleanjobStatus: vi.fn(),
  };

  beforeEach(() => {
    useExtractArticles.mockReturnValue(mockUseExtractArticles);
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it("renders Progress component with initial state", () => {
    render(
      <Progress
        jobId="123"
        onComplete={vi.fn()}
        onClose={vi.fn()}
        labelTop="Job Progress"
        labelButton="Cancel"
      />
    );

    expect(screen.getByText("Job Progress")).toBeInTheDocument();
    expect(screen.getByText("50%")).toBeInTheDocument();
  });

  it("passes correct props to Alerts when progress is 100%", () => {
    mockUseExtractArticles.progress = 100;
    mockUseExtractArticles.status = "COMPLETED";
    mockUseExtractArticles.message = "Job is completed";
    render(
      <Progress
        jobId="123"
        onComplete={vi.fn()}
        onClose={vi.fn()}
        labelTop="Job Progress"
        labelButton="Retry"
      />
    );

    expect(Alerts).toHaveBeenCalledWith(
      expect.objectContaining({
        status: "COMPLETED",
        message: "Job is completed",
        error: null,
        errorStatus: null,
      }),
      {}
    );
  });

  it("passes correct props to Alerts when job is in progress", () => {
    mockUseExtractArticles.progress = 50;
    mockUseExtractArticles.status = "in-progress";
    mockUseExtractArticles.message = "Job is in progress";

    render(
      <Progress
        jobId="123"
        onComplete={vi.fn()}
        onClose={vi.fn()}
        labelTop="Job Progress"
        labelButton="Retry"
      />
    );

    expect(Alerts).toHaveBeenCalledWith(
      expect.objectContaining({
        status: "in-progress",
        message: "Job is in progress",
        error: null,
        errorStatus: null,
      }),
      {}
    );
  });
});
