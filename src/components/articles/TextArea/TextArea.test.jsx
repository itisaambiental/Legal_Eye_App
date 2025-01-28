/* eslint-disable no-undef */
import { render } from "@testing-library/react";
import { vi } from "vitest";
import TextArea from "./TextArea";

describe("TextArea Component", () => {
  const defaultProps = {
    value: "",
    onChange: vi.fn(),
    placeholder: "Escribe algo...",
  };

  const renderComponent = (props = defaultProps) => {
    render(<TextArea {...props} />);
  };

  afterEach(() => {
    vi.clearAllMocks();
  });

  test("renders the TextArea with placeholder text", () => {
    renderComponent();

    const editor = document.querySelector(".ql-editor");
    expect(editor).toBeInTheDocument();
    expect(editor.getAttribute("data-placeholder")).toBe("Escribe algo...");
  });

  test("renders the TextArea with the correct initial value", () => {
    const initialValue = "<p>Texto inicial</p>";
    renderComponent({ ...defaultProps, value: initialValue });

    const editor = document.querySelector(".ql-editor");
    expect(editor).toBeInTheDocument();
    expect(editor.innerHTML).toContain("Texto inicial");
  });

});
