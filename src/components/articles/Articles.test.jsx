/* eslint-disable no-undef */
import { render, screen, fireEvent } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import Articles from "./Articles.jsx";
import useArticles from "../../hooks/articles/useArticles.jsx";
import useLegalBasis from "../../hooks/legalBasis/useLegalBasis.jsx";
import { vi } from "vitest";

vi.mock("../../hooks/articles/useArticles.jsx", () => ({
  __esModule: true,
  default: vi.fn(),
}));

vi.mock("../../hooks/legalBasis/useLegalBasis.jsx", () => ({
  __esModule: true,
  default: vi.fn(),
}));

describe("Articles Component", () => {
  beforeEach(() => {
    useArticles.mockReturnValue({
      articles: [
        { id: 1, article_name: "Article 1", article_order: 1 },
        { id: 2, article_name: "Article 2", article_order: 2 },
      ],
      loading: false,
      error: null,
      fetchArticles: vi.fn(),
      addArticle: vi.fn(),
      modifyArticle: vi.fn(),
      removeArticle: vi.fn(),
      deleteArticlesBatch: vi.fn(),
    });

    useLegalBasis.mockReturnValue({
      fetchLegalBasisById: vi.fn().mockResolvedValue({
        success: true,
        data: { id: 1, legal_name: "Legal Basis 1" },
      }),
      loading: false,
      error: null,
    });

    render(
      <MemoryRouter>
        <Articles />
      </MemoryRouter>
    );
  });

  test("renders the articles table with correct headers", () => {
    expect(screen.getByText("Orden")).toBeInTheDocument();
    expect(screen.getByText("Articulo")).toBeInTheDocument();
    expect(screen.getByText("Descripción")).toBeInTheDocument();
    expect(screen.getByText("Acciones")).toBeInTheDocument();
  });

  test("renders articles data correctly in the table", () => {
    expect(screen.getByText("Article 1")).toBeInTheDocument();
    expect(screen.getByText("Article 2")).toBeInTheDocument();
  });

  test("shows a loading indicator when articles are loading", async () => {
    useArticles.mockReturnValueOnce({ ...useArticles(), loading: true });
    useLegalBasis.mockReturnValueOnce({ ...useLegalBasis(), loading: true });
    render(
      <MemoryRouter>
        <Articles />
      </MemoryRouter>
    );
    expect(screen.getByRole("status")).toBeInTheDocument();
  });

  describe("Articles Component with no articles", () => {
    beforeEach(() => {
      useArticles.mockReturnValue({
        articles: [],
        loading: false,
        error: null,
        fetchArticles: vi.fn(),
        addArticle: vi.fn(),
        modifyArticle: vi.fn(),
        removeArticle: vi.fn(),
        deleteArticlesBatch: vi.fn(),
      });

      useLegalBasis.mockReturnValue({
        fetchLegalBasisById: vi.fn().mockResolvedValue({
          success: true,
          data: { id: 1, legal_name: "Legal Basis 1" },
        }),
        loading: false,
        error: null,
      });

      render(
        <MemoryRouter>
          <Articles />
        </MemoryRouter>
      );
    });

    test("renders empty content message when there are no articles", () => {
      const emptyMessage = screen.getByText("No hay articulos para mostrar");
      expect(emptyMessage).toBeInTheDocument();
    });
  });

  describe("Articles Component - Edit Modal", () => {
    beforeEach(() => {
      useArticles.mockReturnValue({
        articles: [
          { id: 1, article_name: "Article 1", article_order: 1 },
          { id: 2, article_name: "Article 2", article_order: 2 },
        ],
        loading: false,
        error: null,
        fetchArticles: vi.fn(),
        addArticle: vi.fn(),
        modifyArticle: vi.fn(),
        removeArticle: vi.fn(),
        deleteArticlesBatch: vi.fn(),
      });

      useLegalBasis.mockReturnValue({
        fetchLegalBasisById: vi.fn().mockResolvedValue({
          success: true,
          data: { id: 1, legal_name: "Legal Basis 1" },
        }),
        loading: false,
        error: null,
      });

      render(
        <MemoryRouter>
          <Articles />
        </MemoryRouter>
      );
    });

    test("opens EditModal with correct data when Edit button is clicked", async () => {
      const optionsButtons = screen.getAllByLabelText("Opciones");
      fireEvent.click(optionsButtons[0]);
      const editButton = screen.getByText("Editar Artículo");
      fireEvent.click(editButton);

      const modalTitle = await screen.findByRole("heading", {
        name: "Editar Artículo",
      });
      expect(modalTitle).toBeInTheDocument();
      const nameInput = screen.getByDisplayValue("Article 1");
      expect(nameInput).toBeInTheDocument();
    });
  });
});
