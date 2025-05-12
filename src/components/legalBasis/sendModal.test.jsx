/* eslint-disable no-undef */
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { ToastContainer, toast } from "react-toastify";
import SendModal from "./sendModal.jsx";
import { vi } from "vitest";

const mockLegalBasis = [{ id: 1 }, { id: 2 }, { id: 3 }];

const mockConfig = {
  showSendModal: true,
  closeSendModal: vi.fn(),
  legalBasis: mockLegalBasis,
  sendLegalBasis: vi.fn(),
  selectedKeys: new Set([1, 2]),
  setSelectedKeys: vi.fn(),
  check: "check-icon-url",
};

describe("SendModal Component for Legal Basis", () => {
  const renderModal = (configOverrides = {}) => {
    const config = { ...mockConfig, ...configOverrides };
    render(
      <>
        <ToastContainer />
        <SendModal config={config} />
      </>
    );
    return config;
  };

  beforeEach(() => {
    vi.clearAllMocks();
    vi.spyOn(toast, "info").mockImplementation(() => {});
    vi.spyOn(toast, "error").mockImplementation(() => {});
  });

  test("renders correctly with multiple selected", () => {
    renderModal();
    expect(
      screen.getByText("¿Estás seguro de que deseas enviar estos Fundamentos Legales a ACM Suite?")
    ).toBeInTheDocument();
  });

  test("renders correctly with one selected", () => {
    renderModal({ selectedKeys: new Set([1]) });
    expect(
      screen.getByText("¿Estás seguro de que deseas enviar este Fundamento Legal a ACM Suite?")
    ).toBeInTheDocument();
  });

  test("renders correctly with all selected", () => {
    renderModal({ selectedKeys: "all" });
    expect(
      screen.getByText("¿Estás seguro de que deseas enviar TODOS los Fundamentos Legales a ACM Suite?")
    ).toBeInTheDocument();
  });

  test("calls closeSendModal when cancel button is clicked", () => {
    renderModal();
    fireEvent.click(screen.getByText("No, cancelar"));
    expect(mockConfig.closeSendModal).toHaveBeenCalled();
  });

  test("calls sendLegalBasis with selected IDs", async () => {
    const sendLegalBasisMock = vi.fn().mockResolvedValue({ success: true, jobId: "abc123" });

    renderModal({ sendLegalBasis: sendLegalBasisMock });

    fireEvent.click(screen.getByText("Sí, enviar"));

    await waitFor(() => {
      expect(sendLegalBasisMock).toHaveBeenCalledWith({ legalBasisIds: [1, 2] });
      expect(toast.info).toHaveBeenCalled();
    });
  });

  test("calls sendLegalBasis with all IDs when 'all' is selected", async () => {
    const sendLegalBasisMock = vi.fn().mockResolvedValue({ success: true, jobId: "job456" });

    renderModal({
      selectedKeys: "all",
      sendLegalBasis: sendLegalBasisMock,
    });

    fireEvent.click(screen.getByText("Sí, enviar"));

    await waitFor(() => {
      expect(sendLegalBasisMock).toHaveBeenCalledWith({ legalBasisIds: [1, 2, 3] });
      expect(toast.info).toHaveBeenCalled();
    });
  });

  test("shows Progress component after successful send", async () => {
    renderModal({
      sendLegalBasis: vi.fn().mockResolvedValue({ success: true, jobId: "abc123" }),
    });

    fireEvent.click(screen.getByText("Sí, enviar"));

    await waitFor(() => {
      expect(
        screen.getByText("Cuando se termine el proceso se te notificará vía correo electrónico.")
      ).toBeInTheDocument();
      expect(screen.getByText("Procesando...")).toBeInTheDocument();
    });
  });

  test("shows error toast if sendLegalBasis fails with error", async () => {
    renderModal({
      sendLegalBasis: vi.fn().mockResolvedValue({ success: false, error: "Falló envío" }),
    });

    fireEvent.click(screen.getByText("Sí, enviar"));

    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith("Falló envío");
    });
  });

  test("shows generic error toast if sendLegalBasis throws", async () => {
    renderModal({
      sendLegalBasis: vi.fn().mockRejectedValue(new Error("Error")),
    });

    fireEvent.click(screen.getByText("Sí, enviar"));

    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith(
        "Algo salió mal al enviar los fundamentos legales. Inténtalo de nuevo."
      );
    });
  });
});
