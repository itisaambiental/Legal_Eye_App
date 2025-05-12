import { useContext, useState, useCallback } from "react";
import Context from "../../context/userContext.jsx";
import createArticle from "../../services/articleService/createArticle.js";
import getArticlesByLegalBasis from "../../services/articleService/getArticlesByLegalBasisId.js";
import getArticlesByName from "../../services/articleService/getArticlesByName.js";
import getArticlesByDescription from "../../services/articleService/getArticlesByDescription.js";
import updateArticle from "../../services/articleService/updateArticle.js";
import deleteArticle from "../../services/articleService/deleteArticle.js";
import deleteArticles from "../../services/articleService/deleteArticles.js";
import ArticleErrors from "../../errors/articles/articleErrors.js";

/**
 * Custom hook for managing articles and retrieving them based on a specific Legal Base.
 * Provides functions to fetch, create, and update articles with error handling and loading states.
 *
 * @returns {Object} - Contains articles list, loading state, error state, and functions for article operations.
 */
export default function useArticles() {
  const { jwt } = useContext(Context);
  const [articles, setArticles] = useState([]);
  const [stateArticles, setStateArticles] = useState({
    loading: true,
    error: null,
  });

  /**
   * Clears the articles and resets the error state.
   *
   * @function clearArticles
   * @returns {void}
   */
  const clearArticles = useCallback(() => {
    setArticles([]);
    setStateArticles((prevState) => ({ ...prevState, error: null }));
  }, []);

  /**
   * Fetches articles associated with a specific Legal Base ID.
   *
   * @async
   * @function fetchArticles
   * @param {number} legalBaseId - The ID of the legal base to fetch articles for.
   * @returns {Promise<void>}
   */
  const fetchArticles = useCallback(
    async (legalBaseId) => {
      setStateArticles({ loading: true, error: null });
      try {
        const articles = await getArticlesByLegalBasis({
          legalBaseId,
          token: jwt,
        });
        setArticles(articles);
        setStateArticles({ loading: false, error: null });
      } catch (error) {
        const errorCode = error.response?.status;
        const serverMessage = error.response?.data?.message;
        const clientMessage = error.message;
        const handledError = ArticleErrors.handleError({
          code: errorCode,
          error: serverMessage,
          httpError: clientMessage,
          items: [legalBaseId],
        });
        setStateArticles({
          loading: false,
          error: handledError,
        });
      }
    },
    [jwt]
  );

  /**
   * Adds a new article associated with a specific legal base.
   *
   * @async
   * @function addArticle
   * @param {number} legalBasisId - The ID of the legal base to associate the article with.
   * @param {Object} article - The article data to add.
   * @param {string} article.title - The title of the article.
   * @param {string} article.article - The content of the article.
   * @param {number} article.order - The order of the article.
   * @returns {Promise<{success: boolean, error?: string}>}
   */
  const addArticle = useCallback(
    async (legalBasisId, article) => {
      try {
        const newArticle = await createArticle({
          legalBasisId,
          title: article.title,
          article: article.article,
          order: article.order,
          token: jwt,
        });
        setArticles((prevArticles) => {
          const updatedArticles = [...prevArticles];
          const findInsertIndex = (articles, newOrder) => {
            let left = 0;
            let right = articles.length;
            while (left < right) {
              const mid = Math.floor((left + right) / 2);
              if (articles[mid].article_order < newOrder) {
                left = mid + 1;
              } else {
                right = mid;
              }
            }
            return left;
          };
          const insertIndex = findInsertIndex(
            updatedArticles,
            newArticle.article_order
          );
          updatedArticles.splice(insertIndex, 0, newArticle);

          return updatedArticles;
        });
        return { success: true };
      } catch (error) {
        const errorCode = error.response?.status;
        const serverMessage = error.response?.data?.message;
        const clientMessage = error.message;
        const handledError = ArticleErrors.handleError({
          code: errorCode,
          error: serverMessage,
          httpError: clientMessage,
          items: [legalBasisId],
        });

        return { success: false, error: handledError.message };
      }
    },
    [jwt]
  );

  /**
   * Fetches articles filtered by their name for a specific legal basis.
   *
   * @async
   * @function fetchArticlesByName
   * @param {number} legalBasisId - The ID of the legal basis to filter articles by.
   * @param {string} name - The name or part of the name to filter articles by.
   * @returns {Promise<void>}
   */
  const fetchArticlesByName = useCallback(
    async (legalBasisId, name) => {
      setStateArticles({ loading: true, error: null });
      try {
        const articles = await getArticlesByName({
          legalBasisId,
          name,
          token: jwt,
        });
        setArticles(articles);
        setStateArticles({ loading: false, error: null });
      } catch (error) {
        const errorCode = error.response?.status;
        const serverMessage = error.response?.data?.message;
        const clientMessage = error.message;
        const handledError = ArticleErrors.handleError({
          code: errorCode,
          error: serverMessage,
          httpError: clientMessage,
        });
        setStateArticles({
          loading: false,
          error: handledError,
        });
      }
    },
    [jwt]
  );

  /**
   * Fetches articles filtered by their description for a specific legal basis.
   *
   * @async
   * @function fetchArticlesByDescription
   * @param {number} legalBasisId - The ID of the legal basis to filter articles by.
   * @param {string} description - The description or part of the description to filter articles by.
   * @returns {Promise<void>}
   */
  const fetchArticlesByDescription = useCallback(
    async (legalBasisId, description) => {
      setStateArticles({ loading: true, error: null });
      try {
        const articles = await getArticlesByDescription({
          legalBasisId,
          description,
          token: jwt,
        });
        setArticles(articles);
        setStateArticles({ loading: false, error: null });
      } catch (error) {
        const errorCode = error.response?.status;
        const serverMessage = error.response?.data?.message;
        const clientMessage = error.message;
        const handledError = ArticleErrors.handleError({
          code: errorCode,
          error: serverMessage,
          httpError: clientMessage,
        });
        setStateArticles({
          loading: false,
          error: handledError,
        });
      }
    },
    [jwt]
  );

  /**
   * Updates an existing article by ID and reorders the articles list if the order is updated.
   *
   * @async
   * @function modifyArticle
   * @param {number} articleId - The ID of the article to update.
   * @param {Object} article - The updated article data.
   * @param {string} [article.title] - The new title of the article (optional).
   * @param {string} [article.article] - The new content of the article (optional).
   * @param {number} [article.order] - The new order of the article (optional).
   * @returns {Promise<{success: boolean, error?: string}>}
   */
  const modifyArticle = useCallback(
    async (articleId, article) => {
      try {
        const updatedArticle = await updateArticle({
          id: articleId,
          title: article.title,
          article: article.article,
          order: article.order,
          token: jwt,
        });
        setArticles((prevArticles) => {
          const updatedArticles = prevArticles.filter(
            (existingArticle) => existingArticle.id !== articleId
          );
          const findInsertIndex = (articles, newOrder) => {
            let left = 0;
            let right = articles.length;
            while (left < right) {
              const mid = Math.floor((left + right) / 2);
              if (articles[mid].article_order < newOrder) {
                left = mid + 1;
              } else {
                right = mid;
              }
            }
            return left;
          };
          const insertIndex = findInsertIndex(
            updatedArticles,
            updatedArticle.article_order
          );
          updatedArticles.splice(insertIndex, 0, updatedArticle);
          return updatedArticles;
        });

        return { success: true };
      } catch (error) {
        const errorCode = error.response?.status;
        const serverMessage = error.response?.data?.message;
        const clientMessage = error.message;

        const handledError = ArticleErrors.handleError({
          code: errorCode,
          error: serverMessage,
          httpError: clientMessage,
          items: [articleId],
        });
        return { success: false, error: handledError.message };
      }
    },
    [jwt]
  );

  /**
   * Deletes an existing article by ID.
   *
   * @async
   * @function removeArticle
   * @param {number} articleId - The ID of the article to delete.
   * @returns {Promise<{success: boolean, error?: string}>}
   */
  const removeArticle = useCallback(
    async (articleId) => {
      try {
        await deleteArticle({ id: articleId, token: jwt });
        setArticles((prevArticles) =>
          prevArticles.filter((article) => article.id !== articleId)
        );
        return { success: true };
      } catch (error) {
        const errorCode = error.response?.status;
        const serverMessage = error.response?.data?.message;
        const clientMessage = error.message;
        const handledError = ArticleErrors.handleError({
          code: errorCode,
          error: serverMessage,
          httpError: clientMessage,
          items: [articleId],
        });
        return { success: false, error: handledError.message };
      }
    },
    [jwt]
  );

  /**
 * Deletes a batch of articles by their IDs.
 *
 * @async
 * @function deleteArticlesBatch
 * @param {Array<number>} articleIds - The IDs of the articles to delete.
 * @returns {Promise<Object>} - Returns an object indicating success or failure, and an optional error message.
 */
const deleteArticlesBatch = useCallback(
  async (articleIds) => {
    try {
      const success = await deleteArticles({ articleIds, token: jwt });
      if (success) {
        setArticles((prevArticles) =>
          prevArticles.filter((article) => !articleIds.includes(article.id))
        );
        return { success: true };
      }
    } catch (error) {
      const errorCode = error.response?.status;
      const serverMessage = error.response?.data?.message;
      const clientMessage = error.message;
      const articles =
      error.response?.data?.errors?.articles?.map(
        (article) => article.name
      ) || articleIds;
      const handledError = ArticleErrors.handleError({
        code: errorCode,
        error: serverMessage,
        httpError: clientMessage,
        items: articles,
      });
      return { success: false, error: handledError.message };
    }
  },
  [jwt]
);

  return {
    articles,
    loading: stateArticles.loading,
    error: stateArticles.error,
    clearArticles,
    fetchArticles,
    addArticle,
    modifyArticle,
    removeArticle,
    deleteArticlesBatch,
    fetchArticlesByName,
    fetchArticlesByDescription,
  };
}
