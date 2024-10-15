/* eslint-disable no-undef */
import { render, screen } from "@testing-library/react";
import Dashboard from "./Dashboard";
import { vi } from "vitest";
import { MemoryRouter } from 'react-router-dom';
import Context from '../context/userContext.jsx';
import useUserProfile from '../hooks/user/profile.jsx'; 

vi.mock('../hooks/user/profile.jsx', () => ({
  __esModule: true,
  default: vi.fn(),
}));

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
    expect(fundamentosLink.closest('a')).toHaveAttribute('href', '/fundamentos'); 
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
    expect(fundamentosLink.closest('a')).toHaveAttribute('href', '/fundamentos'); 
  });
});
