import { useContext, useState, useCallback } from "react";
import Context from "../../context/userContext.jsx";
import getArticlesByLegalBasis from "../../services/articlesService/getArticlesByLegalBasisId.js";
import createNewArticle from "../../services/articlesService/createArticle.js";
import ArticleErrors from "../../errors/articles/articleErrors.js";

/**
 * Custom hook for managing articles and retrieving them based on a specific Legal Base.
 * @returns {Object} - Contains articles list, loading state, error state, and functions for article operations.
 */
export default function useArticles() {
  const { jwt } = useContext(Context);
  const [articles, setArticles] = useState([]);
  const [stateArticles, setStateArticles] = useState({
    loading: false,
    error: null,
  });

  /**
   * Clears the list of articles from the state.
   * @function clearArticles
   * @returns {void}
   */
  const clearArticles = useCallback(() => {
    setArticles([]);
    setStateArticles((prevState) => ({ ...prevState, error: null }));
  }, []);

  /**
   * Fetches articles associated with a specific legal basis.
   * @async
   * @function fetchArticles
   * @param {number} legalBasisId - The ID of the legal basis to retrieve articles for.
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
   * Adds a new article to the list of articles.
   * Maintains the correct order using binary search for efficient insertion.
   * @param {number} legalBasisId - The ID of the legal basis.
   * @param {string} title - The title of the article.
   * @param {string} article - The content of the article.
   * @param {number} order - The order of the article within the legal basis.
   * @returns {Promise<Object>} - Success or failure of the operation.
   */
  const addArticle = useCallback(
    async (legalBasisId, title, article, order) => {
      try {
        const newArticle = await createNewArticle({
          legalBasisId,
          title,
          article,
          order,
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

  return {
    articles,
    loading: stateArticles.loading,
    error: stateArticles.error,
    clearArticles,
    fetchArticles,
    addArticle,
  };
}
