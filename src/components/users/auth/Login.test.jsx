/* eslint-disable no-undef */
import { render, screen, act, fireEvent } from "@testing-library/react";
import Login from "./Login.jsx";
import useAuth from "../../../hooks/user/auth/useAuth.jsx";
import { useNavigate } from "react-router-dom";

// Mocking the hooks and dependencies
vi.mock("../../../hooks/user/auth/useAuth.jsx", () => ({
    __esModule: true,
    default: vi.fn(),
}));

vi.mock("react-router-dom", () => ({
    useNavigate: vi.fn(),
}));

describe("Login Component", () => {
    const mockLogin = vi.fn();
    const mockNavigate = vi.fn();
    const mockOnLogin = vi.fn();
    const mockLoginMicrosoft = vi.fn();

    beforeEach(() => {
        vi.clearAllMocks();
        vi.useFakeTimers(); 
        useAuth.mockReturnValue({
            isLoginLoading: false,
            hasLoginError: false,
            login: mockLogin,
            login_microsoft: mockLoginMicrosoft,
            isLogged: false,
            setStateLogin: vi.fn(),
            stateMicrosoft: { error: null },
            setStateMicrosoft: vi.fn(),
        });
        useNavigate.mockReturnValue(mockNavigate);
    });

    afterEach(() => {
        vi.useRealTimers();
    });

    test("shows loading spinner initially and then displays login form", () => {
        render(<Login onLogin={mockOnLogin} />);
        expect(screen.getByRole("status")).toBeInTheDocument();
        act(() => {
            vi.advanceTimersByTime(0);
        });
        expect(screen.queryByRole("status")).not.toBeInTheDocument();
        expect(screen.getByPlaceholderText("Dirección de correo")).toHaveValue("");
        expect(screen.getByPlaceholderText("Contraseña")).toHaveValue("");
    });

    test("renders login form with empty fields after loading", () => {
        render(<Login onLogin={mockOnLogin} />);
        act(() => {
            vi.advanceTimersByTime(0);
        });
        expect(screen.getByPlaceholderText("Dirección de correo")).toHaveValue("");
        expect(screen.getByPlaceholderText("Contraseña")).toHaveValue("");
    });


    test("displays error messages if fields are empty and submit is clicked", async () => {
        render(<Login onLogin={mockOnLogin} />);

        act(() => {
            vi.advanceTimersByTime(0);
        });
        const submitButton = screen.getByText("Iniciar sesión");

        await act(async () => {
            fireEvent.click(submitButton);
        });

        const errorMessages = screen.getAllByText("Este campo es obligatorio");
        expect(errorMessages).toHaveLength(2); 
        expect(errorMessages[0]).toBeInTheDocument(); 
        expect(errorMessages[1]).toBeInTheDocument(); 
    });

    test("toggles password visibility when show password button is clicked", async () => {
        render(<Login onLogin={mockOnLogin} />);
    
        act(() => {
            vi.advanceTimersByTime(0);
        });
    
        const passwordInput = screen.getByPlaceholderText("Contraseña");
        const toggleButton = screen.getByRole("button", { name: /mostrar contraseña/i });
        expect(passwordInput).toHaveAttribute("type", "password");
        await act(async () => {
            fireEvent.click(toggleButton);
        });
        expect(passwordInput).toHaveAttribute("type", "text");
        await act(async () => {
            fireEvent.click(toggleButton);
        });
        expect(passwordInput).toHaveAttribute("type", "password");
    });

    test("calls login function and onLogin callback on successful login", async () => {
        useAuth.mockReturnValue({
            ...useAuth(),
            isLogged: true,
        });
    
        render(<Login onLogin={mockOnLogin} />);
    
        act(() => {
            vi.advanceTimersByTime(0);
        });
    
        const emailInput = screen.getByPlaceholderText("Dirección de correo");
        const passwordInput = screen.getByPlaceholderText("Contraseña");
        const submitButton = screen.getByText("Iniciar sesión");
        fireEvent.change(emailInput, { target: { value: "test@test.com" } });
        fireEvent.change(passwordInput, { target: { value: "password123" } });
        await act(async () => {
            fireEvent.click(submitButton);
        });

        expect(mockLogin).toHaveBeenCalledWith({ email: "test@test.com", password: "password123" });
        expect(mockOnLogin).toHaveBeenCalled();
        expect(mockNavigate).toHaveBeenCalledWith("/");
    });
    test("displays error message on login error", async () => {
        useAuth.mockReturnValue({
            ...useAuth(),
            hasLoginError: true,
        });
    
        render(<Login onLogin={mockOnLogin} />);
    
        act(() => {
            vi.advanceTimersByTime(0);
        });
    
        const emailInput = screen.getByPlaceholderText("Dirección de correo");
        const passwordInput = screen.getByPlaceholderText("Contraseña");
        const submitButton = screen.getByText("Iniciar sesión");
    
        fireEvent.change(emailInput, { target: { value: "test@test.com" } });
        fireEvent.change(passwordInput, { target: { value: "wrongpassword" } });
        await act(async () => {
            fireEvent.click(submitButton);
        });
    
        expect(screen.getByText("Dirección de correo o contraseña inválido")).toBeInTheDocument();
    });
    
    test("calls Microsoft login function when Microsoft login button is clicked", async () => {
        render(<Login onLogin={mockOnLogin} />);
    
        act(() => {
            vi.advanceTimersByTime(0);
        });
    
        const microsoftLoginButton = screen.getByText("Continuar con Microsoft");
    
        await act(async () => {
            fireEvent.click(microsoftLoginButton);
        });
    
        expect(mockLoginMicrosoft).toHaveBeenCalled();
    });
    
    test("navigates to reset password page when 'Forgot Password' is clicked", async () => {
        render(<Login onLogin={mockOnLogin} />);
    
        act(() => {
            vi.advanceTimersByTime(0);
        });
    
        const resetPasswordButton = screen.getByText("¿Olvidaste tu contraseña?");
        await act(async () => {
            fireEvent.click(resetPasswordButton);
        });
    
        expect(mockNavigate).toHaveBeenCalledWith("/reset-password/request", { state: { fromLogin: true } });
    });
    
    test("displays error message when Microsoft login fails", async () => {
        const errorMessage = "Error al iniciar sesión con Microsoft";
        useAuth.mockReturnValue({
            ...useAuth(),
            login_microsoft: vi.fn(() => {
                useAuth().setStateMicrosoft({ loading: false, error: errorMessage });
            }),
            stateMicrosoft: { loading: false, error: errorMessage }
        });
    
        render(<Login onLogin={mockOnLogin} />);
        act(() => {
            vi.advanceTimersByTime(0);
        });
        const microsoftLoginButton = screen.getByText("Continuar con Microsoft");
        await act(async () => {
            fireEvent.click(microsoftLoginButton);
        });
        expect(screen.getByText(errorMessage)).toBeInTheDocument();
    });
    
});
