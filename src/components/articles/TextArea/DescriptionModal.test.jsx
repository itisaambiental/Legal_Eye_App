/* eslint-disable no-undef */
import { render, screen, fireEvent } from "@testing-library/react";
import DescriptionModal from "./DescriptionModal";
import { vi } from "vitest";

describe("DescriptionModal Component", () => {
  const defaultProps = {
    isOpen: true,
    onClose: vi.fn(),
    title: "Descripción del Artículo",
    description: "<p>Este es el contenido de la descripción</p>",
  };

  const renderComponent = (props = defaultProps) => {
    render(<DescriptionModal {...props} />);
  };

  afterEach(() => {
    vi.clearAllMocks();
  });

  test("renders the modal with the correct title", () => {
    renderComponent();
    expect(screen.getByText("Descripción del Artículo")).toBeInTheDocument();
  });

  test("renders the sanitized description content", () => {
    renderComponent();
    const descriptionContent = screen.getByText("Este es el contenido de la descripción");
    expect(descriptionContent).toBeInTheDocument();
  });

  test("calls onClose when the close button is clicked", () => {
    renderComponent();
    const closeButton = screen.getByText("Cerrar");
    fireEvent.click(closeButton);
    expect(defaultProps.onClose).toHaveBeenCalledTimes(1);
  });

  test("does not render the modal when isOpen is false", () => {
    renderComponent({ ...defaultProps, isOpen: false });
    expect(screen.queryByText("Descripción del Artículo")).not.toBeInTheDocument();
  });

  test("sanitizes HTML to prevent XSS attacks", () => {
    const maliciousDescription = '<img src="x" onerror="alert(\'XSS\')" />';
    renderComponent({ ...defaultProps, description: maliciousDescription });

    const sanitizedContent = screen.queryByAltText("x");
    expect(sanitizedContent).not.toBeInTheDocument();
  });
});
