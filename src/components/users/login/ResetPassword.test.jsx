/* eslint-disable no-undef */
import { render, screen, act, fireEvent } from "@testing-library/react";
import ResetPassword from "./ResetPassword";
import useUser from "../../../hooks/user/useAuth.jsx";
import { useNavigate, useLocation } from "react-router-dom";

// Mocking hooks and dependencies
vi.mock("../../../hooks/user/useAuth.jsx", () => ({
    __esModule: true,
    default: vi.fn(),
}));

vi.mock("react-router-dom", () => ({
    useNavigate: vi.fn(),
    useLocation: vi.fn(),
}));

describe("ResetPassword Component", () => {
    const mockResetPassword = vi.fn();
    const mockNavigate = vi.fn();
    const mockLocation = {
        state: { fromLogin: true }
    };

    beforeEach(() => {
        vi.clearAllMocks();
        vi.useFakeTimers();
        useUser.mockReturnValue({
            reset_password: mockResetPassword,
            isResetPasswordLoading: false,
            hasResetPasswordError: null,
        });
        useNavigate.mockReturnValue(mockNavigate);
        useLocation.mockReturnValue(mockLocation);
    });

    afterEach(() => {
        vi.useRealTimers();
    });

    test("shows loading spinner initially and then displays reset password form", () => {
        render(<ResetPassword />);
        expect(screen.getByRole("status")).toBeInTheDocument();
        act(() => {
            vi.advanceTimersByTime(0);
        });
        expect(screen.queryByRole("status")).not.toBeInTheDocument();
        expect(screen.getByPlaceholderText("Dirección de correo")).toBeInTheDocument();
    });

    test("renders reset password form with empty email field", () => {
        render(<ResetPassword />);
        act(() => {
            vi.advanceTimersByTime(0);
        });
        expect(screen.getByPlaceholderText("Dirección de correo")).toHaveValue("");
    });

    test("displays error message if email field is empty and submit is clicked", async () => {
        render(<ResetPassword />);
        act(() => {
            vi.advanceTimersByTime(0);
        });
        const submitButton = screen.getByText("Enviar Email");

        await act(async () => {
            fireEvent.click(submitButton);
        });

        const errorMessage = screen.getByText("Este campo es obligatorio");
        expect(errorMessage).toBeInTheDocument();
    });

    test("calls reset_password and navigates to verify page on successful reset", async () => {
        mockResetPassword.mockResolvedValue(true);
        render(<ResetPassword />);
        act(() => {
            vi.advanceTimersByTime(0);
        });

        const emailInput = screen.getByPlaceholderText("Dirección de correo");
        const submitButton = screen.getByText("Enviar Email");

        fireEvent.change(emailInput, { target: { value: "test@test.com" } });

        await act(async () => {
            fireEvent.click(submitButton);
        });

        expect(mockResetPassword).toHaveBeenCalledWith("test@test.com");
        expect(mockNavigate).toHaveBeenCalledWith("/reset-password/verify/test%40test.com", { state: { fromRequest: true } });
    });

    test("displays error message on reset password error", async () => {
        useUser.mockReturnValue({
            ...useUser(),
            reset_password: mockResetPassword,
            hasResetPasswordError: "Error al enviar el correo",
        });

        render(<ResetPassword />);
        act(() => {
            vi.advanceTimersByTime(0);
        });

        const emailInput = screen.getByPlaceholderText("Dirección de correo");
        const submitButton = screen.getByText("Enviar Email");

        fireEvent.change(emailInput, { target: { value: "test@test.com" } });

        await act(async () => {
            fireEvent.click(submitButton);
        });

        expect(screen.getByText("Error al enviar el correo")).toBeInTheDocument();
    });

    test("navigates to login page when 'Volver al inicio' is clicked", async () => {
        render(<ResetPassword />);
        act(() => {
            vi.advanceTimersByTime(0);
        });

        const goBackButton = screen.getByText("Volver al inicio");

        await act(async () => {
            fireEvent.click(goBackButton);
        });

        expect(mockNavigate).toHaveBeenCalledWith("/login");
    });
});
