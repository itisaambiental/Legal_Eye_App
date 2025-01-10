/* eslint-disable no-undef */
import { render, screen, act, fireEvent } from "@testing-library/react";
import VerifyCode from "./VerifyCode.jsx";
import useUser from "../../../hooks/user/useAuth.jsx";
import { useNavigate, useLocation, useParams } from "react-router-dom";

// Mocking hooks and dependencies
vi.mock("../../../hooks/user/useAuth.jsx", () => ({
    __esModule: true,
    default: vi.fn(),
}));

vi.mock("react-router-dom", () => ({
    useNavigate: vi.fn(),
    useLocation: vi.fn(),
    useParams: vi.fn(),
}));

describe("VerifyCode Component", () => {
    const mockVerifyCode = vi.fn();
    const mockResetPassword = vi.fn();
    const mockNavigate = vi.fn();
    const mockLocation = { state: { fromRequest: true } };
    const mockParams = { email: encodeURIComponent("test@test.com") };

    beforeEach(() => {
        vi.clearAllMocks();
        vi.useFakeTimers();
        useUser.mockReturnValue({
            verify_code: mockVerifyCode,
            reset_password: mockResetPassword,
            isVerifyCodeLoading: false,
            hasVerifyCodeError: null,
            isResetPasswordLoading: false,
            hasResetPasswordError: null,
        });
        useNavigate.mockReturnValue(mockNavigate);
        useLocation.mockReturnValue(mockLocation);
        useParams.mockReturnValue(mockParams);
    });

    afterEach(() => {
        vi.useRealTimers();
    });

    test("shows loading spinner initially and then displays verify code form", () => {
        render(<VerifyCode />);
        expect(screen.getByRole("status")).toBeInTheDocument();
        act(() => {
            vi.advanceTimersByTime(0);
        });
        expect(screen.queryByRole("status")).not.toBeInTheDocument();
        expect(screen.getByPlaceholderText("XXXXXX")).toBeInTheDocument();
    });

    test("renders verify code form with empty code field", () => {
        render(<VerifyCode />);
        act(() => {
            vi.advanceTimersByTime(0);
        });
        expect(screen.getByPlaceholderText("XXXXXX")).toHaveValue("");
    });

    test("displays error message if code field is empty and submit is clicked", async () => {
        render(<VerifyCode />);
        act(() => {
            vi.advanceTimersByTime(0);
        });
        const submitButton = screen.getByText("Verificar Código");

        await act(async () => {
            fireEvent.click(submitButton);
        });

        const errorMessage = screen.getByText("Este campo es obligatorio");
        expect(errorMessage).toBeInTheDocument();
    });

    test("calls verify_code and navigates to complete page on successful verification", async () => {
        mockVerifyCode.mockResolvedValue(true);
        render(<VerifyCode />);
        act(() => {
            vi.advanceTimersByTime(0);
        });

        const codeInput = screen.getByPlaceholderText("XXXXXX");
        const submitButton = screen.getByText("Verificar Código");

        fireEvent.change(codeInput, { target: { value: "123456" } });

        await act(async () => {
            fireEvent.click(submitButton);
        });

        expect(mockVerifyCode).toHaveBeenCalledWith(mockParams.email, "123456");
        expect(mockNavigate).toHaveBeenCalledWith("/reset-password/complete", { state: { fromVerify: true } });
    });

    test("displays error message on verify code error", async () => {
        useUser.mockReturnValue({
            ...useUser(),
            hasVerifyCodeError: "Código incorrecto",
        });

        render(<VerifyCode />);
        act(() => {
            vi.advanceTimersByTime(0);
        });

        const codeInput = screen.getByPlaceholderText("XXXXXX");
        const submitButton = screen.getByText("Verificar Código");

        fireEvent.change(codeInput, { target: { value: "123456" } });

        await act(async () => {
            fireEvent.click(submitButton);
        });

        expect(screen.getByText("Código incorrecto")).toBeInTheDocument();
    });

    test("displays error message when resending code fails", async () => {
        useUser.mockReturnValue({
            ...useUser(),
            hasResetPasswordError: "Error al reenviar el código",
        });

        render(<VerifyCode />);
        act(() => {
            vi.advanceTimersByTime(0);
        });

        const resendButton = screen.getByText("Reenviar Código (60s)");

        await act(async () => {
            fireEvent.click(resendButton);
        });

        expect(screen.getByText("Error al reenviar el código")).toBeInTheDocument();
    });

    test("resets timer and calls reset_password when 'Resend Code' is clicked", async () => {
        mockResetPassword.mockResolvedValue(true);
        render(<VerifyCode />);
        
        act(() => {
            vi.advanceTimersByTime(0);
        });

        act(() => {
            vi.advanceTimersByTime(60000); 
        });
    
        const resendButton = screen.getByText("Reenviar Código");
    
        await act(async () => {
            fireEvent.click(resendButton);
        });
    
        expect(mockResetPassword).toHaveBeenCalledWith("test@test.com", true);
        expect(screen.getByText("Reenviar Código (60s)")).toBeInTheDocument();
    });
    

    test("navigates to reset password page when 'Volver' is clicked", async () => {
        render(<VerifyCode />);
        act(() => {
            vi.advanceTimersByTime(0);
        });

        const goBackButton = screen.getByText("Volver");

        await act(async () => {
            fireEvent.click(goBackButton);
        });

        expect(mockNavigate).toHaveBeenCalledWith("/reset-password/request", { state: { fromVerify: true } });
    });
});
