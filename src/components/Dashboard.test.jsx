/* eslint-disable no-undef */
import { render, screen, fireEvent } from "@testing-library/react";
import Dashboard from "./Dashboard";
import { MemoryRouter } from 'react-router-dom';
import Context from '../context/userContext.jsx';
import useUserProfile from '../hooks/user/profile.jsx';

vi.mock('../hooks/user/profile.jsx', () => ({
  __esModule: true,
  default: vi.fn(),
}));

vi.mock('@azure/msal-browser', () => {
  return {
    PublicClientApplication: vi.fn().mockImplementation(() => {
      return {
        acquireTokenSilent: vi.fn(),
        acquireTokenPopup: vi.fn(),
        loginPopup: vi.fn(),
        logout: vi.fn(),
      };
    }),
  };
});

describe("Dashboard Component", () => {
  const mockLogout = vi.fn();

  beforeEach(() => {
    useUserProfile.mockReturnValue({
      name: "John Doe",
      email: "john.doe@example.com",
      profilePicture: null,
    });
  });

  test("does not render 'Usuarios' link for non-admin", () => {
    render(
      <MemoryRouter>
        <Context.Provider value={{ logout: mockLogout, isAdmin: false, isAnalyst: true }}>
          <Dashboard />
        </Context.Provider>
      </MemoryRouter>
    );

    const usersLink = screen.queryByText("Usuarios");
    expect(usersLink).not.toBeInTheDocument(); 
  });

  test("renders 'Usuarios' link for admin", () => {
    render(
      <MemoryRouter>
        <Context.Provider value={{ logout: mockLogout, isAdmin: true, isAnalyst: false }}>
          <Dashboard />
        </Context.Provider>
      </MemoryRouter>
    );

    const usersLink = screen.getByText("Usuarios");
    expect(usersLink).toBeInTheDocument();
    expect(usersLink.closest('a')).toHaveAttribute('href', '/users'); 
  });

  test("renders 'Fundamentos Legales' link for admin", () => {
    render(
      <MemoryRouter>
        <Context.Provider value={{ logout: mockLogout, isAdmin: true, isAnalyst: false }}>
          <Dashboard />
        </Context.Provider>
      </MemoryRouter>
    );

    const fundamentosLink = screen.getByText("Fundamentos Legales");
    expect(fundamentosLink).toBeInTheDocument();
    expect(fundamentosLink.closest('a')).toHaveAttribute('href', '/legal_basis'); 
  });

  test("renders 'Fundamentos Legales' link for analyst", () => {
    render(
      <MemoryRouter>
        <Context.Provider value={{ logout: mockLogout, isAdmin: false, isAnalyst: true }}>
          <Dashboard />
        </Context.Provider>
      </MemoryRouter>
    );

    const fundamentosLink = screen.getByText("Fundamentos Legales");
    expect(fundamentosLink).toBeInTheDocument();
    expect(fundamentosLink.closest('a')).toHaveAttribute('href', '/legal_basis'); 
  });

  test("calls logout when clicking on 'Cerrar sesión' button", () => {
    render(
      <MemoryRouter>
        <Context.Provider value={{ logout: mockLogout, isAdmin: true, isAnalyst: false }}>
          <Dashboard />
        </Context.Provider>
      </MemoryRouter>
    );

    const logoutButton = screen.getByText("Cerrar sesión");
    fireEvent.click(logoutButton);

    expect(mockLogout).toHaveBeenCalledTimes(1);
  });


  test("renders user info in dropdown for admin", () => {
    render(
      <MemoryRouter>
        <Context.Provider value={{ logout: mockLogout, isAdmin: true, isAnalyst: false }}>
          <Dashboard />
        </Context.Provider>
      </MemoryRouter>
    );
    const dropdownButton = screen.getByLabelText('user_avatar');
    fireEvent.click(dropdownButton);
    const userInfo = screen.getByText("John Doe - Admin");
    expect(userInfo).toBeInTheDocument();
    expect(screen.getByText("john.doe@example.com")).toBeInTheDocument();
  });


  test("renders user info in dropdown for analyst", () => {
    render(
      <MemoryRouter>
        <Context.Provider value={{ logout: mockLogout, isAdmin: false, isAnalyst: true }}>
          <Dashboard />
        </Context.Provider>
      </MemoryRouter>
    );
    const dropdownButton = screen.getByLabelText('user_avatar');
    fireEvent.click(dropdownButton);
    const userInfo = screen.getByText("John Doe - Analista");
    expect(userInfo).toBeInTheDocument();
    expect(screen.getByText("john.doe@example.com")).toBeInTheDocument();
  });

  test("renders user info in dropdown for guest", () => {
    render(
      <MemoryRouter>
        <Context.Provider value={{ logout: mockLogout, isAdmin: false, isAnalyst: false }}>
          <Dashboard />
        </Context.Provider>
      </MemoryRouter>
    );
    const dropdownButton = screen.getByLabelText('user_avatar');
    fireEvent.click(dropdownButton);
    const userInfo = screen.getByText("John Doe - Invitado");
    expect(userInfo).toBeInTheDocument();
    expect(screen.getByText("john.doe@example.com")).toBeInTheDocument();
  });
});
