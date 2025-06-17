/* eslint-disable no-undef */
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import Progress from "./Progress";
import Alerts from "./Alerts";
import useReqIdentify from "../../../hooks/reqIdentifications/useReqIdentify";

vi.mock("../../../hooks/reqIdentifications/useReqIdentify");
vi.mock("./Alerts"); // Mock Alerts to inspect props, not the actual render

describe("Progress Component - ReqIdentify", () => {
  const defaultHookValues = {
    progress: 50,
    status: "ACTIVE",
    message: "Requirement identification is in progress...",
    error: null,
    errorStatus: null,
    fetchJobStatus: vi.fn(),
    clearError: vi.fn(),
    cleanJobStatus: vi.fn(),
  };

  beforeEach(() => {
    useReqIdentify.mockReturnValue({ ...defaultHookValues });
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it("renders the Progress component with progress value and top label", () => {
    render(
      <Progress
        jobId="req-abc-123"
        onComplete={vi.fn()}
        onClose={vi.fn()}
        labelTop="Analysis Progress"
        labelButton="Accept"
      />
    );

    expect(screen.getByText("Analysis Progress")).toBeInTheDocument();
    expect(screen.getByText("50%")).toBeInTheDocument();
  });

  it("calls Alerts with COMPLETED status and 100% progress", () => {
    useReqIdentify.mockReturnValue({
      ...defaultHookValues,
      progress: 100,
      status: "COMPLETED",
      message: "Requirement identification completed successfully.",
    });

    render(
      <Progress
        jobId="req-abc-456"
        onComplete={vi.fn()}
        onClose={vi.fn()}
        labelTop="Identification Finished"
        labelButton="Finish"
      />
    );

    expect(Alerts).toHaveBeenCalledWith(
      expect.objectContaining({
        status: "COMPLETED",
        message: "Requirement identification completed successfully.",
        error: null,
        errorStatus: null,
        labelButton: "Finish",
      }),
      {}
    );
  });

  it("calls Alerts with an error when one is present", () => {
    const mockError = {
      title: "Unexpected error",
      message: "An unexpected error occurred. Please try again later.",
    };

    useReqIdentify.mockReturnValue({
      ...defaultHookValues,
      error: mockError,
      errorStatus: "UNEXPECTED_ERROR",
    });

    render(
      <Progress
        jobId="req-err-789"
        onComplete={vi.fn()}
        onClose={vi.fn()}
        labelTop="Job Failed"
        labelButton="Retry"
      />
    );

    expect(Alerts).toHaveBeenCalledWith(
      expect.objectContaining({
        error: mockError,
        errorStatus: "UNEXPECTED_ERROR",
        labelButton: "Retry",
      }),
      {}
    );
  });

  it("calls Alerts while job is still in progress", () => {
    render(
      <Progress
        jobId="req-prog-001"
        onComplete={vi.fn()}
        onClose={vi.fn()}
        labelTop="Processing..."
        labelButton="Stop"
      />
    );

    expect(Alerts).toHaveBeenCalledWith(
      expect.objectContaining({
        status: "ACTIVE",
        message: "Requirement identification is in progress...",
        error: null,
        errorStatus: null,
        labelButton: "Stop",
      }),
      {}
    );
  });
});
