/* eslint-disable no-undef */
import { render, screen, act, fireEvent } from "@testing-library/react";
import CompleteReset from "./CompleteReset";
import { useNavigate, useLocation } from "react-router-dom";
import { vi } from "vitest";

// Mocking hooks and dependencies
vi.mock("react-router-dom", () => ({
  useNavigate: vi.fn(),
  useLocation: vi.fn(),
}));

describe("CompleteReset Component", () => {
  const mockNavigate = vi.fn();
  const mockLocation = { state: { fromVerify: true } };

  beforeEach(() => {
    vi.clearAllMocks();
    vi.useFakeTimers();
    useNavigate.mockReturnValue(mockNavigate);
    useLocation.mockReturnValue(mockLocation);
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  test("shows loading spinner initially and then displays confirmation message", () => {
    render(<CompleteReset />);
    expect(screen.getByRole("status")).toBeInTheDocument();

    act(() => {
      vi.advanceTimersByTime(0);
    });

    expect(screen.queryByRole("status")).not.toBeInTheDocument();
    expect(screen.getByText("Contraseña Actualizada")).toBeInTheDocument();
  });

  test("redirects to not found page if accessed without 'fromVerify' in location state", () => {
    useLocation.mockReturnValue({ state: null });
    render(<CompleteReset />);

    act(() => {
      vi.advanceTimersByTime(0);
    });

    expect(mockNavigate).toHaveBeenCalledWith("/*", { replace: true });
  });

  test("displays confirmation message and 'Ir al Inicio de Sesión' button", () => {
    render(<CompleteReset />);

    act(() => {
      vi.advanceTimersByTime(0);
    });

    expect(screen.getByText("Contraseña Actualizada")).toBeInTheDocument();
    expect(screen.getByText("Ir al Inicio de Sesión")).toBeInTheDocument();
  });

  test("navigates to login page when 'Ir al Inicio de Sesión' button is clicked", async () => {
    render(<CompleteReset />);

    act(() => {
      vi.advanceTimersByTime(0);
    });

    const loginButton = screen.getByText("Ir al Inicio de Sesión");

    await act(async () => {
      fireEvent.click(loginButton);
    });

    expect(mockNavigate).toHaveBeenCalledWith("/login");
  });
});
