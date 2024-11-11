/* eslint-disable no-undef */
import { render, screen, fireEvent } from "@testing-library/react";
import Users from "./Users.jsx";
import useUsers from "../../hooks/user/users.jsx";
import useRoles from "../../hooks/user/roles.jsx";

// Mock global de useUsers y useRoles
vi.mock("../../hooks/user/users.jsx", () => ({
  __esModule: true,
  default: vi.fn(),
}));

vi.mock("../../hooks/user/roles.jsx", () => ({
  __esModule: true,
  default: vi.fn(() => ({
    roles: [
      { id: 1, role: "Admin" },
      { id: 2, role: "Analyst" }
    ],
    roles_loading: false,
    roles_error: null
  }))
}));

describe("Users Component", () => {
  beforeEach(() => {
    useUsers.mockReturnValue({
      users: [
        { id: 1, name: "User_Admin", gmail: "admin@ejemplo.com", roleId: 1 },
        { id: 2, name: "User_Analyst", gmail: "analyst@ejemplo.com", roleId: 2 }
      ],
      loading: false,
      error: null,
      addUser: vi.fn(),
      updateUserDetails: vi.fn(),
      deleteUser: vi.fn(),
      deleteUsersBatch: vi.fn(),
      fetchUsersByRole: vi.fn(),
      fetchUsers: vi.fn(),
    });

    render(<Users />);
  });

  test("renders the user grid with correct headers and checkbox", () => {
    expect(screen.getByText("Nombre")).toBeInTheDocument();
    expect(screen.getByText("Rol")).toBeInTheDocument();
    expect(screen.getByText("Acciones")).toBeInTheDocument();

    const selectAllCheckbox = screen.getByRole("checkbox", { name: /select all/i });
    expect(selectAllCheckbox).toBeInTheDocument();
  });

  test("renders user data correctly in the table", () => {
    expect(screen.getByText("User_Admin")).toBeInTheDocument();
    expect(screen.getByText("admin@ejemplo.com")).toBeInTheDocument();
    expect(screen.getByText("Admin")).toBeInTheDocument();

    expect(screen.getByText("User_Analyst")).toBeInTheDocument();
    expect(screen.getByText("analyst@ejemplo.com")).toBeInTheDocument();
    expect(screen.getByText("Analista")).toBeInTheDocument();
  });

  test("shows a loading indicator when users are loading", () => {
    useUsers.mockReturnValueOnce({ ...useUsers(), loading: true });
    useRoles.mockReturnValueOnce({ ...useRoles(), roles_loading: true });

    render(<Users />);
    expect(screen.getByRole("status")).toBeInTheDocument();
  });

  test("displays an error message if there is an error loading users", () => {
    useUsers.mockReturnValueOnce({ ...useUsers(), error: { title: "Failed to load users", message: "Server Error" }});
    render(<Users />);
    expect(screen.getByText("Failed to load users")).toBeInTheDocument();
    expect(screen.getByText("Server Error")).toBeInTheDocument();
  });
});

describe("Users Component with no users", () => {
  beforeEach(() => {
    useUsers.mockReturnValue({
      users: [],
      loading: false,
      error: null,
      addUser: vi.fn(),
      updateUserDetails: vi.fn(),
      deleteUser: vi.fn(),
      deleteUsersBatch: vi.fn(),
      fetchUsersByRole: vi.fn(),
      fetchUsers: vi.fn(),
    });

    render(<Users />);
  });

  test("renders empty content message when there are no users", () => {
    const emptyMessage = screen.getByText("No hay usuarios para mostrar");
    expect(emptyMessage).toBeInTheDocument();
  });
});

describe("Users Component - Edit Modal", () => {
  beforeEach(() => {
    useUsers.mockReturnValue({
      users: [
        { id: 1, name: "User_Admin", gmail: "admin@ejemplo.com", roleId: 1 },
        { id: 2, name: "User_Analyst", gmail: "analyst@ejemplo.com", roleId: 2 }
      ],
      loading: false,
      error: null,
      addUser: vi.fn(),
      updateUserDetails: vi.fn(),
      deleteUser: vi.fn(),
      deleteUsersBatch: vi.fn(),
      fetchUsersByRole: vi.fn(),
      fetchUsers: vi.fn(),
    });

    render(<Users />);
  });

  test("opens EditModal with correct data when Edit button is clicked", () => {
    const optionsButtons = screen.getAllByLabelText("Opciones");
    fireEvent.click(optionsButtons[0]);
    const editButton = screen.getByText("Editar Usuario");
    fireEvent.click(editButton);
    const modalTitle = screen.getByRole("heading", { name: "Editar Usuario" });
    expect(modalTitle).toBeInTheDocument();
    const nameInput = screen.getByDisplayValue("User_Admin");
    const emailInput = screen.getByDisplayValue("admin@ejemplo.com");
    expect(nameInput).toBeInTheDocument();
    expect(emailInput).toBeInTheDocument();
  });
});
