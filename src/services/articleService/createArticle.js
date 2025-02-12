import server from "../../config/server.js"

/**
 * Creates a new article associated with a specific legal basis.
 * Sends a POST request with article data to the backend.
 *
 * @async
 * @function createNewArticle
 * @param {Object} params - Parameters for creating a new article.
 * @param {number} params.legalBasisId - The ID of the legal basis to link this article to.
 * @param {string} params.title - The title of the article.
 * @param {string} params.article - The content of the article.
 * @param {number} params.order - The order of the article within the legal basis.
 * @param {string} params.token - The authorization token for the request.
 *
 * @returns {Promise<Object>} The created article data returned from the server.
 * @throws {Error} If the response status is not 201 or if there is an error with the request.
 */
export default async function createArticle({ legalBasisId, title, article, order, token }) {
  try {
    const response = await server.post(
      `/articles/legalBasis/${legalBasisId}`,
      { title, article, order },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    )
    if (response.status !== 201) {
      throw new Error('Failed to create article')
    }
    const { article: createdArticle } = response.data;
    return createdArticle
  } catch (error) {
    console.error("Error creating article:", error);
    throw error
  }
}
