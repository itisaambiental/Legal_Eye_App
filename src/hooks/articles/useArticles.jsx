import { useContext, useState, useCallback } from "react";
import Context from "../../context/userContext.jsx";
import getArticlesByLegalBasis from "../../services/articlesService/getArticlesByLegalBasisId.js";
import getArticlesByName from "../../services/articlesService/getArticlesByName.js";
import getArticlesByDescription from "../../services/articlesService/getArticlesByDescription.js";
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

  const clearArticles = useCallback(() => {
    setArticles([]);
    setStateArticles((prevState) => ({ ...prevState, error: null }));
  }, []);

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

  const fetchArticlesByName = useCallback(
    async (name) => {
      setStateArticles({ loading: true, error: null });
      try {
        const articles = await getArticlesByName({
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
   * Fetches articles by description.
   * @async
   * @function fetchArticlesByDescription
   * @param {string} description - The description or part of the description of the articles to retrieve.
   * @returns {Promise<void>}
   */
  const fetchArticlesByDescription = useCallback(
    async (description) => {
      setStateArticles({ loading: true, error: null });
      try {
        const articles = await getArticlesByDescription({
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

  return {
    articles,
    loading: stateArticles.loading,
    error: stateArticles.error,
    clearArticles,
    fetchArticles,
    addArticle,
    fetchArticlesByName,
    fetchArticlesByDescription,
  };
}
